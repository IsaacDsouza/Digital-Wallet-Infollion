const User = require("../models/User");
const Transaction = require("../models/Transaction");
const sendAlert = require("../utils/email");

const checkForFraud = async (transaction) => {
  const { type, amount, from, to, currency } = transaction;

  if (type === "withdraw" && currency === "USD" && amount > 1000) {
    transaction.flagged = true;
    transaction.reason = "Large withdrawal";
  }

  if (type === "transfer" && from) {
    const recentTransfers = await Transaction.find({
      from,
      type: "transfer",
      currency,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
      deleted: false,
    });

    if (recentTransfers.length >= 3) {
      transaction.flagged = true;
      transaction.reason = "Multiple rapid transfers";
    }
  }

  await transaction.save();

  if (transaction.flagged) {
    const userId = from || to;
    const user = await User.findOne({ _id: userId, deleted: false });
    if (user) {
      await sendAlert(
        `${user.username}@gmail.com`,
        "Fraud Alert",
        `Suspicious ${transaction.type} of $${transaction.amount} ${currency} was flagged.\nReason: ${transaction.reason}`
      );
    }
  }
};

exports.deposit = async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
  if (!currency) return res.status(400).json({ message: "Currency is required" });

  const user = await User.findOne({ _id: req.user.id, deleted: false });
  if (!user) return res.status(404).json({ message: "User not found or deleted" });

  const current = user.balances.get(currency) || 0;
  user.balances.set(currency, current + amount);
  await user.save();

  const tx = new Transaction({ type: "deposit", to: user._id, amount, currency });
  await checkForFraud(tx);

  res.json({
    message: `Deposit successful`,
    currency,
    newBalance: user.balances.get(currency)
  });
};

exports.withdraw = async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
  if (!currency) return res.status(400).json({ message: "Currency is required" });

  const user = await User.findOne({ _id: req.user.id, deleted: false });
  if (!user) return res.status(404).json({ message: "User not found or deleted" });

  const currentBalance = user.balances.get(currency) || 0;
  if (currentBalance < amount) return res.status(400).json({ message: "Insufficient funds" });

  user.balances.set(currency, currentBalance - amount);
  await user.save();

  const tx = new Transaction({ type: "withdraw", from: user._id, amount, currency });
  await checkForFraud(tx);

  res.json({ message: "Withdrawal successful", currency, newBalance: user.balances.get(currency) });
};

exports.transfer = async (req, res) => {
  const { toUsername, amount, currency } = req.body;

  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
  if (!currency) return res.status(400).json({ message: "Currency is required" });

  const sender = await User.findOne({ _id: req.user.id, deleted: false });
  const recipient = await User.findOne({ username: toUsername, deleted: false });

  if (!sender || !recipient) return res.status(404).json({ message: "Sender or recipient not found or deleted" });

  const senderBalance = sender.balances.get(currency) || 0;
  if (senderBalance < amount) return res.status(400).json({ message: "Insufficient funds" });

  sender.balances.set(currency, senderBalance - amount);
  recipient.balances.set(currency, (recipient.balances.get(currency) || 0) + amount);

  await sender.save();
  await recipient.save();

  const tx = new Transaction({
    type: "transfer",
    from: sender._id,
    to: recipient._id,
    amount,
    currency
  });

  await checkForFraud(tx);

  res.json({ message: "Transfer successful", currency, senderBalance: sender.balances.get(currency) });
};

exports.history = async (req, res) => {
  const txs = await Transaction.find({
    $or: [{ from: req.user.id }, { to: req.user.id }],
    deleted: false
  }).sort({ createdAt: -1 });

  res.json(txs);
};
