import { error, log } from "console";
import dotenv from "dotenv";
import path from "path";
import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";

dotenv.config();

const requiredEnvVars = [
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "CORS_ORIGIN",
];

const missingEnvVars = requiredEnvVars.filter((varName) => {
  return !process.env[varName];
});

if (missingEnvVars.length > 0) {
  console.error(
    "As seguintes variáveis de ambiente obrigatórias não estão definidas:",
    missingEnvVars.join(", ")
  );
  process.exit(1);
}

// Extraindo as variáveis de ambiente
export const {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT = "5432",
  SECRET_KEY = "random_secret_password",
  CORS_ORIGIN,
  PORT = "3000",
} = process.env;

const poolConfig: PoolConfig = {
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT, 10),
};

export const pool = new Pool(poolConfig);

pool.on("error", (err: Error) => {
  console.error(`Erro inesperado na pool de conexões: ${err.message}`);
  process.exit(1);
});

export const query = <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);
//QueryResultRow é uma interface que representa uma linha retornada pelo banco de dados, onde cada coluna é um par chave-valor.
