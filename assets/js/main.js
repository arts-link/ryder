import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)
// This will automatically find any <i> tags with the 'fa' class and convert them into <svg> elements
dom.watch()

import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

// This is optional but gives access to Alpine in devtools
Alpine.plugin(focus);
window.Alpine = Alpine;
Alpine.start();

if (loadLeaflet) {
  import('leaflet').then(L => {
      // Make Leaflet accessible globally
      window.L = L;

      // Notify any map shortcodes that Leaflet is ready
      window.dispatchEvent(new CustomEvent('leaflet-loaded'));
  }).catch(error => {
      console.error('Error loading Leaflet:', error);
  });
}

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
