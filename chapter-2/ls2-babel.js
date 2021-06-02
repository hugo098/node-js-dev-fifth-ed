'use strict';

let listFiles = (() => {
    var _ref = _asyncToGenerator(function* () {
        try {
            var dir = '.';
            if (process.argv[2]) {
                dir = process.argv[2];
            }
            const files = yield fs_readdir(dir);
            for (let fn of files) {
                console.log(fn);
            }
        } catch (err) {
            console.error(err);
        }
    });

    return function listFiles() {
        return _ref.apply(this, arguments);
    };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');

const fs_readdir = dir => {
    return new Promise((reject, resolve) => {
        fs.readdir(dir, (err, fileList) => {
            if (err) {
                reject(err);
            } else {
                resolve(fileList);
            }
        });
    });
};

listFiles();
