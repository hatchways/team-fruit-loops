const express = require('express');
const router = express.Router();
const game = require('../controllers/game');

router.get('/:id/ping', game.ping);
router.post('/', game.create);
router.put('/:id/join', game.join);
router.put('/:id/assign', game.assign);
router.put('/:id/start', game.start);
router.put('/:id/next-move', game.nextMove);
router.put('/:id/end-turn', game.endTurn);
router.put('/:id/restart', game.restart);

module.exports = router;
