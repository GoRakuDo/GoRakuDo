// Scripts Index - Easy imports for all categorized scripts

// Core Scripts
export { default as UpgradeBrowser } from './core/upgrade-browsermu.js';

// Utility function to load scripts dynamically
export function loadScript(category, scriptName) {
  const scriptMap = {
    core: {
      'upgrade-browsermu': () => import('./core/upgrade-browsermu.js'),
    },
  };

  if (scriptMap[category] && scriptMap[category][scriptName]) {
    return scriptMap[category][scriptName]();
  }

  throw new Error(`Script not found: ${category}/${scriptName}`);
}

// Initialize all scripts
export function initializeScripts() {
  // Auto-initialize based on page type
  // Homepage uses inline scripts in src/pages/index.astro
  // Docs page uses pure Astro SSG - no JavaScript needed
}
