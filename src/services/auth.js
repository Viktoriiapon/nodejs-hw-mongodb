import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import crypto from 'crypto';
import { Session } from '../db/models/session.js';

export const createUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  return await User.create({
    ...payload,
    password: hashedPassword,
  });
};

const createSession = () => {
  return {
    accessToken: crypto.randomBytes(10).toString('base64'),
    refreshToken: crypto.randomBytes(10).toString('base64'),
    accessTokenValidUntil: Date.now() + 1000 * 60 * 15,
    refreshTokenValidUntil: Date.now() + 1000 * 60 * 60 * 24 * 30,
  };
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email   });

  if (!user) {
    throw createHttpError(404, 'User is not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: user._id });  

  return await Session.create({
    userId: user._id,
    ...createSession(),
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found!!');
  }

  await Session.deleteOne({ _id: sessionId });

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired!');
  }

  // const user = await User.findById(session.userId);

  // if (!user) {
  //   throw createHttpError(401, 'Session for this user not found!');
  // }

 

  return await Session.create({
    userId: session.user._id,
    ...createSession(),
  });
};

export const logoutUser = async ({ sessionId, sessionToken }) => {
  return await Session.deleteOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};
