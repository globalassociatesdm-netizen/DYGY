import { useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-based reveal animations using IntersectionObserver.
 * Elements with [data-reveal] attribute will animate in when visible.
 */
export function useScrollReveal(rootMargin = '-40px') {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold: 0.08,
      }
    );

    // Observe all elements with data-reveal attribute
    const revealElements = container.querySelectorAll('[data-reveal]');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, [rootMargin]);

  return containerRef;
}

/**
 * Returns CSS inline delay for staggered reveal animations.
 */
export function staggerDelay(index: number, baseMs = 80): React.CSSProperties {
  return { transitionDelay: `${index * baseMs}ms` } as React.CSSProperties;
}
