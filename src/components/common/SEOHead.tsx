// @ts-ignore
import React from 'react';
// @ts-ignore
import * as HelmetAsync from 'react-helmet-async';
// @ts-ignore
const Helmet = HelmetAsync.Helmet || HelmetAsync.default?.Helmet;

interface SEOHeadProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
}

export default function SEOHead({ title, description, image, url }: SEOHeadProps) {
    const siteName = '도서출판 동틀녘'; // 나중에 설정 싱글톤에서 가져올 수도 있음
    const defaultDescription = '좋은 책을 만드는 도서출판 동틀녘입니다.';

    return (
        <Helmet>
            <title>{title} | {siteName}</title>
            <meta name="description" content={description || defaultDescription} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description || defaultDescription} />
            {image && <meta property="og:image" content={image} />}
            {url && <meta property="og:url" content={url} />}
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description || defaultDescription} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
}
