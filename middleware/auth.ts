import jwt from 'jsonwebtoken';

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

// export const isAdmin = (token) => {
//   const auth = checkAuthorization(token);

//   if (auth.role !== 'admin') {
//     throw Error('Forbidden');
//   }
// };
