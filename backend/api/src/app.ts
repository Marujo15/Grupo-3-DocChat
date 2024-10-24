import dotenv from "dotenv";
import { CORS_ORIGIN } from "./config";
import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/routes";
import { pool } from "./database/database";

dotenv.config();

console.log("CORS Origin:", process.env.CORS_ORIGIN);

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

app.use("/api", routes);

export const startServer = async () => {
  try {
    await pool.connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

export default app;
