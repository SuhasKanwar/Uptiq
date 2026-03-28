use std::sync::{Arc, Mutex};

use poem::{handler, web::{Data, Json, Path}};
use store::store::Store;

use crate::{auth_middleware::UserId, request::CreateWebsiteRequest, response::{CreateWebsiteResponse, GetWebsiteResponse}};

#[handler]
pub fn get_website(
    Path(website_id): Path<String>,
    Data(store): Data<&Arc<Mutex<Store>>>,
    UserId(user_id): UserId
) -> Json<GetWebsiteResponse> {
    let website = store.lock().unwrap().get_website(website_id, user_id).unwrap();

    Json(GetWebsiteResponse {
        url: website.url,
        id: website.id,
        user_id: website.user_id
    })
}

#[handler]
pub fn create_website(
    Json(data): Json<CreateWebsiteRequest>,
    Data(store): Data<&Arc<Mutex<Store>>>,
    UserId(user_id): UserId
) -> Json<CreateWebsiteResponse> {
    let url = data.url;

    let website = store.lock().unwrap().create_website(String::from("1"), url).unwrap();

    let response = CreateWebsiteResponse {
        message: String::from("SUCCESS"),
        id: website.id
    };
    Json(response)
}