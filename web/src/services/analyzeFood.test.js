import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./supabase", () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { supabase } from "./supabase";
import analyzeFood from "./analyzeFood";
import analyzeFoodDesc from "./analyzeFoodDesc";
import i18n from "../lib/i18n";
import { resolveLanguage } from "../../supabase/functions/_shared/language";

describe("Language handling for meal analysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("resolveLanguage helper", () => {
    it("maps 'uk' or 'uk-UA' to Ukrainian", () => {
      expect(resolveLanguage("uk")).toBe("Ukrainian");
      expect(resolveLanguage("uk-UA")).toBe("Ukrainian");
    });

    it("maps 'pl' or 'pl-PL' to Polish", () => {
      expect(resolveLanguage("pl")).toBe("Polish");
      expect(resolveLanguage("pl-PL")).toBe("Polish");
    });

    it("maps 'en' or 'en-US' to English", () => {
      expect(resolveLanguage("en")).toBe("English");
      expect(resolveLanguage("en-US")).toBe("English");
    });

    it("falls back to English when undefined or empty", () => {
      expect(resolveLanguage()).toBe("English");
      expect(resolveLanguage("")).toBe("English");
    });
  });

  describe("analyzeFoodDesc service", () => {
    it("forwards explicit language to edge function invoke", async () => {
      supabase.functions.invoke.mockResolvedValueOnce({
        data: { name: "Kanapka", foods: [], meal_total: { calories: 200 } },
        error: null,
      });

      const res = await analyzeFoodDesc("kanapka z serem", "bez masla", "pl");

      expect(supabase.functions.invoke).toHaveBeenCalledWith("analyze-food-desc", {
        body: {
          description: "kanapka z serem",
          clarifications: "bez masla",
          language: "pl",
        },
      });
      expect(res.name).toBe("Kanapka");
    });

    it("falls back to current i18n language if language not provided", async () => {
      await i18n.changeLanguage("uk");
      supabase.functions.invoke.mockResolvedValueOnce({
        data: { name: "Борщ", foods: [], meal_total: { calories: 300 } },
        error: null,
      });

      await analyzeFoodDesc("борщ зі сметаною");

      expect(supabase.functions.invoke).toHaveBeenCalledWith("analyze-food-desc", {
        body: {
          description: "борщ зі сметаною",
          clarifications: undefined,
          language: "uk",
        },
      });
    });
  });

  describe("analyzeFood service", () => {
    it("forwards language to analyze-food edge function", async () => {
      globalThis.Image = class {
        set src(_) {
          setTimeout(() => {
            this.width = 400;
            this.height = 300;
            this.onload?.();
          }, 0);
        }
      };
      const origCreateElement = document.createElement.bind(document);
      document.createElement = (tag) => {
        if (tag === "canvas") {
          return {
            getContext: () => ({ drawImage: vi.fn() }),
            toDataURL: () => "data:image/jpeg;base64,mockbase64",
          };
        }
        return origCreateElement(tag);
      };

      await i18n.changeLanguage("pl");
      supabase.functions.invoke.mockResolvedValueOnce({
        data: { name: "Kanapka", foods: [], meal_total: { calories: 200 } },
        error: null,
      });

      await analyzeFood("data:image/jpeg;base64,123", "dodatkowe info");

      expect(supabase.functions.invoke).toHaveBeenCalledWith("analyze-food", {
        body: {
          imageBase64: "mockbase64",
          mimeType: "image/jpeg",
          clarifications: "dodatkowe info",
          language: "pl",
        },
      });
    });
  });
});
