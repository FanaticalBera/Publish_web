import React from 'react';
interface PurchaseLink {
    storeName: string | 'kyobo' | 'yes24' | 'aladin' | 'ridi' | 'other';
    url: string;
}

interface StoreLinksProps {
    links: readonly PurchaseLink[];
}

export default function StoreLinks({ links }: StoreLinksProps) {
    if (!links || links.length === 0) return null;

    const getStoreLabel = (store: string) => {
        switch (store) {
            case 'kyobo': return '교보문고';
            case 'yes24': return 'YES24';
            case 'aladin': return '알라딘';
            case 'ridi': return '리디북스';
            default: return '구매하기';
        }
    };

    return (
        <div className="store-links">
            {links.map((link, idx) => (
                <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`store-btn store-${link.storeName}`}
                >
                    {getStoreLabel(link.storeName)}
                </a>
            ))}
        </div>
    );
}
