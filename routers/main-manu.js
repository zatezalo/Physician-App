const express = require('express');

const mainManuController = require('../controllers/main-manu');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/profile', isAuth, mainManuController.getProfile);


module.exports = router;