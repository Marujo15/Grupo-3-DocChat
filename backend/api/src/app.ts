import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pool } from "./config/database";
import { initializeVectorStore } from "./config/initVectorStore";
import routes from "./routes/routes";

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

app.use("/api", routes);

//função para inicializar o banco de dados e vector store (ambos PostgreSQL):
export const startServer = async () => {
  try {
    await pool.connect();
    console.log("Conexão com o banco de dados estabelecida.");

    await initializeVectorStore();
    console.log("Armazenamento de vetores inicializado.");
  } catch (error) {
    console.error("Erro ao inicializar banco de dados ou vector store:", error);
    process.exit(1);
  }
};

export default app;
