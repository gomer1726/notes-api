const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {validationResult} = require('express-validator');
const User = require('../models/index').User;
const helpers = require('../helpers/errorHandler');

/**
 * Add user to database
 *
 * @param req
 * @param res
 * @returns {Promise<this>}
 * @constructor
 */
exports.Register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const {login, password} = req.body;

    try {
        let user = await User.findOne({ where: { login } });

        if (user) throw new Error("ALREADY_EXISTS");

        user = User.build({
            login,
            password,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

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
        return helpers.handleErrors(res, e);
    }
};