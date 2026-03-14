use crate::store::Store;
use diesel::prelude::*;
use chrono::{NaiveDateTime, Utc};
use uuid::Uuid;

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::website)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Website {
    pub id: String,
    pub url: String,
    pub user_id: String,
    pub time_added: NaiveDateTime,
}

impl Store {
    pub fn create_website(&mut self, user_id: String, url: String) -> Result<Website, diesel::result::Error> {
        let new_website = Website {
            id: Uuid::new_v4().to_string(),
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

    pub fn get_website(&mut self, id: String) -> Result<Website, diesel::result::Error> {
        use crate::schema::website;

        let website = website::table
            .filter(website::id.eq(id))
            .select(Website::as_select())
            .first(&mut self.conn)?;

        Ok(website)
    }
}