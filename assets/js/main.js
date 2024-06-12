// Import necessary libraries
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';
import L from 'leaflet';

// Make Leaflet accessible globally
window.L = L;

// This is optional but gives access to Alpine in devtools
Alpine.plugin(focus);
window.Alpine = Alpine;
Alpine.start();

// Check if dark mode is enabled in configuration
if (showDarkToggle) {
  import('./themeSwitcher.js').then((module) => {
    module.initDarkMode();
  }).catch((error) => {
    console.error('Error loading dark mode module:', error);
  });
}

// Import extended functionalities
import './extended.js';

// Leaflet is now available globally
console.log('Leaflet version:', L.version);
