import { Link } from "react-router-dom";
import type { NewsArticle } from "@/types/content";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
  basePath?: string;
}

export default function NewsCard({ article, basePath = "/news" }: NewsCardProps) {
  return (
    <Link
      to={`${basePath}/${article.slug}`}
      className="block rounded-xl bg-card shadow-card overflow-hidden card-lift"
    >
      {/* Thumbnail */}
      {article.thumbnail ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-dawn-glow to-dawn-end/30" />
      )}

      {/* Content */}
      <div className="p-5">
        {article.category && (
          <span className="inline-block px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full mb-3">
            {article.category}
          </span>
        )}
        <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <time className="text-xs text-muted-foreground">
          {formatDate(article.publishDate)}
        </time>
      </div>
    </Link>
  );
}
