import { ERROR_TYPE, GoogleErrorDetails } from "@/models";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { settingHelpers, SettingsState } from "@/sidepanel/store/useSettings";

const promptHelpers = {
  async sanitizeErrorMessage(error: unknown) {
    const { credential } = await settingHelpers.getStore();
    let errorType: keyof ERROR_TYPE | undefined | null = null;

    if (credential?.type === "gemini") {
      const googleError = error as GoogleErrorDetails;
      errorType =
        googleError?.error?.status || googleError?.errorDetails?.[0]?.reason;
    }

    if (errorType === "RESOURCE_EXHAUSTED") {
      return {
        type: errorType,
        title: "Requests Limit Reached",
        description: credential?.isDefault
          ? "You've reached the maximum number of requests allowed for now. Please wait and try again later. If this happens often, consider using a custom api key"
          : "You've reached the maximum number of requests allowed for now. Please wait and try again later.",
      };
    }

    if (errorType === "API_KEY_INVALID") {
      return {
        type: errorType,
        title: "Invalid API Key",
        description: "Seems like the api key you used is not valid",
      };
    }
  },
  async makePrompt<T extends object>(prompt: string) {
    try {
      const { credential } = await settingHelpers.getStore();
      if (credential?.type === "gemini") {
        return await this.gemini<T>({ credential, prompt });
      }

      return this.openai<T>();
    } catch (err) {
      const error = await this.sanitizeErrorMessage(err);

      return {
        error,
        type: "error",
        data: null,
      } as const;
    }
  },
  async gemini<T>({
    credential,
    prompt,
  }: {
    prompt: string;
    credential: SettingsState["credential"];
  }) {
    const sanitizeGeminiResponse = (response: string) => {
      const isResponseArray =
        response.indexOf("{") === -1 ||
        response.indexOf("[") < response.indexOf("{");
      const startSymbol = isResponseArray ? "[" : "{";
      const endSymbol = isResponseArray ? "]" : "}";
      const start = response.indexOf(startSymbol);
      const end = response.lastIndexOf(endSymbol);

      if (start === -1 || end === -1 || start >= end) {
        return null; // Return original if braces not found or invalid
      }

      return JSON.parse(response.slice(start, end + 1)) as T;
    };

    const genAI = new GoogleGenerativeAI(credential?.apiKey ?? "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 10192,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);

    return {
      type: "success",
      data: sanitizeGeminiResponse(result.response?.text()) as T,
      error: null,
    } as const;
  },
  async openai<T = null>() {
    return {
      type: "success",
      data: null as T,
      error: null,
    };
  },
};

export default promptHelpers;
