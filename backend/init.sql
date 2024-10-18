create extension vector;

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE chats (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    chat_id VARCHAR(50) REFERENCES chats(id),
    sender VARCHAR(15) CHECK (sender IN ('user', 'ia', 'system', 'toolCall', 'toolMessage')) NOT NULL, 
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE urls (
    id VARCHAR(50) PRIMARY KEY,
    base_url VARCHAR(100) NOT NULL,
    url VARCHAR(100) NOT NULL, 
    content TEXT NOT NULL, --conteudo da pagina toda da url
);

CREATE TABLE vectors (
    id VARCHAR(50) PRIMARY KEY,
    url_id VARCHAR(50) REFERENCES urls(id),
    base_url VARCHAR(100) NOT NULL,
    content TEXT NOT NULL, -- string do chunk
    vector vector(1536) NOT NULL -- embed do chunk
);

CREATE TABLE users_urls (
    user_id VARCHAR(50) REFERENCES users(id),
    url_id VARCHAR(50) REFERENCES urls(id),
    PRIMARY KEY (user_id, url_id)
);

CREATE TABLE chats_urls (
    chat_id VARCHAR(50) REFERENCES chats(id),
    base_url VARCHAR(50) NOT NULL,
    PRIMARY KEY (chat_id, base_url)
);

-- CREATE OR REPLACE FUNCTION cosine_distance(vec1 double precision[], vec2 double precision[])
-- RETURNS double precision AS $$
-- DECLARE
--     dot_product float8 := 0;
--     norm_a float8 := 0;
--     norm_b float8 := 0;
-- BEGIN
--     FOR i IN 1..array_length(vec1, 1) LOOP
--         dot_product := dot_product + (vec1[i] * vec2[i]);
--         norm_a := norm_a + (vec1[i] * vec1[i]);
--         norm_b := norm_b + (vec2[i] * vec2[i]);
--     END LOOP;

--     RETURN 1 - (dot_product / (sqrt(norm_a) * sqrt(norm_b)));  -- Retorna 1 - similaridade
-- END;
-- $$ LANGUAGE plpgsql;

-- Inserindo dados
-- INSERT INTO urls (id, base_url, url, content, vector) VALUES
-- ('1', 'https://example.com', 'https://example.com/page1', 'Conteúdo da página 1', ARRAY[1.0, -1.0]),
-- ('2', 'https://example.com', 'https://example.com/page2', 'Conteúdo da página 2', ARRAY[1.1, -1.1]),
-- ('3', 'https://example.com', 'https://example.com/page3', 'Conteúdo da página 3', ARRAY[1.2, -1.2]),
-- ('4', 'https://example.com', 'https://example.com/page4', 'Conteúdo da página 4', ARRAY[1.3, -1.3]),
-- ('5', 'https://example.com', 'https://example.com/page5', 'Conteúdo da página 5', ARRAY[1.4, -1.4]),
-- ('6', 'https://example.com', 'https://example.com/page6', 'Conteúdo da página 6', ARRAY[1.5, -1.5]),
-- ('7', 'https://example.com', 'https://example.com/page7', 'Conteúdo da página 7', ARRAY[1.6, -1.6]),
-- ('8', 'https://example.com', 'https://example.com/page8', 'Conteúdo da página 8', ARRAY[1.7, -1.7]),
-- ('9', 'https://example.com', 'https://example.com/page9', 'Conteúdo da página 9', ARRAY[1.8, -1.8]),
-- ('10', 'https://example.com', 'https://example.com/page10', 'Conteúdo da página 10', ARRAY[1.9, -1.9]);


--Exemplo de select:
-- SELECT id, base_url, url, content, vector, cosine_distance(vector, ARRAY[1.0900021, -1.2919312]) AS distance
-- FROM urls
-- ORDER BY distance
-- LIMIT 10;


--psql -U docchat-user -d docchat-db