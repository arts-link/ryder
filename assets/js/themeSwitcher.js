// darkMode.js
export function initDarkMode() {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const lightModeButton = document.getElementById("lightMode");
  const darkModeButton = document.getElementById("darkMode");
  const systemModeButton = document.getElementById("systemMode");

  let systemModeListenerAdded = false; // Flag to track whether system mode listener is added

  function toggleTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      lightModeButton.classList.remove('hidden');
      darkModeButton.classList.add('hidden');
      systemModeButton.classList.add('hidden');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      darkModeButton.classList.remove('hidden');
      lightModeButton.classList.add('hidden');
      systemModeButton.classList.add('hidden');
    } else if (theme === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
        localStorage.theme = '';
        systemModeButton.classList.remove('hidden');
        darkModeButton.classList.add('hidden');
        lightModeButton.classList.add('hidden');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = '';
        systemModeButton.classList.remove('hidden');
        lightModeButton.classList.add('hidden');
        darkModeButton.classList.add('hidden');
      }
    }
    // Check if the theme is explicitly set by the user
    if (theme === 'light' || theme === 'dark') {
      // Remove event listener for system mode change if it's added
      if (systemModeListenerAdded) {
        darkModeMediaQuery.removeEventListener('change', detectOSThemeChange);
        systemModeListenerAdded = false;
      }
    } else {
      // Add event listener for system mode change if it's not added
      if (!systemModeListenerAdded) {
        darkModeMediaQuery.addEventListener('change', detectOSThemeChange);
        systemModeListenerAdded = true;
      }
    }
  }

  function detectOSThemeChange(event) {
    // Check if the new theme is dark
    if (event.matches) {
      document.documentElement.classList.add('dark');
      // toggleTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      // toggleTheme('light');
    }
  }

  // Event listeners and initialization
  lightModeButton.addEventListener("click", () => toggleTheme('dark'));
  darkModeButton.addEventListener("click", () => toggleTheme('system'));
  systemModeButton.addEventListener("click", () => toggleTheme('light'));

  // Check local storage for theme or default to system
  if (localStorage.theme === 'dark') {
    toggleTheme('dark');
  } else if (localStorage.theme === 'light') {
    toggleTheme('light');
  } else {
    toggleTheme('system');
  }

}
