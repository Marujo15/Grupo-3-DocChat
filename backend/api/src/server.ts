import dotenv from "dotenv";
dotenv.config();

import app, { startServer } from "./app";
import { PORT } from "./config";

const port: number = PORT ? parseInt(PORT) : 3000;

const startApp = async () => {
  await startServer();
  app.listen(port, () => {
    console.log(`Server running on the port ${port}`);
  });
};

startApp();
