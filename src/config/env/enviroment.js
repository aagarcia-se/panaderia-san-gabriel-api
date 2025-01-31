import { config } from "dotenv";

config();

export const enviroment = {
  dev: {
    database: {
      bd_url: process.env.DB_URL_DEV,
      bd_token: process.env.DB_TOKEN_DEV,
    },
    server: {
      port: process.env.SERVER_DEV || 3000,
    },
    smsConfig: {
      sid_twilio: process.env.ACCOUNTSID_DEV,
      token_twilio: process.env.AUTHTOKEN_DEV,
    },
  },
  pil: {
    database: {
      bd_url: process.env.DB_URL_PIL,
      bd_token: process.env.DB_TOKEN_PIL,
      sid_twilio: process.env.ACCOUNTSID_PIL,
      token_twilio: process.env.AUTHTOKEN_PIL,
    },
    server: {
      port: process.env.SERVER_PROD || 3000,
    },
    smsConfig: {
      sid_twilio: process.env.ACCOUNTSID_PIL,
      token_twilio: process.env.AUTHTOKEN_PIL,
    },
  },
  prod: {
    database: {
      bd_url: process.env.DB_URL_PROD,
      bd_token: process.env.DB_TOKEN_PROD,
      sid_twilio: process.env.ACCOUNTSID_PROD,
      token_twilio: process.env.AUTHTOKEN_PROD,
    },
    server: {
      port: process.env.SERVER_PROD || 3000,
    },
    smsConfig: {
      sid_twilio: process.env.ACCOUNTSID_PROD,
      token_twilio: process.env.AUTHTOKEN_PROD,
    },
  },
};
