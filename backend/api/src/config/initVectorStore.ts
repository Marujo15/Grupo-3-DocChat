import dotenv from "dotenv";
import {
  PGVectorStore,
  DistanceStrategy,
} from "@langchain/community/vectorstores/pgvector";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PoolConfig } from "pg";

dotenv.config();

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: "text-embedding-3-small",
});

const config = {
  postgresConnectionOptions: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  } as PoolConfig,
  tableName: "testlangchainjs", //nome da tabela onde serão armazenados os vetores
  columns: {
    idColumnName: "id", //nome da coluna que conterá os IDs
    vectorColumnName: "vector", //nome da coluna que armazenará os vetores
    contentColumnName: "content", //nome da coluna para armazenar o conteúdo
    metadataColumnName: "metadata", //nome da coluna para armazenar metadados adicionais
  },
  distanceStrategy: "cosine" as DistanceStrategy,
  //estratégia de distância (cosine é a padrão)
};

export const initializeVectorStore = async () => {
  try {
    const vectorStore = await PGVectorStore.initialize(embeddings, config);
    console.log("Vector Store initialized successfully.");
    return vectorStore;
  } catch (error) {
    console.error("Failed to initialize vector store:", error);
    throw error;
  }
};
