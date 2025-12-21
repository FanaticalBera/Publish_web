import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawer from "./MobileDrawer";

const navItems = [
  { label: "도서", href: "/books" },
  { label: "저자", href: "/authors" },
  { label: "소식", href: "/news" },
  { label: "자료실", href: "/dataroom" },
  { label: "소개", href: "/about" },
];

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-14 md:h-16 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-heading text-xl md:text-2xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            동틀녘
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Contact Link */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              문의
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="메뉴 열기"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
