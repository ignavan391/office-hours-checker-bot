CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT uuid_generate_v4 (),
    name TEXT,
    telegram_id INT NOT NULL,

    CONSTRAINT primary_key_user PRIMARY KEY ( id )
);

CREATE TABLE IF NOT EXISTS dates (
    id UUID NOT NULL DEFAULT uuid_generate_v4 (),
    came TIMESTAMP,
    go TIMESTAMP,
    work_hours REAL NOT NULL DEFAULT 0,
    user_id UUID,

    CONSTRAINT primary_key_days PRIMARY KEY ( id ),
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id)
);


CREATE UNIQUE INDEX "user.telegramId_unique" ON "users"("telegram_id");
