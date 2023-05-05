const fs = require('fs');
const readableStream = fs.createReadStream(__dirname + '/text.txt', 'utf-8');
let data = '';
readableStream.on('data', chunk => {
  data += chunk;
});
readableStream.on('end', () => console.log(data));
readableStream.on('error', error => console.log('Error', error.message));
