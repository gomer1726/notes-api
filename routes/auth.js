const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const AuthController = require('../controllers/AuthController');
const User = require('../models/index').User;

// Get logged in user
router.get('/', auth, AuthController.GetLoggedInUser);

// Login
router.post('/', User.loginRules(), AuthController.Login);

// Terminate all sessions
router.post('/terminate/all', auth, AuthController.TerminateSessions);

module.exports = router;