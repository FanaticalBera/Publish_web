import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Announcement from "./Announcement";
import { getHomepage } from "@/utils/reader";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState<{
    enabled: boolean;
    message: string;
    link?: string;
  } | null>(null);

  useEffect(() => {
    // Scroll handling
    if (typeof document !== "undefined") {
      const hasOverlay = document.querySelector(".drawer-overlay");
      if (!hasOverlay) {
        document.body.style.overflow = "";
      }
    }

    // Fetch announcement
    const fetchAnnouncement = async () => {
      try {
        const homepage = await getHomepage();
        if (homepage?.globalAnnouncement) {
          setAnnouncement(homepage.globalAnnouncement);
        }
      } catch (error) {
        console.error("Failed to fetch announcement:", error);
      }
    };

    fetchAnnouncement();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {announcement?.enabled && announcement.message && (
        <Announcement
          message={announcement.message}
          link={announcement.link || undefined}
        />
      )}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

