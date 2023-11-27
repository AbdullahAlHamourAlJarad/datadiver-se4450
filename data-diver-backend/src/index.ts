import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import errorHandler from './ErrorHandler';
import router from './routes/routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('Kareem Is The Best!');
});



//Error Handler Middleware
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});