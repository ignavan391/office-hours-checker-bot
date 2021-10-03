CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE users ADD created_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE users ADD updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE TRIGGER  set_timestamp_to_user
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();