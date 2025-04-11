import express from 'express';
import * as userController from '../controller/userController.js';
import authMiddleware from '../middelware/auth.js';

import { validators } from '../middelware/validateResource/index.js';
const router = express.Router();

// Get all users
router.post("/register",  validators('REGISTER_USER'), userController.register);
router.post("/login", validators('LOGIN'), userController.login);
router.post("/mine/claim", authMiddleware, validators('CLAIM_COINS'), userController.claimCoins);

export default router;
