import { useSyncExternalStore } from "react";

/**
 * Custom hook to safely detect desktop view without hydration warnings.
 * Returns false during SSR and initial hydration, then updates after hydration.
 * This prevents hydration mismatches between server and client.
 */
export const useIsDesktop = (): boolean => {
  const subscribe = (callback: () => void): (() => void) => {
    window.addEventListener("resize", callback);

    return (): void => {
      window.removeEventListener("resize", callback);
    };
  };

  const getSnapshot = (): boolean => {
    return window.innerWidth >= 1024;
  };

  const getServerSnapshot = (): boolean => {
    return false;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
