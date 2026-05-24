use poem::{Error, http::StatusCode};
use store::StoreError;

pub fn store_err_to_http(e: StoreError) -> Error {
    match e {
        StoreError::NotFound => Error::from_status(StatusCode::NOT_FOUND),
        StoreError::Other(msg) => Error::from_string(msg, StatusCode::INTERNAL_SERVER_ERROR),
    }
}
