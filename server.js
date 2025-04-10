// Модули, библиотеки
const express = require("express");
const server = express();
const sass = require('sass');
const path = require('path');
const fs = require('fs');
const serveStatic = require('serve-static');
const mime = require('mime-types');
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// Функция для компиляции scss в css
function compileSass(srcPath, destPath) {
    if (fs.existsSync(srcPath)) {
        const result = sass.compile(srcPath, {
            style: 'compressed'
        });
        fs.writeFileSync(destPath, result.css);
    } else {
        console.error(`Файл ${srcPath} не найден.`);
    }
}

// Подключение папок к серверу
server.use((req, res, next) => {
    if (req.path.endsWith('.css')) {
        const srcPath = path.join(__dirname, '/scss', req.path.replace('.css', '.scss'));
        const destPath = path.join(__dirname, '/css', req.path);

        compileSass(srcPath, destPath);
    }
    next();
});

// mime настройки чтобы не было ошибок с типизацией
server.use(serveStatic(path.join(__dirname, '/css'), {
    setHeaders: function (res, path) {
        if (mime.lookup(path) === 'text/css') {
            res.setHeader('Content-Type', 'text/css');
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// Подключение главной страницы с отправкой данных
server.get('/', (req, res) => {
    res.render('index', {
      firstDate: '02.01.2023',
      firstTime: '22:00',
      secondDate: '31.12.2023',
      secondTime: '12:59'
    });
});

server.use('/images', express.static(path.join(__dirname, 'images')));

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
