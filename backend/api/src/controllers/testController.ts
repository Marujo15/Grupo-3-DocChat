import { testService } from "../services/testService";
import { Request, Response } from "express";

export const testController = {
  getAllTests: async (req: Request, res: Response) => {
    try {
      const allTests = await testService.getAllTests();

      if (allTests.length === 0) {
        res.status(404).json({
          success: false,
          data: "Não há nenhum teste no banco de dados",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: allTests,
      });
    } catch (err: any) {
      console.error(`Erro ao recuperar todos os testes: ${err.message}`);
      res.status(500).json({
        success: false,
        error: "Erro ao recuperar todos os testes",
      });
    }
  },
};
