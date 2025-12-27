import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mainNavItems = [
  { label: "도서", href: "/books" },
  { label: "저자", href: "/authors" },
  { label: "소식", href: "/news" },
  {
    label: "자료",
    href: "",
    children: [
      { label: "자료실", href: "/dataroom" },
      { label: "참고노트", href: "/reference-notes" },
    ]
  },
  { label: "소개", href: "/about" },
];

const footerNavItems = [
  { label: "문의하기", href: "/contact" },
  { label: "개인정보처리방침", href: "/privacy" },
];

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("scroll-lock");
    } else {
      document.body.classList.remove("scroll-lock");
    }
    return () => {
      document.body.classList.remove("scroll-lock");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="drawer-overlay animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-card z-50 shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          <span className="font-heading text-lg font-semibold">메뉴</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {mainNavItems.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <div className="space-y-2">
                    <div className="h-12 px-4 flex items-center text-lg font-medium text-muted-foreground">
                      {item.label}
                    </div>
                    <ul className="pl-4 space-y-2 border-l-2 border-muted ml-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            to={child.href}
                            onClick={onClose}
                            className="flex items-center h-10 px-4 rounded-lg text-base font-medium text-foreground hover:bg-muted transition-colors"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center h-12 px-4 rounded-lg text-lg font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Navigation */}
        <div className="border-t border-border py-4 px-4">
          <ul className="space-y-1">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className="flex items-center h-10 px-4 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
