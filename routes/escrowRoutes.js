const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrowController');
const auth = require('../middleware/auth');

// Route to lock funds into escrow
router.post('/lock', auth, escrowController.lockEscrow);

// Route to release funds from escrow
router.post('/release', auth, escrowController.releaseEscrow);

module.exports = router;
