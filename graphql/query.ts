import { Post } from '../models/post';

const query = {
  posts: async (context: any) => {
    const posts = await Post.find();
    return posts;
  },

  post: async ({ id }: { id: string }, context: any) => {
    const post = await Post.findById(id);
    return post;
  },
};

export { query };
