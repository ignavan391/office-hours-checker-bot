CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID NOT NULL DEFAULT uuid_generate_v4 (),
    CONSTRAINT primary_key_user PRIMARY KEY ( id ),

    name TEXT,
    telegramId int NOT NULL
);

CREATE TABLE dates (
    id uuid NOT NULL DEFAULT uuid_generate_v4 (),
    CONSTRAINT primary_key_days PRIMARY KEY ( id ),

    came TIMESTAMP NOT NULL DEFAULT NOW(),
    go TIMESTAMP,
    workHours int NOT NULL DEFAULT 0,
    userId UUID,
    CONSTRAINT fk_users
      FOREIGN KEY(userId) 
	  REFERENCES users(id)
);


CREATE UNIQUE INDEX "user.telegramId_unique" ON "users"("telegramid");
