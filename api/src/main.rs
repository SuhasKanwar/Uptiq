use std::io::Error;
use poem::{Route, Server, get, handler, listener::TcpListener, post, web::Path};

#[handler]
fn index() -> String {
    format!("Server is running successfully!!!")
}

#[handler]
fn get_website(Path(website_id): Path<String>) -> String {
    format!("Website ID: {}", website_id)
}

#[handler]
fn create_website() -> String {
    format!("Creating a new website entry...")
}


#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = Route::new()
        .at("/", get(index))
        .at("/website/:website_id", get(get_website))
        .at("/website", post(create_website));
    
    Server::new(TcpListener::bind("0.0.0.0:9000"))
        .run(app)
        .await
}