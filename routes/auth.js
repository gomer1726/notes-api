const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check} = require('express-validator');
const AuthController = require('../controllers/AuthController');

// Get logged in user
router.get('/', auth, AuthController.GetLoggedInUser);

// Login
router.post(
    '/',
    [
        check('login', 'Required field').not().isEmpty(),
        check('password', 'Required field').exists(),
    ],
    AuthController.Login
);

// Terminate all sessions
router.post('/terminate/all', auth, AuthController.TerminateSessions);

module.exports = router;