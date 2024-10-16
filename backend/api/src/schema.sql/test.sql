CREATE TABLE test (id SERIAL PRIMARY KEY, teste VARCHAR(100));

INSERT INTO test (teste) VALUES ('teste sei lá');

SELECT * FROM test;

-- Criação da tabela users
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

-- Criação da tabela chats
CREATE TABLE chats (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL
);

-- Criação da tabela messages
CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    chat_id INT REFERENCES chats(id) ON DELETE CASCADE,
    sender VARCHAR(10) CHECK (sender IN ('user', 'ia')) NOT NULL, 
    -- seria melhor se a api checasse se está sendo enviado 'user' ou 'ia' para a coluna seneder do banco de dados do que o proprio banco checar
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);