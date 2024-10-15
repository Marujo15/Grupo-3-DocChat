import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const corsOptions = {
  origin: `http://localhost:${process.env.PORT}`,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

export default cors(corsOptions);
