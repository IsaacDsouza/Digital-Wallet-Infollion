const User = require("../models/User");
const Transaction = require("../models/Transaction");
const sendAlert = require("../utils/email"); 

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
      createdAt: { $gte: new Date(Date.now() - 60000) }, 
    });
    if (recentTransfers.length >= 3) {
      transaction.flagged = true;
      transaction.reason = "Multiple transfers in short time";
    }
  }

  await transaction.save();

  if (transaction.flagged) {
    const user = await User.findById(from || to);
    if (user) {
      await sendAlert(
        `${user.username}@gmail.com`, 
        "Fraud Alert",
        `A suspicious ${transaction.type} of $${transaction.amount} was flagged. Reason: ${transaction.reason}`
      );
    }
  }
};

exports.deposit = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const user = await User.findById(req.user.id);
  user.balance += amount;
  await user.save();

  const tx = new Transaction({ type: "deposit", to: user._id, amount });
  await checkForFraud(tx);

  res.json({ message: "Deposit successful" });
};

exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const user = await User.findById(req.user.id);
  if (user.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

  user.balance -= amount;
  await user.save();

  const tx = new Transaction({ type: "withdraw", from: user._id, amount });
  await checkForFraud(tx);

  res.json({ message: "Withdrawal successful" });
};

exports.transfer = async (req, res) => {
  const { toUsername, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

  const sender = await User.findById(req.user.id);
  const recipient = await User.findOne({ username: toUsername });

  if (!recipient) return res.status(404).json({ message: "Recipient not found" });
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

  res.json({ message: "Transfer successful" });
};

exports.history = async (req, res) => {
  const txs = await Transaction.find({
    $or: [{ from: req.user.id }, { to: req.user.id }],
  }).sort({ createdAt: -1 });

  res.json(txs);
};
