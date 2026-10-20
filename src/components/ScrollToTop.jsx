
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    let frameOne;
    let frameTwo;

    const scrollToTarget = () => {
      if (hash) {
        const id = decodeURIComponent(hash.slice(1));
        const target = document.getElementById(id);

        if (target) {
          target.scrollIntoView({
            behavior: "instant",
            block: "start",
          });
          return;
        }
      }

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    };

    frameOne = requestAnimationFrame(() => {
      frameTwo = requestAnimationFrame(scrollToTarget);
    });

    return () => {
      cancelAnimationFrame(frameOne);
      cancelAnimationFrame(frameTwo);
    };
  }, [pathname, hash, key]);

  return null;
}
