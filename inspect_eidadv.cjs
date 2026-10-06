const fs = require('fs');
const content = fs.readFileSync('C:/Users/Administrador/.gemini/antigravity/brain/e77d158a-de8a-430e-ada5-a0601b59cbc7/.system_generated/steps/559/content.md', 'utf8');

// Find all image URLs
const imgRegex = /https:\/\/eidadv\.com\.br\/wp-content\/uploads\/[^\s"'>]+/g;
const images = [...new Set(content.match(imgRegex) || [])];
console.log('=== IMAGES ===');
images.forEach(img => console.log(img));

// Find sections and structure
const sectionMatches = content.match(/<section[\s\S]*?<\/section>/gi) || [];
console.log('\n=== SECTIONS (' + sectionMatches.length + ') ===');
sectionMatches.forEach((s, idx) => {
  const heading = (s.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i) || [])[1] || 'No heading';
  const cleanHeading = heading.replace(/<[^>]+>/g, '').trim();
  const cls = (s.match(/class=["']([^"']+)["']/i) || [])[1] || '';
  console.log(`[Section ${idx+1}] class="${cls}" | Heading: "${cleanHeading}"`);
});
