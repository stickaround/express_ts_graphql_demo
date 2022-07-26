import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    posts: [Post]
    post(id: ID!): Post
    users: [User]
    user(id: ID!): User
  }
  type Mutation {
    createPost(title: String!, content: String!): PostResponse
    updatePost(id: ID!, title: String, content: String): PostResponse
    deletePost(id: ID!): PostResponse
    register(username: String!, password: String!): AuthResponse
    login(username: String!, password: String!): AuthResponse
    createUser(username: String!, password: String!): UserPayload
    updateUser(id: ID!, username: String!, password: String!): UserPayload
    deleteUser(id: ID!): UserPayload
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
  type User {
    _id: ID!
    username: String
    role: String
  }
  type AuthResponse {
    data: User
    token: String
    error: String
  }
  type UserPayload {
    data: User
    error: String
  }
`);

export { schema };
