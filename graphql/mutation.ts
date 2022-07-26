import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Post } from '../models/post';
import { User } from '../models/user';
import { appConfig } from '../config/constants';

const mutation = {
  createPost: async (
    { title, content }: { title: string; content: string },
    context: any
  ) => {
    try {
      const post = await Post.create({ title, content });

      return {
        data: post,
        error: '',
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
      };
    }
  },

  updatePost: async (
    { id, title, content }: { id: string; title: string; content: string },
    context: any
  ) => {
    const update: { title?: string; content?: string } = {};
    if (title) update.title = title;
    if (content) update.content = content;

    try {
      const post = await Post.findByIdAndUpdate(id, update, { new: true });

      if (!post) {
        return {
          data: null,
          error: 'Post not found!',
        };
      }
      return {
        data: post,
        error: '',
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
      };
    }
  },

  deletePost: async ({ id }: { id: string }, context: any) => {
    try {
      const post = await Post.findByIdAndRemove(id);

      if (!post) {
        return {
          data: null,
          error: 'Post not found!',
        };
      }
      return {
        data: post,
        error: '',
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
      };
    }
  },

  register: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
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
  login: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
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

  createUser: async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
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
  updateUser: async ({
    id,
    username,
    password,
  }: {
    id: string;
    username: string;
    password: string;
  }) => {
    try {
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
      const existingUser = await User.findOne({ username });
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
      return {
        data: updated,
        error: '',
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
      };
    }
  },
  deleteUser: async ({ id }: { id: string }, context: any) => {
    try {
      const deleted = await User.findByIdAndRemove(id);
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
};

export { mutation };
