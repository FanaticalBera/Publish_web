import { Link } from "react-router-dom";
import AuthorAvatar from "./AuthorAvatar";
import { Author } from "@/types/content";

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link
      to={`/authors/${author.slug}`}
      className="block p-6 rounded-xl bg-card shadow-card card-lift"
    >
      <div className="flex items-center gap-4">
        <AuthorAvatar name={author.name} photo={author.photo} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {author.name}
          </h3>
          {author.shortBio && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {author.shortBio}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
