import Anthropic from "@anthropic-ai/sdk";
import { config } from "../index.js";


const configEnv = config.anthropic;

const anthropicIA = new Anthropic({
  apiKey: configEnv.api_key || ""
});

export default anthropicIA;