export const appConfig = {
  mongoose: {
    url: process.env.mongoUrl || 'mongodb://127.0.0.1:27017/post_management',
  },
  port: process.env.port || 3000,
  jwtKey: 'I love Gareth Bale & Real Madrid CF',
};
