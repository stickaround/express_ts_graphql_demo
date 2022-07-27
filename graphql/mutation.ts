import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { Post } from '../models/post';
import { User } from '../models/user';
import { appConfig } from '../config/constants';
import { checkAuthentication, checkAuthorization } from '../middleware/auth';

const mutation = {
  createPost: async (
    { title, content }: { title: string; content: string },
    { token }: { token: string }
  ) => {
    const user = checkAuthentication(token);
    try {
      const post = await (
        await Post.create({ title, content, user_id: user.user_id })
      ).populate('user_id');
      return {
        data: { ...post.toJSON(), user: post.user_id },
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
    { token }: { token: string }
  ) => {
    try {
      const user = checkAuthentication(token);
      const update: { title?: string; content?: string } = {};
      if (title) update.title = title;
      if (content) update.content = content;
      const updating = await Post.findById(id);
      checkAuthorization(user, updating);
      const post = await (
        await Post.findByIdAndUpdate(id, update, { new: true })
      ).populate('user_id');

      if (!post) {
        return {
          data: null,
          error: 'Post not found!',
        };
      }
      return {
        data: { ...post.toJSON(), user: post.user_id },
        error: '',
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message,
      };
    }
  },

  deletePost: async ({ id }: { id: string }, { token }: { token: string }) => {
    try {
      const user = checkAuthentication(token);
      const deleting = await Post.findById(id);
      if (!deleting) {
        throw Error('Not found!');
      }
      checkAuthorization(user, deleting);
      const post = await (await Post.findByIdAndRemove(id)).populate('user_id');
      if (!post) {
        return {
          data: null,
          error: 'Post not found!',
        };
      }
      return {
        data: { ...post.toJSON(), user: post.user_id },
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

  createUser: async (
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
      const existingUser = await User.findOne({ username, _id: { $ne: id } });
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
  deleteUser: async ({ id }: { id: string }, { token }: { token: string }) => {
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
};

export { mutation };
