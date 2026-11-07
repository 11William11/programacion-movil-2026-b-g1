// Agrega a expect() los comparadores del DOM, como toBeInTheDocument()
import '@testing-library/jest-dom/vitest';

// jsdom no trae matchMedia y Ionic lo usa al arrancar
window.matchMedia =
  window.matchMedia ||
  ((query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList);
