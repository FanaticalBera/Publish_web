import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
    headline: string;
    subheadline: string;
    image: string;
    ctaIdentifier?: string; // e.g. "books" or "latest-news" or specific link
}

export default function Hero({ headline, subheadline, image, ctaIdentifier }: HeroProps) {
    return (
        <section className="hero-section" style={{ backgroundImage: image ? `url(${image})` : undefined }}>
            <div className="hero-overlay">
                <div className="container hero-content">
                    <h1>{headline}</h1>
                    <p>{subheadline}</p>
                    {ctaIdentifier && (
                        <Link to="/books" className="cta-button">
                            도서 살펴보기
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
