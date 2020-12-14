const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {validationResult} = require('express-validator');
const User = require('../models/index').User;
const helpers = require('../helpers/errorHandler');

/**
 * Get logged in user data
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 * @constructor
 */
exports.GetLoggedInUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}

/**
 * Login user and get token
 *
 * @param req
 * @param res
 * @returns {Promise<this>}
 * @constructor
 */
exports.Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {login, password} = req.body;

    try {
        let user = await User.findOne({ where: { login } });

        if (!user) throw new Error("INVALID_CREDENTIALS");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("INVALID_CREDENTIALS");

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: config.get('tokenLifetime'),
            },
            (err, token) => {
                if (err) throw err;
                res.json({token});
            },
        );
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}

/**
 * Terminate all user sessions
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @constructor
 */
exports.TerminateSessions = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) throw new Error("NOT_FOUND");

        await User.update({ sessionsTerminatedAt: new Date() }, {
            where: { id: user.id }
        });

        return res.status(200).send();
    } catch (e) {
        const error = helpers.handleErrors(e.message);
        return res.status(error.code).json({message: error.message});
    }
}