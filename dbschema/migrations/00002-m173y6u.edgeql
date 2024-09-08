CREATE MIGRATION m173y6uyfsyoqa7wgvmwyq6umrypvfvj2r6eqj3rcchxdaaijqv4na
    ONTO m1a7uknc5mucfu42pdergm3svceh3ocvoaxyjvwxvsktdkqljeie4q
{
  ALTER TYPE default::RecipeEntry {
      ALTER LINK user_likes {
          RENAME TO likes;
      };
  };
  ALTER TYPE default::RecipeEntry {
      CREATE REQUIRED PROPERTY numLikes := (SELECT
          std::count(.likes)
      );
  };
  ALTER TYPE default::User {
      ALTER PROPERTY oauth2_sub {
          RENAME TO name;
      };
  };
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY picture: std::str {
          SET REQUIRED USING (<std::str>'');
      };
      CREATE REQUIRED PROPERTY sub: std::str {
          SET REQUIRED USING (<std::str>'');
          CREATE CONSTRAINT std::exclusive;
      };
  };
  ALTER TYPE default::UserLike {
      CREATE CONSTRAINT std::exclusive ON ((.user, .recipe));
  };
};
