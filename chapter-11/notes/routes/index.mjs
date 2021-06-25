import express from 'express';
//import util from 'util';
//import { NotesStore as notes } from '../app.mjs';
import { NotesStore as notes } from '../models/notes-store.mjs';
export const router = express.Router();
import { twitterLogin } from './users.mjs';
import { io } from '../app.mjs';
import DBG from 'debug';
const debug = DBG('notes:home');
const error = DBG('notes:error-home');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const notelist = await getKeyTitlesList();
    res.render('index', {
      title: 'Notes', notelist: notelist,
      user: req.user ? req.user : undefined,
      twitterLogin
    });
  } catch (e) { next(e); }
});
async function getKeyTitlesList() {
  const keylist = await notes.keylist();
  const keyPromises = keylist.map(key => notes.read(key));
  const notelist = await Promise.all(keyPromises);
  return notelist.map(note => {
    return { key: note.key, title: note.title };
  });
};

export const emitNoteTitles = async () => {
  const notelist = await getKeyTitlesList();
  io.of('/home').emit('notetitles', { notelist });
};
export function init() {
  io.of('/home').on('connect', socket => {
    debug('socketio connection on /home');
  });
  notes.on('notecreated', emitNoteTitles);
  notes.on('noteupdated', emitNoteTitles);
  notes.on('notedestroyed', emitNoteTitles);
}

