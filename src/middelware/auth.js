import jwt from 'jsonwebtoken';
import { User } from '../models/users.js';
import { makeResponse, statusCodes, responseMessages } from '../helpers/index.js';
const { AUTH_ERROR, INVALID_REQUEST, SERVER_ERROR } = statusCodes;

export default async (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers.authorization;
  if (!token) {
    return makeResponse(res, AUTH_ERROR, false, responseMessages.AUTH_TOKEN_MISSING);
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    // Attach the decoded user information to the request object
      console.log(decoded);
       
    if (decoded.id) {
      // Try to find the user by ID And Delete Status
      try {
       const userExist = await User.findOne({ where: { id:decoded.id } });
        if (!userExist) {
          return makeResponse(res, INVALID_REQUEST, false, responseMessages.USER_NOT_FOUND);
        }
        req.user = decoded;
       return next(); // Token is valid, proceed to the next middleware
      } catch (error) {
        res.locals.success = false;
        return makeResponse(res, SERVER_ERROR, false, responseMessages.INTERNAL_SERVER_ERROR);
      }
     
    }
    return makeResponse(res, AUTH_ERROR, false, responseMessages.USER_NOT_FOUND);
  } catch (error) {
    // Include a success flag in the response
    res.locals.success = false;
    return makeResponse(res, AUTH_ERROR, false, error ?? responseMessages.AUTH_TOKEN_MISSING);
  }
};
