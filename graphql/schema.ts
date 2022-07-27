import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    posts: PostListResponse
    post(id: ID!): PostResponse
    users: UserList
    user(id: ID!): UserResponse
  }
  type Mutation {
    createPost(title: String!, content: String!): PostResponse
    updatePost(id: ID!, title: String, content: String): PostResponse
    deletePost(id: ID!): PostResponse
    register(username: String!, password: String!): AuthResponse
    login(username: String!, password: String!): AuthResponse
    createUser(username: String!, password: String!): UserResponse
    updateUser(id: ID!, username: String!, password: String!): UserResponse
    deleteUser(id: ID!): UserResponse
  }
  type Post {
    _id: ID!
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
  type User {
    _id: ID!
    username: String
    role: String
    posts: [Post!]
  }
  type UserList {
    data: [User]
    error: String
  }
  type UserResponse {
    data: User
    error: String
  }
  type AuthResponse {
    data: User
    token: String
    error: String
  }
`);

export { schema };
