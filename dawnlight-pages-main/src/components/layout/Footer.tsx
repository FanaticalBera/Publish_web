import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <Link 
              to="/" 
              className="font-heading text-xl font-semibold text-foreground hover:text-primary transition-colors"
            >
              동틀녘
            </Link>
            <p className="text-sm text-muted-foreground">
              아침을 여는 시작, 새로운 꿈을 꾸다
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              문의하기
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              개인정보처리방침
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {currentYear} 도서출판 동틀녘. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
