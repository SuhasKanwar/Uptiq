use crate::store::Store;
use diesel::prelude::*;
use chrono::{NaiveDateTime, Utc};

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::website)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Website {
    pub id: i32,
    pub url: String,
    pub user_id: i32,
    pub time_added: NaiveDateTime,
}

impl Store {
    pub fn create_website(&mut self, user_id: i32, url: String) -> Result<Website, diesel::result::Error> {
        let new_website = Website {
            id: 0,
            url,
            user_id,
            time_added: Utc::now().naive_utc(),
        };

        let website = diesel::insert_into(crate::schema::website::table)
            .values(&new_website)
            .returning(Website::as_returning())
            .get_result(&mut self.conn)?;

        Ok(website)
    }

    pub fn get_website(&mut self, id: i32) -> Result<Website, diesel::result::Error> {
        use crate::schema::website;

        let website = website::table
            .filter(website::id.eq(id))
            .select(Website::as_select())
            .first(&mut self.conn)?;

        Ok(website)
    }
}