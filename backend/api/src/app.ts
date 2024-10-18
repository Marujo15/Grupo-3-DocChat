import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import testRoutes from "./routes/testRoutes";
import scrapeRoutes from "./routes/scrapeRoutes";

dotenv.config();

console.log("Origem do CORS:", process.env.CORS_ORIGIN);

const app: Application = express();

const corsOrigin: string = process.env.CORS_ORIGIN || "*";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/test", testRoutes);
app.use("/api/scrape", scrapeRoutes);

export default app;
