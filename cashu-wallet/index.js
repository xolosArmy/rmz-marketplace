function verifyProofs(proofs) {
  if (!Array.isArray(proofs) || proofs.length === 0) {
    throw new Error('Invalid proofs');
  }
  return true;
}

function lock(token, escrowId) {
  return { escrowId, lockedToken: token };
}

function release(escrowId, address) {
  return { escrowId, releasedTo: address };
}

module.exports = { verifyProofs, lock, release };
