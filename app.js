const fs = require('fs');
const path = require('path');
const Chance = require('chance');

const chance = new Chance();

/**
 * Методы первого файла
 */

/**
 * Генерация случайного набора букв
 * @param ext расширение файла (если необходимо)
 * @returns {string}
 */
exports.genString = (ext = '') => {
  return chance.string({ pool: 'qwertyuiopasdfghjklzxcvbnm', length: 15 }) + ext;
};

/**
 * создание папки
 * @param dirpath путь к папке
 */
exports.createDir = (dirpath) => {
  if (!fs.existsSync(dirpath)) {
    fs.mkdirSync(dirpath);
  }
};

/**
 * Создание файла-пустышки
 * @param filepath путь к файлу
 * @param content содержимое файла
 */
exports.createFile = (filepath, content) => {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, content);
  }
};

/**
 * создание папок с рандомной структурой (вложенностью)
 * @param dir
 * @returns {*[]}
 */
exports.createDirs = async (dir) => {
  exports.createDir(dir);
  const dirs = [dir];
  const countDirs = chance.integer({ min: 100, max: 200 });
  for (let i = 0; i < countDirs; i++) {
    const parent = dirs[Math.floor(Math.random() * dirs.length)];
    const randomstring = exports.genString();
    const dirpath = path.normalize(path.join(parent, randomstring));
    exports.createDir(dirpath);
    dirs.push(dirpath);
  }
  console.log(`Created ${countDirs} dirs`);
  return dirs;
};

/**
 * Создание файлов в папке dirs
 * @param dirs Путь к папке, где будут созданы файлы
 * @returns {*[]}
 */
exports.createFiles = (dirs) => {
  const files = [];
  let countFiles = 0;
  dirs.forEach(dir => {
    const count = chance.integer({ min: 3, max: 10 });
    countFiles += count;
    for (let i = 0; i < count; i++) {
      const randomstring = exports.genString('.jpg');
      const filepath = path.normalize(path.join(dir, randomstring));
      exports.createFile(filepath, '');
      files.push(filepath);
    }
  });
  console.log(`Created ${countFiles} files`);
  return files;
};

/**
* Методы второго файла
*/

/**
 * Удаление папки
 * @param dir путь к папке
 */
exports.removeDir = (dir) => {
  fs.rmdirSync(dir);
  console.log(`dir ${dir} removed`);
};

/**
 * Перемещает файлы из папки dirFrom в папку dirTo сортируя по первой букве файла
 * @param dirFrom Исходная папка
 * @param dirTo Конечная папка
 * @param callbackFile колбек, применяемый к каждому файлу
 */
exports.sortFiles = (dirFrom, dirTo, callbackFile = null) => {
  const files = fs.readdirSync(dirFrom);

  files.forEach((item) => {
    const filepath = path.join(dirFrom, item);
    const state = fs.statSync(filepath);
    if (state.isDirectory()) {
      // console.log('DIR: ' + filepath, state.isDirectory());
      exports.sortFiles(filepath, dirTo, callbackFile);
      exports.removeDir(filepath);
    } else {
      if (callbackFile) {
        callbackFile(filepath, dirTo);
        // console.log('File: ' + item);
      }
    }
  });
};

/**
 * перемещение файла
 * @param filepath текущий путь
 * @param dirTo конечный путь
 * @returns {boolean}
 */
exports.moveFile = (filepath, dirTo) => {
  if (!fs.existsSync(filepath)) {
    console.error(`${filepath} does not exists`);
    return false;
  }
  const parsedPath = path.parse(filepath);
  const newPath = path.join(dirTo, parsedPath.name.substr(0, 1));
  exports.createDir(dirTo);
  exports.createDir(newPath);
  fs.renameSync(filepath, path.join(newPath, parsedPath.base));
  console.log(`file ${filepath} moved`);
};
