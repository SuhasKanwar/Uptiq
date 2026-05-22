use std::sync::{Arc, Mutex};

use poem::{
    Result, handler,
    web::{Data, Json, Path},
};
use store::store::Store;

use crate::{
    auth_middleware::UserId,
    request::{CreateWebsiteRequest, UpdateWebsiteRequest},
    response::{
        CreateWebsiteResponse, DeleteWebsiteResponse, GetWebsiteResponse, ListWebsitesResponse,
        UpdateWebsiteResponse, WebsiteItem,
    },
    utils::store_err_to_http,
};

#[handler]
pub fn create_website(
    Json(data): Json<CreateWebsiteRequest>,
    Data(store): Data<&Arc<Mutex<Store>>>,
    UserId(user_id): UserId,
) -> Result<Json<CreateWebsiteResponse>> {
    let website = store
        .lock()
        .unwrap()
        .create_website(user_id, data.url)
        .map_err(store_err_to_http)?;

    Ok(Json(CreateWebsiteResponse {
        message: String::from("SUCCESS"),
        id: website.id,
    }))
}

#[handler]
pub fn list_websites(
    Data(store): Data<&Arc<Mutex<Store>>>,
    UserId(user_id): UserId,
) -> Result<Json<ListWebsitesResponse>> {
    let websites = store
        .lock()
        .unwrap()
        .list_websites(user_id)
        .map_err(store_err_to_http)?;

    let items = websites
        .into_iter()
        .map(|w| WebsiteItem {
            id: w.id,
            url: w.url,
            user_id: w.user_id,
            time_added: w.time_added.and_utc().timestamp(),
        })
        .collect();

    Ok(Json(ListWebsitesResponse { websites: items }))
}

#[handler]
pub fn get_website(
    Path(website_id): Path<String>,
    Data(store): Data<&Arc<Mutex<Store>>>,
    UserId(user_id): UserId,
) -> Result<Json<GetWebsiteResponse>> {
    let website = store
        .lock()
        .unwrap()
        .get_website(website_id, user_id)
        .map_err(store_err_to_http)?;

    Ok(Json(GetWebsiteResponse {
        website: WebsiteItem {
            id: website.id,
            url: website.url,
            user_id: website.user_id,
            time_added: website.time_added.and_utc().timestamp(),
        },
    }))
}

#[handler]
pub fn update_website(
    Path(website_id): Path<String>,
    Json(data): Json<UpdateWebsiteRequest>,
    Data(store): Data<&Arc<Mutex<Store>>>,
    UserId(user_id): UserId,
) -> Result<Json<UpdateWebsiteResponse>> {
    let website = store
        .lock()
        .unwrap()
        .update_website(website_id, user_id, data.url)
        .map_err(store_err_to_http)?;

    Ok(Json(UpdateWebsiteResponse {
        message: String::from("SUCCESS"),
        website: WebsiteItem {
            id: website.id,
            url: website.url,
            user_id: website.user_id,
            time_added: website.time_added.and_utc().timestamp(),
        },
    }))
}

#[handler]
pub fn delete_website(
    Path(website_id): Path<String>,
    Data(store): Data<&Arc<Mutex<Store>>>,
    UserId(user_id): UserId,
) -> Result<Json<DeleteWebsiteResponse>> {
    store
        .lock()
        .unwrap()
        .delete_website(website_id, user_id)
        .map_err(store_err_to_http)?;

    Ok(Json(DeleteWebsiteResponse {
        message: String::from("SUCCESS"),
    }))
}
