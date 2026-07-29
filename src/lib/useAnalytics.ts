import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { logEvent, setUserProperties } from "firebase/analytics";
import { analytics } from "./firebase";

// Helper to extract granular device and connection details
const getVisitorInfo = () => {
  const nav = navigator as any;
  return {
    user_agent: navigator.userAgent,
    language: navigator.language,
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    referrer: document.referrer || "direct",
    connection_type: nav.connection?.effectiveType || "unknown",
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    cookies_enabled: navigator.cookieEnabled,
    do_not_track: navigator.doNotTrack === "1",
    cpu_cores: navigator.hardwareConcurrency || "unknown",
    device_memory_gb: nav.deviceMemory || "unknown",
  };
};

export function usePageTracking() {
  const location = useLocation();
  const initRef = useRef(false);

  useEffect(() => {
    if (!analytics) return;

    // Parse URL parameters for UTM tracking
    const searchParams = new URLSearchParams(location.search);
    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");
    const utmTerm = searchParams.get("utm_term");
    const utmContent = searchParams.get("utm_content");

    const visitorInfo = getVisitorInfo();

    // 1. Set User Properties (Persists these attributes for the user profile in Firebase)
    if (!initRef.current) {
      setUserProperties(analytics, {
        timezone: visitorInfo.time_zone,
        initial_referrer: visitorInfo.referrer,
        device_memory: String(visitorInfo.device_memory_gb),
      });
      initRef.current = true;
    }

    // 2. Log Page View with absolutely everything attached
    logEvent(analytics, "page_view", {
      page_path: location.pathname + location.search,
      page_title: document.title,
      ...visitorInfo,
      utm_source: utmSource || undefined,
      utm_medium: utmMedium || undefined,
      utm_campaign: utmCampaign || undefined,
    });

    // 3. Log standardized Firebase Campaign Event if any UTM exists
    // (This ensures Firebase attributes the acquisition channel properly)
    if (utmSource || utmMedium || utmCampaign) {
      logEvent(analytics, "campaign_details", {
        source: utmSource || "unknown",
        medium: utmMedium || "unknown",
        campaign: utmCampaign || "unknown",
        term: utmTerm || undefined,
        content: utmContent || undefined,
      });
    }

  }, [location]);
}
