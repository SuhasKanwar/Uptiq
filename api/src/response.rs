use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct CreateWebsiteResponse {
    pub id: String
}