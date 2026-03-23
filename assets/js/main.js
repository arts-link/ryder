import { library, dom } from '@fortawesome/fontawesome-svg-core'

// Only import the solid icons used by this theme
import {
  faAngleDown,
  faAnglesRight,
  faBars,
  faBath,
  faBicycle,
  faBinoculars,
  faBullhorn,
  faCalendarDays,
  faCameraRetro,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCode,
  faComputer,
  faDumpsterFire,
  faDungeon,
  faGlobe,
  faHandPointLeft,
  faHandPointRight,
  faHouse,
  faMapLocationDot,
  faMoon,
  faOm,
  faShieldDog,
  faSignsPost,
  faSnowflake,
  faSun,
  faTags,
  faTimes,
  faTriangleExclamation,
  faWandMagicSparkles,
  faWheatAwn,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

// Only import the regular icons used by this theme
import {
  faHandPointRight as farHandPointRight,
} from '@fortawesome/free-regular-svg-icons'

// Only import the brand icons used by this theme
import {
  faGithubAlt,
  faSpotify,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'

library.add(
  // solid
  faAngleDown, faAnglesRight, faBars, faBath, faBicycle, faBinoculars,
  faBullhorn, faCalendarDays, faCameraRetro, faCircleCheck, faCircleExclamation,
  faCircleInfo, faCode, faComputer, faDumpsterFire, faDungeon, faGlobe,
  faHandPointLeft, faHandPointRight, faHouse, faMapLocationDot, faMoon, faOm,
  faShieldDog, faSignsPost, faSnowflake, faSun, faTags, faTimes,
  faTriangleExclamation, faWandMagicSparkles, faWheatAwn, faXmark,
  // regular
  farHandPointRight,
  // brands
  faGithubAlt, faSpotify, faYoutube,
)
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

      // You can now use L here, or call another function that requires Leaflet
      // console.log('Leaflet has been loaded:', L);

      // Optionally, call your function that needs Leaflet here
      // initMap(); // Assuming initMap is your function to initialize the map
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
