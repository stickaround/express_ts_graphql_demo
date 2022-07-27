import express, { Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';

import { application, schema } from './graphql/application';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP((req, res, graphqlParmas) => ({
    schema,
    rootValue: application.resolvers,
    customExecuteFn: application.createExecution(),
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
