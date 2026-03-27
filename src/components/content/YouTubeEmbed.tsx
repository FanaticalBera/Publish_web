import { getYouTubeEmbedUrl } from "@/utils/youtube";

type YouTubeEmbedProps = {
  url: string;
  title?: string;
};

export function YouTubeEmbed({ url, title = "YouTube video player" }: YouTubeEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) return null;

  return (
    <div className="max-w-[720px] mx-auto mb-8 md:mb-12">
      <div className="aspect-[16/9] overflow-hidden rounded-xl bg-black">
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
