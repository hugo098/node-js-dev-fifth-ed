import express from 'express';
import { NotesStore as notes } from '../app.mjs';
export const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  //... placeholder for Notes home page code
  try {
    const keylist = await notes.keylist();
    // console.log(`keylist ${util.inspect(keylist)}`);
    const keyPromises = keylist.map(key => {
      return notes.read(key);
    });
    const notelist = await Promise.all(keyPromises);
    // console.log(util.inspect(notelist));
    res.render('index', { title: 'Notes', notelist: notelist });
  } catch (err) {
    next(err);
  }

});

