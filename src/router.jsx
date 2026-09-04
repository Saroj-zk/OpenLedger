import React, { useEffect, useState } from 'react';

/* =====================================================================
   A router small enough to read in one sitting.
   Two pages do not justify a routing library, but they do justify real
   URLs: /models has to be linkable and indexable, so this pushes state
   rather than hiding the route behind a hash.
   ===================================================================== */

const ROUTE_EVENT = 'openledger:route';

export function currentPath() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

export function navigate(to) {
  if (currentPath() === to) return;
  window.history.pushState({}, '', to);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export function useRoute() {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const sync = () => setPath(currentPath());
    window.addEventListener('popstate', sync);
    window.addEventListener(ROUTE_EVENT, sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener(ROUTE_EVENT, sync);
    };
  }, []);

  return path;
}

/**
 * An anchor that stays an anchor. Middle click, cmd click and "open in
 * new tab" all behave normally; only a plain left click is intercepted.
 */
export function Link({ to, children, className = '', ...rest }) {
  const onClick = (event) => {
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  );
}
