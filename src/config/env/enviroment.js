import { config } from "dotenv";

config();

export const enviroment = {
  dev: {
    database: {
      host: process.env.DB_HOST_DEV,
      user: process.env.DB_USER_DEV,
      port: process.env.DB_PORT_DEV,
      password: process.env.DB_PASSWORD_DEV,
      databaseName: process.env.DB_DATABASE_DEV,
    },
    server: {
      port: process.env.SERVER_DEV || 3000,
    },
  },
  prod: {
    database: {
      host: process.env.DB_HOST_PROD,
      port: process.env.DB_PORT_PROD,
      user: process.env.DB_USER_PROD,
      password: process.env.DB_PASSWORD_PROD,
      databaseName: process.env.DB_DATABASE_PROD,
    },
    server: {
      port: process.env.SERVER_PROD || 3000,
    },
  },
};
