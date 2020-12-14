const Note = require('../models/index').Note;
const {validationResult} = require('express-validator');
const helpers = require('../helpers/errorHandler');

/**
 * Get user's notes
 *
 * @param req
 * @param res
 * @returns {Promise<this>}
 * @constructor
 */
exports.UserNotes = async (req, res) => {
    try {
        let {limit = 10, offset = 0} = req.query;

        const notes = await Note.findAndCountAll({
            where: {
                userId: req.user.id
            },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        return res.status(200).json({totalCount: notes.count, notes: notes.rows});
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}

/**
 * Show public note
 *
 * @param req
 * @param res
 * @returns {Promise<this>}
 * @constructor
 */
exports.ShowPublic = async (req, res) => {
    try {
        const {id = null} = req.params;
        const note = await Note.findOne({where: {id, isPublic: true}});

        if (!note) throw new Error("NOT_FOUND");
        else return res.status(200).json(note);
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}

/**
 * Add no to database
 *
 * @param req
 * @param res
 * @returns {Promise<this>}
 * @constructor
 */
exports.Store = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }
        const note = await Note.create({
            userId: req.user.id,
            text: req.body.text,
            isPublic: req.body.isPublic
        });
        return res.status(201).json(note);
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}

/**
 * Update note
 *
 * @param req
 * @param res
 * @returns {Promise<this>}
 * @constructor
 */
exports.Update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()});
        }

        const {text, isPublic} = req.body;
        const {id} = req.params;

        let note = await Note.findByPk(id);

        if (!note) throw new Error("NOT_FOUND");
        if (note.userId !== req.user.id) throw new Error("FORBIDDEN");

        await Note.update({
            userId: req.user.id,
            text,
            isPublic
        }, {where: {id}});

        note = await Note.findByPk(id);

        return res.status(200).json(note);
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}

/**
 * Delete note from database
 *
 * @param req
 * @param res
 * @returns {Promise<this|*>}
 * @constructor
 */
exports.Destroy = async (req, res) => {
    try {
        const {id} = req.params;
        let note = await Note.findByPk(id);
        if (!note) throw new Error("NOT_FOUND");
        if (note.userId !== req.user.id) throw new Error("FORBIDDEN");

        await Note.destroy({where: {id}});
        return res.status(204).send();
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}

