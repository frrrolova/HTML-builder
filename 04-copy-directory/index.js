const { readdir, mkdir, copyFile, rm } = require('node:fs/promises');
const folderCopy = __dirname + '/files-copy';

rm(folderCopy, { recursive: true, force: true })
  .then(() => mkdir(folderCopy, { recursive: true }))
  .then(() => readdir(__dirname + '/files'))
  .then((files) => {
    files.forEach((file) => {
      copyFile(__dirname + '/files/' + file, folderCopy + '/' + file);
    });
  });



