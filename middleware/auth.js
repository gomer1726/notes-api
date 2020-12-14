const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/index').User;

/**
 * Check for valid token
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports = async function(req, res, next) {
    const token = req.header('x-auth-token');

    try {
        if (!token) res.status(403).json({message: "Unauthorized"});

        const decoded = jwt.verify(token, config.get('jwtSecret'));

        const user = await User.findByPk(decoded.user.id);

        if (user.sessionsTerminatedAt) {
            const terminatedAt = new Date(user.sessionsTerminatedAt).getTime() / 1000;
            if (terminatedAt > decoded.iat) res.status(403).json({ message: "Unauthorized" });
        }

        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Unauthorized" });
    }
};