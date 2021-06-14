//import * as util from 'util';
import { default as express } from 'express';
//import { NotesStore as notes } from '../app.mjs';
import { NotesStore as notes } from '../models/notes-store.mjs';
export const router = express.Router();

// Add Note
router.get('/add', (req, res, next) => {
    res.render('noteedit', {
        title: "Add a Note",
        docreate: true,
        notekey: '',
        note: undefined
    });
});

// Save Note(update)
router.post('/save', async (req, res, next) => {
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
    try {
        let note = await notes.read(req.query.key.trim());
        res.render('noteview', {
            title: note ? note.title : "",
            notekey: req.query.key,
            note: note
        });
    } catch (err) {
        next(err);
    }
});

router.get('/edit', async (req, res, next) => {
    try {
        let note = await notes.read(req.query.key);
        res.render('noteedit', {
            title: note ? ("Edit " + note.title) : "Add a note",
            docreate: false,
            notekey: req.query.key,
            note: note
        });
    } catch (err) {
        next(err);
    }
});

router.get('/destroy', async (req, res, next) => {
    try {
        const note = await notes.read(req.query.key);
        res.render('notedestroy', {
            title: note ? `Delete ${note.title}` : "",
            notekey: req.query.key,
            note: note
        });
    } catch (err) {
        next(err);
    }
});

// Really destroy note (destroy)
router.post('/destroy/confirm', async(req, res, next)=>{
    try{
        await notes.destroy(req.body.notekey);
        res.redirect('/');
    }catch(err){
        next(err);
    }
});