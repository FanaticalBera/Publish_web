import React from 'react';

interface AnnouncementProps {
    message: string;
}

export default function Announcement({ message }: AnnouncementProps) {
    if (!message) return null;

    return (
        <div className="announcement-banner">
            <div className="container announcement-content">
                <span className="announcement-icon">📢</span>
                <span>{message}</span>
            </div>
        </div>
    );
}
