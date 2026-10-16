import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// BrowserRouter keeps the old scroll position when a link changes page, so a
// footer link landed the reader halfway down the next page. New navigations
// start at the top; back/forward (POP) leaves the browser's own restoration
// alone, and links to an in-page #anchor are left to the browser too.
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === 'POP' || hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash, navType]);
  return null;
}
