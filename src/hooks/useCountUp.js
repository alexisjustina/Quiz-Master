import { useEffect, useState } from "react";

// Animates a number from 0 up to `target`. Jumps straight to the end
// when the visitor prefers reduced motion.
export default function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || target === 0) {
      setValue(target);
      return undefined;
    }

    let frame;
    let start;
    const tick = (time) => {
      if (start === undefined) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
