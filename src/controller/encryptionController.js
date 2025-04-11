import { encrypt, decrypt } from '../utils/encryption.js';

import { makeResponse, statusCodes, responseMessages } from '../helpers/makeResponse/index.js';
const { SUCCESS, SERVER_ERROR } = statusCodes;


// Controller for register new user
export const encryptData = async (req, res) => {
  try {
    const { data } = req.body;
    const encrypted = encrypt(data);
    res.json(encrypted);
    return makeResponse(res, SUCCESS, true, responseMessages.DATA_ENCRYPT);
  } catch (err) {
    return makeResponse(res, SERVER_ERROR, false, responseMessages.INTERNAL_SERVER_ERROR, err);
  }
};


// Controller for login user
export const decryptData = async (req, res) => {
  try {
    const { iv, encryptedData } = req.body;
    const decrypted = decrypt(iv, encryptedData);
    res.json({ decrypted });
  } catch (err) {
    return makeResponse(res, SERVER_ERROR, false, responseMessages.INTERNAL_SERVER_ERROR, err);
  }
};
