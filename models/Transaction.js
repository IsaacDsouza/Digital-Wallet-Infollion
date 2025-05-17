const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["deposit", "withdraw", "transfer"] },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  currency: { type: String, required: true },
  amount: Number,
  createdAt: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false },
  reason: String,
  deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
