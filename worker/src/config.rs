use std::env;

use dotenvy::dotenv;

pub struct Config {
    #[allow(dead_code)]
    pub database_url: String,
    pub redis_url: String,
    pub region_id: String,
    pub poll_interval_secs: u64,
    pub worker_count: usize,
    pub request_timeout_secs: u64,
    pub queue_key: String,
}

impl Default for Config {
    fn default() -> Self {
        dotenv().ok();

        let database_url =
            env::var("DATABASE_URL").expect("DATABASE_URL must be set in the environment");

        let redis_url =
            env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());

        let region_id = env::var("REGION_ID").unwrap_or_else(|_| "reg_default".to_string());

        let poll_interval_secs: u64 = env::var("POLL_INTERVAL_SECS")
            .ok()
            .and_then(|v| v.parse().ok())
            .unwrap_or(60);

        let worker_count: usize = env::var("WORKER_COUNT")
            .ok()
            .and_then(|v| v.parse().ok())
            .unwrap_or(4);

        let request_timeout_secs: u64 = env::var("REQUEST_TIMEOUT_SECS")
            .ok()
            .and_then(|v| v.parse().ok())
            .unwrap_or(10);

        let queue_key =
            env::var("QUEUE_KEY").unwrap_or_else(|_| "uptiq:website_checks".to_string());

        Self {
            database_url,
            redis_url,
            region_id,
            poll_interval_secs,
            worker_count,
            request_timeout_secs,
            queue_key,
        }
    }
}
