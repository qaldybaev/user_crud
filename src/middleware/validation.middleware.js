import { BaseExceptionError } from "../exception/base.exception.js";

export const ValidationMiddleware = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body);

        if (error) {
            return next(new BaseExceptionError(error.message, 400));
        }

        req.body = value;
        next(); 
    };
};
