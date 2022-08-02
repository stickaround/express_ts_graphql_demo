import { createModule, gql } from 'graphql-modules';

import { Post } from '../../models/post';
import { checkAuthentication, checkAuthorization } from '../../middleware/auth';

const postModule = createModule({
  id: 'post',
  dirname: __dirname,
  typeDefs: [
    gql`
      type Query {
        posts: PostListResponse
        post(id: String!): PostResponse
      }
      type Mutation {
        createPost(title: String!, content: String!): PostResponse
        updatePost(id: String, title: String, content: String): PostResponse
        deletePost(id: String!): PostResponse
      }
      type Post {
        _id: String!
        title: String!
        content: String!
        user: User!
      }
      type PostListResponse {
        data: [Post]
        error: String
      }
      type PostResponse {
        data: Post
        error: String
      }
    `,
  ],
  resolvers: {
    Query: {
      posts: async (params: any, args, { token }: { token: string }) => {
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

      post: async (
        root,
        { id }: { id: string },
        { token }: { token: string }
      ) => {
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
    },
    Mutation: {
      createPost: async (
        root,
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
        root,
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

      deletePost: async (
        root,
        { id }: { id: string },
        { token }: { token: string }
      ) => {
        try {
          const user = checkAuthentication(token);
          const deleting = await Post.findById(id);
          if (!deleting) {
            throw Error('Not found!');
          }
          checkAuthorization(user, deleting);
          const post = await (
            await Post.findByIdAndRemove(id)
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
    },
  },
});

export { postModule };
