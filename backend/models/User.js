const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, index: true },
    passwordHash: { type: String },
    solanaWallet: { type: String },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
