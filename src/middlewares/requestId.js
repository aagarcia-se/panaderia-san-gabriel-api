import { randomUUID } from "node:crypto";
import requestContext from "../observability/context/requestContext.js";

const requestId = (req, res, next) => {
  const incomingRequestId = req.headers["x-request-id"];

  const id = incomingRequestId || randomUUID();

  req.requestId = id;

  res.setHeader("X-Request-Id", id);

  requestContext.run(
    {
      requestId: id,
    },
    next
  );
};

export default requestId;