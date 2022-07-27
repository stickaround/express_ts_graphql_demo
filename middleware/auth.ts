import { Document } from 'mongoose';
import jwt from 'jsonwebtoken';

import { iPost } from '../models/post';

import { appConfig } from '../config/constants';

export const checkAuthentication = (token: string) => {
  if (token) {
    const jwtToken = token.split(' ')[1];
    try {
      return jwt.verify(jwtToken, appConfig.jwtKey) as {
        user_id: string;
        username: string;
        role: string;
      };
    } catch (err) {
      throw Error('Unauthenticated!');
    }
  } else {
    throw Error('Unauthenticated!');
  }
};

export const checkAuthorization = (
  user: { user_id: string; username: string; role: string },
  post: iPost
) => {
  if (user.role !== 'admin' && post.user_id.toString() !== user.user_id) {
    throw Error('Forbidden!');
  }
};
