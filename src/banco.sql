-- Drop tables if they exist to start with a clean slate
DROP TABLE IF EXISTS Livros;
DROP TABLE IF EXISTS Usuarios;

-- =============================================
-- Tabela de Usuários
-- Armazena informações sobre alunos e professores.
-- =============================================
CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    papel INT NOT NULL, -- 0 para aluno, 1 para professor
    dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Tabela de Livros
-- Armazena informações detalhadas sobre os livros.
-- =============================================
CREATE TABLE Livros (
    id SERIAL PRIMARY KEY,
    Usuarios_id INT NOT NULL REFERENCES Usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    autores VARCHAR(255) NOT NULL,
    genero CHAR(1) NOT NULL, -- 't' = terror, 'r' = romance, 'a' = ação, 'f' = fantasia
    sinopse TEXT NOT NULL,
    classificacaoEtaria INT NOT NULL,
    dataEscrita DATE,
    idioma VARCHAR(50) NOT NULL,
    urlImagem VARCHAR(255),
    dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Inserindo dados de exemplo na tabela Usuario
-- =============================================
INSERT INTO Usuarios (nome, email, senha_hash, papel, dataCriacao, dataAtualizacao) VALUES
('Ana Souza', 'ana@exemplo.com', '$2a$10$exemploSenhaHash1', 0, '2025-08-20 14:30:00', '2025-08-20 15:10:00'),
('Carlos Pereira', 'carlos@exemplo.com', '$2a$10$exemploSenhaHash2', 1, '2025-08-21 10:00:00', '2025-08-21 10:00:00'),
('Mariana Costa', 'mariana@exemplo.com', '$2a$10$exemploSenhaHash3', 0, '2025-08-22 09:15:00', '2025-08-22 09:15:00'),
('Jorge Almeida', 'jorge@exemplo.com', '$2a$10$exemploSenhaHash4', 1, '2025-08-23 11:05:00', '2025-08-23 11:05:00'),
('Beatriz Lima', 'bia@exemplo.com', '$2a$10$exemploSenhaHash5', 0, '2025-08-24 16:45:00', '2025-08-24 16:45:00');

-- =============================================
-- Inserindo dados de exemplo na tabela Livros
-- =============================================
INSERT INTO Livros (Usuarios_id, titulo, autores, genero, sinopse, classificacaoEtaria, dataEscrita, idioma, urlImagem, dataCriacao, dataAtualizacao) VALUES
(2, 'Ed & Lorraine Warren: Demonologistas: Arquivos sobrenaturais', 'Gerald Brittle e Ed Warren', 't', 'Eles enfrentaram os mistérios mais sinistros do...', 18, '1980-01-01', 'Português do Brasil', '/img/demonologistas.png', '2025-08-20 14:50:00', '2025-08-20 14:50:00'),
(2, 'O Hobbit', 'J.R.R. Tolkien', 'f', 'Uma grande aventura de um pequeno herói que sai de sua zona de conforto para reaver um tesouro guardado por um dragão.', 12, '1937-09-21', 'Inglês', '/img/hobbit.png', '2025-08-21 11:00:00', '2025-08-21 11:00:00'),
(4, 'O Orgulho e Preconceito', 'Jane Austen', 'r', 'Uma das mais aclamadas histórias de amor da literatura, sobre as maneiras e casamentos na sociedade inglesa do século XIX.', 10, '1813-01-28', 'Inglês', '/img/orgulho_preconceito.png', '2025-08-22 15:20:00', '2025-08-22 15:20:00'),
(4, 'O Código Da Vinci', 'Dan Brown', 'a', 'O simbologista Robert Langdon se envolve em uma busca para desvendar um mistério protegido por uma sociedade secreta.', 16, '2003-03-18', 'Português do Brasil', '/img/codigo_vinci.png', '2025-08-23 18:00:00', '2025-08-23 18:00:00'),
(2, 'Frankenstein', 'Mary Shelley', 't', 'Um cientista cria uma criatura grotesca em um experimento científico pouco ortodoxo.', 16, '1818-01-01', 'Inglês', '/img/frankenstein.png', '2025-08-24 12:00:00', '2025-08-24 12:00:00'),
(4, 'A Guerra dos Tronos', 'George R. R. Martin', 'f', 'Em uma terra onde os verões podem durar décadas e os invernos uma vida inteira, os problemas estão se formando.', 18, '1996-08-01', 'Português do Brasil', NULL, '2025-08-25 09:30:00', '2025-08-25 09:30:00');