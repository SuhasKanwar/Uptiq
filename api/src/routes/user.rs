use std::sync::{Arc, Mutex};

use poem::{Error, handler, http::StatusCode, web::{Data, Json}};
use store::store::Store;

use crate::{request::{SignInRequest, SignUpRequest}, response::{SignInResponse, SignUpResponse}};

#[handler]
pub fn sign_up(Json(data): Json<SignUpRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<SignUpResponse> {
    let id = store.lock().unwrap().sign_up(data.username, data.password).unwrap();

    let response = SignUpResponse {
        message: String::from("SUCCESS"),
        id
    };

    Json(response)
}

#[handler]
pub fn sign_in(Json(data): Json<SignInRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Result<Json<SignInResponse>, Error> {
    let user_id = store.lock().unwrap().sign_in(data.username, data.password);

    match user_id {
        Ok(user_id) => {
            let response = SignInResponse {
                message: String::from("SUCCESS"),
                jwt: user_id.to_string()
            };

            Ok(Json(response))
        }
        Err(_e) => Err(Error::from_status(StatusCode::UNAUTHORIZED))
    }
}