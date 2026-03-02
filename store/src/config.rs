use std::env;

pub struct Config {
    pub database_url: String
}

impl Default for Config {
    fn default() -> Self {
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| panic!("Please provide the DATABASE_URL enviornment variable"));
        Self { database_url }
    }
}