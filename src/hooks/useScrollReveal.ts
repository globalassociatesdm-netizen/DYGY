import { useEffect, useRef } from 'react';

/**
 * Custom hook for scroll-based reveal animations using IntersectionObserver & MutationObserver.
 * Elements with [data-reveal] attribute will animate in when visible, including dynamically loaded content.
 */
export function useScrollReveal(rootMargin = '60px') {
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
        threshold: 0.02,
      }
    );

    const checkAndObserve = () => {
      const elements = container.querySelectorAll('[data-reveal]:not(.revealed)');
      const windowHeight = window.innerHeight;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is in viewport or already scrolled past, reveal it
        if (rect.top <= windowHeight + 80 && rect.bottom >= -80) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    // Run immediately and after a short tick
    checkAndObserve();
    const timer = setTimeout(checkAndObserve, 50);

    // Watch for dynamic DOM additions (e.g. API fetches resolving)
    const mutationObserver = new MutationObserver(() => {
      checkAndObserve();
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('scroll', checkAndObserve, { passive: true });
    window.addEventListener('resize', checkAndObserve, { passive: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', checkAndObserve);
      window.removeEventListener('resize', checkAndObserve);
    };
  }, [rootMargin]);

  return containerRef;
}

/**
 * Returns CSS inline delay for staggered reveal animations.
 */
export function staggerDelay(index: number, baseMs = 50): React.CSSProperties {
  return { transitionDelay: `${index * baseMs}ms` } as React.CSSProperties;
}

