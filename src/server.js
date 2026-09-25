import app from "./app.js";
import { config } from "./config/index.js";
import testBetterStack from "./observability/testBetterStack.js";

export const startServer = async () => {
  try {
    await testBetterStack();

    app.listen(config.server.port, () => {
      console.log(
        `Server is running on port ${config.server.port}`
      );
    });
  } catch (error) {
    console.error(
      "Error while starting server:",
      error
    );
  }
};
