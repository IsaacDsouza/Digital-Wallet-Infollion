const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { flaggedTransactions, totalBalances, topUsers, softDeleteUser, softDeleteTransaction } = require("../controllers/adminController");

/**
 * @swagger
 * /api/admin/flagged:
 *   get:
 *     summary: View flagged transactions
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of flagged transactions
 */
router.get("/flagged", auth, flaggedTransactions);

/**
 * @swagger
 * /api/admin/total-balances:
 *   get:
 *     summary: View total balance across users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total balance
 */
router.get("/total-balances", auth, totalBalances);

/**
 * @swagger
 * /api/admin/top-users:
 *   get:
 *     summary: View top users by balance
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top user list
 */
router.get("/top-users", auth, topUsers);


/**
 * @swagger
 * /api/admin/user/{username}:
 *   delete:
 *     summary: Soft delete a user account
 *     tags: [Admin]
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User soft-deleted
 */

router.delete("/user/:username", auth, softDeleteUser);

/**
 * @swagger
 * /api/admin/transaction/{id}:
 *   delete:
 *     summary: Soft delete a transaction
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction soft-deleted
 */
router.delete("/transaction/:id", auth, softDeleteTransaction);



module.exports = router;
