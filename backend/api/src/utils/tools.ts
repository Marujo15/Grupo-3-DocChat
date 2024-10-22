// src/utils/tools.ts

import { vectorServices } from '../services/vectorService';
import { similaritySearchService } from '../services/similaritySearchService';

interface CustomTool {
  name: string;
  description: string;
  func: (input: string) => Promise<string>;
}

export const createSearchDocumentationTool = (userId: string): CustomTool => {
  return {
    name: 'searchDocumentation',
    description:
      'Use esta ferramenta para buscar informações nas documentações fornecidas pelo usuário.',
    func: async (input: string) => {
      const embeddedQuestion = await vectorServices.vectorizeString(input);
      const results = await similaritySearchService.searchSimilarDocuments(
        embeddedQuestion,
        userId
      );
      const combinedResults = results.map((r: any) => r.content).join('\n');
      return (
        combinedResults ||
        'Nenhuma informação relevante encontrada nas documentações fornecidas.'
      );
    },
  };
};
