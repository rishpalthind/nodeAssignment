import bcrypt from "bcrypt";
import { User } from "../models/users.js";
import { generateToken } from "../utils/jwt.js";

import { makeResponse, statusCodes, responseMessages } from '../helpers/makeResponse/index.js';
const { SUCCESS, BAD_REQUEST, SERVER_ERROR, AUTH_ERROR, NOT_FOUND } = statusCodes;
const MAX_CLAIM_COINS = process.env.MAX_CLAIM_COINS || 10;

// Controller for register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return makeResponse(res, BAD_REQUEST, false, responseMessages.USER_EXIST);
      }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    return makeResponse(res, SUCCESS, true, responseMessages.USER_CREATE);
  } catch (err) {
        return makeResponse(res, SERVER_ERROR, false, responseMessages.INTERNAL_SERVER_ERROR, err);
  }
};


// Controller for login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user)
        return makeResponse(res, NOT_FOUND, false, responseMessages.USER_NOT_FOUND);
    
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return makeResponse(res, AUTH_ERROR, false, responseMessages.INVALID_CRED);

        const token = generateToken(user);
        res.json({ token });
      } catch (err) {
        return makeResponse(res, SERVER_ERROR, false, responseMessages.INTERNAL_SERVER_ERROR, err);
      }
  };


  // Controller for claim coins
export const claimCoins = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return makeResponse(res, BAD_REQUEST, false, responseMessages.USER_ID_REQUIRED);
    
    const user = await User.findByPk(userId);
    if (!user)
    return makeResponse(res, NOT_FOUND, false, responseMessages.USER_NOT_FOUND);

    if (user.balance <= 0) {
      return makeResponse(res, BAD_REQUEST, false, responseMessages.NO_COINS_TO_CLAIM);
    }

    const claimable = Math.min(user.balance, MAX_CLAIM_COINS);

    user.balance -= claimable;
    await user.save();

    return res.status(200).json({
      message: `✅ Claimed ${claimable} coin(s) successfully.`,
      claimed: claimable,
      remainingBalance: user.balance,
    });

  } catch (err) {
    console.error("Claiming error:", err);
    return makeResponse(res, SERVER_ERROR, false, responseMessages.INTERNAL_SERVER_ERROR, err);
  }
};