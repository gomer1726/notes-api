const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const UserController = require('../controllers/UserController');

// Register user
router.post(
    '/',
    [
        check('login', 'Required field').not().isEmpty(),
        check('password','Minimum 6 characters').isLength({min: 6}),
    ],
    UserController.Register
);

module.exports = router;