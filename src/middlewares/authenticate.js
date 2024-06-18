import createHttpError from 'http-errors';
// import { registerUserController } from '../controllers/auth.js';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const header = req.get('Authorization');

  if (!header) {
    return next(createHttpError(401, 'Header is not provided'));
  }
  const [bearer, token ] = header.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Header should be of bearer type'));
  }
  const session = await Session.findOne({ accessToken: token });

  if(!session){
    return next(createHttpError(401, 'Session not found'));
  }

  if(Date.now() > session.accessTokenValidUntil){
    return next(createHttpError(401, 'Access token expired'))
  }

  const user = await User.findById(session.userId)
    if(!user){
       return next(createHttpError(401, 'User associated with this session is not found'));
      
  }
  req.user = user;
  return next();
};


