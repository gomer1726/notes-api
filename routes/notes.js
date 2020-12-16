const express = require('express');
const auth = require('../middleware/auth');
const NoteController = require('../controllers/NoteController');
const Note = require('../models/index').Note;

const router = express.Router();

// list note
router.get('/', auth, NoteController.UserNotes);

// show public note
router.get('/public/:id', NoteController.ShowPublic);

// add note
router.post('/', [auth, Note.rules()], NoteController.Store);

// update note
router.put('/:id', [auth, Note.rules()], NoteController.Update);

// delete note
router.delete('/:id', auth, NoteController.Destroy);

module.exports = router;