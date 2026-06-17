import '@testing-library/jest-dom';

global.IntersectionObserver = vi.fn(function (cb) {
  return {
    observe:    vi.fn(),
    unobserve:  vi.fn(),
    disconnect: vi.fn(),
  };
});