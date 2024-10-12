import https from "https";
import http from "http";
import cheerio from "cheerio";

export const fetchHtml = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        resolve(data);
      });
      response.on("error", (err) => {
        reject(err);
      });
    });
  });
};

interface ParagraphInfo {
  text: string;
}

const extractParagraphs = (html: string): ParagraphInfo[] => {
  const $ = cheerio.load(html);
  const paragraphs: ParagraphInfo[] = [];

  $("p").each((_: number, element: cheerio.Element) => {
    const text = $(element).text().trim();
    paragraphs.push({ text });
  });

  return paragraphs;
};

export default { fetchHtml, extractParagraphs };
