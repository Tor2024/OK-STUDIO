import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Hook für Google Analytics Tracking
 * 
 * Verwendung:
 * ```tsx
 * import { useAnalytics } from './hooks/useAnalytics';
 * 
 * function MyComponent() {
 *   const { trackEvent, trackConversion } = useAnalytics();
 *   
 *   const handleClick = () => {
 *     trackEvent('button_click', { button_name: 'CTA' });
 *   };
 *   
 *   const handleSubmit = () => {
 *     trackConversion('contact_form', 100);
 *   };
 * }
 * ```
 */
export function useAnalytics() {
  const location = useLocation();

  // Track Page Views automatisch bei Route-Änderung
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
        page_location: window.location.href,
      });

      // Debug-Log (nur in Development)
      if ((import.meta as any).env.DEV) {
        console.log('📊 Analytics: Page View', {
          path: location.pathname,
          title: document.title,
        });
      }
    }
  }, [location]);

  /**
   * Trackt Custom Events
   * 
   * @param name - Event Name (z.B. 'button_click', 'video_play')
   * @param params - Zusätzliche Parameter
   */
  const trackEvent = (name: string, params?: Record<string, any>) => {
    if (window.gtag) {
      window.gtag('event', name, params);

      if ((import.meta as any).env.DEV) {
        console.log('📊 Analytics: Event', name, params);
      }
    }
  };

  /**
   * Trackt Conversions
   * 
   * @param type - Conversion Type (z.B. 'contact_form', 'project_view')
   * @param value - Wert in EUR (optional)
   */
  const trackConversion = (type: string, value?: number) => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        event_category: type,
        value: value || 0,
        currency: 'EUR',
      });

      if ((import.meta as any).env.DEV) {
        console.log('📊 Analytics: Conversion', type, value);
      }
    }
  };

  /**
   * Trackt Scroll Depth
   * 
   * @param depth - Prozent (z.B. 25, 50, 75, 100)
   */
  const trackScrollDepth = (depth: number) => {
    trackEvent('scroll_depth', {
      depth_percentage: depth,
      page_path: location.pathname,
    });
  };

  /**
   * Trackt Outbound Links
   * 
   * @param url - Ziel-URL
   * @param label - Optional Label
   */
  const trackOutboundLink = (url: string, label?: string) => {
    trackEvent('click', {
      event_category: 'outbound',
      event_label: label || url,
      link_url: url,
    });
  };

  /**
   * Trackt File Downloads
   * 
   * @param filename - Dateiname
   * @param fileType - Dateityp (z.B. 'pdf', 'zip')
   */
  const trackDownload = (filename: string, fileType: string) => {
    trackEvent('file_download', {
      file_name: filename,
      file_type: fileType,
      page_path: location.pathname,
    });
  };

  /**
   * Trackt Video-Interaktionen
   * 
   * @param action - 'play', 'pause', 'complete'
   * @param videoTitle - Video-Titel
   */
  const trackVideo = (action: 'play' | 'pause' | 'complete', videoTitle: string) => {
    trackEvent('video_' + action, {
      video_title: videoTitle,
      page_path: location.pathname,
    });
  };

  /**
   * Trackt Formular-Interaktionen
   * 
   * @param formName - Name des Formulars
   * @param action - 'start', 'submit', 'error'
   */
  const trackForm = (formName: string, action: 'start' | 'submit' | 'error') => {
    trackEvent('form_' + action, {
      form_name: formName,
      page_path: location.pathname,
    });
  };

  /**
   * Trackt Suchvorgänge
   * 
   * @param searchTerm - Suchbegriff
   * @param resultsCount - Anzahl Ergebnisse (optional)
   */
  const trackSearch = (searchTerm: string, resultsCount?: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  };

  /**
   * Trackt Fehler
   * 
   * @param errorMessage - Fehlermeldung
   * @param errorType - Fehlertyp (z.B. '404', 'api_error')
   */
  const trackError = (errorMessage: string, errorType: string) => {
    trackEvent('error', {
      error_message: errorMessage,
      error_type: errorType,
      page_path: location.pathname,
    });
  };

  return {
    trackEvent,
    trackConversion,
    trackScrollDepth,
    trackOutboundLink,
    trackDownload,
    trackVideo,
    trackForm,
    trackSearch,
    trackError,
  };
}

/**
 * Hook für Scroll Depth Tracking
 * Automatisch trackt 25%, 50%, 75%, 100%
 */
export function useScrollDepthTracking() {
  const { trackScrollDepth } = useAnalytics();

  useEffect(() => {
    const tracked = new Set<number>();
    const thresholds = [25, 50, 75, 100];

    const handleScroll = () => {
      const scrollPercentage = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      thresholds.forEach(threshold => {
        if (scrollPercentage >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackScrollDepth]);
}

/**
 * Hook für Outbound Link Tracking
 * Automatisch trackt alle externen Links
 */
export function useOutboundLinkTracking() {
  const { trackOutboundLink } = useAnalytics();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (link && link.hostname !== window.location.hostname) {
        trackOutboundLink(link.href, link.textContent || undefined);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [trackOutboundLink]);
}
