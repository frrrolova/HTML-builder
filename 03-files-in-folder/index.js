const { readdir, stat } = require('node:fs/promises');
const path = require('path');
const filesPath = path.join(__dirname, 'secret-folder');

readdir(filesPath, { withFileTypes: true })
  .then((files) => {
    return files.filter(file => file.isFile());
  })
  .then((files) => {
    files.forEach((file) => {

      const extention = path.extname(path.join(filesPath , file.name)).slice(1);
      const name = path.parse(path.join(filesPath, file.name)).name;

      stat(filesPath + '/' + file.name).then((fileStat) => {
        console.log(`${name} - ${extention} - ${fileStat.size / 1024}kb`);
      });
    });
  });
