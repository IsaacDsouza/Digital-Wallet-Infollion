const sendAlert = require("../utils/email");

(async () => {
  await sendAlert(
    "user@mail.com",
    "Fraud Detected",
    "A suspicious withdrawal of $10000 was detected on your wallet."
  );
})();
