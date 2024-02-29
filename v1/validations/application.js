const joi = require("joi");

const validateSchema = async (inputs, schema) => {
  try {
    let { error, _ } = schema.validate(inputs);
    if (error) throw error.details ? error.details[0].message.replace(/['"]+/g, "") : "";
    else return false;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  validateCreate: async (req, property) => {
    const schema = joi.object({
      name: joi.string().required(),
      phone: joi.string().pattern(/^[0-9]{10}$/).required()
        .messages({
          'string.pattern.base': `"phone" must be a 10 digit number`
        }),
      email: joi.string().email().required()
        .messages({
          'string.email': `"email" must be a valid email address`
        }),
      dob: joi.string().regex(/^([0-2][0-9]|(3)[0-1])\/(((0)[0-9])|((1)[0-2]))\/\d{4}$/).required()
        .messages({
          'string.pattern.base': `"dob" should be in DD/MM/YYYY format`
        }),
      description: joi.string().required(),
      address: joi.object({
        address: joi.string().required(),
        city:  joi.string().required(),
        state:  joi.string().required(),
        district:  joi.string().required(),
        country:  joi.string().required(),
        zip:  joi.string().required(),
      })
    });
    return await validateSchema(req[property], schema);
  },
  validateUpdate: async (req, property) => {
    const schema = joi.object({
      name: joi.string().optional(),
      phone: joi.string().pattern(/^[0-9]{10}$/).optional()
        .messages({
          'string.pattern.base': `"phone" must be a 10 digit number`
        }),
      email: joi.string().email().optional()
        .messages({
          'string.email': `"email" must be a valid email address`
        }),
      dob: joi.string().regex(/^([0-2][0-9]|(3)[0-1])\/(((0)[0-9])|((1)[0-2]))\/\d{4}$/).optional()
        .messages({
          'string.pattern.base': `"dob" should be in DD/MM/YYYY format`
        }),
      description: joi.string().optional(),
      address: joi.object({
        address: joi.string().optional(),
        city:  joi.string().optional(),
        state:  joi.string().optional(),
        district:  joi.string().optional(),
        country:  joi.string().optional(),
        zip:  joi.string().optional(),
      })
    });
    return await validateSchema(req[property], schema);
  },
};
