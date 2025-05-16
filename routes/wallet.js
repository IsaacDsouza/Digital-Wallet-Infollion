const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { deposit, withdraw, transfer, history } = require("../controllers/walletController");

/**
 * @swagger
 * /api/wallet/deposit:
 *   post:
 *     summary: Deposit cash
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Deposit successful
 */
router.post("/deposit", auth, deposit);

/**
 * @swagger
 * /api/wallet/withdraw:
 *   post:
 *     summary: Withdraw cash
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Withdrawal successful
 */
router.post("/withdraw", auth, withdraw);

/**
 * @swagger
 * /api/wallet/transfer:
 *   post:
 *     summary: Transfer cash to another user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [toUsername, amount]
 *             properties:
 *               toUsername:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transfer successful
 */
router.post("/transfer", auth, transfer);

/**
 * @swagger
 * /api/wallet/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of transactions
 */
router.get("/history", auth, history);


module.exports = router;
