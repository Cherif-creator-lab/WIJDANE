import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const baseURL = process.env.ANTHROPIC_BASE_URL || "https://api.miraiapi.com/v1";

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY non configurée dans l'environnement.");
  }

  return new Anthropic({
    apiKey,
    baseURL,
  });
}

export function getDefaultModel() {
  return process.env.ANTHROPIC_MODEL || "claude-sonnet-5.5";
}
