import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import makeRequest from './connOpenAI';
import { error } from 'console';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Kareem Is The Best!');
});

app.get('/answer', (req: Request, res: Response) => {
  let dbURL = req.query.dbURL;
  let dbName = req.query.dbName;
  let dbUserName = req.query.dbUserName;
  let dbPass = req.query.dbPass;
  let question = req.query.question;

  //TODO send back the actual answer
  makeRequest();
  res.send('Hello');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
//CHANGE TEST