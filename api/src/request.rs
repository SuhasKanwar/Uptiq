use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SignUpRequest {
    pub username: String,
    pub password: String
}

#[derive(Serialize, Deserialize)]
pub struct SignInRequest {
    pub username: String,
    pub password: String
}

#[derive(Serialize, Deserialize)]
pub struct GetWebsiteRequest {
    pub website_id: String
}

#[derive(Serialize, Deserialize)]
pub struct CreateWebsiteRequest {
    pub url: String
}

pub struct CreateUserRequest {
    pub username: String,
    pub password: String
}