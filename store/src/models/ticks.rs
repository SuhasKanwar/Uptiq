use crate::{StoreError, store::Store};
use chrono::{NaiveDateTime, Utc};
use diesel::{
    deserialize::{self, FromSql},
    pg::{Pg, PgValue},
    prelude::*,
    serialize::{self, IsNull, Output, ToSql},
};
use std::io::Write;
use uuid::Uuid;

#[derive(
    Debug, Clone, PartialEq, diesel::deserialize::FromSqlRow, diesel::expression::AsExpression,
)]
#[diesel(sql_type = crate::schema::sql_types::WebsiteStatus)]
pub enum WebsiteStatus {
    Up,
    Down,
    Unknown,
}

impl ToSql<crate::schema::sql_types::WebsiteStatus, Pg> for WebsiteStatus {
    fn to_sql<'b>(&'b self, out: &mut Output<'b, '_, Pg>) -> serialize::Result {
        let label = match self {
            WebsiteStatus::Up => "UP",
            WebsiteStatus::Down => "DOWN",
            WebsiteStatus::Unknown => "UNKNOWN",
        };
        out.write_all(label.as_bytes())?;
        Ok(IsNull::No)
    }
}

impl FromSql<crate::schema::sql_types::WebsiteStatus, Pg> for WebsiteStatus {
    fn from_sql(bytes: PgValue<'_>) -> deserialize::Result<Self> {
        match bytes.as_bytes() {
            b"UP" => Ok(WebsiteStatus::Up),
            b"DOWN" => Ok(WebsiteStatus::Down),
            b"UNKNOWN" => Ok(WebsiteStatus::Unknown),
            v => Err(format!("Unknown website_status variant: {:?}", v).into()),
        }
    }
}

#[derive(Queryable, Insertable, Selectable)]
#[diesel(table_name = crate::schema::website_tick)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct WebsiteTick {
    pub id: String,
    pub response_time_ms: i32,
    pub status: WebsiteStatus,
    pub website_id: String,
    pub region_id: String,
    pub created_at: NaiveDateTime,
}

impl Store {
    pub fn create_tick(
        &mut self,
        website_id: String,
        region_id: String,
        response_time_ms: i32,
        status: WebsiteStatus,
    ) -> Result<WebsiteTick, StoreError> {
        let new_tick = WebsiteTick {
            id: Uuid::new_v4().to_string(),
            response_time_ms,
            status,
            website_id,
            region_id,
            created_at: Utc::now().naive_utc(),
        };

        let tick = diesel::insert_into(crate::schema::website_tick::table)
            .values(&new_tick)
            .returning(WebsiteTick::as_returning())
            .get_result(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(tick)
    }

    pub fn list_ticks(
        &mut self,
        website_id: String,
        user_id: String,
        limit: i64,
    ) -> Result<Vec<WebsiteTick>, StoreError> {
        use crate::schema::{website, website_tick};

        website::table
            .filter(website::id.eq(&website_id))
            .filter(website::user_id.eq(&user_id))
            .select(website::id)
            .first::<String>(&mut self.conn)
            .optional()
            .map_err(StoreError::from)?
            .ok_or(StoreError::NotFound)?;

        let ticks = website_tick::table
            .filter(website_tick::website_id.eq(&website_id))
            .order(website_tick::created_at.desc())
            .limit(limit.min(1000))
            .select(WebsiteTick::as_select())
            .load(&mut self.conn)
            .map_err(StoreError::from)?;

        Ok(ticks)
    }
}
