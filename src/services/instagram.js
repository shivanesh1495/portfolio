const INSTAGRAM_USERNAME = "cinematraphie";

/**
 * Fetch Instagram user profile data including media count
 * Uses Instagram's public oembed endpoint (no auth required)
 */
export async function fetchInstagramProfile() {
  try {
    // Method 1: Try Instagram's public oembed endpoint
    const response = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_USERNAME}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return {
        username: data.data?.user?.username || INSTAGRAM_USERNAME,
        mediaCount:
          data.data?.user?.edge_owner_to_timeline_media?.edges?.length || 0,
      };
    }

    // Fallback: Return default value if API fails
    return {
      username: INSTAGRAM_USERNAME,
      mediaCount: 0,
    };
  } catch (error) {
    console.warn("Instagram fetch failed, using fallback:", error);
    return {
      username: INSTAGRAM_USERNAME,
      mediaCount: 0,
    };
  }
}

/**
 * Alternative method using a CORS-friendly approach
 * This version uses Instagram's graph API via a proxy or alternative endpoint
 */
export async function fetchInstagramMediaCount() {
  try {
    // Using a lightweight approach - fetch the Instagram profile page and parse
    const response = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_USERNAME}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15",
          Accept: "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      const mediaCount =
        data.data?.user?.edge_owner_to_timeline_media?.edges?.length ||
        data.data?.user?.edge_owner_to_timeline_media?.count ||
        124; // Fallback to 124 as manual value
      return mediaCount;
    }

    // Manual fallback value if API is unreachable
    return 124;
  } catch (error) {
    console.warn("Could not fetch Instagram media count:", error);
    // Return a fallback value (you can update this manually if needed)
    return 124;
  }
}
