use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SignUpRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignInRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateWebsiteRequest {
    pub url: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateWebsiteRequest {
    pub url: String,
}
