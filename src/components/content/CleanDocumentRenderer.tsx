import { DocumentRenderer as KeystaticDocumentRenderer } from "@keystatic/core/renderer";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import { cleanCopiedContent } from "@/utils/textFormatting";

/**
 * Custom DocumentRenderer wrapper that automatically cleans HTML entities
 * and escape characters from text content
 */
export function CleanDocumentRenderer({ document, ...props }: { document: any; [key: string]: any }) {
    if (!document) return null;

    if (typeof document === "string") {
        const cleanedSource = cleanCopiedContent(document);
        const ast = Markdoc.parse(cleanedSource);
        const content = Markdoc.transform(ast);
        return <>{Markdoc.renderers.react(content, React)}</>;
    }

    if (!Array.isArray(document)) return null;

    // Recursively clean text nodes in the document AST
    const cleanDocument = (node: any): any => {
        if (!node) return node;

        if (Array.isArray(node)) {
            return node.map(cleanDocument);
        }

        if (typeof node === 'object') {
            // If this is a text node, clean the text
            if ('text' in node && typeof node.text === 'string') {
                return {
                    ...node,
                    text: cleanCopiedContent(node.text)
                };
            }

            // If it has children, clean them recursively
            if ('children' in node) {
                return {
                    ...node,
                    children: cleanDocument(node.children)
                };
            }

            // Otherwise, process all object properties
            const cleaned: any = {};
            for (const [key, value] of Object.entries(node)) {
                cleaned[key] = cleanDocument(value);
            }
            return cleaned;
        }

        return node;
    };

    const cleanedDocument = cleanDocument(document);

    return <KeystaticDocumentRenderer document={cleanedDocument} {...props} />;
}
