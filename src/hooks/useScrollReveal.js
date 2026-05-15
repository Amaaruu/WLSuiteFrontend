import { useEffect, useRef, useState } from 'react';

export const useScrollReveal = (options = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    if (!currentElement) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(currentElement);
      }
    }, options);

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options.rootMargin, options.threshold]);

  return [elementRef, isVisible];
};