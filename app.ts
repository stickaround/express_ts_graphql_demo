import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/', (req: Request, res: Response) => {
  return res.send('Welcome to Post managing site!');
});

console.log('dbg: ', process.env.PORT, process.env.mongoUrl);

export { app };
