export const THEME_STORAGE_KEY = "frag-store-theme";
export const THEME_CHANGE_EVENT = "frag-store:theme-change";

export type ResolvedTheme = "dark" | "light";
export type ThemePreference = ResolvedTheme | "system";

export interface ThemeChangeDetail {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
}

export const THEME_BOOTSTRAP_SCRIPT = `(() => {
  const root = document.documentElement;
  let preference = "system";

  try {
    const storedTheme = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (storedTheme === "dark" || storedTheme === "light") {
      preference = storedTheme;
    }
  } catch {}

  let resolvedTheme = preference;
  if (preference === "system") {
    try {
      resolvedTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      resolvedTheme = "dark";
    }
  }

  root.dataset.themePreference = preference;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
})();`;

export function getDocumentTheme(): ResolvedTheme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function getDocumentThemePreference(): ThemePreference {
  const preference = document.documentElement.dataset.themePreference;

  return preference === "dark" || preference === "light" ? preference : "system";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") {
    return preference;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyDocumentTheme(preference: ThemePreference, persist = true) {
  const root = document.documentElement;
  const resolvedTheme = resolveTheme(preference);

  root.dataset.themePreference = preference;
  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;

  if (persist) {
    try {
      if (preference === "system") {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, preference);
      }
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  }

  const detail: ThemeChangeDetail = { preference, resolvedTheme };
  window.dispatchEvent(new CustomEvent<ThemeChangeDetail>(THEME_CHANGE_EVENT, { detail }));
}
