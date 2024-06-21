// Import necessary libraries
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// <!-- Add all icons to the library so you can use it in your page -->

library.add(fas, far, fab)
// This will automatically find any <i> tags with the 'fa' class and convert them into <svg> elements
dom.watch()

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
