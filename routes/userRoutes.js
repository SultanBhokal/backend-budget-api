import express from "express";
import {registerUser,loginUser,logoutUser,isLogin} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(isLogin)
router.route("/logout").get(logoutUser);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router;