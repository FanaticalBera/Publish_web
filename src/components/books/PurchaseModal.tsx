import { useEffect } from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PurchaseLink } from "@/types/content";
import { useIsMobile } from "@/hooks/use-mobile";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  purchaseLinks: PurchaseLink[];
}

export default function PurchaseModal({
  isOpen,
  onClose,
  bookTitle,
  purchaseLinks,
}: PurchaseModalProps) {
  const isMobile = useIsMobile();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        구매는 외부 서점에서 진행돼요. 새 탭에서 열립니다.
      </p>

      <div className="space-y-3">
        {purchaseLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full h-14 px-5 rounded-xl bg-muted hover:bg-accent transition-colors"
          >
            <span className="font-medium">{link.name}</span>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        ))}
      </div>
    </>
  );

  // Mobile: Bottom Sheet
  if (isMobile) {
    return (
      <>
        <div
          className="drawer-overlay animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
        <div className="bottom-sheet animate-slide-up">
          <div className="bottom-sheet-handle" />
          <div className="px-6 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">구매처 선택</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {content}
          </div>
        </div>
      </>
    );
  }

  // Desktop: Modal
  return (
    <>
      <div
        className="drawer-overlay animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md animate-scale-in p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold">구매처 선택</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            《{bookTitle}》
          </p>
          {content}
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
