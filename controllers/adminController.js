const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.flaggedTransactions = async (req, res) => {
  const flagged = await Transaction.find({ flagged: true });
  res.json(flagged);
};

exports.totalBalances = async (req, res) => {
  const users = await User.find();
  const total = users.reduce((sum, user) => sum + user.balance, 0);
  res.json({ total });
};

exports.topUsers = async (req, res) => {
  const top = await User.find().sort({ balance: -1 }).limit(5);
  res.json(top);
};
exports.softDeleteUser = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });

  if (!user) return res.status(404).json({ message: "User not found" });

  user.deleted = true;
  await user.save();

  res.json({ message: `User ${username} soft-deleted` });
};

