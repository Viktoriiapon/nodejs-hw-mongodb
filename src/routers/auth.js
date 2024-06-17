import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import { loginUserController, logoutUserController, refreshTokenController, registerUserController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
    '/login',
    validateBody(loginUserSchema),
    ctrlWrapper(loginUserController),
  );
  authRouter.post(
    '/refresh-token',
    ctrlWrapper(refreshTokenController),
  );
  authRouter.post(
    '/logout',
    ctrlWrapper(logoutUserController),
  );
 

export default authRouter;