import {getLimit,setLimit,updateAmount} from '../controllers/limitController.js';
import express from "express";
import isAuthenticated from '../middleware/auth.js';

const router = express.Router();


router.route('/').get(isAuthenticated,getLimit);
router.route('/').post(isAuthenticated,setLimit);
router.route('/').put(isAuthenticated,updateAmount);

export default router;