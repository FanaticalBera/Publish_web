export interface Book {
  slug: string;
  title: string;
  subtitle?: string;
  logline: string;
  cover: string;
  description: string;
  authorSlug?: string;
  publishDate: string;
  isbn?: string;
  pages?: number;
  price?: string;
  tableOfContents?: string[];
  purchaseLinks: PurchaseLink[];
  authors?: {
    slug?: string;
    name?: string;
  }[];
}

export interface PurchaseLink {
  name: string;
  url: string;
}

export interface Author {
  slug: string;
  name: string;
  photo?: string;
  bio: string;
  shortBio?: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  publishDate: string;
  category?: string;
  relatedBookSlugs?: string[];
}

export interface DataRoomItem {
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  file?: string;
  publishDate: string;
}

export interface ReferenceNote {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail?: string;
  publishDate: string;
  category: string;
}
