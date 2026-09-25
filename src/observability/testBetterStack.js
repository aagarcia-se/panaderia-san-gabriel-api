import { Logtail } from "@logtail/node";

import observabilityConfig from "./config/observability.config.js";

const testBetterStack = async () => {
  const sourceToken =
    observabilityConfig.betterStack?.sourceToken;

  const ingestingHost =
    observabilityConfig.betterStack?.ingestingHost;

  console.log("=================================");
  console.log("BETTER STACK DIRECT TEST");
  console.log("=================================");

  console.log(
    "OBSERVABILITY ENABLED:",
    observabilityConfig.enabled
  );

  console.log(
    "HAS SOURCE TOKEN:",
    Boolean(sourceToken)
  );

  console.log(
    "HAS INGESTING HOST:",
    Boolean(ingestingHost)
  );

  console.log(
    "INGESTING HOST:",
    ingestingHost || "NOT_CONFIGURED"
  );

  if (!observabilityConfig.enabled) {
    console.log(
      "Better Stack test skipped: observability disabled"
    );

    return;
  }

  if (!sourceToken || !ingestingHost) {
    console.error(
      "Better Stack test failed: missing credentials"
    );

    return;
  }

  try {
    const logtail = new Logtail(sourceToken, {
      endpoint: `https://${ingestingHost}`,
    });

    console.log("Logtail client initialized");

    logtail.info(
      "Vercel Better Stack direct connectivity test",
      {
        category: "SYSTEM",
        operation: "betterStackConnectivityTest",

        application:
          observabilityConfig.application,

        service:
          observabilityConfig.service,

        environment:
          observabilityConfig.environment,

        source: "vercel",

        test: true,

        timestamp: new Date().toISOString(),
      }
    );

    console.log("Log sent to Logtail queue");

    await logtail.flush();

    console.log(
      "BETTER STACK FLUSH COMPLETED SUCCESSFULLY"
    );

    console.log("=================================");
  } catch (error) {
    console.error(
      "BETTER STACK DIRECT TEST ERROR:"
    );

    console.error(error);

    if (error instanceof Error) {
      console.error("MESSAGE:", error.message);
      console.error("STACK:", error.stack);
    }
  }
};

export default testBetterStack;