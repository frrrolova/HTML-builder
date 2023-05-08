const { readdir, mkdir, copyFile } = require('node:fs/promises');
const folderCopy = __dirname + '/files-copy';

mkdir(folderCopy, { recursive: true })
  .then(() => {
    readdir(__dirname + '/files').then((files) => {
      files.forEach((file) => {
        copyFile(__dirname + '/files/' + file, folderCopy + '/' + file);
      });
    });
  });


