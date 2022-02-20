const app = require('./app');

const trashDir = './trash';

console.log('start');
app.createDirs(trashDir)
  .then(dirs => {
    console.log('after dirs', dirs);

    app.createFiles(dirs)
      .then(files => console.log('makeFiles', files));
    console.log('after files');
  });

console.log('end');
