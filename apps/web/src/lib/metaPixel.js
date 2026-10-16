/**
 * STRONGBUILD Meta Pixel & Conversions API (CAPI) Client
 * Handles client-side fbq events, UTM attribution, and event deduplication IDs.
 */

const DEFAULT_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '';

// Safe event ID generator for deduplication between Pixel and CAPI
export const generateEventId = (eventName = 'event') => {
  return `sb_${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Capture and persist UTM parameters and fbclid from URL
export const captureUtmParameters = () => {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid'];
    const captured = {};
    let hasUtm = false;

    utmKeys.forEach((key) => {
      const val = params.get(key);
      if (val) {
        captured[key] = val;
        hasUtm = true;
      }
    });

    if (hasUtm) {
      sessionStorage.setItem('strongbuild_utm_params', JSON.stringify({
        ...captured,
        timestamp: Date.now(),
        landing_page: window.location.pathname,
      }));
    }
  } catch (err) {
    // Non-blocking
  }
};

export const getStoredUtmParameters = () => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem('strongbuild_utm_params');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

/**
 * Initialize Meta Pixel script
 */
export const initMetaPixel = (pixelId = DEFAULT_PIXEL_ID) => {
  if (typeof window === 'undefined') return;

  // Capture UTM parameters on initial page load
  captureUtmParameters();

  if (!pixelId) {
    console.info('[MetaPixel] No Pixel ID configured yet. Set VITE_META_PIXEL_ID in environment.');
    return;
  }

  if (window.fbq) return;

  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', pixelId);
  console.info(`[MetaPixel] Initialized for ID: ${pixelId}`);
};

/**
 * Track PageView
 */
export const trackPageView = () => {
  if (typeof window === 'undefined') return;
  captureUtmParameters();

  const eventId = generateEventId('pageview');
  if (window.fbq) {
    window.fbq('track', 'PageView', {}, { eventID: eventId });
  }
  return eventId;
};

/**
 * Track ViewContent (Product Detail Page)
 */
export const trackViewContent = ({ product, variant }) => {
  if (typeof window === 'undefined' || !product) return;

  const eventId = generateEventId('viewcontent');
  const priceInCents = variant?.sale_price_in_cents ?? variant?.price_in_cents ?? product?.price_in_cents ?? 0;
  const value = priceInCents / 100;
  const currency = variant?.currency || 'INR';

  const payload = {
    content_name: product.title,
    content_ids: [String(variant?.id || product.id)],
    content_type: 'product',
    value: value,
    currency: currency,
    variant_title: variant?.title || '',
  };

  if (window.fbq) {
    window.fbq('track', 'ViewContent', payload, { eventID: eventId });
  } else {
    console.debug('[MetaPixel:Simulated] ViewContent', payload, eventId);
  }
  return eventId;
};

/**
 * Track AddToCart
 */
export const trackAddToCart = ({ product, variant, quantity = 1 }) => {
  if (typeof window === 'undefined' || !product) return;

  const eventId = generateEventId('addtocart');
  const priceInCents = variant?.sale_price_in_cents ?? variant?.price_in_cents ?? 0;
  const value = (priceInCents / 100) * quantity;
  const currency = variant?.currency || 'INR';

  const payload = {
    content_name: product.title,
    content_ids: [String(variant?.id || product.id)],
    content_type: 'product',
    value: value,
    currency: currency,
    num_items: quantity,
  };

  if (window.fbq) {
    window.fbq('track', 'AddToCart', payload, { eventID: eventId });
  } else {
    console.debug('[MetaPixel:Simulated] AddToCart', payload, eventId);
  }
  return eventId;
};

/**
 * Track InitiateCheckout
 */
export const trackInitiateCheckout = ({ items = [], totalValue = 0, currency = 'INR' }) => {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('initiatecheckout');
  const contentIds = items.map((i) => String(i.variant?.id || i.product?.id || i.variant_id)).filter(Boolean);
  const numItems = items.reduce((sum, i) => sum + (i.quantity || 1), 0);

  const payload = {
    content_ids: contentIds,
    content_type: 'product',
    value: totalValue,
    currency: currency,
    num_items: numItems,
  };

  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', payload, { eventID: eventId });
  } else {
    console.debug('[MetaPixel:Simulated] InitiateCheckout', payload, eventId);
  }
  return eventId;
};

/**
 * Track Purchase (Order Success Page) with deduplication
 */
export const trackPurchase = ({ orderId, totalValue, currency = 'INR', contentIds = [] }) => {
  if (typeof window === 'undefined' || !orderId) return;

  // Deduplication key in localStorage to ensure the same purchase event doesn't fire twice on page refreshes
  const key = `sb_purchase_tracked_${orderId}`;
  if (localStorage.getItem(key)) {
    console.info(`[MetaPixel] Purchase ${orderId} already tracked. Skipping duplicate.`);
    return;
  }

  const eventId = generateEventId(`purchase_${orderId}`);
  const payload = {
    content_ids: contentIds,
    content_type: 'product',
    value: totalValue,
    currency: currency,
    order_id: orderId,
  };

  if (window.fbq) {
    window.fbq('track', 'Purchase', payload, { eventID: eventId });
    localStorage.setItem(key, JSON.stringify({ eventId, timestamp: Date.now() }));
  } else {
    console.debug('[MetaPixel:Simulated] Purchase', payload, eventId);
    localStorage.setItem(key, JSON.stringify({ eventId, timestamp: Date.now() }));
  }
  return eventId;
};
