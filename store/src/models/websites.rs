use crate::{StoreError, store::Store};
use chrono::{NaiveDateTime, Utc};
use diesel::prelude::*;
use uuid::Uuid;

#[derive(Queryable, Insertable, Selectable, Clone)]
#[diesel(table_name = crate::schema::website)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct Website {
    pub id: String,
    pub url: String,
    pub user_id: String,
    pub time_added: NaiveDateTime,
    pub is_active: bool,
}

impl Store {
    pub fn create_website(&mut self, user_id: String, url: String) -> Result<Website, StoreError> {
        let new_website = Website {
            id: Uuid::new_v4().to_string(),
            url,
            user_id,
            time_added: Utc::now().naive_utc(),
            is_active: true,
        };

        let website = diesel::insert_into(crate::schema::website::table)
            .values(&new_website)
            .returning(Website::as_returning())
            .get_result(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(website)
    }

    pub fn get_website(
        &mut self,
        website_id: String,
        user_id: String,
    ) -> Result<Website, StoreError> {
        use crate::schema::website;

        let website = website::table
            .filter(website::id.eq(website_id))
            .filter(website::user_id.eq(user_id))
            .select(Website::as_select())
            .first(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(website)
    }

    pub fn list_websites(&mut self, user_id: String) -> Result<Vec<Website>, StoreError> {
        use crate::schema::website;

        let websites = website::table
            .filter(website::user_id.eq(user_id))
            .order(website::time_added.desc())
            .select(Website::as_select())
            .load(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(websites)
    }

    pub fn list_active_websites(&mut self) -> Result<Vec<Website>, StoreError> {
        use crate::schema::website;

        let websites = website::table
            .filter(website::is_active.eq(true))
            .order(website::time_added.asc())
            .select(Website::as_select())
            .load(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(websites)
    }

    pub fn update_website(
        &mut self,
        website_id: String,
        user_id: String,
        new_url: String,
    ) -> Result<Website, StoreError> {
        use crate::schema::website;

        let existing = website::table
            .filter(website::id.eq(&website_id))
            .filter(website::user_id.eq(&user_id))
            .select(Website::as_select())
            .first(&mut self.conn)
            .optional()
            .map_err(StoreError::from)?
            .ok_or(StoreError::NotFound)?;

        let updated = diesel::update(website::table)
            .filter(website::id.eq(&existing.id))
            .set(website::url.eq(new_url))
            .returning(Website::as_returning())
            .get_result(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(updated)
    }

    pub fn delete_website(
        &mut self,
        website_id: String,
        user_id: String,
    ) -> Result<(), StoreError> {
        use crate::schema::website;

        let rows_deleted = diesel::delete(
            website::table
                .filter(website::id.eq(&website_id))
                .filter(website::user_id.eq(&user_id)),
        )
        .execute(&mut self.conn)
        .map_err(StoreError::from)?;

        if rows_deleted == 0 {
            return Err(StoreError::NotFound);
        }

        Ok(())
    }
}
