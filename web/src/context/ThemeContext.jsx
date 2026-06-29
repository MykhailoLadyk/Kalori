import { createContext, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { themesDefinitions } from "../lib/constans";

export const ThemeContext = createContext(null);

// CSS variable names mapped to palette keys
const VAR_MAP = {
  bg: "--c-bg",
  panel: "--c-panel",
  card: "--c-card",
  border: "--c-border",
  accent: "--c-accent",
  gold: "--c-gold",
  blue: "--c-blue",
  pink: "--c-pink",
  orange: "--c-orange",
  red: "--c-red",
  text: "--c-text",
  soft: "--c-soft",
  muted: "--c-muted",
  mutedLight: "--c-muted-light",
};

function applyPalette(palette) {
  const root = document.documentElement;
  for (const [key, varName] of Object.entries(VAR_MAP)) {
    if (palette[key]) {
      root.style.setProperty(varName, palette[key]);
    }
  }
  // Alpha-derived variables (accentDim, accentMid, accentGlow, goldDim,
  // blueDim, pinkDim) are defined in index.css using color-mix() referencing
  // the base variables above — they update automatically.
}

const DEFAULT_PALETTE = themesDefinitions[0].palette;

export function ThemeProvider({ children }) {
  const { user } = useUser();
  const themeId = user?.settings?.theme ?? 1;

  useEffect(() => {
    const themeDef = themesDefinitions.find((t) => t.id === themeId);
    const palette = themeDef?.palette ?? DEFAULT_PALETTE;
    applyPalette(palette);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId }}>
      {children}
    </ThemeContext.Provider>
  );
}
