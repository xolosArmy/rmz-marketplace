const localEcash = require('local-ecash');

// Locks the buyer token in an escrow. Validates Cashu proofs before locking.
async function lockFunds(buyerToken, escrowId, amount) {
  try {
    localEcash.validateCashuToken(buyerToken, amount);
    return localEcash.lock(buyerToken, escrowId);
  } catch (err) {
    throw new Error(`lockFunds failed: ${err.message}`);
  }
}

// Releases the escrowed token to the seller address.
async function releaseFunds(escrowId, sellerAddress, amount) {
  try {
    // In a real implementation, amount validation would occur here.
    return localEcash.release(escrowId, sellerAddress);
  } catch (err) {
    throw new Error(`releaseFunds failed: ${err.message}`);
  }
}

module.exports = {
  lockFunds,
  releaseFunds,
};
