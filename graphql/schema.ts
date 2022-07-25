import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }
  type Mutation {
    createPost(title: String!, content: String!): PostResponse
    updatePost(id: ID!, title: String, content: String): PostResponse
    deletePost(id: ID!): PostResponse
  }
  type Post {
    _id: ID!
    title: String!
    content: String!
  }
  type PostResponse {
    data: Post
    error: String
  }
`);

export { schema };
