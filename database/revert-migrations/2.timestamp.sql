DROP TRIGGER IF EXISTS  set_timestamp_to_user;
DROP FUNCTION IF EXISTS  trigger_set_timestamp();
ALTER TABLE users DROP COLUMN IF EXISTS created_at;
ALTER TABLE users DROP COLUMN IF EXISTS updated_at;