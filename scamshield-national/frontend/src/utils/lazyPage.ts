import { ComponentType, lazy } from 'react';

// Pages are split into their own files and fetched on first visit (a phone
// opening one page shouldn't download all 23). Two problems that creates,
// both handled here:
//
// 1. A deploy replaces every page file with a new name. A tab opened before
//    the deploy still asks for the old names, gets a 404, and React shows a
//    blank page until a manual refresh. When a page file fails to load we
//    reload once, which picks up the new version; a short guard stops a
//    reload loop if the failure is something else (offline, say).
// 2. Fetching a page on first click adds a pause. preloadPages() fetches
//    every page in the background once the first screen is up, so later
//    navigation is instant.

const RELOAD_KEY = 'scamshield:chunk-reload-at';
const RELOAD_GUARD_MS = 30_000;

export function reloadForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < RELOAD_GUARD_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Storage blocked: still worth one reload attempt.
  }
  window.location.reload();
  return true;
}

type Loader<T> = () => Promise<{ default: T }>;

const loaders: Loader<unknown>[] = [];

export function lazyPage<T extends ComponentType<any>>(loader: Loader<T>) {
  const load: Loader<T> = () =>
    loader().catch((err) => {
      // Never resolves when reloading: the page is going away anyway.
      if (reloadForNewVersion()) return new Promise<never>(() => {});
      throw err;
    });
  loaders.push(load as Loader<unknown>);
  return lazy(load);
}

// Fetch every page in the background once the browser is
// idle, one after another. Failures are ignored here — the real navigation handles them.
export function preloadPages() {
  const run = async () => {
    for (const load of loaders) {
      try {
        await load();
      } catch {
        /* handled on navigation */
      }
    }
  };
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void })
    .requestIdleCallback;
  if (idle) idle(() => void run(), { timeout: 3000 });
  else setTimeout(() => void run(), 1500);
}
