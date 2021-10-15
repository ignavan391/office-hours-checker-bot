# office-hours-checker-bot
---------
just a telegram bot to monitor the number of hours worked

## How to use ? 

[![Telegram Badge](https://img.shields.io/badge/-Telegram-0088cc?style=flat-square&logo=Telegram&logoColor=white)](https://web.telegram.org/#/im?p=@officeHoursCheckerBot)

Write a message to the bot **@officeHoursCheckerBot**

### Commands :


- <code><button height="27">/come</button></code> - Mark that I came ( starts counting the time )
- <code><button height="27">/go</button></code> - Mark that I left ( stops counting time )
- <code><button height="27">/show</button></code> - Show hours for the day
- <code><button height="27">/show_all_info</button></code> - show the work schedule for the month
- <code><button height="27">get {mm/dd}</button></code> - show the work schedule for the day {mm/dd}
- <code><button height="27">set {mm/dd} {work hour}</button></code> - set the work schedule for the day {mm/dd} {workhour}

## Example :

```javascript
set 02/01 8h
get 02/01
```

Result:
```
[Year]: 2021
[Date]: 02/01 
[Time 🕔]: 8
```

```javascript
/show_all_info
```

```javascript
02/04 | 6
02/07 | 7
02/08 | 0.25
02/16 | 15
02/17 | 15.01
03/04 | 6.25
```

## For contributors : 

### How to start : 


1. clone this repo
2. create env file:
```bash
$ echo "DATABASE_USER=example \nDATABASE_PASS=example \nDATABASE_NAME=example \nDATABASE_PORT=5432 \nDATABASE_HOST=localhost \nBOT_TOKEN=your_bot_token" > .env
```
3. start : 
```bash
$ chmod +x ./database/database.sh && ./database/database.sh
$ docker-compose up --build
```

#### Expected result migrations:
```
$ yarn migrations
```

```bash
$ chmod +x ./database/database.sh && ./database/database.sh
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; CREATE TABLE IF NOT EXISTS users ( id UUID NOT NULL DEFAULT uuid_generate_v4 (), name TEXT, telegram_id INT NOT NULL, CONSTRAINT primary_key_user PRIMARY KEY ( id ) ); CREATE TABLE IF NOT EXISTS dates ( id UUID NOT NULL DEFAULT uuid_generate_v4 (), came TIMESTAMP NOT NULL DEFAULT NOW(), go TIMESTAMP, work_hours REAL NOT NULL DEFAULT 0, user_id UUID, CONSTRAINT primary_key_days PRIMARY KEY ( id ), CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id) ); CREATE UNIQUE INDEX "user.telegramId_unique" ON "users"("telegram_id");
CREATE EXTENSION
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE OR REPLACE FUNCTION trigger_set_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql; ALTER TABLE users ADD created_at TIMESTAMP NOT NULL DEFAULT NOW(); ALTER TABLE users ADD updated_at TIMESTAMP NOT NULL DEFAULT NOW(); CREATE TRIGGER set_timestamp_to_user BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();
CREATE FUNCTION
ALTER TABLE
ALTER TABLE
CREATE TRIGGER
Done in 0.24s.
```

#### Project Structure: 

* [database](https://github.com/kitt3911/office-hours-checker-bot/tree/master/database) - database staff : migrations, seeds, etc
* --- [migrations](https://github.com/kitt3911/office-hours-checker-bot/tree/master/database/migrations)
* ------ [1.timestamp.sql](https://github.com/kitt3911/office-hours-checker-bot/blob/master/database/migrations/1.timestamp.sql)

A migration that creates a trigger to automatically update a field (updated_at):

```sql
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE users ADD created_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE users ADD updated_at TIMESTAMP NOT NULL DEFAULT NOW();

CREATE TRIGGER  set_timestamp_to_user
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
```


### How to participate in the project ?
1. Create your feature branch (```git checkout -b my-new-feature```)
2. Commit your changes (```git commit -am 'Add some feature'```)
3. Push to the branch (```git push origin my-new-feature```)
4. Create new Pull Request
5. ???
6. PROFIT!!!
