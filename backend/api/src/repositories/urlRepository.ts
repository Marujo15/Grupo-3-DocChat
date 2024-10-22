import { pool } from "../database/database";
import { ErrorApi } from "../errors/ErrorApi";
import { IUrl, IVector } from "../interfaces/url";

export const urlRepository = {
  getUrlsByUserId: async (userId: string): Promise<string[]> => {
    const query = `
        SELECT u.base_url
        FROM users_urls uu
        JOIN urls u ON uu.url_id = u.id
        WHERE uu.user_id = $1;
    `;

    try {
      const result = await pool.query(query, [userId]);

      const uniqueBaseUrls: Set<string> = new Set(
        result.rows.map((row) => row.base_url)
      );

      return Array.from(uniqueBaseUrls);
    } catch (error) {
      console.error("Error creating user:", error);

      throw new ErrorApi({
        message: "Failed to get user URLs.",
        status: 500,
      });
    }
  },

  saveUrls: async (urls: IUrl[]): Promise<string[]> => {
    const query = `
      INSERT INTO urls (id, base_url, url, content)
      VALUES ${urls
        .map(
          (_, i) =>
            `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
        )
        .join(", ")}
      RETURNING id;
    `;

    const values = urls.flatMap(({ id, baseUrl, url, content }) => [
      id,
      baseUrl,
      url,
      content,
    ]);

    try {
      const result = await pool.query(query, values);
      return result.rows.map((row) => row.id);
    } catch (error) {
      console.error('Error saving URLs:', error);
      throw new ErrorApi({
        message: 'Failed to save user URLs.',
        status: 500,
      });
    }
  },

  saveVectors: async (vectors: IVector[]): Promise<void> => {
    const query = `
      INSERT INTO vectors (id, url_id, base_url, content, vector)
      VALUES ${vectors
        .map(
          (_, i) =>
            `
              ($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, 
               $${i * 5 + 4}, $${i * 5 + 5}::vector)
            `
        )
        .join(", ")};
    `;

    const values = vectors.flatMap(
      ({ id, urlId, baseUrl, content, vector }) => [
        id,
        urlId,
        baseUrl,
        content,
        JSON.stringify(vector),
      ]
    );

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error("Error saving vectors:", error);
      throw new ErrorApi({
        message: "Failed to save user vectors.",
        status: 500,
      });
    }
  },

  syncIdsOnUsersUrls: async (
    userId: string,
    urlIds: string[]
  ): Promise<void> => {
    if (urlIds.length === 0) return;

    const usersUrlsQuery = `
      INSERT INTO users_urls (user_id, url_id)
      VALUES ${urlIds.map((_, index) => `($1, $${index + 2})`).join(", ")}
    `;

    const values = [
      vector.id,
      vector.urlId,
      vector.baseUrl,
      vector.content,
      vector.vector,
    ];

    try {
      await pool.query(query, values);
    } catch (error) {
      console.error('Error saving vector:', error);
      throw new ErrorApi({
        message: 'Failed to save vector.',
        status: 500,
      });
    }
  },
    
  removeUrlsByBaseUrl: async (
    userId: string,
    baseUrl: string
  ): Promise<string[]> => {
    // Query para buscar todos os IDs das URLs relacionadas ao userId e baseUrl
    const selectQuery = `
      SELECT u.id
      FROM urls u
      JOIN users_urls uu ON u.id = uu.url_id
      WHERE u.base_url = $1
      AND uu.user_id = $2;
    `;

    // Query para deletar URLs associadas apenas a um único usuário
    const deleteQuery = `
      DELETE FROM urls
      WHERE id IN (
          SELECT u.id
          FROM urls u
          JOIN users_urls uu ON u.id = uu.url_id
          WHERE u.base_url = $1
          AND uu.user_id = $2
          AND u.id IN (
              SELECT url_id
              FROM users_urls
              GROUP BY url_id
              HAVING COUNT(user_id) = 1
          )
      );
    `;

    try {
      // Primeiro, obtenha todos os IDs das URLs associadas ao userId e baseUrl
      const selectResult = await pool.query(selectQuery, [baseUrl, userId]);

      const allUrlIds = selectResult.rows.map((row: { id: string }) => row.id);

      // Em seguida, delete as URLs associadas a apenas um usuário
      await pool.query(deleteQuery, [baseUrl, userId]);

      // Retorne todos os IDs das URLs relacionadas ao userId e baseUrl (deletadas ou não)
      return allUrlIds;
    } catch (error) {
      console.error("Erro ao remover e buscar URLs:", error);
      throw new Error("Não foi possível remover e buscar as URLs");
    }
  },
    
  syncIdsOnUsersUrls: async (userId: string, urlIds: string[]): Promise<void> => {
    if (urlIds.length === 0) return;

    const valuesPlaceholders = urlIds.map((_, index) => `($1, $${index + 2})`).join(', ');

    const usersUrlsQuery = `
      INSERT INTO users_urls (user_id, url_id)
      VALUES ${valuesPlaceholders};
    `;

    const usersUrlsValues = [userId, ...urlIds];

    try {
      await pool.query(usersUrlsQuery, usersUrlsValues);
    } catch (error) {
      console.error('Error syncing IDs on users_urls:', error);
      throw new ErrorApi({
        message: 'Failed to sync user URLs.',
        status: 500,
      });
    }
  },

  getPagesByEmbedding: async (
    embedding: number[],
    userId: string,
    chatId: string,
    matchThreshold: number,
    matchCount: number
  ): Promise<string[]> => {
    try {
      // Query que chama a função SQL match_chunks
      const query = `
            SELECT * 
            FROM match_chunks($1, $2, $3, $4, $5);
        `;

      // Definindo os parâmetros
      const values = [
        JSON.stringify(embedding),
        userId,
        chatId,
        matchThreshold,
        matchCount,
      ];

      // Executando a query
      const { rows } = await pool.query(query, values);

      return rows;
    } catch (error: any) {
      throw error;
    }
  },

  getUrlsByChatId: async (chatId: string): Promise<string[]> => {
    try {
      const query = `
        SELECT base_url 
        FROM chats_urls 
        WHERE chat_id = $1
      `;

      // Executando a query
      const { rows } = await pool.query(query, [chatId]);

      if (rows.length === 0) {
        throw new ErrorApi({
          message: "Nenhuma URL encontrada para este chat.",
          status: 404,
        });
      }

      return rows.map((row: { base_url: string }) => row.base_url);
    } catch (error: any) {
      throw error;
    }
  },
};
