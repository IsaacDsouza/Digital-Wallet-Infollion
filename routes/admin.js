const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  flaggedTransactions,
  totalBalances,
  topUsers,
  softDeleteUser,
  softDeleteTransaction
} = require("../controllers/adminController");

/**
 * @swagger
 * /api/admin/flagged:
 *   get:
 *     summary: View all flagged transactions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flagged transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get("/flagged", auth, flaggedTransactions);

/**
 * @swagger
 * /api/admin/total-balances:
 *   get:
 *     summary: View total balances per currency
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total balance across all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *               example:
 *                 USD: 10500
 *                 EUR: 2500
 */
router.get("/total-balances", auth, totalBalances);

/**
 * @swagger
 * /api/admin/top-users:
 *   get:
 *     summary: View top users by total wallet value
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   total:
 *                     type: number
 */
router.get("/top-users", auth, topUsers);

/**
 * @swagger
 * /api/admin/user/{username}:
 *   delete:
 *     summary: Soft delete a user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user to soft-delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User soft-deleted
 *       404:
 *         description: User not found
 */
router.delete("/user/:username", auth, softDeleteUser);

/**
 * @swagger
 * /api/admin/transaction/{id}:
 *   delete:
 *     summary: Soft delete a transaction
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Transaction ID to soft-delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction soft-deleted
 *       404:
 *         description: Transaction not found
 */
router.delete("/transaction/:id", auth, softDeleteTransaction);

module.exports = router;
