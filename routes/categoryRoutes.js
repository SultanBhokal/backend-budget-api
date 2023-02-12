import express from "express";
import isAuthenticated from "../middleware/auth.js";
import {
    getCategory,addCategory,deleteCategory,updateCategory,
    addCategoryFromLocalToDb
} from "../controllers/categoryController.js";
const router = express.Router();

// Category routes

router.route("/").get(isAuthenticated,getCategory);
router.route("/").post(isAuthenticated,addCategory);
router.route("/").put(isAuthenticated,updateCategory);
router.route("/").delete(isAuthenticated,deleteCategory);

router.route("/local").post(isAuthenticated,addCategoryFromLocalToDb)
// </Category routes>






export default router;