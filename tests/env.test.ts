import { describe, expect, it } from "vitest";
import { getAIProviderConfig, validateServerEnv } from "@/lib/env";

describe("environment validation", () => {
  it("defaults to mock provider when AI_PROVIDER is missing", () => {
    expect(getAIProviderConfig({}).provider).toBe("mock");
  });

  it("requires OPENAI_API_KEY when provider is openai", () => {
    expect(() => getAIProviderConfig({ AI_PROVIDER: "openai" })).toThrow(
      "OPENAI_API_KEY"
    );
  });

  it("uses a default model when OpenAI model is omitted", () => {
    const config = getAIProviderConfig({
      AI_PROVIDER: "openai",
      OPENAI_API_KEY: "test-key",
    });

    expect(config.model).toBe("gpt-4o-mini");
  });

  it("validates required server secrets without exposing values", () => {
    const env = validateServerEnv({
      DATABASE_URL: "postgresql://user:pass@localhost:5432/writewise",
      AUTH_SECRET: "test-secret",
      AI_PROVIDER: "mock",
    });

    expect(env.ai.provider).toBe("mock");
  });
});
