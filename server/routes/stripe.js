const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')

const authenticate = require("../controllers/authenticate");
const stripe = require('../controllers/stripe');

router.post('/webhook', bodyParser.raw({type: 'application/json'}), stripe.webhook);

// requests to stripe user should target valid user
router.use('/:player', authenticate.player);

router.get('/:player/intent', stripe.intent);

router.get('/:player/private-enabled', stripe.privateGamesEnabled);

module.exports = router;
