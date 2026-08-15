// Stripped for AI Studio web runtime migration
// const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateResumePDF() {
  console.log('PDF generation via Puppeteer is disabled in container environment.');
}

if (require.main === module) {
  generateResumePDF();
}

module.exports = { generateResumePDF };
