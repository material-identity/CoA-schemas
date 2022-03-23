const fs = require('fs');
const defaultInputPath = './CAMPUS';
const defaultOutputPath = './CAMPUS-edited/';

/*
Script will detect if the input path is a file or directory
If its a json file it will transform the file
If its a directory it will transform all the json files in the directory
*/

(function (argv) {
  const inputPath = argv[2] || defaultInputPath;
  const outputPath = argv[3] || defaultOutputPath;
  const stats = fs.statSync(inputPath);

  if (stats.isFile()) {
    try {
      if (/.json/.test(inputPath)) {
        const translation = JSON.parse(fs.readFileSync(inputPath).toString());
        const newTranslationObject = {};

        translation.forEach((obj) => {
          const { Id, ...rest } = obj;
          newTranslationObject[Id] = rest;
        });

        fs.writeFileSync(outputPath, JSON.stringify(newTranslationObject));
        console.log('File written successfully\n');
      } else {
        console.log('File extension is not .json');
      }
    } catch (error) {
      console.error(error.message);
    }
  } else if (stats.isDirectory()) {
    try {
      const allInputFiles = fs.readdirSync(inputPath);

      allInputFiles.forEach((fileName) => {
        if (/.json/.test(fileName)) {
          const filePath = `${inputPath}/${fileName}`;

          const newTranslationObject = {};
          let translation = fs.readFileSync(filePath).toString();

          try {
            translation = JSON.parse(translation);

            translation.forEach((obj) => {
              const { Id, ...rest } = obj;
              newTranslationObject[Id] = rest;
            });

            fs.writeFileSync(`${outputPath}/${fileName}`, JSON.stringify(newTranslationObject));
            console.log(`${fileName} written successfully\n`);
          } catch (error) {
            console.log(`${error.message} in file ${fileName}`);
          }
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  }
})(process.argv);
