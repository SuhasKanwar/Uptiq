use crate::{StoreError, schema::user, store::Store};
use bcrypt::{DEFAULT_COST, hash, verify};
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::user)]
#[diesel(check_for_backend(diesel::pg::Pg))]
struct User {
    id: String,
    username: String,
    password: String,
}

impl Store {
    pub fn sign_up(&mut self, username: String, password: String) -> Result<String, StoreError> {
        let existing_user = user::table
            .filter(user::username.eq(&username))
            .select(User::as_select())
            .first::<User>(&mut self.conn)
            .optional()
            .map_err(StoreError::from)?;

        if existing_user.is_some() {
            return Err(StoreError::Other("username already exists".to_string()));
        }

        let hashed_password =
            hash(password, DEFAULT_COST).map_err(|e| StoreError::Other(e.to_string()))?;

        let new_user = User {
            id: Uuid::new_v4().to_string(),
            username,
            password: hashed_password,
        };

        let result = diesel::insert_into(user::table)
            .values(&new_user)
            .returning(User::as_returning())
            .get_result(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(result.id)
    }

    pub fn sign_in(&mut self, username: String, password: String) -> Result<String, StoreError> {
        let user = user::table
            .filter(user::username.eq(username))
            .select(User::as_select())
            .first(&mut self.conn)
            .optional()
            .map_err(StoreError::from)?
            .ok_or(StoreError::NotFound)?;

        let valid_password =
            verify(password, &user.password).map_err(|e| StoreError::Other(e.to_string()))?;

        if !valid_password {
            return Err(StoreError::Other("invalid credentials".to_string()));
        }

        Ok(user.id)
    }
}
