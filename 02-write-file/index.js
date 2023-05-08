const fs = require('fs');
const readLine = require('readline');

const writeStream = fs.createWriteStream(__dirname + '/destination.txt');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Type something: '
});

rl.prompt();
rl.on(
  'line',
  (input) => {
    if (input === 'exit') {
      console.log('Good bye!');
      rl.close();
      return;
    }
    writeStream.write(input, () => {
      rl.prompt();
    });
  }
);

rl.on(
  'SIGINT',
  () => {
    console.log('\nGood bye!');
    rl.close();
  }
);



