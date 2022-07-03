import Joi from "joi";

export const createSchema = Joi.object({
  name: Joi.string().required().label("--name"),
  cwd: Joi.string().optional().label("--cwd"),
  template: Joi.string().optional().label("--template"),
});
