import type { Document } from "@langchain/core/documents";
import { vectorRepository } from "../repositories/vectorRepository";
import { encode, decode } from "gpt-3-encoder";
//gpt-3-encoder é útil para contar tokens de texto e dividi-los de acordo com os limites de tokens dos modelos da OpenAI, como o text-embedding-3-small

//função para dividir texto em chunks com base no limite de tokens:
function splitTextIntoChunks(
  text: string,
  maxTokensPerChunk: number
): string[] {
  const tokens = encode(text);
  //converte o texto (fornecido na chamada da função) em tokens (palavras ou partes de palavras). nesse caso, no contexto de modelos como o GPT-3, serão tokens numéricos (e não de palavras ou parte de palavras)
  console.log(`total tokens: ${tokens.length}`);
  const chunks = [];
  //cria um array para armazenar as chunks que serão geradas (será um conjunto de tokens - o máximo de tokens por chunk será definido na chamada da função)
  let currentChunk = [];
  //armazena os tokens de cada chunk enquanto ele está sendo criado
  let currentTokens = 0;
  //variável que conta quantos tokens foram adicionados ao chunk atual

  for (let token of tokens) {
    //para todos os tokens gerados (um por vez):
    currentChunk.push(token);
    //vai adicionando um token dentro do chunk em construção
    currentTokens++;
    //vai contabilizando no contador

    if (currentTokens >= maxTokensPerChunk) {
      //se o número de tokens já adicionados for maior ou igual ao limite máximo de tokens por chunk:
      chunks.push(currentChunk.join(" "));
      //aí ele junta os tokens do chunk atual (array) em uma string (currentChunk.join.(" ") e adiciona ao array chunks (chunks.push))

      currentChunk = [];
      //zera o array do chunk em construção (para recomeçar)
      currentTokens = 0;
      //zera o contador
    }
  }

  if (currentChunk.length > 0) {
    //se ainda houver tokens restantes que não completaram um chunk completo no final do loop, eles serão tratados como o último chunk
    chunks.push(currentChunk.join(" "));
    //e serão adicionados ao array chunks
  }

  console.log(`os chunks: ${chunks}`);
  console.log(`total chunks: ${chunks.length}`);
  return chunks;
  //conjunto de chunks, ou seja: cada chunk contém todos os tokens numéricos (que representam um texto) possíveis (que, no caso são 4000)
}

export const vectorService = {
  addVector: async (
    documents: Document<Record<string, any>>[],
    ids?: string[]
  ) => {
    try {
      const maxTokensPerChunk = 4000;
      //limite de tamanho para cada chunk - abaixo de 5000 tokens (regra OpenAI)

      //processa cada documento, dividindo seu conteúdo em chunks (com tokens numéricos):
      const chunkedDocuments: Document<Record<string, any>>[] = [];
      //array onde os documentos divididos em chunks serão armazenados
      documents.forEach((doc) => {
        const chunks = splitTextIntoChunks(doc.pageContent, maxTokensPerChunk);
        //divide o conteúdo de cada um dos documentos em chunks (pedaços de textos)

        chunks.forEach((chunk, index) => {
          //para cada chunk criada, é criado um novo documento chunkeado e é adicionado ao array chunkedDocuments
          chunkedDocuments.push({
            pageContent: chunk,
            //o conteúdo do chunk é armazenado, também, como pageContent
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
