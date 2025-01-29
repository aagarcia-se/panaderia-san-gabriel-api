import app from "./app.js";
import { config } from "./config/index.js";

export const startServer = () => {
  app.listen(config.server.port, () => {
    console.log(`Server is running`);
  });
};
