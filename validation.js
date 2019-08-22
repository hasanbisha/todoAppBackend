const Joi = require("@hapi/joi");

// Register Validation

const registerValidation = data => {
    const Schema = {
        name: Joi.string()
            .min(3)
            .required(),
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    };

    // Validate data before a user is created
    return Joi.validate(data, Schema);
}

const loginValidation = data => {
    const Schema = {
        email: Joi.string()
            .min(6)
            .required()
            .email(),
      password: Joi.string()
            .min(6)
            .required()
    }

    // Validate data before we login
    return Joi.validate(data, Schema);
}

const updateUserValidation = data => {
    const Schema = {
        name: Joi.string()
            .min(3)
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
        newPassword: Joi.string()
            .min(6)
            .required()
    };

    // Validate data before we update
    return Joi.validate(data, Schema);
}

module.exports.registerValidation = registerValidation;

module.exports.loginValidation = loginValidation;

module.exports.updateUserValidation = updateUserValidation;
