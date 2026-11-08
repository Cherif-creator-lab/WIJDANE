import Anthropic from "@anthropic-ai/sdk";

export function getAnthropicClient() {
  const apiKey =
    process.env.ANTHROPIC_API_KEY ||
    "sk-XprZK2vvDS4ZENowET9I5SLl7Tlu4fYEkD9kVWaPsPn9EbvK";

  // L'Anthropic SDK ajoute automatiquement "/v1/messages".
  // Si ANTHROPIC_BASE_URL contient "/v1", il faut le retirer pour éviter "POST /v1/v1/messages" (404)
  let rawBaseURL = process.env.ANTHROPIC_BASE_URL || "https://api.miraiapi.com";
  const cleanBaseURL = rawBaseURL.replace(/\/v1\/?$/, "");

  return new Anthropic({
    apiKey,
    baseURL: cleanBaseURL,
  });
}

export function getDefaultModel() {
  return process.env.ANTHROPIC_MODEL || "claude-opus-4.8";
}

export async function createClaudeMessageWithFallback(params: {
  system?: string;
  messages: { role: "user" | "assistant"; content: string }[];
  max_tokens?: number;
  preferredModel?: string;
}) {
  const client = getAnthropicClient();
  const modelsToTry = [
    params.preferredModel || getDefaultModel(),
    "claude-opus-4.8",
    "claude-sonnet-5.5",
    "claude-sonnet-5",
  ];

  // Dédupliquer la liste des modèles
  const uniqueModels = Array.from(new Set(modelsToTry));
  let lastError: any = null;

  for (const model of uniqueModels) {
    try {
      const response = await client.messages.create({
        model,
        max_tokens: params.max_tokens || 4096,
        ...(params.system ? { system: params.system } : {}),
        messages: params.messages,
      });
      return { response, usedModel: model };
    } catch (err: any) {
      console.warn(`Modèle ${model} indisponible ou occupé, essai suivant...`, err?.message);
      lastError = err;
    }
  }

  throw lastError || new Error("Tous les modèles Claude sur le relais sont temporairement occupés.");
}
