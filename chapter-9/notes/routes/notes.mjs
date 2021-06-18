//import * as util from 'util';
import { default as express } from 'express';
//import { NotesStore as notes } from '../app.mjs';
import { NotesStore as notes } from '../models/notes-store.mjs';
export const router = express.Router();
import { ensureAuthenticated } from './users.mjs';
import { twitterLogin } from './users.mjs';
import { emitNoteTitles } from './index.mjs';
import { io } from '../app.mjs';

import {
    postMessage, destroyMessage, recentMessages,
    emitter as msgEvents
} from '../models/messages-sequelize.mjs';
import DBG from 'debug';
const debug = DBG('notes:home');
const error = DBG('notes:error-home');


// Add Note
router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: '',
        note: undefined,
        user: req.user,
        twitterLogin: twitterLogin
    });
});

// Save Note(update)
router.post('/save', ensureAuthenticated, async (req, res, next) => {
    try {
        let note;
        if (req.body.docreate === "create") {
            note = await notes.create(req.body.notekey.trim(), req.body.title, req.body.body);
        } else {
            note = await notes.update(req.body.notekey.trim(), req.body.title, req.body.body);
        }
        res.redirect('/notes/view?key=' + req.body.notekey.trim());

    } catch (err) {
        next(err);
    }
});

router.get('/view', async (req, res, next) => {
    debug(twitterLogin)
    try {
        let note = await notes.read(req.query.key.trim());
        const messages = await recentMessages('/notes', req.query.key);
        res.render('noteview', {
            title: note ? note.title : "",
            notekey: req.query.key,
            note: note,
            user: req.user ? req.user : undefined,
            twitterLogin: twitterLogin,
            messages
        });
    } catch (err) {
        next(err);
    }
});

router.get('/edit', ensureAuthenticated, async (req, res, next) => {
    try {
        let note = await notes.read(req.query.key);
        res.render('noteedit', {
            title: note ? ("Edit " + note.title) : "Add a note",
            docreate: false,
            notekey: req.query.key,
            user: req.user,
            note: note,
            twitterLogin: twitterLogin
        });
    } catch (err) {
        next(err);
    }
});

router.get('/destroy', ensureAuthenticated, async (req, res, next) => {
    try {
        const note = await notes.read(req.query.key);
        res.render('notedestroy', {
            title: note ? `Delete ${note.title}` : "",
            notekey: req.query.key,
            user: req.user,
            note: note,
            twitterLogin: twitterLogin,
        });
    } catch (err) {
        next(err);
    }
});

// Really destroy note (destroy)
router.post('/destroy/confirm', ensureAuthenticated, async (req, res, next) => {
    try {
        await notes.destroy(req.body.notekey);
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});

export function init() {
    notes.on('noteupdated', note => {
        const toemit = {
            key: note.key, title: note.title, body: note.body
        };
        io.of('/notes').to(note.key).emit('noteupdated', toemit);
        emitNoteTitles();
    });
    notes.on('notedestroyed', key => {
        io.of('/notes').to(key).emit('notedestroyed', key);
        emitNoteTitles();
    });

    msgEvents.on('newmessage', newmsg => {
        io.of(newmsg.namespace).to(newmsg.room).emit('newmessage',
            newmsg);
    });
    msgEvents.on('destroymessage', data => {
        io.of(data.namespace).to(data.room).emit('destroymessage', data);
    });
    
    io.of('/notes').on('connect', socket => {
        if (socket.handshake.query.key) {
            socket.join(socket.handshake.query.key);
        }
        socket.on('create-message', async (newmsg, fn) => {
            try {
                await postMessage(
                    newmsg.from, newmsg.namespace, newmsg.room,
                    newmsg.message);
                fn('ok');
            } catch (err) {
                error(`FAIL to create message ${err.stack}`);
            }
        });
        socket.on('delete-message', async (data) => {
            try {
                await destroyMessage(data.id);
            } catch (err) {
                error(`FAIL to delete message ${err.stack}`);
            }
        });
    });   

}