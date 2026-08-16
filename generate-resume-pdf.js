const fs = require('fs');
const path = require('path');

async function generateResumePDF() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (err) {
    console.error('Puppeteer is not installed. Run `npm i puppeteer` to enable PDF generation.');
    return;
  }

  const resumeHtml = path.join(__dirname, 'source', 'resume.html');
  if (!fs.existsSync(resumeHtml)) {
    console.error('Source resume HTML not found at', resumeHtml);
    return;
  }

  const fileUrl = 'file://' + resumeHtml.replace(/\\/g, '/');
  const outputRootPdf = path.join(__dirname, 'resume.pdf');
  const outputPublicPdf = path.join(__dirname, 'public', 'resume.pdf');

  console.log('Launching headless browser to generate PDF...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outputRootPdf,
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    });

    console.log('Generated:', outputRootPdf);

    try {
      await fs.promises.mkdir(path.dirname(outputPublicPdf), { recursive: true });
      await fs.promises.copyFile(outputRootPdf, outputPublicPdf);
      console.log('Copied to:', outputPublicPdf);
    } catch (copyErr) {
      console.warn('Could not copy PDF to public/:', copyErr.message);
    }
  } finally {
    await browser.close();
  }
}

if (require.main === module) generateResumePDF();

module.exports = { generateResumePDF };
