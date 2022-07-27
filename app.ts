import express, { NextFunction, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema';
import { resolver } from './graphql/resolver';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP((req, res, graphqlParmas) => ({
    schema,
    rootValue: resolver,
    graphiql: true,
    context: {
      token: req.headers.authorization ?? '',
    },
  }))
);
app.use('/', (req: Request, res: Response) => {
  return res.send('Welcome to Post managing site!');
});

export { app };
