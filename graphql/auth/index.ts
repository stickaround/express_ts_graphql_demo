import { createModule, gql } from 'graphql-modules';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../../models/user';

import { appConfig } from '../../config/constants';
import { checkAuthentication } from '../../middleware/auth';

const authModule = createModule({
  id: 'auth',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Mutation {
        login(username: String!, password: String!): AuthResponse
        register(username: String!, password: String!): AuthResponse
      }
      type Query {
        getProfile: UserResponse
      }
      type User {
        _id: String!
        username: String
        role: String
        posts: [Post!]
      }
      type UserResponse {
        data: User
        error: String
      }
      type AuthResponse {
        data: User
        token: String!
        error: String
      }
    `,
  ],
  resolvers: {
    Mutation: {
      register: async (
        root,
        {
          username,
          password,
        }: {
          username: string;
          password: string;
        }
      ) => {
        try {
          if (!(username && password)) {
            return {
              data: null,
              token: '',
              error: 'Invalid credentials!',
            };
          }
          const oldUser = await User.findOne({ username });
          if (oldUser) {
            return {
              data: null,
              token: '',
              error: 'User with that username already exists!',
            };
          }
          const hashedPassword: string = await bcrypt.hash(password, 10);
          const user = await User.create({
            username,
            password: hashedPassword,
          });
          const token = jwt.sign(
            {
              user_id: user._id,
              username: user.username,
              role: user.role,
            },
            appConfig.jwtKey,
            { expiresIn: '2d' }
          );
          return {
            data: user,
            token,
            error: '',
          };
        } catch (error: any) {
          return {
            data: null,
            token: '',
            error: error.message,
          };
        }
      },
      login: async (
        root,
        {
          username,
          password,
        }: {
          username: string;
          password: string;
        }
      ) => {
        try {
          if (!(username && password)) {
            return {
              data: null,
              token: '',
              error: 'Invalid credentials!',
            };
          }
          const user = await User.findOne({ username });
          if (!user) {
            return {
              data: null,
              token: '',
              error: 'Invalid credentials!',
            };
          }

          const match: boolean = await bcrypt.compare(password, user.password);

          if (!match) {
            return {
              data: null,
              token: '',
              error: 'Invalid credentials!',
            };
          }
          const token = jwt.sign(
            {
              user_id: user._id,
              username: user.username,
              role: user.role,
            },
            appConfig.jwtKey,
            {
              expiresIn: '2d',
            }
          );
          return {
            data: user,
            token,
            error: '',
          };
        } catch (error) {
          return {
            data: null,
            token: '',
            error: error.message,
          };
        }
      },
    },
    Query: {
      getProfile: async (
        params: any,
        args: any,
        { token }: { token: string }
      ) => {
        try {
          const auth = checkAuthentication(token);
          const user = await User.findById(auth.user_id);
          if (!user) {
            return {
              data: null,
              error: 'Not found!',
            };
          }
          return {
            data: user,
            error: '',
          };
        } catch (error) {
          return {
            data: null,
            error: error.message,
          };
        }
      },
    },
  },
});

export { authModule };
