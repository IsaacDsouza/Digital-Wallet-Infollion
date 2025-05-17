const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { deposit, withdraw, transfer, history } = require("../controllers/walletController");

/**
 * @swagger
 * /api/wallet/deposit:
 *   post:
 *     summary: Deposit digital cash into a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *           example:
 *             amount: 100
 *             currency: "USD"
 *     responses:
 *       200:
 *         description: Deposit successful
 */
router.post("/deposit", auth, deposit);

/**
 * @swagger
 * /api/wallet/withdraw:
 *   post:
 *     summary: Withdraw digital cash from the wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *           example:
 *             amount: 50
 *             currency: "USD"
 *     responses:
 *       200:
 *         description: Withdrawal successful
 */
router.post("/withdraw", auth, withdraw);

/**
 * @swagger
 * /api/wallet/transfer:
 *   post:
 *     summary: Transfer digital cash to another user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toUsername
 *               - amount
 *               - currency
 *             properties:
 *               toUsername:
 *                 type: string
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *           example:
 *             toUsername: "alice"
 *             amount: 75
 *             currency: "USD"
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post("/transfer", auth, transfer);

/**
 * @swagger
 * /api/wallet/history:
 *   get:
 *     summary: Get user's transaction history
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/history", auth, history);

module.exports = router;
