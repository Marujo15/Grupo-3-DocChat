import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import testRoutes from "./routes/testRoutes";
import scrapeRoutes from "./routes/scrapeRoutes";
import vectorRoutes from "./routes/vectorRoutes";
import questionRoutes from "./routes/questionRoutes";
import { pool } from "./config/database";
import { initializeVectorStore } from "./config/initVectorStore";
import routes from "./routes/routes";
import { CORS_ORIGIN } from "./config/database";
import chatRoutes from "./routes/chatRoutes";

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

app.use("/api/test", testRoutes);
app.use("/api/scrape", scrapeRoutes);

export default app;
