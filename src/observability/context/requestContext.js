import { AsyncLocalStorage } from "node:async_hooks";

const requestContext = new AsyncLocalStorage();

export default requestContext;