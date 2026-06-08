use poem::{EndpointExt, Route, Server, get, handler, listener::TcpListener, post};
use std::{
    io::Error,
    sync::{Arc, Mutex},
};

use store::store::Store;

use crate::routes::{
    user::{sign_in, sign_up},
    website::{create_website, delete_website, get_website, list_websites, update_website},
};

pub mod auth_middleware;
pub mod config;
pub mod request;
pub mod response;
pub mod routes;
pub mod utils;

#[handler]
fn index() -> String {
    String::from("Uptiq API server is running successfully!!!")
}

#[handler]
fn health_check() -> String {
    String::from("OK")
}

#[tokio::main(flavor = "multi_thread")]
async fn main() -> Result<(), Error> {
    let store = Arc::new(Mutex::new(Store::new().unwrap()));

    let app = Route::new()
        .at("/", get(index))
        .at("/health", get(health_check))
        .at("/user/signup", post(sign_up))
        .at("/user/signin", post(sign_in))
        .at("/websites", post(create_website).get(list_websites))
        .at(
            "/websites/:id",
            get(get_website).put(update_website).delete(delete_website),
        )
        .data(store);

    Server::new(TcpListener::bind("0.0.0.0:5000"))
        .run(app)
        .await
}
