import { buildSchema } from 'graphql';
import { gql } from 'apollo-server-express';

const schema = buildSchema(`
  type Query {
    posts: [Post]
    post(id: ID!): Post
  }
  type Mutation {
    createPost(title: String!, content: String!): PostResponse
    updatePost(id: ID!, title: String, content: String): PostResponse
    deletePost(id: ID!): PostResponse
    register(username: String!, password: String!): UserResponse
    login(username: String!, password: String!): UserResponse
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
  type UserPayload {
    username: String
    role: String
  }
  type UserResponse {
    data: UserPayload
    token: String
    error: String
  }
`);

export { schema };
