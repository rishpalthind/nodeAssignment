import Joi from "joi";


// Validation Cases
export const validationSchema = (action) => {
  switch (action) {
    case "REGISTER_USER": {
      return {
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.any().required(),
      };
    }

    case "LOGIN": {
      return {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      };
    }
    case "ENCRYPT": {
      return {
        data: Joi.any().required(),
      };
    }
    case "DECRYPT": {
      return {
        iv: Joi.any().required(),
        encryptedData: Joi.any().required(),
      };
    }

    case "CLAIM_COINS": {
      return {
        coins: Joi.number().greater(0).less(10).required(),
      };
    }
 

  }
  return {};
};

