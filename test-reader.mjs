import { getAbout, getAllNews } from './src/utils/reader.ts';

console.log('=== Testing About Data ===');
const aboutData = await getAbout();
console.log('About data:', JSON.stringify(aboutData, null, 2));
console.log('Mission exists:', !!aboutData?.mission);
console.log('History exists:', !!aboutData?.history);

console.log('\n=== Testing News Data ===');
const newsData = await getAllNews();
console.log('News count:', newsData.length);
console.log('News data:', JSON.stringify(newsData, null, 2));
