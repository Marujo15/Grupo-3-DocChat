import app, { startServer } from "./app";
import { PORT } from "./config/database";

const port: number = PORT ? parseInt(PORT) : 3000;

const startApp = async () => {
  await startServer();
  //garante que o banco e vector store estão inicializados para só então inicializar o servidor
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

startApp();
//chama o processo completo de inicialização
