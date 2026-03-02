// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, Clone, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "website_status"))]
    pub struct WebsiteStatus;
}

diesel::table! {
    region (id) {
        id -> Int4,
        name -> Text,
    }
}

diesel::table! {
    website (id) {
        id -> Int4,
        url -> Text,
        time_added -> Timestamp,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::WebsiteStatus;

    website_tick (id) {
        id -> Int4,
        response_time_ms -> Int4,
        status -> WebsiteStatus,
        website_id -> Int4,
        region_id -> Int4,
    }
}

diesel::joinable!(website_tick -> region (region_id));
diesel::joinable!(website_tick -> website (website_id));

diesel::allow_tables_to_appear_in_same_query!(region, website, website_tick,);
