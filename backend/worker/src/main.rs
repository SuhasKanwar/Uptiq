use std::sync::{Arc, Mutex};
use std::time::Duration;

use reqwest::Client;
use store::store::Store;
use tokio::signal;
use tracing::info;
use tracing_subscriber::{EnvFilter, fmt};

mod config;
mod poller;
mod scheduler;

use config::Config;

#[tokio::main(flavor = "multi_thread")]
async fn main() {
    fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .init();

    let config = Config::default();

    info!(
        region_id = %config.region_id,
        poll_interval_secs = config.poll_interval_secs,
        worker_count = config.worker_count,
        request_timeout_secs = config.request_timeout_secs,
        queue_key = %config.queue_key,
        "Uptiq Worker starting"
    );

    let store = Store::new().expect("Failed to connect to Postgres");
    let db: Arc<Mutex<Store>> = Arc::new(Mutex::new(store));

    let redis_client = redis::Client::open(config.redis_url.clone()).expect("Invalid Redis URL");
    let redis_conn = redis::aio::ConnectionManager::new(redis_client)
        .await
        .expect("Failed to connect to Redis");

    let http_client = Client::builder()
        .timeout(Duration::from_secs(config.request_timeout_secs + 2))
        .user_agent("Uptiq-Monitor/1.0")
        .build()
        .expect("Failed to build HTTP client");

    let sched_db = Arc::clone(&db);
    let sched_redis = redis_conn.clone();
    let sched_queue = config.queue_key.clone();
    let sched_region = config.region_id.clone();
    let sched_interval = config.poll_interval_secs;

    tokio::spawn(async move {
        scheduler::run_scheduler(
            sched_db,
            sched_redis,
            sched_queue,
            sched_region,
            sched_interval,
        )
        .await;
    });

    for worker_id in 0..config.worker_count {
        let poller_db = Arc::clone(&db);
        let poller_redis = redis_conn.clone();
        let poller_queue = config.queue_key.clone();
        let poller_http = http_client.clone();
        let poller_timeout = config.request_timeout_secs;

        tokio::spawn(async move {
            poller::run_poller(
                worker_id,
                poller_db,
                poller_redis,
                poller_queue,
                poller_http,
                poller_timeout,
            )
            .await;
        });
    }

    info!(
        "Worker running — {} poller task(s) active. Press Ctrl+C to stop.",
        config.worker_count
    );

    signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
    info!("Shutdown signal received — stopping worker");
}
