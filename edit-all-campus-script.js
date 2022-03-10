const fs = require('fs');

const readDirectory = './CAMPUS';
const writeDirectory = './CAMPUS-edited';

const all = fs.readdirSync(readDirectory);

all.forEach(async (fileName) => {
  const filePath = `${readDirectory}/${fileName}`;

  const newTranslationObject = {};

  try {
    const translation = await JSON.parse(fs.readFileSync(filePath).toString());

    translation.forEach((obj) => {
      const { Id, ...rest } = obj;
      newTranslationObject[Id] = rest;
    });
  } catch (error) {
    console.log(`Error in ${fileName}`);
    console.log(error);
  }

  await fs.writeFile(`${writeDirectory}/${fileName}`, JSON.stringify(newTranslationObject), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`${fileName} written successfully\n`);
    }
  });
});
