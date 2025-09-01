import { validationResult } from "express-validator";

export function runValidations(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: result.array().map(e => ({
        field: e.path,
        msg: e.msg
      }))
    });
  }
  next();
}
