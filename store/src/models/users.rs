use crate::{schema::user, store::Store};
use bcrypt::{DEFAULT_COST, hash, verify};
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::user)]
#[diesel(check_for_backend(diesel::pg::Pg))]
struct User {
    id: String,
    username: String,
    password: String
}

impl Store {
    pub fn sign_up(&mut self, username: String, password: String) -> Result<String, diesel::result::Error> {
        let hashed_password = hash(password, DEFAULT_COST)
            .map_err(|_| diesel::result::Error::RollbackTransaction)?;
        let new_user = User {
            id: Uuid::new_v4().to_string(),
            username,
            password: hashed_password,
        };

        let result = diesel::insert_into(user::table)
            .values(&new_user)
            .returning(User::as_returning())
            .get_result(&mut self.conn);
        
        match result {
            Ok(user) => Ok(user.id),
            Err(e) => Err(e)
        }
    }

    pub fn sign_in(&mut self, username: String, password: String) -> Result<String, diesel::result::Error> {
        let user = user::table
            .filter(user::username.eq(username))
            .select(User::as_select())
            .first(&mut self.conn)?;

        let valid_password = verify(user.password, &password).map_err(|_| diesel::result::Error::RollbackTransaction)?;

        if !valid_password {
            return Err(diesel::result::Error::NotFound);
        }

        Ok(user.id)
    }
}