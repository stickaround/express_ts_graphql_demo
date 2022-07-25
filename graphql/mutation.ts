import { Post } from '../models/post';

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
};

export { mutation };
