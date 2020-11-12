const express = require('express');
const router = express.Router();
const game = require('../controllers/game');

router.get('/:id/ping', game.ping);
router.post('/match', game.create);
router.put('/join', game.join);
router.put('/assign', game.assign);
router.put('/start', game.start);
router.put('/next', game.nextMove);

module.exports = router;
