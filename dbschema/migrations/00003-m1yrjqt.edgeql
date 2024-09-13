CREATE MIGRATION m1yrjqtsqili52m7rvvpbhmdox3zdzij4mmyeg2bhbokc45bymrkna
    ONTO m173y6uyfsyoqa7wgvmwyq6umrypvfvj2r6eqj3rcchxdaaijqv4na
{
  ALTER TYPE default::UserLike {
      CREATE REQUIRED PROPERTY datetime: std::datetime {
          SET default := (std::datetime_current());
      };
  };
};
