const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')

const authenticate = require("../controllers/authenticate");
const upgrade = require('../controllers/upgrade');

router.post('/webhook', bodyParser.raw({type: 'application/json'}), upgrade.webhook);

// requests to upgrade user should target valid user
router.use('/:player', authenticate.player);

router.get('/:player/intent', upgrade.intent);

module.exports = router;
