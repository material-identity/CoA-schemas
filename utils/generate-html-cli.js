const glob = require('glob');
const { generateHtmlCertificate } = require('./generate-html');

(async function (argv) {
  const certificatePattern = argv[2] || 'test/fixtures/valid_certificate_*.json';
  try {
    const filePaths = glob.sync(certificatePattern);
    await Promise.all(filePaths.map((filePath) => generateHtmlCertificate(filePath)));
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
