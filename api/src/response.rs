use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SignUpResponse {
    pub message: String,
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignInResponse {
    pub message: String,
    pub jwt: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WebsiteItem {
    pub id: String,
    pub url: String,
    pub user_id: String,
    pub time_added: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateWebsiteResponse {
    pub message: String,
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GetWebsiteResponse {
    pub website: WebsiteItem,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ListWebsitesResponse {
    pub websites: Vec<WebsiteItem>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateWebsiteResponse {
    pub message: String,
    pub website: WebsiteItem,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteWebsiteResponse {
    pub message: String,
}
