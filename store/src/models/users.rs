use crate::{schema::user, store::Store};
use diesel::prelude::*;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::user)]
#[diesel(check_for_backend(diesel::pg::Pg))]
struct User {
    id: i32,
    username: String,
    password: String
}

impl Store {
    pub fn sign_up(&mut self, username: String, password: String) -> Result<i32, diesel::result::Error> {
        let new_user = User {
            id: 1,
            username,
            password,
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

    pub fn sign_in(&mut self, username: String, password: String) -> Result<i32, diesel::result::Error> {
        let user = user::table
            .filter(user::username.eq(username))
            .select(User::as_select())
            .first(&mut self.conn)?;

        if user.password != password {
            return Err(diesel::result::Error::NotFound);
        }

        Ok(user.id)
    }
}