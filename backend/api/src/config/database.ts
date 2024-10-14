import dotenv from "dotenv";
import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";

dotenv.config();

const {
  DB_HOST,
  DB_PORT = "5432",
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  console.error(
    "Uma ou mais variáveis de ambiente obrigatórias não estão definidas."
  );
  process.exit(1);
}

const poolConfig: PoolConfig = {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
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
