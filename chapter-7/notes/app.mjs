import { default as DBG } from 'debug';
const debug = DBG('notes:debug');
const dbgerror = DBG('notes:error');
import express from 'express';
import hbs from 'hbs';
import * as path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import * as http from 'http';
import { approotdir } from './approotdir.mjs';
const __dirname = approotdir;
import {
    normalizePort, onError, onListening, handle404, basicErrorHandler
} from './appsupport.mjs';

//import { InMemoryNotesStore } from './models/notes-memory.mjs';
//export const NotesStore = new InMemoryNotesStore();

import { useModel as useNotesModel } from './models/notes-store.mjs';
useNotesModel(process.env.NOTES_MODEL ? process.env.NOTES_MODEL : "memory")
    .then(store => { })
    .catch(error => { onError({ code: 'ENOTESSTORE', error }); });

import { router as indexRouter } from './routes/index.mjs';
import { router as notesRouter } from './routes/notes.mjs';

import { default as rfs } from 'rotating-file-stream';

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'partials'));

// uncomment after placing you favicon in /public
app.use(favicon(path.join(__dirname, 'public/', 'favicon.ico')));
app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev', {
    stream: process.env.REQUEST_LOG_FILE ?
        rfs.createStream(process.env.REQUEST_LOG_FILE, {
            size: '10M', //rotate every 10 MegaBytes written
            interval: '1d', //rotate daily
            compress: 'gzip' //compress rotated files
        })
        : process.stdout
}));

if (process.env.REQUEST_LOG_FILE) {
    app.use(logger(process.env.REQUEST_LOG_FORMAT || 'dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*app.use(
    '/assets/vendor/bootstrap',
    express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist'))
);*/
/*app.use(
    '/assets/vendor/bootstrap',
    express.static(path.join(__dirname, 'theme', 'dist'))
);*/
app.use(
    '/assets/vendor/bootstrap/js',
    express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js'))
);
app.use(
    '/assets/vendor/bootstrap/css',
    express.static(path.join(__dirname, 'minty'))
);
app.use(
    '/assets/vendor/jquery',
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);
app.use(
    '/assets/vendor/popper.js',
    express.static(path.join(__dirname, 'node_modules', 'popper.js', 'dist', 'umd'))
);
app.use(
    '/assets/vendor/feather-icons',
    express.static(path.join(__dirname, 'node_modules', 'feather-icons', 'dist')));

// Router function lists
app.use('/', indexRouter);
app.use('/notes', notesRouter);

// error handlers
// catch 404 and forward to error handler
app.use(handle404);
app.use(basicErrorHandler);

export const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

export const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

server.on('request', (req, res) => {
    debug(`${new Date().toISOString()} request ${req.method} ${req.url}`);
});

