import { testRepository } from "../repositories/testRepository";

export const testService = {
  getAllTests: async () => {
    try {
      return await testRepository.getAllTests();
    } catch (err: any) {
      console.error(`Erro ao recuperar todos os testes: ${err.message}`);
      throw err;
    }
  },
};
