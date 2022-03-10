const fs = require('fs');
const filePath = './CAMPUS/EN.json';
const outputFilePath = './CAMPUS-edited/EN.json';

let translation = fs.readFileSync(filePath).toString();
const newTranslationObject = {};

try {
  translation = JSON.parse(translation);

  translation.forEach((obj) => {
    const { Id, ...rest } = obj;
    newTranslationObject[Id] = rest;
  });

  fs.writeFile(outputFilePath, JSON.stringify(newTranslationObject), (err) => {
    if (err) console.log(err);
    else {
      console.log('File written successfully\n');
    }
  });
} catch (error) {
  console.log(error);
}
