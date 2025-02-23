import { GoogleErrorDetails, PromptStore } from "@/models";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendMessage } from ".";

const API_KEY_STORE = "API_KEY_STORE";
const DEFAULT_AI_API_KEY = import.meta.env.VITE_AI_API_KEY as string;
const DEFAULT_AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER as string;
const AI_ERROR_MESSAGES = "AI_ERROR_MESSAGES";

const promptHelpers = {
  async getApiDetails() {
    const state = (await chrome.storage.sync.get(API_KEY_STORE))[
      API_KEY_STORE
    ] as PromptStore | null;

    return {
      provider: DEFAULT_AI_PROVIDER,
      apiKey: DEFAULT_AI_API_KEY,
      ...state,
    };
  },
  async setApiDetails(store: Partial<PromptStore>) {
    const currentStore = await this.getApiDetails();
    chrome.storage.sync.set({
      [API_KEY_STORE]: { ...currentStore, ...store },
    });
  },
  async sanitizeErrorMessage(error: unknown) {
    let errorType = null;
    const { provider } = await this.getApiDetails();

    if (provider === "google") {
      const googleError = error as GoogleErrorDetails;
      errorType =
        googleError?.error?.status || googleError?.errorDetails?.[0]?.reason;
    }

    return {
      errorType,
    };
  },
  async makePrompt<T extends object>(
    prompt: string,
    config: { responseType: "array" | "object" }
  ) {
    try {
      const { apiKey, provider } = await this.getApiDetails();

      if (provider === "google") {
        const sanitizeGeminiResponse = (response: string) => {
          const startSymbol = config.responseType === "array" ? "[" : "{";
          const endSymbol = config.responseType === "array" ? "]" : "}";
          const start = response.indexOf(startSymbol);
          const end = response.lastIndexOf(endSymbol);

          if (start === -1 || end === -1 || start >= end) {
            return null; // Return original if braces not found or invalid
          }

          return JSON.parse(response.slice(start, end + 1)) as T;
        };

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash-8b",
        });
        const result = await model.generateContent(prompt);
        return sanitizeGeminiResponse(result.response?.text());
      }
      return {} as T;
    } catch (error) {
      // RESOURCE_EXHAUSTED
      const errResponse = await this.sanitizeErrorMessage(error);
      sendMessage(AI_ERROR_MESSAGES, { type: errResponse });
      return null;
    }
  },
};

export default promptHelpers;
