use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use redis::AsyncCommands;
use reqwest::Client;
use store::{WebsiteStatus, store::Store};
use tracing::{error, info, warn};

use crate::scheduler::CheckJob;

pub async fn run_poller(
    worker_id: usize,
    db: Arc<Mutex<Store>>,
    redis: redis::aio::ConnectionManager,
    queue_key: String,
    http_client: Client,
    request_timeout_secs: u64,
) {
    info!(worker_id, "Poller started");

    loop {
        let result: Option<(String, String)> = {
            let mut conn = redis.clone();
            match conn.blpop(&queue_key, 5.0).await {
                Ok(v) => v,
                Err(e) => {
                    error!(worker_id, error = %e, "Redis BLPOP failed");
                    tokio::time::sleep(Duration::from_secs(1)).await;
                    continue;
                }
            }
        };

        let payload = match result {
            Some((_, payload)) => payload,
            None => continue,
        };

        let job: CheckJob = match serde_json::from_str(&payload) {
            Ok(j) => j,
            Err(e) => {
                error!(worker_id, error = %e, payload, "Malformed job payload — skipping");
                continue;
            }
        };

        info!(worker_id, website_id = %job.website_id, url = %job.url, "Checking website");

        let (status, response_time_ms) =
            poll_website(&http_client, &job.url, request_timeout_secs).await;

        let db_clone = Arc::clone(&db);
        let wid = job.website_id.clone();
        let rid = job.region_id.clone();
        let st = status.clone();

        let tick_result = tokio::task::spawn_blocking(move || {
            db_clone
                .lock()
                .expect("DB mutex poisoned")
                .create_tick(wid, rid, response_time_ms, st)
        })
        .await;

        match tick_result {
            Ok(Ok(tick)) => {
                info!(
                    worker_id,
                    website_id = %job.website_id,
                    url = %job.url,
                    tick_id = %tick.id,
                    status = ?tick.status,
                    response_time_ms = tick.response_time_ms,
                    "Tick recorded"
                );
            }
            Ok(Err(e)) => {
                error!(worker_id, website_id = %job.website_id, error = %e, "Failed to store tick");
            }
            Err(e) => {
                error!(worker_id, error = %e, "spawn_blocking panicked");
            }
        }
    }
}

async fn poll_website(client: &Client, url: &str, timeout_secs: u64) -> (WebsiteStatus, i32) {
    let start = Instant::now();
    let timeout = Duration::from_secs(timeout_secs);

    let response = tokio::time::timeout(timeout, client.get(url).send()).await;

    let elapsed_ms = start.elapsed().as_millis() as i32;

    match response {
        Ok(Ok(resp)) => {
            if resp.status().is_success() {
                info!(url, status = %resp.status(), elapsed_ms, "Website UP");
                (WebsiteStatus::Up, elapsed_ms)
            } else {
                warn!(url, status = %resp.status(), elapsed_ms, "Website DOWN (non-2xx)");
                (WebsiteStatus::Down, elapsed_ms)
            }
        }
        Ok(Err(e)) => {
            warn!(url, error = %e, elapsed_ms, "Website DOWN (connection error)");
            (WebsiteStatus::Down, elapsed_ms)
        }
        Err(_timeout) => {
            warn!(url, timeout_secs, "Website UNKNOWN (timeout)");
            (WebsiteStatus::Unknown, elapsed_ms)
        }
    }
}
