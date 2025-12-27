import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileDrawer from "./MobileDrawer";
import SearchDropdown from "@/components/search/SearchDropdown";
import { useSearchShortcut } from "@/hooks/useSearchShortcut";

const navItems = [
  { label: "도서", href: "/books" },
  { label: "저자", href: "/authors" },
  { label: "소식", href: "/news" },
  {
    label: "자료",
    href: "/dataroom", // Fallback or main link
    children: [
      { label: "자료실", href: "/dataroom" },
      { label: "참고노트", href: "/reference-notes" },
    ]
  },
  { label: "소개", href: "/about" },
];

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useSearchShortcut(() => {
    setIsSearchActive(true);
  });

  // Focus input when search becomes active
  useEffect(() => {
    if (isSearchActive) {
      searchInputRef.current?.focus();
    }
  }, [isSearchActive]);

  // Close search on ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchActive) {
        setIsSearchActive(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchActive]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchActive &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchActive(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive]);

  const handleCloseSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-14 md:h-16 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container h-full flex items-center relative">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="동틀녘"
              className="h-8 md:h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Absolutely centered */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {navItems.map((item) => (
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap cursor-pointer py-4"
                  >
                    {item.label}
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${activeDropdown === item.label
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 translate-y-1 invisible"
                    }`}>
                    <div className="bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[140px] flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors text-center whitespace-nowrap"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Right Section: Contact + Search + Mobile Menu */}
          <div className="ml-auto flex items-center gap-4">
            {/* Contact Link */}
            <Link
              to="/contact"
              className="hidden md:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              문의
            </Link>

            {/* Search Area - Expands to the left */}
            <div
              ref={searchContainerRef}
              className={`relative flex items-center justify-end transition-all duration-300 ease-in-out ${isSearchActive ? "w-full md:w-[320px]" : "w-10"
                }`}
            >
              {isSearchActive ? (
                <>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2 border border-border w-full animate-in fade-in zoom-in-95 duration-200">
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="검색어를 입력하세요..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
                      aria-label="검색어 입력"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => setSearchQuery("")}
                        aria-label="검색어 지우기"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={handleCloseSearch}
                      aria-label="검색 닫기"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Search Dropdown Results */}
                  <SearchDropdown query={searchQuery} onClose={handleCloseSearch} />
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchActive(true)}
                  aria-label="검색 열기"
                  className="relative"
                  title="검색 (Ctrl+K)"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
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
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}
