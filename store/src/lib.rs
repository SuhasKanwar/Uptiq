pub mod schema;

pub struct Store {
    conn: Connection
}

impl Default for Store {
    fn default() -> Self {
        Store {
            conn: Connection::new()
        }
    }
}

impl Store {
    pub fn create_user(&self) {
    }

    pub fn create_website(&self) -> String {
        String::from("website_id_123")
    }
}