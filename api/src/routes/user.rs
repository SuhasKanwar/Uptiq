use std::sync::{Arc, Mutex};

use jsonwebtoken::{EncodingKey, Header, encode};
use poem::{
    Error, handler,
    http::StatusCode,
    web::{Data, Json},
};
use serde::{Deserialize, Serialize};
use store::{StoreError, store::Store};

use crate::{
    config::Config,
    request::{SignInRequest, SignUpRequest},
    response::{SignInResponse, SignUpResponse},
};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

#[handler]
pub fn sign_up(
    Json(data): Json<SignUpRequest>,
    Data(store): Data<&Arc<Mutex<Store>>>,
) -> Result<Json<SignUpResponse>, Error> {
    let id = store
        .lock()
        .unwrap()
        .sign_up(data.username, data.password)
        .map_err(|e| match e {
            StoreError::Other(msg) if msg.contains("username already exists") => {
                Error::from_status(StatusCode::CONFLICT)
            }
            _ => Error::from_status(StatusCode::INTERNAL_SERVER_ERROR),
        })?;

    Ok(Json(SignUpResponse {
        message: String::from("SUCCESS"),
        id,
    }))
}

#[handler]
pub fn sign_in(
    Json(data): Json<SignInRequest>,
    Data(store): Data<&Arc<Mutex<Store>>>,
) -> Result<Json<SignInResponse>, Error> {
    let config = Config::default();

    let user_id = store
        .lock()
        .unwrap()
        .sign_in(data.username, data.password)
        .map_err(|_| Error::from_status(StatusCode::UNAUTHORIZED))?;

    let exp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .expect("system clock is before Unix epoch")
        .as_secs()
        + config.token_validity_secs;

    let claims = Claims {
        sub: user_id,
        exp: exp as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_ref()),
    )
    .map_err(|_| Error::from_status(StatusCode::INTERNAL_SERVER_ERROR))?;

    Ok(Json(SignInResponse {
        message: String::from("SUCCESS"),
        jwt: token,
    }))
}
