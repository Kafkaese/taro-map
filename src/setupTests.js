import '@testing-library/jest-dom/extend-expect';

// jsdom doesn't implement ResizeObserver; react-slider (used by YearSlider)
// reads element size on mount via ResizeObserver.
global.ResizeObserver = global.ResizeObserver || class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
