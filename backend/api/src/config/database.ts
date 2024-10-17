import dotenv from "dotenv";
import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";

dotenv.config();

const {
  DB_USER,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT = "5432",
} = process.env;

if (!DB_USER || !DB_HOST || !DB_NAME || !DB_PASSWORD) {
  console.error(
    "Uma ou mais variáveis de ambiente obrigatórias não estão definidas."
  );
  process.exit(1);
}

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
