use std::{io::Error, sync::{Arc, Mutex}};
use poem::{EndpointExt, Route, Server, get, handler, listener::TcpListener, post, web::{Data, Json}};

use store::store::Store;
use crate::{request::{CreateWebsiteRequest, GetWebsiteRequest, SignInRequest, SignUpRequest}, response::{GetWebsiteResponse, SignInResponse, SignUpResponse}};
use crate::response::CreateWebsiteResponse;

pub mod request;
pub mod response;

#[handler]
fn index() -> String {
    String::from("Server is running successfully!!!")
}

#[handler]
fn sign_up(Json(data): Json<SignUpRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<SignUpResponse> {
    let id = store.lock().unwrap().sign_up(data.username, data.password).unwrap();

    let response = SignUpResponse {
        message: String::from("SUCCESS"),
        id
    };

    Json(response)
}

#[handler]
fn sign_in(Json(data): Json<SignInRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<SignInResponse> {
    let success = store.lock().unwrap().sign_in(data.username, data.password).unwrap();

    let response = SignInResponse {
        message: if success { String::from("SUCCESS") } else { String::from("FAILURE") },
        jwt: String::from("dummy_jwt_token")
    };

    Json(response)
}

#[handler]
fn get_website(Json(data): Json<GetWebsiteRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<GetWebsiteResponse> {
    let website = store.lock().unwrap().get_website(data.website_id).unwrap();

    Json(GetWebsiteResponse {
        url: website.url
    })
}

#[handler]
fn create_website(Json(data): Json<CreateWebsiteRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<CreateWebsiteResponse> {
    let url = data.url;

    let website = store.lock().unwrap().create_website(1, url).unwrap();

    let response = CreateWebsiteResponse {
        message: String::from("SUCCESS"),
        id: website.id
    };
    Json(response)
}


#[tokio::main(flavor = "multi_thread")]
async fn main() -> Result<(), Error> {
    let store = Arc::new(Mutex::new(Store::new().unwrap()));

    let app = Route::new()
        .at("/", get(index))
        .at("/signup", post(sign_up))
        .at("/signin", post(sign_in))
        .at("/website/:website_id", get(get_website))
        .at("/website", post(create_website))
        .data(store);
    
    Server::new(TcpListener::bind("0.0.0.0:6969"))
        .run(app)
        .await
}