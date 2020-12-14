const express = require('express');
const auth = require('../middleware/auth');
const NoteController = require('../controllers/NoteController');
const {check} = require('express-validator');

const router = express.Router();

// list note
router.get('/', auth, NoteController.UserNotes);

// show note
router.get('/public/:id', NoteController.ShowPublic);

// add note
router.post('/', [auth, [
    check('text', 'Required field').not().isEmpty(),
    check('text', 'Maximum 1000 characters').isLength({max: 1000}),
    check('isPublic').optional()
]], NoteController.Store);

// update note
router.put('/:id', [auth, [
    check('text', 'Required field').not().isEmpty(),
    check('text', 'Maximum 1000 characters').isLength({max: 1000}),
    check('isPublic').optional()
]], NoteController.Update);

// delete note
router.delete('/:id', auth, NoteController.Destroy);

module.exports = router;