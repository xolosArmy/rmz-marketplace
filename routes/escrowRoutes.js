const express = require('express');
const router = express.Router();
const escrowController = require('../controllers/escrowController');

// Route to lock funds into escrow
router.post('/lock', escrowController.lockEscrow);

// Route to release funds from escrow
router.post('/release', escrowController.releaseEscrow);

module.exports = router;
