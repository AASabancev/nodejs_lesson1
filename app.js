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
 * @param dir путь к папке
 */
exports.createDir = async (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) reject(err);

      resolve(dir);
    });
  });
};

/**
 * Создание файла-пустышки
 * @param filepath путь к файлу
 * @param content содержимое файла
 */
exports.createFile = async (filepath, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf8', (err) => {
      if (err) reject(err);

      resolve(true);
    });
  });
};

/**
 * создание папок с рандомной структурой (вложенностью)
 * @param dir
 * @returns {*[]}
 */
exports.createDirs = async (dir) => {
  const dirs = [dir];
  const countDirs = chance.integer({ min: 5, max: 10 });
  for (let i = 0; i < countDirs; i++) {
    const parent = dirs[Math.floor(Math.random() * dirs.length)];
    const randomstring = exports.genString();
    const dirpath = path.normalize(path.join(parent, randomstring));
    dirs.push(dirpath);
  }
  return new Promise((resolve, reject) => {
    Promise.all(dirs.map(async dir => { await exports.createDir(dir); }))
      .then(() => {
        console.log(`Created ${countDirs} dirs`);
        resolve(dirs);
      });
  });
};

/**
 * Создание файлов в папке dirs
 * @param dirs Путь к папке, где будут созданы файлы
 * @returns {*[]}
 */
exports.createFiles = async (dirs) => {
  const files = [];
  let countFiles = 0;
  dirs.forEach(dir => {
    const count = chance.integer({ min: 3, max: 10 });
    countFiles += count;
    for (let i = 0; i < count; i++) {
      const randomstring = exports.genString('.jpg');
      const filepath = path.normalize(path.join(dir, randomstring));
      files.push(filepath);
    }
  });

  return new Promise((resolve, reject) => {
    Promise.all(files.map(async file => { await exports.createFile(file, ''); }))
      .then(() => {
        console.log(`Created ${countFiles} files`);
        resolve(files);
      });
  });
};

/**
* Методы второго файла
*/

/**
 * Удаление папки
 * @param dir путь к папке
 */
exports.removeDir = async (dir) => {
  return new Promise((resolve, reject) => {
    fs.rmdir(dir, {}, (err) => {
      if (err) reject(err);

      resolve(dir);
    });
  });
};

/**
 * Перемещает файлы из папки dirFrom в папку dirTo сортируя по первой букве файла
 * @param dirFrom Исходная папка
 * @param dirTo Конечная папка
 * @param callbackFile колбек, применяемый к каждому файлу
 */
exports.sortFiles = async (dirFrom, dirTo, callbackFile = null) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirFrom, {}, (err, files) => {
      if (err) throw err;

      if (!files.length) {
        exports.removeDir(dirFrom);
        resolve(true);
      }

      Promise.all(files.map(async file => { await exports.sortFile(file, dirFrom, dirTo, callbackFile); }))
        .then(() => {
          resolve(true);
        });
    });
  });
};

exports.sortFile = async (item, dirFrom, dirTo, callbackFile = null) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(dirFrom, item);
    fs.stat(filepath, {}, async (err, state) => {
      if (err) throw err;

      if (state.isDirectory()) {
        exports.sortFiles(filepath, dirTo, callbackFile)
          .then(() => {
            exports.removeDir(filepath)
              .then(() => {
                resolve(true);
              });
          });
      } else {
        if (callbackFile) {
          await callbackFile(filepath, dirTo);
          resolve(true);
        }
      }
    });
  });
};

/**
 * перемещение файла
 * @param filepath текущий путь
 * @param dirTo конечный путь
 * @returns {boolean}
 */
exports.moveFile = async (filepath, dirTo) => {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, {}, (err, state) => {
      if (err) throw err;

      if (!state.isFile()) {
        console.error(`${filepath} does not exists`);
        return false;
      }
      const parsedPath = path.parse(filepath);
      const newPath = path.join(dirTo, parsedPath.name.substr(0, 1));
      exports.createDir(newPath)
        .then(() => {
          fs.rename(filepath, path.join(newPath, parsedPath.base), (err) => {
            if (err) throw err;

            console.log(`file ${filepath} moved`);
            resolve(filepath);
          });
        }).catch(err => {
          if (err) throw err;
        });
    });
  });
};
