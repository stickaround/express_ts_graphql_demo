import express, { NextFunction, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema';
import { resolver } from './graphql/resolver';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let token = '';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  token = req.headers.authorization || 'abc';

  next();
};

app.use(
  '/graphql',
  authMiddleware,
  graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true,
  })
);
app.use('/', (req: Request, res: Response) => {
  return res.send('Welcome to Post managing site!');
});

export { app };
