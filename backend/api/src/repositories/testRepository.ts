import { query } from "../config/database";

export const testRepository = {
  getAllTests: async () => {
    const text = "SELECT * FROM test";
    try {
      const { rows } = await query(text);
      return rows;
    } catch (err: any) {
      console.error(`Erro ao recuperar todos os testes: ${err.message}`);
      throw err;
    }
  },
};
