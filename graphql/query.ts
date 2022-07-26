import { Post } from '../models/post';
import { User } from '../models/user';
import { checkAuthentication } from '../middleware/auth';

const query = {
  posts: async (params: any, { token }: { token: string }) => {
    checkAuthentication(token);
    const posts = await Post.find();
    return posts;
  },

  post: async ({ id }: { id: string }, { token }: { token: string }) => {
    checkAuthentication(token);
    const post = await Post.findById(id);
    return post;
  },

  users: async (params: any, { token }: { token: string }) => {
    checkAuthentication(token);
    const users = await User.find();
    return users;
  },

  user: async ({ id }: { id: string }, { token }: { token: string }) => {
    checkAuthentication(token);
    const user = await User.findById(id);
    return user;
  },
};

export { query };
