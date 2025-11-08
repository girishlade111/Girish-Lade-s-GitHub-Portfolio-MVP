import { useState, useEffect, useRef, RefObject } from 'react';

interface ObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * A custom React hook that uses the Intersection Observer API to detect when an element is visible in the viewport.
 * @param options - Configuration options for the Intersection Observer.
 * @returns A tuple containing the ref to attach to the element and a boolean indicating if it's intersecting.
 */
const useIntersectionObserver = (
  options: ObserverOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
): [RefObject<HTMLElement>, boolean] => {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger only when the element is intersecting
        if (entry.isIntersecting) {
          setIntersecting(true);
          // Stop observing the element once it has become visible
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      options
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isIntersecting];
};

export default useIntersectionObserver;
