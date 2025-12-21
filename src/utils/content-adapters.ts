import type { PurchaseLink } from "@/types/content";

type DocNode = {
  type?: string;
  text?: string;
  children?: DocNode[];
};

function extractText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(extractText).filter(Boolean).join(" ").trim();
  }
  if (typeof value === "object") {
    const node = value as DocNode;
    if (node.text) return node.text;
    if (node.children) return extractText(node.children);
  }
  return "";
}

export function getFirstParagraphText(doc: unknown): string {
  if (Array.isArray(doc)) {
    const paragraph =
      doc.find((node: any) => node?.type === "paragraph") ?? doc[0];
    return extractText((paragraph as any)?.children ?? paragraph);
  }
  return extractText(doc);
}

const storeLabels: Record<string, string> = {
  kyobo: "교보문고",
  yes24: "Yes24",
  aladin: "알라딘",
  ridi: "리디북스",
  other: "Other",
};

export function mapPurchaseLinks(links: any[] | undefined): PurchaseLink[] {
  if (!Array.isArray(links)) return [];
  return links
    .map((link) => {
      const name = storeLabels[link?.storeName] ?? link?.storeName ?? "Store";
      const url = link?.url;
      if (!url) return null;
      return { name, url };
    })
    .filter((link): link is PurchaseLink => !!link);
}

export function mapNewsTypeLabel(type: string | undefined): string | undefined {
  switch (type) {
    case "notice":
      return "Notice";
    case "release":
      return "New Release";
    case "event":
      return "Event";
    case "column":
      return "Column";
    default:
      return undefined;
  }
}
