use std::io::Error;
use poem::{Route, Server, get, handler, listener::TcpListener, post, web::Json};

use store::store::Store;
use crate::{request::{CreateWebsiteRequest, GetWebsiteRequest, SignInRequest, SignUpRequest}, response::{GetWebsiteResponse, SignInResponse, SignUpResponse}};
use crate::response::CreateWebsiteResponse;

pub mod request;
pub mod response;

#[handler]
fn index() -> String {
    format!("Server is running successfully!!!")
}

#[handler]
fn sign_up(Json(data): Json<SignUpRequest>) -> Json<SignUpResponse> {
    let mut s = Store::default().unwrap();
    let id = s.sign_up(data.username, data.password).unwrap();

    let response = SignUpResponse {
        message: String::from("SUCCESS"),
        id: id
    };

    Json(response)
}

#[handler]
fn sign_in(Json(data): Json<SignInRequest>) -> Json<SignInResponse> {
    let mut s = Store::default().unwrap();
    let success = s.sign_in(data.username, data.password).unwrap();

    let response = SignInResponse {
        message: if success { String::from("SUCCESS") } else { String::from("FAILURE") },
        jwt: String::from("dummy_jwt_token")
    };

    Json(response)
}

#[handler]
fn get_website(Json(data): Json<GetWebsiteRequest>) -> Json<GetWebsiteResponse> {
    let mut store = Store::default().unwrap();
    let website = store.get_website(data.website_id).unwrap();

    Json(GetWebsiteResponse {
        url: website.url
    })
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
        .at("/signup", post(sign_up))
        .at("/signin", post(sign_in))
        .at("/website/:website_id", get(get_website))
        .at("/website", post(create_website));
    
    Server::new(TcpListener::bind("0.0.0.0:6969"))
        .run(app)
        .await
}