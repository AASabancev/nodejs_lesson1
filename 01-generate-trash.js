const app = require('./app');

const trashDir = './trash';
const variant1 = false;

console.log('start');
if (variant1) {
  /**
   * вариант 1
   */
  (async () => {
    const dirs = await app.createDirs(trashDir);
    console.log('after dirs');
    app.createFiles(dirs);
    console.log('after files');
  })();
} else {
  /**
   * вариант 2
   */
  const makeDirs = (trashDir) => {
    return new Promise((resolve, reject) => {
      const dirs = app.createDirs(trashDir);
      resolve(dirs);
    });
  };

  const makeFiles = (dirs) => {
    return new Promise((resolve, reject) => {
      const files = app.createFiles(dirs);
      resolve(files);
    });
  };

  makeDirs(trashDir)
    .then(dirs => {
      console.log('after dirs');
      makeFiles(dirs)
        .then(files => console.log('makeFiles'));
      console.log('after files');
    });
}
console.log('end');
