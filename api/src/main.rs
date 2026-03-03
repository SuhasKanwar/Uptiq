use std::io::Error;
use poem::{Route, Server, get, handler, listener::TcpListener, post, web::{Json, Path}};

use store::store::Store;
use crate::request::CreateWebsiteRequest;
use crate::response::CreateWebsiteResponse;

pub mod request;
pub mod response;

#[handler]
fn index() -> String {
    format!("Server is running successfully!!!")
}

#[handler]
fn get_website(Path(website_id): Path<String>) -> String {
    format!("Website ID: {}", website_id)
}

#[handler]
fn create_website(Json(data): Json<CreateWebsiteRequest>) -> Json<CreateWebsiteResponse> {
    let url = data.url;

    let mut store = Store::default().unwrap();
    let website = store.create_website(1, url).unwrap();

    let response = CreateWebsiteResponse {
        message: String::from("SUCCESS"),
        id: website.id
    };
    Json(response)
}


#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = Route::new()
        .at("/", get(index))
        .at("/website/:website_id", get(get_website))
        .at("/website", post(create_website));
    
    Server::new(TcpListener::bind("0.0.0.0:6969"))
        .run(app)
        .await
}