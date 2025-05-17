const User = require("../models/User");
const Transaction = require("../models/Transaction");
const sendAlert = require("../utils/email");

// Helper function to check for fraud
const checkForFraud = async (transaction) => {
  const { type, amount, from, to } = transaction;

  if (type === "withdraw" && amount > 1000) {
    transaction.flagged = true;
    transaction.reason = "Large withdrawal";
  }

  if (type === "transfer" && from) {
    const recentTransfers = await Transaction.find({
      from,
      type: "transfer",
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) }, // past 1 minute
      deleted: false
    });

    if (recentTransfers.length >= 3) {
      transaction.flagged = true;
      transaction.reason = "Multiple rapid transfers";
    }
  }

  await transaction.save();

  // Fetch user and send fraud alert (use from or to for recipient)
  if (transaction.flagged) {
    const userId = from || to;
    const user = await User.findOne({ _id: userId, deleted: false });
    if (user) {
      await sendAlert(
        `${user.username}@gmail.com`,
        "Fraud Alert",
        `Suspicious ${transaction.type} of $${transaction.amount} flagged. Reason: ${transaction.reason}`
      );
    }
  }
};

exports.deposit = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const user = await User.findOne({ _id: req.user.id, deleted: false });
  if (!user) return res.status(404).json({ message: "User not found or deleted" });

  user.balance += amount;
  await user.save();

  const tx = new Transaction({ type: "deposit", to: user._id, amount });
  await checkForFraud(tx);

  res.json({ message: "Deposit successful", newBalance: user.balance });
};

exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const user = await User.findOne({ _id: req.user.id, deleted: false });
  if (!user) return res.status(404).json({ message: "User not found or deleted" });

  if (user.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

  user.balance -= amount;
  await user.save();

  const tx = new Transaction({ type: "withdraw", from: user._id, amount });
  await checkForFraud(tx);

  res.json({ message: "Withdrawal successful", newBalance: user.balance });
};

exports.transfer = async (req, res) => {
  const { toUsername, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const sender = await User.findOne({ _id: req.user.id, deleted: false });
  const recipient = await User.findOne({ username: toUsername, deleted: false });

  if (!sender || !recipient) return res.status(404).json({ message: "Sender or recipient not found or deleted" });
  if (sender.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

  sender.balance -= amount;
  recipient.balance += amount;

  await sender.save();
  await recipient.save();

  const tx = new Transaction({
    type: "transfer",
    from: sender._id,
    to: recipient._id,
    amount,
  });
  await checkForFraud(tx);

  res.json({ message: "Transfer successful", senderBalance: sender.balance });
};

exports.history = async (req, res) => {
  const txs = await Transaction.find({
    $or: [{ from: req.user.id }, { to: req.user.id }],
    deleted: false
  }).sort({ createdAt: -1 });

  res.json(txs);
};
