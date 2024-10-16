import app from "./app";
import { PORT } from "./config/database";

const port: number = PORT ? parseInt(PORT) : 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
