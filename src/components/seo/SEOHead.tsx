import React from "react";
import SEOHead from "../common/SEOHead";

interface DawnSEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export default function DawnSEOHead({
  title,
  description,
  ogImage,
  canonical,
}: DawnSEOHeadProps) {
  return (
    <SEOHead title={title} description={description} image={ogImage} url={canonical} />
  );
}
