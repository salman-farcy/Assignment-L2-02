import express, { type Request, type Response } from "express"
import CookieParser from "cookie-parser";
import cors from "cors"
import { authRoute } from "./modules/auth/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/error";

const app = express();

// middleware
app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
}));


app.get('/', (req : Request, res : Response) => {
  res.send('Hello World!');
});


app.use('/api/auth', authRoute);

app.use('/api/issues', );


app.use(notFoundHandler)

app.use(errorHandler)

export default app;