const app = require('./app');

const trashDir = './trash';

const dirs = app.createDirs(trashDir);
app.createFiles(dirs);
