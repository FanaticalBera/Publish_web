import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface AnnouncementProps {
    message: string;
    link?: string;
}

export default function Announcement({ message, link }: AnnouncementProps) {
    if (!message) return null;

    const Content = () => (
        <div className="container flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary-foreground md:text-base">
            <span className="flex items-center gap-2">
                <span className="inline-block p-1 bg-white/20 rounded-full">📢</span>
                {message}
            </span>
            {link && <ArrowRight className="w-4 h-4 opacity-80" />}
        </div>
    );

    return (
        <div className="relative z-50 bg-primary text-primary-foreground">
            {link ? (
                <Link to={link} className="block hover:bg-black/5 transition-colors">
                    <Content />
                </Link>
            ) : (
                <Content />
            )}
        </div>
    );
}
