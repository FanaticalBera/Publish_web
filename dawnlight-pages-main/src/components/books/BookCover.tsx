import { useState } from "react";
import { cn } from "@/lib/utils";

interface BookCoverProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BookCover({ src, alt, className }: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate a color based on the book title for placeholder
  const getPlaceholderColor = () => {
    const colors = [
      "from-dawn-start/30 to-dawn-end/30",
      "from-primary/20 to-accent/30",
      "from-secondary to-dawn-mid/30",
      "from-accent/30 to-dawn-glow",
    ];
    const index = alt.length % colors.length;
    return colors[index];
  };

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "aspect-book w-full rounded-lg bg-gradient-to-br flex items-center justify-center overflow-hidden",
          getPlaceholderColor(),
          className
        )}
      >
        <div className="text-center p-4">
          <span className="font-heading text-sm text-foreground/70 line-clamp-3">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("aspect-book w-full rounded-lg overflow-hidden relative", className)}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br animate-pulse",
          getPlaceholderColor()
        )} />
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
