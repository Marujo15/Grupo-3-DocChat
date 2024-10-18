export interface IUrl {
  id: string;
  baseUrl: string;
  url: string;
  content:string
}

export interface IVector {
  id: string; // Identificador único do vetor
  urlId: string; // ID da URL associada (referencia à tabela urls)
  url: string; // A URL em formato de string
  baseUrl: string; // O domínio ou base da URL
  content: string; // O conteúdo associado à URL
  vector: number[]; // O vetor de floats representando o embedding
}
