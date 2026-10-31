import { useEffect, useState } from 'react';
import { useLocation } from '@tanstack/react-router';

const STORAGE_KEY = 'tcc-ga4-consent';
const SETTINGS_EVENT = 'tcc:open-analytics-settings';
const measurementId = import.meta.env['VITE_GA4_MEASUREMENT_ID']?.trim() ?? '';
const validMeasurementId = /^G-[A-Z0-9]+$/.test(measurementId);

type ConsentChoice = 'granted' | 'denied' | null;

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    __tccGa4MeasurementId?: string;
    __tccGa4PreviousPage?: string | undefined;
  }
}

function isProductionHost() {
  return window.location.hostname === 'www.thecarboncredit.in';
}

function sanitizedPageLocation(pathname: string) {
  return new URL(pathname, window.location.origin).toString();
}

function ensureGoogleTag() {
  if (!validMeasurementId || !isProductionHost()) return false;

  window.dataLayer ??= [];
  window.gtag ??= (...args: unknown[]) => window.dataLayer?.push(args);

  if (window.__tccGa4MeasurementId !== measurementId) {
    window.__tccGa4MeasurementId = measurementId;
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    if (!document.querySelector(`script[data-tcc-ga4="${measurementId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset['tccGa4'] = measurementId;
      document.head.appendChild(script);
    }
  }

  return true;
}

export function AnalyticsConsent() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const [choice, setChoice] = useState<ConsentChoice>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!validMeasurementId || !isProductionHost()) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'granted' || stored === 'denied') setChoice(stored);
    } catch {
      // Analytics stays off when the browser does not allow local storage.
    }

    const openSettings = () => setSettingsOpen(true);
    window.addEventListener(SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (choice !== 'granted' || !ensureGoogleTag() || !window.gtag) return;

    const pageLocation = sanitizedPageLocation(pathname);
    const previousPage = window.__tccGa4PreviousPage ?? document.referrer;
    let safeReferrer: string | undefined;
    try {
      if (previousPage) {
        const parsed = new URL(previousPage);
        safeReferrer = `${parsed.origin}${parsed.pathname}`;
      }
    } catch {
      safeReferrer = undefined;
    }

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: pageLocation,
      ...(safeReferrer ? { page_referrer: safeReferrer } : {}),
    });
    window.__tccGa4PreviousPage = pageLocation;
  }, [choice, pathname]);

  useEffect(() => {
    if (choice !== 'granted' || !validMeasurementId || !isProductionHost()) return;
    const onContactLink = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href^="mailto:"]');
      if (link && window.gtag) window.gtag('event', 'contact_email_open', { surface: 'public_site' });
    };
    document.addEventListener('click', onContactLink, true);
    return () => document.removeEventListener('click', onContactLink, true);
  }, [choice]);

  function saveChoice(next: Exclude<ConsentChoice, null>) {
    if (window.gtag && window.__tccGa4MeasurementId === measurementId) {
      window.gtag('consent', 'update', { analytics_storage: next });
    }
    if (next === 'denied') window.__tccGa4PreviousPage = undefined;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Keep the decision for this render; analytics remains consent-gated.
    }
    setChoice(next);
    setSettingsOpen(false);
  }

  if (!validMeasurementId || !isProductionHost() || (choice !== null && !settingsOpen)) return null;

  return (
    <aside className="analytics-consent" aria-label="Optional analytics settings">
      <div>
        <strong>Optional analytics</strong>
        <p>
          Allow optional Google Analytics for public page visits. Vercel aggregate usage and
          performance metrics are described in the Privacy page. No form contents or farmer records
          are sent to Google Analytics.
        </p>
      </div>
      <div className="analytics-consent-actions">
        <button type="button" onClick={() => saveChoice('granted')}>Allow analytics</button>
        <button type="button" onClick={() => saveChoice('denied')}>Reject analytics</button>
      </div>
    </aside>
  );
}

export function AnalyticsSettingsButton() {
  if (!validMeasurementId) return null;
  return (
    <button
      className="analytics-settings-trigger"
      type="button"
      onClick={() => window.dispatchEvent(new Event(SETTINGS_EVENT))}
    >
      Analytics settings
    </button>
  );
}
