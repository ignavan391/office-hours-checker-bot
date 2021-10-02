import dotenv from 'dotenv';
dotenv.config();

export type DatabaseConfig = {
  user: string;
  password: string;
  name: string;
  port: number;
};

export type Config = {
  botToken: string;
  database: DatabaseConfig;
};

function initConfig(): Config {
  return {
    botToken: process.env.BOT_TOKEN || '',
    database: {
      user: process.env.DATABASE_USER || '',
      password: process.env.DATABASE_PASS || '',
      name: process.env.DATABASE_NAME || '',
      port: Number.parseInt(process.env.DATABASE_PORT ?? '') || 5432,
    },
  };
}

const config = initConfig();
export default config;
