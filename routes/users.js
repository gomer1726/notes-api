const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const User = require('../models/index').User;

// Register user
router.post('/', User.storeRules(), UserController.Register);

module.exports = router;