/**
 * Content Cleanup Script (IMPROVED VERSION)
 * 
 * This script processes all .mdoc files in the content directory
 * and removes HTML entities, backslashes, and excessive whitespace
 * that may have been introduced through copy-paste operations.
 * 
 * IMPORTANT: Only cleans the content body, preserving YAML frontmatter
 * 
 * Usage: node scripts/clean-content.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

/**
 * Cleans up content copied from blogs or other sources
 */
function cleanCopiedContent(content) {
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

/**
 * Recursively find all .mdoc files in a directory
 */
function findMdocFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findMdocFiles(filePath, fileList);
        } else if (file.endsWith('.mdoc')) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * Process a single .mdoc file
 * Only cleans the content section, preserving YAML frontmatter
 */
function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Split frontmatter and content
    const parts = content.split(/^---$/m);

    if (parts.length < 3) {
        // No frontmatter, clean entire file
        const cleaned = cleanCopiedContent(content);
        if (content !== cleaned) {
            fs.writeFileSync(filePath, cleaned, 'utf-8');
            return true;
        }
        return false;
    }

    // parts[0] is empty, parts[1] is frontmatter, parts[2]+ is content
    const frontmatter = parts[1];
    const bodyParts = parts.slice(2);
    const body = bodyParts.join('---');

    // Only clean the body content, not the frontmatter
    const cleanedBody = cleanCopiedContent(body);

    if (body !== cleanedBody) {
        const newContent = `---${frontmatter}---${cleanedBody}`;
        fs.writeFileSync(filePath, newContent, 'utf-8');
        return true;
    }

    return false;
}

/**
 * Create backup of content directory
 */
function createBackup() {
    const contentDir = path.join(projectRoot, 'content');
    const backupDir = path.join(projectRoot, 'content_backup_' + Date.now());

    console.log('📦 Creating backup...');
    fs.cpSync(contentDir, backupDir, { recursive: true });
    console.log(`✅ Backup created at: ${backupDir}\n`);

    return backupDir;
}

/**
 * Main execution
 */
function main() {
    console.log('🧹 Content Cleanup Script (IMPROVED)\n');
    console.log('This script will clean HTML entities and backslashes from all .mdoc files.');
    console.log('⚠️  YAML frontmatter will be preserved.\n');

    // Create backup first
    const backupDir = createBackup();

    // Find all .mdoc files
    const contentDir = path.join(projectRoot, 'content');
    const files = findMdocFiles(contentDir);

    console.log(`📄 Found ${files.length} .mdoc files\n`);

    let cleanedCount = 0;
    const cleanedFiles = [];

    // Process each file
    for (const file of files) {
        const relativePath = path.relative(projectRoot, file);
        const wasCleaned = processFile(file);

        if (wasCleaned) {
            cleanedCount++;
            cleanedFiles.push(relativePath);
            console.log(`✨ Cleaned: ${relativePath}`);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Cleanup complete!`);
    console.log(`   - Total files: ${files.length}`);
    console.log(`   - Files cleaned: ${cleanedCount}`);
    console.log(`   - Backup location: ${backupDir}`);

    if (cleanedFiles.length > 0) {
        console.log(`\n📝 Cleaned files:`);
        cleanedFiles.forEach(file => console.log(`   - ${file}`));
    }

    console.log(`\n💡 Tip: If you need to restore, copy files from the backup directory.`);
}

// Run the script
try {
    main();
} catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
}
