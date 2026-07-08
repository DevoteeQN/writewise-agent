import { z } from "zod";

const aiProviderSchema = z.enum(["mock", "openai"]).default("mock");

export type AIProviderConfig = {
  provider: "mock" | "openai";
  model: string;
  openAIApiKey?: string;
};

type ServerEnvInput = Partial<Record<string, string | undefined>>;

export function getAIProviderConfig(env: ServerEnvInput = process.env): AIProviderConfig {
  const provider = aiProviderSchema.parse(env.AI_PROVIDER?.trim() || undefined);
  const model = env.AI_MODEL?.trim() || "gpt-4o-mini";

  if (provider === "openai") {
    const openAIApiKey = env.OPENAI_API_KEY?.trim();

    if (!openAIApiKey) {
      throw new Error("AI_PROVIDER=openai requires OPENAI_API_KEY on the server.");
    }

    return {
      provider,
      model,
      openAIApiKey,
    };
  }

  return {
    provider,
    model,
  };
}

export function validateServerEnv(env: ServerEnvInput = process.env) {
  const authSecret = env.AUTH_SECRET || env.NEXTAUTH_SECRET;
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }

  if (!authSecret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET is required.");
  }

  return {
    databaseUrl,
    authSecret,
    ai: getAIProviderConfig(env),
  };
}
