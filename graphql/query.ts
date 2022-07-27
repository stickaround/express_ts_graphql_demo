import { Post } from '../models/post';
import { User } from '../models/user';
import { checkAuthentication, checkAuthorization } from '../middleware/auth';

const query = {
  posts: async (params: any, { token }: { token: string }) => {
    try {
      const auth = checkAuthentication(token);
      const query = auth.role === 'admin' ? {} : { user_id: auth.user_id };
      const posts = await Post.find({ ...query }).populate('user_id');
      const postList = [
        ...posts.map((post) => ({
          ...post.toJSON(),
          user: post.user_id,
        })),
      ];
      return {
        data: postList,
        error: '',
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  },

  post: async ({ id }: { id: string }, { token }: { token: string }) => {
    try {
      const auth = checkAuthentication(token);
      const post = await Post.findById(id);
      checkAuthorization(auth, post);
      await post.populate('user_id');
      return {
        data: {
          ...post.toJSON(),
          user: post.user_id,
        },
        error: '',
      };
    } catch (error) {
      return {
        data: null,
        error: error.message,
      };
    }
  },

  users: async (params: any, { token }: { token: string }) => {
    try {
      const auth = checkAuthentication(token);
      if (auth.role !== 'admin') {
        throw Error('Forbidden!');
      }
      const users = await User.find();
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

  user: async ({ id }: { id: string }, { token }: { token: string }) => {
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
};

export { query };
