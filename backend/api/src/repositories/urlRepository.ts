// src/repositories/urlRepository.ts

import { pool } from '../database/database';
import { ErrorApi } from '../errors/ErrorApi';
import { IUrl, IVector } from '../interfaces/url';

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
      console.error('Error getting user URLs:', error);

      throw new ErrorApi({
        message: 'Failed to get user URLs.',
        status: 500,
      });
    }
  },

  saveUrls: async (urls: IUrl[]): Promise<string[]> => {
    const query = `
      INSERT INTO urls (id, base_url, url, content)
      VALUES ${urls.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}
      RETURNING id;
    `;

    const values = urls.flatMap((url) => [
      url.id,
      url.baseUrl,
      url.url,
      url.content,
    ]);

    try {
      const result = await pool.query(query, values);

      const newUrlIds = result.rows.map((row) => row.id);

      return newUrlIds;
    } catch (error) {
      console.error('Error saving URLs:', error);
      throw new ErrorApi({
        message: 'Failed to save user URLs.',
        status: 500,
      });
    }
  },

  saveVector: async (vector: IVector) => {
    const query = `
      INSERT INTO vectors (id, url_id, base_url, content, vector)
      VALUES ($1, $2, $3, $4, $5);
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

};
