use std::sync::{Arc, Mutex};
use std::time::Duration;

use serde::{Deserialize, Serialize};
use store::store::Store;
use tokio::time::sleep;
use tracing::{error, info};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CheckJob {
    pub website_id: String,
    pub url: String,
    pub region_id: String,
}

pub async fn run_scheduler(
    db: Arc<Mutex<Store>>,
    redis: redis::aio::ConnectionManager,
    queue_key: String,
    region_id: String,
    interval_secs: u64,
) {
    info!(interval_secs, "Scheduler started");

    loop {
        match enqueue_all_websites(&db, &redis, &queue_key, &region_id).await {
            Ok(count) => info!(count, "Enqueued website check jobs"),
            Err(e) => error!(error = %e, "Failed to enqueue website jobs"),
        }

        sleep(Duration::from_secs(interval_secs)).await;
    }
}

async fn enqueue_all_websites(
    db: &Arc<Mutex<Store>>,
    redis: &redis::aio::ConnectionManager,
    queue_key: &str,
    region_id: &str,
) -> Result<usize, Box<dyn std::error::Error + Send + Sync>> {
    let db_clone = Arc::clone(db);
    let websites = tokio::task::spawn_blocking(move || {
        db_clone
            .lock()
            .expect("DB mutex poisoned")
            .list_active_websites()
    })
    .await??;

    let count = websites.len();
    if count == 0 {
        return Ok(0);
    }

    let mut pipe = redis::pipe();
    for website in &websites {
        let job = CheckJob {
            website_id: website.id.clone(),
            url: website.url.clone(),
            region_id: region_id.to_string(),
        };
        let payload = serde_json::to_string(&job)?;
        pipe.rpush(queue_key, payload).ignore();
    }

    let mut conn = redis.clone();
    pipe.query_async::<()>(&mut conn).await?;

    Ok(count)
}
