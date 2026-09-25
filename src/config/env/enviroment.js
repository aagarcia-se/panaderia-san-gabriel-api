import { config } from "dotenv";

config();

export const enviroment = {
  development: {
    database: {
      bd_url: process.env.DB_URL_DEV,
      bd_token: process.env.DB_TOKEN_DEV,
    },

    server: {
      port: process.env.SERVER_PORT || 3000,
    },

    smsConfig: {
      sid_twilio: process.env.ACCOUNTSID_DEV,
      token_twilio: process.env.AUTHTOKEN_DEV,
    },

    anthropic: {
      api_key: process.env.ANTHROPIC_API_KEY_DEV,
    },

    gemini: {
      api_key: process.env.GEMINI_API_KEY_DEV,
    },

    observability: {
      environment: process.env.APP_ENV || "development",
      application: process.env.APP_NAME || "unknown",
      service: process.env.APP_SERVICE || "api",
      logLevel: process.env.LOG_LEVEL || "debug",
      enabled: process.env.OBSERVABILITY_ENABLED || false,

      betterStack: {
        sourceToken: process.env.BETTER_STACK_SOURCE_TOKEN,
        ingestingHost: process.env.BETTER_STACK_INGESTING_HOST,
      },
    },
  },

  staging: {
    database: {
      bd_url: process.env.DB_URL_PIL,
      bd_token: process.env.DB_TOKEN_PIL,
      sid_twilio: process.env.ACCOUNTSID_PIL,
    },

    server: {
      port: process.env.SERVER_PORT || 3000,
    },

    smsConfig: {
      sid_twilio: process.env.ACCOUNTSID_PIL,
      token_twilio: process.env.AUTHTOKEN_PIL,
    },

    anthropic: {
      api_key: process.env.ANTHROPIC_API_KEY_PIL,
    },

    gemini: {
      api_key: process.env.GEMINI_API_KEY_PIL,
    },

    observability: {
      environment: process.env.APP_ENV || "staging",
      application: process.env.APP_NAME || "unknown",
      service: process.env.APP_SERVICE || "api",
      logLevel: process.env.LOG_LEVEL || "info",
      enabled: process.env.OBSERVABILITY_ENABLED || false,

      betterStack: {
        sourceToken: process.env.BETTER_STACK_SOURCE_TOKEN,
        ingestingHost: process.env.BETTER_STACK_INGESTING_HOST,
      },
    },
  },

  production: {
    database: {
      bd_url: process.env.DB_URL_PROD,
      bd_token: process.env.DB_TOKEN_PROD,
      sid_twilio: process.env.ACCOUNTSID_PROD,
    },

    server: {
      port: process.env.SERVER_PORT || 3000,
    },

    smsConfig: {
      sid_twilio: process.env.ACCOUNTSID_PROD,
      token_twilio: process.env.AUTHTOKEN_PROD,
    },

    anthropic: {
      api_key: process.env.ANTHROPIC_API_KEY_PROD,
    },

    gemini: {
      api_key: process.env.GEMINI_API_KEY_PROD,
    },

    observability: {
      environment: process.env.APP_ENV || "production",
      application: process.env.APP_NAME || "unknown",
      service: process.env.APP_SERVICE || "api",
      logLevel: process.env.LOG_LEVEL || "info",
      enabled: process.env.OBSERVABILITY_ENABLED || false,

      betterStack: {
        sourceToken: process.env.BETTER_STACK_SOURCE_TOKEN,
        ingestingHost: process.env.BETTER_STACK_INGESTING_HOST,
      },
    },
  },
};