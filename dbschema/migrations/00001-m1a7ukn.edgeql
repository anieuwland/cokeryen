CREATE MIGRATION m1a7uknc5mucfu42pdergm3svceh3ocvoaxyjvwxvsktdkqljeie4q
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE EXTENSION edgeql_http VERSION '1.0';
  CREATE TYPE default::RecipeVariant {
      CREATE REQUIRED PROPERTY ingredients: array<tuple<std::str, std::str>>;
      CREATE REQUIRED PROPERTY instructions: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE GLOBAL default::current_user -> std::uuid;
  CREATE TYPE default::RecipeBook {
      CREATE ACCESS POLICY superuser
          ALLOW ALL USING (std::all((GLOBAL default::current_user = <std::uuid>'e3665608-d8a1-4779-a396-f68437747839')));
      CREATE ACCESS POLICY unauthenticated_full_read
          ALLOW SELECT USING (NOT (EXISTS (GLOBAL default::current_user)));
      CREATE REQUIRED PROPERTY modernized: std::bool;
      CREATE REQUIRED PROPERTY person: std::str;
      CREATE REQUIRED PROPERTY reference: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE REQUIRED PROPERTY transcriber: std::str;
      CREATE REQUIRED PROPERTY year: std::int16;
  };
  CREATE TYPE default::RecipeEntry {
      CREATE ACCESS POLICY superuser
          ALLOW ALL USING (std::all((GLOBAL default::current_user = <std::uuid>'e3665608-d8a1-4779-a396-f68437747839')));
      CREATE ACCESS POLICY unauthenticated_full_read
          ALLOW SELECT USING (NOT (EXISTS (GLOBAL default::current_user)));
      CREATE REQUIRED LINK book: default::RecipeBook {
          ON TARGET DELETE DELETE SOURCE;
      };
      CREATE REQUIRED LINK historical: default::RecipeVariant {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE LINK modernized: default::RecipeVariant {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY number: std::int16 {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY tags: array<std::str>;
      CREATE REQUIRED PROPERTY visualization: std::str {
          SET default := '';
      };
  };
  ALTER TYPE default::RecipeVariant {
      CREATE ACCESS POLICY superuser
          ALLOW ALL USING (std::all((GLOBAL default::current_user = <std::uuid>'e3665608-d8a1-4779-a396-f68437747839')));
      CREATE ACCESS POLICY unauthenticated_full_read
          ALLOW SELECT USING (NOT (EXISTS (GLOBAL default::current_user)));
  };
  CREATE TYPE default::User {
      CREATE ACCESS POLICY superuser
          ALLOW ALL USING (std::all((GLOBAL default::current_user = <std::uuid>'e3665608-d8a1-4779-a396-f68437747839')));
      CREATE ACCESS POLICY unauthenticated_full_read
          ALLOW SELECT USING (NOT (EXISTS (GLOBAL default::current_user)));
      CREATE REQUIRED PROPERTY oauth2_sub: std::str;
  };
  CREATE TYPE default::UserComment {
      CREATE ACCESS POLICY superuser
          ALLOW ALL USING (std::all((GLOBAL default::current_user = <std::uuid>'e3665608-d8a1-4779-a396-f68437747839')));
      CREATE ACCESS POLICY unauthenticated_full_read
          ALLOW SELECT USING (NOT (EXISTS (GLOBAL default::current_user)));
      CREATE REQUIRED LINK user: default::User;
      CREATE REQUIRED PROPERTY comment: std::str;
  };
  CREATE TYPE default::UserLike {
      CREATE ACCESS POLICY superuser
          ALLOW ALL USING (std::all((GLOBAL default::current_user = <std::uuid>'e3665608-d8a1-4779-a396-f68437747839')));
      CREATE ACCESS POLICY unauthenticated_full_read
          ALLOW SELECT USING (NOT (EXISTS (GLOBAL default::current_user)));
      CREATE REQUIRED LINK recipe: default::RecipeEntry;
      CREATE REQUIRED LINK user: default::User;
  };
  ALTER TYPE default::RecipeBook {
      CREATE MULTI LINK recipes := (.<book[IS default::RecipeEntry]);
  };
  ALTER TYPE default::RecipeEntry {
      CREATE MULTI LINK user_likes := (.<recipe[IS default::UserLike]);
  };
};
