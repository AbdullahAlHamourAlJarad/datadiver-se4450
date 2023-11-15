import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Kareem Is The Best!');
});

app.get('/answer', (req: Request, res: Response) => {
  let dbURL = req.query.dbURL;
  let dbUserName = req.query.dbUserName;
  let dbPass = req.query.dbPass;
  let question = req.query.question;

  //TODO send back the actual answer
  res.send('Kareem Is The Best!!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});