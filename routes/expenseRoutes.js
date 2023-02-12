import express from "express";
import isAuthenticated from "../middleware/auth.js";
import {
    getExpenseAll,getExpenseByDate,addExpense,getExpenseByMonth,
    updateExpense,deleteExpense
} from "../controllers/expenseController.js";
const router = express.Router();




// Expense routes

router.route("/").get(isAuthenticated,getExpenseAll);
router.route("/").post(isAuthenticated,addExpense);
router.route("/").put(isAuthenticated,updateExpense);
router.route("/").delete(isAuthenticated,deleteExpense);
router.route("/expenseByDate").get(isAuthenticated,getExpenseByDate);
router.route("/expenseByMonth").get(isAuthenticated,getExpenseByMonth);





export default router;