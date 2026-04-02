import { useEffect, useState } from "react";

/**
 * Custom hook to safely detect desktop view without hydration warnings.
 * Returns false during SSR and initial hydration, then updates after hydration.
 * This prevents hydration mismatches between server and client.
 */
export const useIsDesktop = (): boolean => {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect((): (() => void) => {
    // Mark as mounted to trigger re-render with actual media query
    setIsMounted(true);

    const getDesktopStatus = (): void => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Set initial value
    getDesktopStatus();

    // Create debounced resize handler
    let timeoutId: NodeJS.Timeout;
    const handleResize = (): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(getDesktopStatus, 150);
    };

    window.addEventListener("resize", handleResize);

    return (): void => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Return false during SSR and initial hydration to ensure server/client match
  return isMounted && isDesktop;
};
