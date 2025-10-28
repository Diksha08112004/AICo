const web3 = require('@solana/web3.js');

async function logActivity(activity) {
  return { ok: true, activity };
}

module.exports = { logActivity };
