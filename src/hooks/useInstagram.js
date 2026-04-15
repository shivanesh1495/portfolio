import { useState, useEffect } from "react";
import { fetchInstagramMediaCount } from "../services/instagram";

export function useInstagramStats() {
  const [mediaCount, setMediaCount] = useState(124); // Fallback value
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const count = await fetchInstagramMediaCount();
        if (isMounted) {
          setMediaCount(count || 124);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn("Failed to fetch Instagram stats:", error);
        if (isMounted) {
          setMediaCount(124); // Fallback
          setIsLoading(false);
        }
      }
    };

    // Add a small delay to avoid blocking initial render
    const timer = setTimeout(fetchStats, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  return { mediaCount, isLoading };
}
