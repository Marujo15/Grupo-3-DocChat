import type { Document } from "@langchain/core/documents";
import { vectorRepository } from "../repositories/vectorRepository";
import { encode, decode } from "gpt-3-encoder";
//gpt-3-encoder é útil para contar tokens de texto e dividi-los de acordo com os limites de tokens dos modelos da OpenAI, como o text-embedding-3-small

//função para dividir texto em chunks com base no limite de tokens:
function splitTextIntoChunksAndStrings(
  text: string,
  maxTokensPerChunk: number
): string[] {
  const tokens = encode(text);
  //converte o texto (fornecido na chamada da função) em tokens (palavras ou partes de palavras). nesse caso, no contexto de modelos como o GPT-3, serão tokens numéricos (e não de palavras ou parte de palavras)
  console.log(`total tokens: ${tokens.length}`);

  let chunksStrings: string[] = [];
  //array para armazenar as strings (concatenadas) de cada um chunk
  let currentChunkText = "";
  //armazena o texto do chunk atual já decodificado
  let currentTokens = 0;
  //variável que conta quantos tokens foram adicionados ao chunk atual

  for (let token of tokens) {
    //para todos os tokens gerados (um por vez):
    currentChunkText += decode([token]);
    //decodifica o token individualmente e adiciona à string do chunk
    currentTokens++;
    //vai contabilizando no contador

    if (currentTokens >= maxTokensPerChunk) {
      //se o número de tokens já adicionados for maior ou igual ao limite máximo de tokens por chunk:
      chunksStrings.push(currentChunkText);
      //adiciona a string decodificada ao array de strings

      currentChunkText = "";
      //zera o texto correspondente ao chunk em construção
      currentTokens = 0;
      //zera o contador
    }
  }

  if (currentChunkText.length > 0) {
    //?
    chunksStrings.push(currentChunkText);
    //adiciona a string decodificada ao array de strings
  }

  console.log(`os excertos referentes aos chunks: ${chunksStrings}`);

  return chunksStrings;
}

export const vectorService = {
  addVector: async (
    documents: Document<Record<string, any>>[],
    ids?: string[]
  ) => {
    try {
      const maxTokensPerChunk = 1000;
      //limite de tamanho para cada chunk - abaixo de 5000 tokens (regra OpenAI)

      //processa cada documento, dividindo seu conteúdo em chunks (com tokens numéricos):
      const chunkedDocuments: Document<Record<string, any>>[] = [];
      //array onde os documentos divididos em chunks serão armazenados
      documents.forEach((doc) => {
        const chunksStrings = splitTextIntoChunksAndStrings(
          doc.pageContent,
          maxTokensPerChunk
        );

        chunksStrings.forEach((chunkText, index) => {
          //para cada chunk criada, é criado um novo documento chunkeado e é adicionado ao array chunkedDocuments
          chunkedDocuments.push({
            pageContent: chunkText,
            //armazena o excerto original correspondente ao chunk
            metadata: { ...doc.metadata, chunkIndex: index },
            //mantém os metadados originais do documento e adiciona um campo chunkIndex para identificar a ordem do chunk no documento original
          });
        });
      });

      console.log(`chunkedDocuments: ${JSON.stringify(chunkedDocuments)}`);
      return await vectorRepository.addVector(chunkedDocuments, ids);
      //adiciona os documentos chunkeados ao vector store
    } catch (err: any) {
      console.error(`Erro ao adicionar vetor no vector store: ${err.message}`);
      throw err;
    }
  },
};

// A diferença entre tokens e embeddings:

//     Tokens: São representações discretas do texto e são usados para converter o texto em uma forma que o modelo possa processar. Cada token é transformado em um número.
//Exemplo de tokens numéricos: [20, 438, 15, 7, 201] (números correspondentes a palavras ou partes de palavras).

//     Embeddings: São representações vetoriais geradas depois que os tokens são processados pelo modelo. Um embedding é um vetor contínuo que contém uma representação semântica do texto.
//Exemplo de embedding: [0.123, -0.456, 0.789, ...] (uma lista de números que capturam o significado do texto).

// Relação entre tokens e embeddings:

//     Tokenização (via encode()): Converte o texto em tokens numéricos que o modelo entende.
//     Embeddings (via modelos de linguagem): Após o texto ser tokenizado, o modelo processa esses tokens e gera um embedding, que é a representação vetorial do texto, capturando seu significado semântico.

// Aqui está uma explicação clara e concisa cobrindo ambas as opções, tanto a configuração padrão quanto a personalizada:

// ### 1. **Opção Padrão**
// Na configuração padrão do **`PGVectorStore`**, você define as colunas do banco de dados para armazenar os dados dos documentos. Veja o exemplo:

// columns: {
//   idColumnName: "id",
//   vectorColumnName: "vector",   // Coluna para os embeddings
//   contentColumnName: "content", // Coluna para o conteúdo textual
//   metadataColumnName: "metadata",
// }

// Nesse caso, o **`PGVectorStore`** mapeia a propriedade **`pageContent`** dos documentos para a **coluna `content`** no banco de dados. Portanto, o documento deve ser passado assim:

// chunkedDocuments.push({
//   pageContent: chunksStrings[index],  // Propriedade padrão que o PGVectorStore espera
//   metadata: { ...doc.metadata, chunkIndex: index },
// });

// Aqui, o **`pageContent`** do documento será armazenado na coluna **`content`** no banco de dados.

// ### 2. **Opção Personalizada**
// Se você quiser mudar o nome da **coluna do banco de dados** para algo como **`texto`**, você pode configurar o **`PGVectorStore`** desta forma:

// columns: {
//   idColumnName: "id",
//   vectorColumnName: "vector",
//   contentColumnName: "texto",   // Coluna personalizada no banco de dados
//   metadataColumnName: "metadata",
// }

// Com essa configuração, o **`PGVectorStore`** ainda espera que a **propriedade do documento** contendo o conteúdo seja chamada **`pageContent`** (a menos que você altere a lógica do **`PGVectorStore`**). Portanto, mesmo com a coluna sendo chamada **`texto`**, o documento deve ser passado assim:

// chunkedDocuments.push({
//   pageContent: chunksStrings[index],  // Propriedade esperada pelo PGVectorStore
//   metadata: { ...doc.metadata, chunkIndex: index },
// });

// Nesse caso, o **`pageContent`** do documento será armazenado na **coluna `texto`** no banco de dados.
