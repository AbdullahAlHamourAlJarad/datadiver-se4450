import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import errorHandler from './ErrorHandler';
import router from './routes/routes';
import bodyParser from 'body-parser'

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8080;


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.get('/', (req: Request, res: Response) => {
  res.send('Rashid Is The Best!');
});


app.use(router)
app.use(errorHandler) //Error Handler Middleware

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});