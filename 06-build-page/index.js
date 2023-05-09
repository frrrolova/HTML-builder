const { readdir, mkdir, copyFile, rm } = require('node:fs/promises');
const path = require('path');
const fs = require('fs');
const newFolder = __dirname + '/project-dist';

mkdir(newFolder, { recursive: true })
  .then(() => createIndexHtml())
  .then(() => mergeStyles())
  .then(() => makeAssets(newFolder));

function makeAssets(destinationFolder) {
  const assetsFolder = destinationFolder + '/assets';
  return rm(assetsFolder, { recursive: true, force: true })
    .then(() => mkdir(assetsFolder, { recursive: true }))
    .then(() => copyDirectory(__dirname + '/assets', assetsFolder));
}

function readFile(path) {
  return new Promise((resolve) => {
    const readableStream = fs.createReadStream(path, 'utf-8');

    let data = '';
    readableStream.on('data', chunk => {
      data += chunk;
    });
    readableStream.on('end', () => {
      resolve(data);
    });
  });
}

function createIndexHtml() {
  const componentsFolder = __dirname + '/components';
  return readFile(__dirname + '/template.html')
    .then((templateContent) => {
      return readdir(componentsFolder, { withFileTypes: true })
        .then((files) => {
          return files.filter(file => {
            const extention = path.extname(componentsFolder + file.name);
            return file.isFile() && extention === '.html';
          });
        })
        .then((componentFiles) => {
          const componentNames = componentFiles.map((file) => path.parse(componentsFolder + '/' + file.name).name);

          const promisesArray = componentNames.map((name) => readFile(`${componentsFolder}/${name}.html`));

          return Promise.all(promisesArray)
            .then((componentsContents) => {
              for (let i = 0; i < componentNames.length; i++) {
                templateContent = templateContent.replaceAll(`{{${componentNames[i]}}}`, componentsContents[i]);
              }
              return templateContent;
            });
        });
    })
    .then((templateContent) => {
      const writeStream = fs.createWriteStream(__dirname + '/project-dist/index.html');
      writeStream.write(templateContent);
    });
}

function mergeStyles() {
  const filesPath = __dirname + '/styles';

  return readdir(filesPath, { withFileTypes: true })
    .then((files) => {
      return files.filter(file => {
        const extention = path.extname(filesPath + '/' + file.name);
        return file.isFile() && extention === '.css';
      });
    })
    .then((files) => {
      const filesPromises = files.map((file) => readFile(filesPath + '/' + file.name));
      return Promise.all(filesPromises);
    })
    .then((filesContents) => {
      return filesContents.join('\n/*<--------------------------------->*/\n');
    })
    .then((allStyles) => {
      const writeStream = fs.createWriteStream(__dirname + '/project-dist/style.css');
      writeStream.write(allStyles);
    });
}

function copyDirectory(path, destination) {
  return readdir(path, { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        const newPath = path + '/' + file.name;
        const newDestination = destination + '/' + file.name;

        if (file.isDirectory()) {
          mkdir(newDestination, { recursive: true })
            .then(() => copyDirectory(newPath, newDestination));
        } else {
          copyFile(newPath, newDestination);
        }
      });
    });
}
