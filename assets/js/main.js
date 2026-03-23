import { library, dom } from '@fortawesome/fontawesome-svg-core'

// Only import the solid icons used by this theme
import {
  faAngleDown,
  faAnglesRight,
  faBars,
  faBath,
  faBicycle,
  faBinoculars,
  faBowlFood,
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
  faBowlFood, faBullhorn, faCalendarDays, faCameraRetro, faCircleCheck, faCircleExclamation,
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

import Alpine from '@alpinejs/csp';
import focus from '@alpinejs/focus';

// Register the alert dismissal component (uses document.cookie — must live
// here rather than in an inline x-data expression so the CSP is not violated)
Alpine.data('alertDismissible', () => ({
  isOpen: document.cookie.indexOf('alertClosed=true') === -1,
  dismiss() {
    this.isOpen = false;
    document.cookie = 'alertClosed=true; path=/;';
  },
}));

// Register the image-gallery component (methods use setTimeout / $refs /
// DOM queries — too complex for the CSP-safe expression evaluator)
Alpine.data('imageGallery', () => ({
  imageGalleryOpened: false,
  imageGalleryActiveUrl: null,
  imageGalleryImageIndex: null,
  imageGallery: [],
  init() {
    try {
      this.imageGallery = JSON.parse(this.$el.dataset.gallery || '[]');
    } catch (e) {
      console.error('Error parsing gallery data:', e);
    }
  },
  imageGalleryOpen(event) {
    this.imageGalleryImageIndex = event.target.dataset.index;
    this.imageGalleryActiveUrl = event.target.src;
    this.imageGalleryOpened = true;
  },
  imageGalleryClose() {
    this.imageGalleryOpened = false;
    setTimeout(() => { this.imageGalleryActiveUrl = null; }, 300);
  },
  imageGalleryNext() {
    if (this.imageGalleryImageIndex < this.imageGallery.length) {
      this.imageGalleryImageIndex = parseInt(this.imageGalleryImageIndex) + 1;
      const img = this.$refs.gallery.querySelector('[data-index=\'' + this.imageGalleryImageIndex + '\']');
      if (img) this.imageGalleryActiveUrl = img.src;
    }
  },
  imageGalleryPrev() {
    if (this.imageGalleryImageIndex > 1) {
      this.imageGalleryImageIndex = parseInt(this.imageGalleryImageIndex) - 1;
      const img = this.$refs.gallery.querySelector('[data-index=\'' + this.imageGalleryImageIndex + '\']');
      if (img) this.imageGalleryActiveUrl = img.src;
    }
  },
}));

// Register the affiliate-link-builder component (default tag injected by Hugo
// via a data attribute so the shortcode needs no inline <script> tag)
Alpine.data('affiliateLinkBuilder', () => ({
  asin: '',
  affiliateTag: '',
  affiliateLink: '',
  init() {
    this.affiliateTag = this.$el.dataset.defaultTag || '';
  },
  isValidAsin(asin) {
    const asinRegex = /^[A-Z0-9]{10}$/;
    return asinRegex.test(asin);
  },
  validateAsin() {
    this.asin = this.asin.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
  },
  generateAffiliateLink() {
    this.affiliateLink = `View ASIN <a class="bg-yellow-400 text-black font-medium py-2 mt-4 px-4 rounded-full border-2 border-yellow-500 hover:bg-yellow-500 hover:border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 no-underline inline-block text-center break-words" href="https://www.amazon.com/dp/${this.asin}/ref=nosim?tag=${this.affiliateTag}">${this.asin || 'Buy Now'}</a> on Amazon.com`;
  },
}));

// This is optional but gives access to Alpine in devtools
Alpine.plugin(focus);
window.Alpine = Alpine;
Alpine.start();

const themeConfigEl = document.getElementById('theme-config');
let themeConfig = {};
if (themeConfigEl) {
  try {
    themeConfig = JSON.parse(themeConfigEl.textContent);
  } catch (e) {
    console.error('Error parsing theme-config:', e);
  }
}
const loadLeaflet = themeConfig.loadLeaflet || false;
const showDarkToggle = themeConfig.showDarkToggle || false;

if (loadLeaflet) {
  import('leaflet').then(L => {
      // Make Leaflet accessible globally
      window.L = L;

      // Configure default marker icons with fingerprinted (cache-busted) URLs
      if (themeConfig.leafletMarkerIconUrl) {
        L.Icon.Default.mergeOptions({
          iconUrl: themeConfig.leafletMarkerIconUrl,
          iconRetinaUrl: themeConfig.leafletMarkerIconRetinaUrl,
          shadowUrl: themeConfig.leafletMarkerShadowUrl,
        });
      }
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
