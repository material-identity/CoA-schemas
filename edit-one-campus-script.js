const fs = require('fs');
const defaultFilePath = './CAMPUS/EN.json';
const defaultOutputFilePath = './CAMPUS-edited/EN.json';

(async function (argv) {
  try {
    const filePath = argv[2] || defaultFilePath;
    const outputFilePath = argv[3] || defaultOutputFilePath;

    const translation = JSON.parse(fs.readFileSync(filePath).toString());
    const newTranslationObject = {};

    translation.forEach((obj) => {
      const { Id, ...rest } = obj;
      newTranslationObject[Id] = rest;
    });

    fs.writeFileSync(outputFilePath, JSON.stringify(newTranslationObject));
    console.log('File written successfully\n');
  } catch (error) {
    console.error(error.message);
  }
})(process.argv);
