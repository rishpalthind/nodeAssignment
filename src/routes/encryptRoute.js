import express from 'express';
import * as encryptionController from '../controller/encryptionController.js';

import { validators } from '../middelware/validateResource/index.js';
const router = express.Router();

// Get all users
router.post("/encrypt",  validators('ENCRYPT'), encryptionController.encryptData);
router.post("/decrypt", validators('DECRYPT'), encryptionController.decryptData);

export default router;
