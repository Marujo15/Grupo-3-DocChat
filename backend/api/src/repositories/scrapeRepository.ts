import https from 'https';
import http from 'http';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import { URL } from 'url';
import { PageInfo } from '../interfaces/PageInfo';

const fetchHtml = (url: string, retries: number = 3): Promise<string> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const handleResponse = (response: http.IncomingMessage) => {
      let data = '';

      if (response.statusCode === 301 || response.statusCode === 302) {
        const newUrl = response.headers.location;
        if (newUrl) {
          fetchHtml(newUrl, retries).then(resolve).catch(reject);
        } else {
          reject(new Error(`Failed to follow redirect, no location header`));
        }
      } else if (response.statusCode === 200) {
        response.on('data', (chunk: string) => {
          data += chunk;
        });

        response.on('end', () => {
          resolve(data);
        });
      } else {
        reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
      }
    };

    const request = protocol.get(url, handleResponse);

    request.on('error', (err) => {
      if (retries > 0 && ((err as NodeJS.ErrnoException).code === 'ECONNRESET' || (err as NodeJS.ErrnoException).code === 'ETIMEDOUT')) {
        console.warn(`Retrying ${url} (${retries} retries left)`);
        setTimeout(() => {
          fetchHtml(url, retries - 1).then(resolve).catch(reject);
        }, 1000);
      } else {
        reject(err);
      }
    });
  });
};

const extractLinks = (html: string, baseUrl: string, visited: Set<string>): string[] => {
  const $ = cheerio.load(html);
  const links: string[] = [];

  $('a').each((_, element) => {
    let href = $(element).attr('href');
    if (href) {
      const absoluteUrl = new URL(href, baseUrl).href;
      if (absoluteUrl.startsWith(baseUrl) && !visited.has(absoluteUrl)) {
        links.push(absoluteUrl);
      }
    }
  });

  return links;
};

const processPage = async (url: string, visited: Set<string>): Promise<PageInfo[]> => {
  if (visited.has(url)) {
    return [];
  }
  visited.add(url);

  try {
    const html = await fetchHtml(url);
    console.log(`Fetched HTML for ${url}:`, html.substring(0, 100)); // Log the first 100 characters of the HTML for debugging
    const turndownService = new TurndownService();
    const markdown = turndownService.turndown(html);
    const links = extractLinks(html, url, visited);
    const pageInfo: PageInfo = { url, html: markdown, links };
    const results: PageInfo[] = [pageInfo];

    // Process links in parallel
    const subPagePromises = links.map(link => processPage(link, visited));
    const subPageResults = await Promise.all(subPagePromises);
    subPageResults.forEach(subPageInfo => results.push(...subPageInfo));

    return results;
  } catch (error) {
    console.error(`Error processing page ${url}:`, error);
    return [];
  }
};

export { fetchHtml, extractLinks, processPage };