

import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(20),
  password: Joi.string().min(3).max(10).required(),

});

// export const updateContactSchema = Joi.object({
//   name: Joi.string().min(3).max(20),
//   email: Joi.string().email().min(3).max(20),
//   phoneNumber: Joi.string().min(3).max(20),
//   isFavourite: Joi.boolean(),
//   contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),

// });