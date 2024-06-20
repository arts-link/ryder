// Import necessary libraries
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

if (loadLeaflet) {
  import('leaflet').then(L => {
      // Make Leaflet accessible globally
      window.L = L;

      // You can now use L here, or call another function that requires Leaflet
      console.log('Leaflet has been loaded:', L);

      // Optionally, call your function that needs Leaflet here
      // initMap(); // Assuming initMap is your function to initialize the map
  }).catch(error => {
      console.error('Error loading Leaflet:', error);
  });
} else {
  console.log('Leaflet will not be loaded.');
}

// import L from 'leaflet';

// // Make Leaflet accessible globally
// window.L = L;

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
