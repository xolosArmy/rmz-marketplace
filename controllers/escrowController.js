const Escrow = require('../models/Escrow');
const ecashService = require('../services/ecashService');

// Creates a new Escrow document and locks funds using ecashService
async function lockEscrow(req, res) {
  try {
    const { orderId, buyer, seller, amountXEC, buyerToken } = req.body;
    const escrow = await Escrow.create({ orderId, buyer, seller, amountXEC });

    try {
      await ecashService.lockFunds(buyerToken, escrow._id, amountXEC);
    } catch (err) {
      escrow.status = 'DISPUTE';
      await escrow.save();
      return res.status(400).json({ error: err.message });
    }

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

    const token = await ecashService.releaseFunds(
      escrow._id,
      escrow.seller,
      escrow.amountXEC
    );

    res.json({ escrow, sellerToken: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  lockEscrow,
  releaseEscrow,
};
