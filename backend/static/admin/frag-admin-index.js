(function () {
  const themeStorageKey = "frag-admin-theme";
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeToggleLabel = document.querySelector("[data-theme-toggle-label]");
  const storageKey = "frag-admin-open-sections";
  const sections = Array.from(document.querySelectorAll("[data-admin-app]"));

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;

    if (themeToggleLabel) {
      themeToggleLabel.textContent = theme === "light" ? "Темная тема" : "Светлая тема";
    }
  }

  if (themeToggle) {
    const initialTheme = window.localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark";
    applyTheme(initialTheme);

    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      window.localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    });
  }

  if (!sections.length) {
    return;
  }

  function readState() {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw);
      return typeof parsed === "object" && parsed ? parsed : {};
    } catch {
      return {};
    }
  }

  function writeState(state) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Ignore storage write failures.
    }
  }

  const state = readState();

  sections.forEach((section) => {
    const appLabel = section.getAttribute("data-admin-app");
    const button = section.querySelector(".frag-admin-app__toggle");
    const panel = section.querySelector(".frag-admin-app__panel");

    if (!appLabel || !button || !panel) {
      return;
    }

    const isOpen = state[appLabel] === true;
    section.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    panel.hidden = !isOpen;

    button.addEventListener("click", () => {
      const nextOpen = button.getAttribute("aria-expanded") !== "true";
      section.classList.toggle("is-open", nextOpen);
      button.setAttribute("aria-expanded", String(nextOpen));
      panel.hidden = !nextOpen;
      state[appLabel] = nextOpen;
      writeState(state);
    });
  });
})();
