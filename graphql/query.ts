import { Post } from '../models/post';
import { User } from '../models/user';

const query = {
  posts: async (context: any) => {
    const posts = await Post.find();
    return posts;
  },

  post: async ({ id }: { id: string }, context: any) => {
    const post = await Post.findById(id);
    return post;
  },

  users: async (context: any) => {
    const users = await User.find();
    return users;
  },

  user: async ({ id }: { id: string }, context: any) => {
    const user = await User.findById(id);
    return user;
  },
};

export { query };
