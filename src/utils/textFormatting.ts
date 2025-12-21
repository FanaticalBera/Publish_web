/**
 * Cleans up content copied from blogs or other sources
 * Removes HTML entities, unnecessary backslashes, and excessive whitespace
 */
export function cleanCopiedContent(content: string): string {
    if (!content) return content;

    return content
        // HTML 엔티티 디코딩
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')

        // 마크다운 줄바꿈 백슬래시 제거 (문장 끝의 \ 제거)
        .replace(/\s*\\\s*$/gm, '')

        // 빈 줄의 백슬래시만 있는 줄 제거
        .replace(/^\s*\\\s*$/gm, '')

        // 연속된 공백을 하나로
        .replace(/[ \t]{2,}/g, ' ')

        // 연속된 빈 줄 최대 2개로 제한 (3개 이상의 줄바꿈을 2개로)
        .replace(/\n{4,}/g, '\n\n\n')

        // 앞뒤 공백 제거
        .trim();
}
