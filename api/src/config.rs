use std::env;

use dotenvy::dotenv;

pub struct Config {
    pub jwt_secret: String,
    pub token_validity_secs: u64,
}

impl Default for Config {
    fn default() -> Self {
        dotenv().ok();

        let jwt_secret = env::var("JWT_SECRET")
            .unwrap_or_else(|_| panic!("Please provide the JWT_SECRET environment variable"));

        let token_validity_secs = 30 * 24 * 60 * 60;

        Self {
            jwt_secret,
            token_validity_secs,
        }
    }
}
