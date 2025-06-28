const Escrow = require('../models/Escrow');
const ecashService = require('../services/ecashService');

// Creates a new Escrow document and locks funds using ecashService
async function lockEscrow(req, res) {
  try {
    const { orderId, buyer, seller, amountXEC } = req.body;
    const escrow = await Escrow.create({ orderId, buyer, seller, amountXEC });

    // Call to lock funds (implementation pending)
    ecashService.lockFunds(buyer, escrow._id, amountXEC);

    res.status(201).json(escrow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Releases funds from escrow and updates status
async function releaseEscrow(req, res) {
  try {
    const { escrowId } = req.body;
    const escrow = await Escrow.findById(escrowId);
    if (!escrow) return res.status(404).json({ error: 'Escrow not found' });

    escrow.status = 'RELEASED';
    await escrow.save();

    // Call to release funds (implementation pending)
    ecashService.releaseFunds(escrow._id, escrow.seller, escrow.amountXEC);

    res.json(escrow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  lockEscrow,
  releaseEscrow,
};
