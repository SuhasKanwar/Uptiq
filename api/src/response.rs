use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct CreateWebsiteResponse {
    pub message: String,
    pub id: i32
}