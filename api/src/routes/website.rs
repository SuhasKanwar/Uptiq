use std::sync::{Arc, Mutex};

use poem::{handler, web::{Data, Json}};
use store::store::Store;

use crate::{request::{CreateWebsiteRequest, GetWebsiteRequest}, response::{CreateWebsiteResponse, GetWebsiteResponse}};

#[handler]
pub fn get_website(Json(data): Json<GetWebsiteRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<GetWebsiteResponse> {
    let website = store.lock().unwrap().get_website(data.website_id).unwrap();

    Json(GetWebsiteResponse {
        url: website.url
    })
}

#[handler]
pub fn create_website(Json(data): Json<CreateWebsiteRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<CreateWebsiteResponse> {
    let url = data.url;

    let website = store.lock().unwrap().create_website(1, url).unwrap();

    let response = CreateWebsiteResponse {
        message: String::from("SUCCESS"),
        id: website.id
    };
    Json(response)
}