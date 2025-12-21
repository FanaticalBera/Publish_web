import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookCover from "./BookCover";
import type { Book } from "@/types/content";

interface BookCardProps {
  book: Book;
  onPurchaseClick: () => void;
}

export default function BookCard({ book, onPurchaseClick }: BookCardProps) {
  const hasPurchaseLinks = book.purchaseLinks && book.purchaseLinks.length > 0;

  return (
    <article className="group card-lift">
      <Link to={`/books/${book.slug}`} className="block">
        <div className="shadow-card rounded-xl overflow-hidden bg-card">
          <BookCover src={book.cover} alt={book.title} />
        </div>
      </Link>

      <div className="mt-4 space-y-2">
        <Link to={`/books/${book.slug}`}>
          <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        {book.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {book.subtitle}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="purchase"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault();
              onPurchaseClick();
            }}
            disabled={!hasPurchaseLinks}
          >
            {hasPurchaseLinks ? "구매하기" : "준비중"}
          </Button>
          <Button variant="detail" size="sm" className="flex-1" asChild>
            <Link to={`/books/${book.slug}`}>상세보기</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
