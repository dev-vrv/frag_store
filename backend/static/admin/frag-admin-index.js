(function () {
  const storageKey = "frag-admin-open-sections";
  const sections = Array.from(document.querySelectorAll("[data-admin-app]"));

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
