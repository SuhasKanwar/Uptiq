use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SignUpResponse {
    pub message: String,
    pub id: String
}

#[derive(Serialize, Deserialize)]
pub struct SignInResponse {
    pub message: String,
    pub jwt: String
}

#[derive(Serialize, Deserialize)]
pub struct GetWebsiteResponse {
    pub url: String
}

#[derive(Serialize, Deserialize)]
pub struct CreateWebsiteResponse {
    pub message: String,
    pub id: String
}