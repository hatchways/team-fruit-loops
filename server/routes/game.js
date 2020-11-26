const express = require('express');
const router = express.Router();
const game = require('../controllers/game');

router.post('/', game.create);
router.get('/ping', game.display);
// This middleware validates game id for
// any type of HTTP request to the /:id path.
router.use('/:id', game.validateGameId);

router.get('/:id/ping', game.ping);

// Store method and parameters in res.locals and pass to last execution
// middleware.
router.put('/:id/join', game.join);
router.put('/:id/assign', game.assign, game.execute);
router.put('/:id/unassign', game.unassign, game.execute);
router.put('/:id/start', game.start, game.execute);
router.put('/:id/next-move', game.nextMove, game.execute);
router.put('/:id/end-turn', game.endTurn, game.execute);
router.put('/:id/restart', game.restart, game.execute);

module.exports = router;
