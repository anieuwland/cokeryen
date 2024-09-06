using extension auth;
using extension edgeql_http;

module default {
    global current_user: uuid;

    type RecipeVariant {
        required ingredients: array<tuple<str, str>>;
        required instructions: str;
        required title: str;
        
        access policy unauthenticated_full_read 
            allow select 
            using (not exists global current_user);
        access policy superuser
            allow all
            using (all(global current_user = <uuid>'e3665608-d8a1-4779-a396-f68437747839'));
    }

    type RecipeEntry {
        required book: RecipeBook { on target delete delete source};
        required number: int16 { constraint exclusive };
        required tags: array<str>;
        required visualization: str { default := "" };
        multi user_likes := .<recipe[is UserLike];
        required historical: RecipeVariant { constraint exclusive };
        modernized: RecipeVariant { constraint exclusive };

        access policy unauthenticated_full_read 
            allow select 
            using (not exists global current_user);
        access policy superuser
            allow all
            using (all(global current_user = <uuid>'e3665608-d8a1-4779-a396-f68437747839'));
    }

    type RecipeBook {
        required modernized: bool;
        required person: str;
        multi recipes := .<book[is RecipeEntry];
        required reference: str {constraint exclusive};
        required title: str;
        required transcriber: str;
        required year: int16;

        access policy unauthenticated_full_read 
            allow select 
            using (not exists global current_user);
        access policy superuser
            allow all
            using (all(global current_user = <uuid>'e3665608-d8a1-4779-a396-f68437747839'));
    }

    type UserLike {
        required user: User;
        required recipe: RecipeEntry;
        
        access policy unauthenticated_full_read 
            allow select 
            using (not exists global current_user);
        access policy superuser
            allow all
            using (all(global current_user = <uuid>'e3665608-d8a1-4779-a396-f68437747839'));
    }

    type UserComment {
        required comment: str;
        required user: User;
        
        access policy unauthenticated_full_read 
            allow select
            using (not exists global current_user);
        access policy superuser
            allow all
            using (all(global current_user = <uuid>'e3665608-d8a1-4779-a396-f68437747839'));
    }

    type User {
        required oauth2_sub: str;
        
        access policy unauthenticated_full_read 
            allow select 
            using (not exists global current_user);
        access policy superuser
            allow all
            using (all(global current_user = <uuid>'e3665608-d8a1-4779-a396-f68437747839'));
    }
}