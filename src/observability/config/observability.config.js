const environment = process.env.APP_ENV || "development";

const config = {
  environment,
  application: process.env.APP_NAME || "san-gabriel-api",
  service: process.env.APP_SERVICE || "api",
  logLevel: process.env.LOG_LEVEL || "info",
};

export default config;