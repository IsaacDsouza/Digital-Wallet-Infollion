const cron = require("node-cron");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const sendAlert = require("../utils/email");

const runFraudScan = async () => {
  const transactions = await Transaction.find({ flagged: false, deleted: false });

  let flaggedCount = 0;

  for (const tx of transactions) {
    let shouldFlag = false;

    // I made some rules 
    // Rule 1 is large withdrawal (only for USD)
    if (tx.type === "withdraw" && tx.currency === "USD" && tx.amount > 1000) {
      tx.flagged = true;
      tx.reason = "Daily scan: large USD withdrawal";
      shouldFlag = true;
    }

    // Rule 2 is excessive transfers in last 24 hrs
    else if (tx.type === "transfer") {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000); 
      const recentTransfers = await Transaction.find({
        from: tx.from,
        type: "transfer",
        currency: tx.currency,
        createdAt: { $gte: since },
        deleted: false,
      });

      if (recentTransfers.length >= 5) {
        tx.flagged = true;
        tx.reason = "Daily scan: 5+ transfers in 24 hours";
        shouldFlag = true;
      }
    }

    if (shouldFlag) {
      await tx.save();
      flaggedCount++;

      // email alert
      const user = await User.findOne({ _id: tx.from || tx.to, deleted: false });
      if (user) {
        await sendAlert(
          `${user.username}@gmail.com`,
          "Fraud Alert (Daily Scan)",
          `A suspicious ${tx.type} of $${tx.amount} ${tx.currency} was flagged.\nReason: ${tx.reason}`
        );
      }
    }
  }

  console.log(`✅ Daily fraud scan completed — ${flaggedCount} transactions flagged.`);
};

cron.schedule("0 2 * * *", runFraudScan);

module.exports = runFraudScan;
