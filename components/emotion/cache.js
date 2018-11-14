import { hydrate } from 'react-emotion';

// Add server-generated styles to emotion cache. Important so that the css doesn't get generated both
// server-side AND client-side!
if (typeof window !== 'undefined') {
  hydrate(window.__NEXT_DATA__.ids);
}

export const withCache = (component) => {
  return component;
};
