use std::sync::{Arc, Mutex};

use poem::{Error, handler, http::StatusCode, web::{Data, Json}};
use store::store::Store;

use crate::{request::{SignInRequest, SignUpRequest}, response::{SignInResponse, SignUpResponse}};

#[handler]
pub fn sign_up(Json(data): Json<SignUpRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Result<Json<SignUpResponse>, Error> {
    let id = store.lock().unwrap().sign_up(data.username, data.password).map_err(|_| Error::from_status(StatusCode::CONFLICT))?;

    let response = SignUpResponse {
        message: String::from("SUCCESS"),
        id
    };

    Ok(Json(response))
}

#[handler]
pub fn sign_in(Json(data): Json<SignInRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Result<Json<SignInResponse>, Error> {
    let user_id = store.lock().unwrap().sign_in(data.username, data.password);

    match user_id {
        Ok(user_id) => {
            let response = SignInResponse {
                message: String::from("SUCCESS"),
                jwt: user_id
            };

            Ok(Json(response))
        }
        Err(_) => Err(Error::from_status(StatusCode::UNAUTHORIZED))
    }
}