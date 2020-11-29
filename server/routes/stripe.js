const express = require('express');
const router = express.Router();
const upgrade = require('../controllers/upgrade');

router.get('/create-intent', upgrade.createPaymentIntent);

module.exports = router;
