const cron = require("node-cron");
const Transaction = require("../models/Transaction");

//Some Basic rules I set for the fraud scanner:
const runFraudScan = async () => {
  const transactions = await Transaction.find({ flagged: false });

  for (const tx of transactions) {
    if (tx.type === "withdraw" && tx.amount > 1000) {
      tx.flagged = true;
      tx.reason = "Daily scan: large withdrawal";
    } else if (tx.type === "transfer") {
      const recentTransfers = await Transaction.find({
        from: tx.from,
        type: "transfer",
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // I chose 24 hours for the daily scan
      });
      if (recentTransfers.length >= 5) {
        tx.flagged = true;
        tx.reason = "Daily scan: excessive transfers";
      }
    }
    await tx.save();
  }

  console.log("✅ Daily fraud scan completed");
};

// daily scan at 2am seems reasonable
cron.schedule("0 2 * * *", runFraudScan);

module.exports = runFraudScan;
