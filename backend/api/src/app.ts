import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import testRoutes from "./routes/testRoutes";
import scrapeRoutes from "./routes/scrapeRoutes";
import routes from "./routes/routes";
import { CORS_ORIGIN } from "./config/database";

dotenv.config();

console.log("Origem do CORS:", CORS_ORIGIN);

const app: Application = express();

const corsOrigin: string = CORS_ORIGIN || "*";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes)

export default app;
