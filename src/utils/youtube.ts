const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

function isValidVideoId(value: string) {
  return /^[a-zA-Z0-9_-]{11}$/.test(value);
}

export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!YOUTUBE_HOSTS.has(parsed.hostname)) return null;

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id && isValidVideoId(id) ? id : null;
    }

    const watchId = parsed.searchParams.get("v");
    if (watchId && isValidVideoId(watchId)) {
      return watchId;
    }

    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    const candidate = pathSegments.find((segment, index) => {
      const previous = pathSegments[index - 1];
      return ["embed", "shorts", "live"].includes(previous ?? "") && isValidVideoId(segment);
    });

    return candidate ?? null;
  } catch {
    return null;
  }
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}
