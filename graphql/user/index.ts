import { createModule, gql } from 'graphql-modules';
import bcrypt from 'bcrypt';

import { User } from '../../models/user';
import { Post } from '../../models/post';
import { checkAuthentication } from '../../middleware/auth';

const userModule = createModule({
  id: 'user',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Query {
        users: UserList
        user(id: String!): UserResponse
      }
      type Mutation {
        createUser(username: String!, password: String!): UserResponse
        updateUser(
          id: String!
          username: String!
          password: String!
        ): UserResponse
        deleteUser(id: String!): UserResponse
      }
      type UserList {
        data: [User]
        error: String
      }
      type UserResponse {
        data: User
        error: String
      }
    `,
  ],
  resolvers: {
    Query: {
      users: async (root: any, args, { token }: { token: string }) => {
        try {
          const auth = checkAuthentication(token);
          if (auth.role !== 'admin') {
            throw Error('Forbidden!');
          }
          const users = await User.find({ _id: { $ne: auth.user_id } });
          return {
            data: users,
            error: '',
          };
        } catch (error) {
          return {
            data: null,
            error: error.message,
          };
        }
      },

      user: async (
        root: any,
        { id }: { id: string },
        { token }: { token: string }
      ) => {
        try {
          const auth = checkAuthentication(token);
          if (auth.role !== 'admin') {
            throw Error('Forbidden!');
          }
          const user = await User.findById(id);
          const posts = await Post.find({ user_id: id });
          return { data: { ...user.toJSON(), posts }, error: '' };
        } catch (error) {
          return {
            data: null,
            error: error.message,
          };
        }
      },
    },
    Mutation: {
      createUser: async (
        root: any,
        {
          username,
          password,
        }: {
          username: string;
          password: string;
        },
        { token }: { token: string }
      ) => {
        try {
          const auth = checkAuthentication(token);
          if (auth.role !== 'admin') {
            throw Error('Forbidden!');
          }
          if (!(username && password)) {
            return {
              data: null,
              error: 'Invalid credentials!',
            };
          }
          const oldUser = await User.findOne({ username });
          if (oldUser) {
            return {
              data: null,
              error: 'User with that username already exists!',
            };
          }
          const hashedPassword: string = await bcrypt.hash(password, 10);
          const user = await User.create({
            username,
            password: hashedPassword,
          });
          return {
            data: user,
            error: '',
          };
        } catch (error: any) {
          return {
            data: null,
            error: error.message,
          };
        }
      },
      updateUser: async (
        root: any,
        {
          id,
          username,
          password,
        }: {
          id: string;
          username: string;
          password: string;
        },
        { token }: { token: string }
      ) => {
        try {
          const user = checkAuthentication(token);
          if (user.role !== 'admin') {
            throw Error('Forbidden!');
          }
          const updatingUser = await User.findById(id);
          if (!updatingUser) {
            return {
              data: null,
              error: 'User not found!',
            };
          }
          if (!(username && password)) {
            return {
              data: null,
              error: 'Invalid credentials!',
            };
          }
          const existingUser = await User.findOne({
            username,
            _id: { $ne: id },
          });
          if (existingUser) {
            return {
              data: null,
              error: 'User with that username already exists!',
            };
          }
          const hashedPassword: string = await bcrypt.hash(password, 10);
          const updated = await User.findByIdAndUpdate(
            id,
            {
              username,
              password: hashedPassword,
            },
            { new: true }
          );
          const posts = await Post.find({ user_id: updated._id });
          return {
            data: { ...updated.toJSON(), posts },
            error: '',
          };
        } catch (error: any) {
          return {
            data: null,
            error: error.message,
          };
        }
      },
      deleteUser: async (
        root: any,
        { id }: { id: string },
        { token }: { token: string }
      ) => {
        try {
          const user = checkAuthentication(token);
          if (user.role !== 'admin') {
            throw Error('Forbidden!');
          }
          const deleted = await User.findByIdAndRemove(id);
          await Post.deleteMany({ user_id: id });
          if (!deleted) {
            return {
              data: null,
              error: 'User not found',
            };
          }
          return {
            data: deleted,
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

export { userModule };
