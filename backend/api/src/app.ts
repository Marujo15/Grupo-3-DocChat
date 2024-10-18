import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./database/database";
import routes from "./routes/routes";
import { CORS_ORIGIN } from "./config";

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

app.use("/api", routes);

//função para inicializar o banco de dados e vector store (ambos PostgreSQL):
export const startServer = async () => {
  try {
    await pool.connect();
    console.log("Conexão com o banco de dados estabelecida.");
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error);
    process.exit(1);
  }
};

export default app;
