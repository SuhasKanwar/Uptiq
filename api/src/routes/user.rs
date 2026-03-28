use std::sync::{Arc, Mutex};

use jsonwebtoken::{EncodingKey, Header, encode};
use poem::{Error, handler, http::StatusCode, web::{Data, Json}};
use serde::{Deserialize, Serialize};
use store::store::Store;

use crate::{request::{SignInRequest, SignUpRequest}, response::{SignInResponse, SignUpResponse}};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    exp: usize
}

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
            let my_claims = Claims {
                sub: user_id,
                exp: 11111111111
            };

            let token = encode(&Header::default(), &my_claims, &EncodingKey::from_secret("secret".as_ref())).map_err(|_| Error::from_status(StatusCode::UNAUTHORIZED))?;

            let response = SignInResponse {
                message: String::from("SUCCESS"),
                jwt: token
            };

            Ok(Json(response))
        }
        Err(_) => Err(Error::from_status(StatusCode::UNAUTHORIZED))
    }
}