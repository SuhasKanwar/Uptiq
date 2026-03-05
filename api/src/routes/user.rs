use std::sync::{Arc, Mutex};

use poem::{handler, web::{Data, Json}};
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
pub fn sign_in(Json(data): Json<SignInRequest>, Data(store): Data<&Arc<Mutex<Store>>>) -> Json<SignInResponse> {
    let success = store.lock().unwrap().sign_in(data.username, data.password).unwrap();

    let response = SignInResponse {
        message: if success { String::from("SUCCESS") } else { String::from("FAILURE") },
        jwt: String::from("dummy_jwt_token")
    };

    Json(response)
}