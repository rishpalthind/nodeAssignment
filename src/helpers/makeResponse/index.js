export const responseMessages = {
  USER_NOT_FOUND: "User not found",
  USER_LOGIN_SUCCESS: "You are successfully logged in",
  USER_FOUND: "User found successfully",
  USER_CREATE: "User created successfully",
  USER_EXIST: "User already exist",
  INVALID_CRED: "Invalid credentials",
  DATA_ENCRYPT: "Data encrypted successfully",
  DATA_DECRYPT: "Data decrypt successfully",
  AUTH_TOKEN_MISSING: "Authorization token missing",
  AUTH_TOKEN_INVALID: "Invalid authorization token",
  NO_COINS_TO_CLAIM: "No mined coins available to claim",
  USER_ID_REQUIRED: "User ID is required",
};

export const notificationPayload = {};

export const statusCodes = {
  SUCCESS: 200,
  RECORD_CREATED: 201,
  RECORD_NOT_FOUND: 204,
  RECORD_ALREADY_REPORTED: 208,
  BAD_REQUEST: 400,
  AUTH_ERROR: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INVALID_REQUEST: 405,
  UNPROCESSABLE: 422,
  RECORD_ALREADY_EXISTS: 409,
  SERVER_ERROR: 500,
};

  const makeResponse = async (
    res,
    statusCode,
    success,
    message,
    payload = null,
  ) =>
    new Promise((resolve) => {
      const responseObj = {
        success,
        code: statusCode,
      };

      if (message !== null) {
        responseObj.message = message;
      }
  
      if (payload !== null) {
        responseObj.data = payload;
      }
  
      res.status(statusCode).send(responseObj);
      resolve(statusCode);
    });

export { makeResponse };
