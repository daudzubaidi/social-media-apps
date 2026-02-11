"use client";

import { useEffect, useRef } from "react";

interface UseIntersectionOptions extends IntersectionObserverInit {
  enabled?: boolean;
}

export function useIntersection(
  onIntersect: () => void,
  options?: UseIntersectionOptions,
) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const {
    enabled = true,
    root = null,
    rootMargin = "0px",
    threshold = 0,
  } = options ?? {};

  useEffect(() => {
    const target = targetRef.current;
    if (!enabled || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onIntersect();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, onIntersect, root, rootMargin, threshold]);

  return targetRef;
}
