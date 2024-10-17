import dotenv from "dotenv";
dotenv.config();

import app, { startServer } from "./app";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const startApp = async () => {
  await startServer();
  //garante que o banco e vector store estão inicializados para só então inicializar o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
};

startApp();
//chama o processo completo de inicialização
