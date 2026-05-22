use jsonwebtoken::{DecodingKey, Validation, decode};
use poem::{Error, FromRequest, Request, RequestBody, Result, http::StatusCode};

use crate::{config::Config, routes::user::Claims};

pub struct UserId(pub String);

impl<'a> FromRequest<'a> for UserId {
    async fn from_request(req: &'a Request, _body: &mut RequestBody) -> Result<Self> {
        let config = Config::default();

        let raw = req
            .headers()
            .get("authorization")
            .and_then(|value| value.to_str().ok())
            .ok_or_else(|| {
                Error::from_string("Missing authorization header", StatusCode::UNAUTHORIZED)
            })?;

        let token = if raw.to_lowercase().starts_with("bearer ") {
            &raw["bearer ".len()..]
        } else {
            raw
        };

        let decoded = decode::<Claims>(
            token,
            &DecodingKey::from_secret(config.jwt_secret.as_ref()),
            &Validation::default(),
        )
        .map_err(|e| Error::from_string(format!("Invalid token: {e}"), StatusCode::UNAUTHORIZED))?;

        Ok(UserId(decoded.claims.sub))
    }
}
