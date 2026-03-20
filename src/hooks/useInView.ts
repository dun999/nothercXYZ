"use client";

import { useCallback, useRef, useState } from "react";

export function useInView(threshold = 0.12) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Callback ref: called whenever the DOM node attaches or detaches.
  // This ensures the IntersectionObserver is set up even when the component
  // initially renders null (e.g. while position data is loading) and only
  // mounts its real element later.
  const ref = useCallback(
    (el: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.disconnect();
            observerRef.current = null;
          }
        },
        { threshold }
      );
      obs.observe(el);
      observerRef.current = obs;
    },
    [threshold]
  );

  return [ref, inView] as const;
}
