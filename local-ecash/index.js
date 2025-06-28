function validateCashuToken(token, expectedAmount) {
  if (!token || typeof token !== 'object') {
    throw new Error('Token missing');
  }
  if (!Array.isArray(token.proofs) || token.proofs.length === 0) {
    throw new Error('Invalid proofs');
  }
  if (token.amount !== expectedAmount) {
    throw new Error('Amount mismatch');
  }
  return true;
}

function lock(token, escrowId) {
  // In a real implementation this would lock the token into an escrow account
  return { escrowId, lockedToken: token };
}

function release(escrowId, address) {
  // In a real implementation this would release funds to the seller address
  return { escrowId, releasedTo: address };
}

module.exports = { validateCashuToken, lock, release };
