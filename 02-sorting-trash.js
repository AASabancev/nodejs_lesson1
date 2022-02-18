const app = require('./app');
const args = require('yargs').argv;

const trashDir = args.fromDir || './trash';
const sortedDir = args.toDir || './sorted';

app.sortFiles(trashDir, sortedDir, app.moveFile);
if (args.unlinkFromDir) {
  app.removeDir(trashDir);
}
