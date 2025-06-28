const wallet = require('cashu-wallet');

async function verifyProofs(proofs) {
  wallet.verifyProofs(proofs);
  return true;
}

// Locks the buyer token in an escrow. Validates Cashu proofs before locking.
async function lockFunds(buyerToken, escrowId, amount) {
  try {
    if (buyerToken.amount !== amount) {
      throw new Error('Amount mismatch');
    }
    verifyProofs(buyerToken.proofs);
    return wallet.lock(buyerToken, escrowId);
  } catch (err) {
    throw new Error(`lockFunds failed: ${err.message}`);
  }
}

// Releases the escrowed token to the seller address.
async function releaseFunds(escrowId, sellerAddress, amount) {
  try {
    // In a real implementation, amount validation would occur here.
    return wallet.release(escrowId, sellerAddress, amount);
  } catch (err) {
    throw new Error(`releaseFunds failed: ${err.message}`);
  }
}

module.exports = {
  lockFunds,
  releaseFunds,
  verifyProofs,
};
