import { error, log } from "console";
import path from "path";
import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "../config";

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

// Observação: QueryResultRow é uma interface que representa uma linha retornada pelo banco de dados, onde cada coluna é um par chave-valor.
