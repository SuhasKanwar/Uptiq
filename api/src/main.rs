use std::{io::Error, sync::{Arc, Mutex}};
use poem::{EndpointExt, Route, Server, get, handler, listener::TcpListener, post};

use store::store::Store;

use crate::routes::{user::{sign_in, sign_up}, website::{create_website, get_website}};

pub mod request;
pub mod response;
pub mod routes;
pub mod auth_middleware;

#[handler]
fn index() -> String {
    String::from("Server is running successfully!!!")
}

#[tokio::main(flavor = "multi_thread")]
async fn main() -> Result<(), Error> {
    let store = Arc::new(Mutex::new(Store::new().unwrap()));

    let app = Route::new()
        .at("/", get(index))
        .at("/user/signup", post(sign_up))
        .at("/user/signin", post(sign_in))
        .at("/status/:website_id", get(get_website))
        .at("/website", post(create_website))
        .data(store);
    
    Server::new(TcpListener::bind("0.0.0.0:6969"))
        .run(app)
        .await
}