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
  faPenToSquare,
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
  faPenToSquare,
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

// Theme configuration emitted by layouts/partials/head/js.html. Parsed here,
// ahead of the Alpine component registrations, because ryderTrack needs to know
// which analytics provider the site selected.
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

// --- Analytics primitives -------------------------------------------------
//
// @alpinejs/csp cannot evaluate function calls, member calls, or arrow
// functions inside inline directives, and it does NOT throw when it meets one —
// the handler simply never runs. So an inline `@click="posthog.capture(...)"`
// is silently dead. Everything the handler needs travels as data attributes
// instead, and the handler itself is a named method on a registered component.

// Forward one event to whichever provider `params.analytics_provider` selected.
// Falls back to feature detection when no provider is configured, and no-ops
// (rather than throwing) when no provider is present at all — the provider
// script may be absent, blocked by an ad blocker, or still loading.
function ryderSendEvent(name, props) {
  if (!name) return false;
  const provider = String(themeConfig.analyticsProvider || '').toLowerCase();
  const payload = props || {};

  try {
    const posthog = window.posthog;
    if ((provider === 'posthog' || provider === '')
      && posthog && typeof posthog.capture === 'function') {
      posthog.capture(name, payload);
      return true;
    }

    const plausible = window.plausible;
    if ((provider === 'plausible' || provider === '')
      && typeof plausible === 'function') {
      plausible(name, { props: payload });
      return true;
    }
  } catch (e) {
    // A provider that throws must never break the click handler it is attached
    // to — the link or form submit has to keep working regardless.
    console.warn('ryderTrack: analytics provider threw while capturing', name, e);
    return false;
  }

  return false;
}

// Read `data-track-props` off an element defensively. Invalid JSON warns and
// yields an empty props object; it must never break the handler, because the
// handler is usually also responsible for a navigation or a form submit.
function ryderTrackProps(el) {
  const raw = el && el.dataset ? el.dataset.trackProps : '';
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    console.warn('ryderTrack: data-track-props must be a JSON object, got:', raw, el);
    return {};
  } catch (e) {
    console.warn('ryderTrack: data-track-props is not valid JSON:', raw, el);
    return {};
  }
}

// Track one element's configured event. Shared by ryderTrack and ryderForm.
function ryderTrackElement(el) {
  if (!el || !el.dataset) return false;
  return ryderSendEvent(el.dataset.trackEvent, ryderTrackProps(el));
}

// Register the analytics click-tracking component.
//
//   <a x-data="ryderTrack" @click="track"
//      data-track-event="ticket_link_click"
//      data-track-props='{"venue":"The Roxy"}'>Tickets</a>
//
Alpine.data('ryderTrack', () => ({
  track(event) {
    ryderTrackElement((event && event.currentTarget) || this.$el);
  },
}));

// Register the declarative form component: POST the form as JSON to
// `data-form-action`, expose the request state, honour a `_gotcha` honeypot,
// and fire an optional `data-track-event` on success.
//
//   <form x-data="ryderForm" @submit.prevent="submit"
//         data-form-action="https://api.example.com/subscribe"
//         data-track-event="signup_submit">
//     <input type="email" name="email" required>
//     <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"
//            class="hidden" aria-hidden="true">
//     <button type="submit" :disabled="isLoading">Subscribe</button>
//     <p x-show="isSuccess">Thanks!</p>
//     <p x-show="isError" x-text="errorMessage"></p>
//   </form>
//
// `status` is the raw string ('' | 'loading' | 'success' | 'error'). The
// booleans exist because the CSP evaluator cannot evaluate a comparison like
// `status === 'success'` — only a plain property lookup — so `x-show` needs a
// property that is already a boolean.
Alpine.data('ryderForm', () => ({
  status: '',
  errorMessage: '',

  get isIdle() { return this.status === ''; },
  get isLoading() { return this.status === 'loading'; },
  get isSuccess() { return this.status === 'success'; },
  get isError() { return this.status === 'error'; },

  async submit(event) {
    // Capture the form before any await — `event.currentTarget` is nulled once
    // the event finishes dispatching. preventDefault is called here as well as
    // by the recommended `.prevent` modifier, so plain `@submit="submit"` also
    // behaves.
    const form = (event && event.currentTarget) || this.$el;
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (this.status === 'loading') return;

    const action = form && form.dataset ? form.dataset.formAction : '';
    if (!action) {
      console.warn('ryderForm: no data-form-action on', form);
      this.status = 'error';
      this.errorMessage = this.fallbackError(form);
      return;
    }

    const payload = {};
    let honeypot = '';
    new FormData(form).forEach((value, key) => {
      // Files cannot travel in a JSON body; this primitive is for text fields.
      if (typeof value !== 'string') return;
      if (key === '_gotcha') { honeypot = value.trim(); return; }
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        if (!Array.isArray(payload[key])) payload[key] = [payload[key]];
        payload[key].push(value);
      } else {
        payload[key] = value;
      }
    });

    // Honeypot filled means a bot. Report success and send nothing, so the bot
    // gets no signal that it was caught.
    if (honeypot) {
      this.status = 'success';
      return;
    }

    this.status = 'loading';
    this.errorMessage = '';

    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`ryderForm: ${action} responded ${response.status}`);
      }
      this.status = 'success';
      // Reuse the ryderTrack path: fires only if data-track-event is present.
      ryderTrackElement(form);
      if (typeof form.reset === 'function') form.reset();
    } catch (e) {
      // The action host must be in CSP connect-src, or fetch rejects here.
      console.warn('ryderForm: submission to', action, 'failed', e);
      this.status = 'error';
      this.errorMessage = this.fallbackError(form);
    }
  },

  fallbackError(form) {
    const custom = form && form.dataset ? form.dataset.errorMessage : '';
    return custom || 'Something went wrong. Please try again.';
  },
}));

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

// Register the video-lightbox component (click a thumbnail, open a modal
// with the video iframe — mirrors imageGallery's open/close/teardown shape).
//
// @alpinejs/csp refuses to evaluate ANY directive on an <iframe> element
// itself ("Evaluating expressions on an iframe is prohibited in the CSP
// build") — not just calls/arrows, unlike everywhere else in this file. So
// the iframe carries only a plain x-ref (a name, not an evaluated
// expression); its `src` is set imperatively here instead of via `:src` or
// `x-show` on the tag. The show/hide toggle lives on the iframe's *wrapper*,
// which is a normal element and unaffected by that restriction. The src is
// only set once the modal opens, so nothing is requested from the embed
// host until the visitor actually clicks.
Alpine.data('videoLightbox', () => ({
  videoLightboxOpened: false,
  videoLightboxOpen(event) {
    const el = (event && event.currentTarget) || this.$el;
    const url = (el.dataset && el.dataset.embedUrl) || '';
    this.videoLightboxOpened = true;
    if (this.$refs.videoLightboxFrame) this.$refs.videoLightboxFrame.src = url;
  },
  videoLightboxClose() {
    this.videoLightboxOpened = false;
    // Clear src after the close transition so the video stops playing
    // instead of continuing in a hidden iframe.
    setTimeout(() => {
      if (this.$refs.videoLightboxFrame) this.$refs.videoLightboxFrame.src = '';
    }, 300);
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
