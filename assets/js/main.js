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
  faChartLine,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faCode,
  faComputer,
  faDumpsterFire,
  faDungeon,
  faGlobe,
  faImage,
  faHouse,
  faMapLocationDot,
  faMoon,
  faMusic,
  faOm,
  faRss,
  faSeedling,
  faShieldDog,
  faSignsPost,
  faSnowflake,
  faSun,
  faTags,
  faTimes,
  faTriangleExclamation,
  faUtensils,
  faWandMagicSparkles,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

// Only import the regular icons used by this theme
import {
  faEnvelope as farEnvelope,
  faHandPointLeft as farHandPointLeft,
  faHandPointRight as farHandPointRight,
} from '@fortawesome/free-regular-svg-icons'

// Only import the brand icons used by this theme
import {
  faAmazon,
  faGithub,
  faGithubAlt,
  faSpotify,
} from '@fortawesome/free-brands-svg-icons'

library.add(
  // solid
  faAngleDown, faAnglesRight, faBars, faBath, faBicycle, faBinoculars,
  faBowlFood, faBullhorn, faCalendarDays, faCameraRetro, faChartLine, faCircleCheck, faCircleExclamation,
  faCircleInfo, faCode, faComputer, faDumpsterFire, faDungeon, faGlobe,
  faHouse, faImage, faMapLocationDot, faMoon, faMusic, faOm,
  faShieldDog, faSignsPost, faSnowflake, faSun, faTags, faTimes,
  faRss, faSeedling, faTriangleExclamation, faUtensils, faWandMagicSparkles, faXmark,
  // regular
  farEnvelope, farHandPointLeft, farHandPointRight,
  // brands
  faAmazon, faGithub, faGithubAlt, faSpotify,
)
// This will automatically find any <i> tags with the 'fa' class and convert them into <svg> elements
dom.watch()

import Alpine from '@alpinejs/csp';
import focus from '@alpinejs/focus';

// Register the mobile menu component (header nav toggle)
Alpine.data('mobileMenu', () => ({
  openMenu: false,
}));

// Register the socials list toggle component
Alpine.data('socialsList', () => ({
  show: false,
}));

// Register the sub-menu component (hover on desktop, click-toggle on mobile)
Alpine.data('subMenu', () => ({
  open: false,
  toggle() { this.open = !this.open; },
}));

// Register the alert dismissal component. Persistence is stored in
// localStorage so dismissals survive normal navigation and browser restarts.
// A cookie fallback is kept for environments where localStorage is blocked.
Alpine.data('alertDismissible', () => ({
  isOpen: true,
  storageKey: 'default',
  init() {
    const key = this.$el.dataset.alertKey || 'default';
    this.storageKey = `alertClosed_${key}`;
    try {
      this.isOpen = window.localStorage.getItem(this.storageKey) !== 'true';
      return;
    } catch (e) {
      this.isOpen = document.cookie.indexOf(`${this.storageKey}=true`) === -1;
    }
  },
  dismiss() {
    this.isOpen = false;
    try {
      window.localStorage.setItem(this.storageKey, 'true');
    } catch (e) {
      document.cookie = `${this.storageKey}=true; path=/; max-age=31536000; SameSite=Lax`;
    }
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
  updateActiveImage(index) {
    const imageIndex = Number(index);
    const selectedImage = this.imageGallery[imageIndex - 1];
    if (!selectedImage) return;
    this.imageGalleryImageIndex = imageIndex;
    this.imageGalleryActiveUrl = selectedImage.photo;
  },
  imageGalleryOpen(event) {
    this.updateActiveImage(event.target.dataset.index || 1);
    this.imageGalleryOpened = true;
  },
  imageGalleryClose() {
    this.imageGalleryOpened = false;
    setTimeout(() => { this.imageGalleryActiveUrl = null; }, 300);
  },
  imageGalleryNext() {
    if (this.imageGalleryImageIndex < this.imageGallery.length) {
      this.updateActiveImage(this.imageGalleryImageIndex + 1);
    }
  },
  imageGalleryPrev() {
    if (this.imageGalleryImageIndex > 1) {
      this.updateActiveImage(this.imageGalleryImageIndex - 1);
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
    const rawThemeConfig = themeConfigEl.tagName === 'TEMPLATE'
      ? themeConfigEl.innerHTML
      : themeConfigEl.textContent;
    themeConfig = JSON.parse((rawThemeConfig || '{}').trim());
  } catch (e) {
    console.error('Error parsing theme-config:', e);
  }
}
const loadLeaflet = themeConfig.loadLeaflet || false;
const showDarkToggle = themeConfig.showDarkToggle || false;

function initLeafletMaps() {
  document.querySelectorAll('[data-leaflet-map]').forEach(function(el) {
    if (el._leaflet_id) return;
    var lat = parseFloat(el.dataset.lat);
    var lon = parseFloat(el.dataset.lon);
    var zoom = parseInt(el.dataset.zoom, 10);
    var map = window.L.map(el, { scrollWheelZoom: false }).setView([lat, lon], zoom);
    el.addEventListener('click', function() { map.scrollWheelZoom.enable(); });
    el.addEventListener('mouseleave', function() { map.scrollWheelZoom.disable(); });
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    var mLat = el.dataset.markerLat;
    var mLon = el.dataset.markerLon;
    if (mLat && mLon) {
      window.L.marker([parseFloat(mLat), parseFloat(mLon)]).addTo(map)
        .bindPopup(el.dataset.markerPopup || '');
    }
  });
}

if (loadLeaflet) {
  import('leaflet').then(L => {
      // Make Leaflet accessible globally
      window.L = L;

      // Fix default marker icons broken by esbuild bundling.
      // _getIconUrl auto-detects URLs at runtime but fails when bundled;
      // deleting it forces Leaflet to use the explicit mergeOptions values.
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: themeConfig.leafletMarkerIconUrl || '/images/leaflet/marker-icon.png',
        iconRetinaUrl: themeConfig.leafletMarkerIconRetinaUrl || '/images/leaflet/marker-icon-2x.png',
        shadowUrl: themeConfig.leafletMarkerShadowUrl || '/images/leaflet/marker-shadow.png',
      });
      // Initialize all maps on the page
      initLeafletMaps();
      // Notify any external scripts that Leaflet is ready
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
