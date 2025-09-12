# projeto-integrador-dsw2-2025-2
Agatha

# A Ordem dos Leitores e dos autores

## 1) Problema
Os leitores, que estão conhecendo o mundo da literatura, tem dificuldade em conseguir achar outros leitores de determinadas obras.
Isso causa frustração e até mesmo solidão.
No início, o foco será nos leitores de Percy Jackson com o objetivo de unir e criar um grupo.

## 2) Atores e Decisores (quem usa / quem decide)

Usuários principais: leitores
Decisores/Apoiadores: autores

## 3) Casos de uso (de forma simples)

Todos: armazenar, remover, ler, favoritar, avaliar.
Leitor: armazenar, favoritar, ler, avaliar, remover livro
autor: publicar, visualizar, destacar, remover livro

## 4) Limites e suposições

Limites: limite de quantidade, sem modificações na escrita, sem comunicação agressiva.  
Suposições: internet, atualização em dia
Plano B: sem internet = roda normalmente se o livro estiver na pasta.

## 5) Hipóteses + validação

H-Valor: Se o leitor tiver opçãoes de mudar a cor de fundo, então melhorá a visualização do livro.  
Validação (valor): O leitor conseguir mudar a cor de fundo com apenas um clique; alvo: deixar o leitor confortável.

H-Viabilidade: Com [tecnologia], [ação/tela] leva até [n] s.  
Validação (viabilidade): a medida que o livro receber mais avaliação positivas, ficará no topo; meta: .

## 6) Fluxo principal e primeira fatia

**Fluxo principal (curto):**  
1) O leitor cria a conta 2) O leitor cria faz login → 3) leitor armazena livro → 4) leitor exclui livro

**Primeira fatia vertical (escopo mínimo):**  
Inclui: [uma tela], [uma ação principal], [salvar], [mostrar algo]  
Critérios de aceite:
- [Condição 1 bem objetiva]
- [Condição 2 bem objetiva]

## 7) Esboços de algumas telas (wireframes)
<!-- Vale desenho no papel (foto), Figma, Excalidraw, etc. Não precisa ser bonito, precisa ser claro.
     EXEMPLO de telas:
     • Login
     • Lista de chamados (ordem + tempo desde criação)
     • Novo chamado (formulário simples)
     • Painel do professor (atender/encerrar)
     EXEMPLO de imagem:
     ![Wireframe - Lista de chamados](img/wf-lista-chamados.png) -->
[Links ou imagens dos seus rascunhos de telas aqui]

## 8) Tecnologias
<!-- Liste apenas o que você REALMENTE pretende usar agora. -->

### 8.1 Navegador
**Navegador:** [HTML/CSS/JS | React/Vue/Bootstrap/etc., se houver]  
**Armazenamento local (se usar):** [LocalStorage/IndexedDB/—]  
**Hospedagem:** [GitHub Pages/—]

### 8.2 Front-end (servidor de aplicação, se existir)
**Front-end (servidor):** [ex.: Next.js/React/—]  
**Hospedagem:** [ex.: Vercel/—]

### 8.3 Back-end (API/servidor, se existir)
**Back-end (API):** [ex.: FastAPI/Express/PHP/Laravel/Spring/—]  
**Banco de dados:** [ex.: SQLite/Postgres/MySQL/MongoDB/—]  
**Deploy do back-end:** [ex.: Render/Railway/—]

## 9) Plano de Dados (Dia 0) — somente itens 1–3
<!-- Defina só o essencial para criar o banco depois. -->

### 9.1 Entidades
<!-- EXEMPLO:
     - Usuario — pessoa que usa o sistema (aluno/professor)
     - Chamado — pedido de ajuda criado por um usuário -->
- [Entidade 1] — [o que representa em 1 linha]
- [Entidade 2] — [...]
- [Entidade 3] — [...]

### 9.2 Campos por entidade
<!-- Use tipos simples: uuid, texto, número, data/hora, booleano, char. -->

### Usuario
| Campo           | Tipo                          | Obrigatório | Exemplo            |
|-----------------|-------------------------------|-------------|--------------------|
| id              | número                        | sim         | 1                  |
| nome            | texto                         | sim         | "Ana Souza"        |
| email           | texto                         | sim (único) | "ana@exemplo.com"  |
| senha_hash      | texto                         | sim         | "$2a$10$..."       |
| papel           | número (0=aluno, 1=professor) | sim         | 0                  |
| dataCriacao     | data/hora                     | sim         | 2025-08-20 14:30   |
| dataAtualizacao | data/hora                     | sim         | 2025-08-20 15:10   |

#### Livros
| Campo               | Tipo        | Obrigatório | Exemplo                                                        |
|---------------------|-------------|-------------|----------------------------------------------------------------|
| id                  | número      | sim         | 2                                                              |
| Usuarios_id         | número (fk) | sim         | 1                                                              |
| titulo              | texto       | sim         | "Ed & Lorraine Warren: Demonologistas: Arquivos sobrenaturais" |
| autores             | texto       | sim         | "Gerald Brittle e Ed Warren "                                  |
| genero              | char        | sim         | 't' = terror \| 'r' = romance \|  'a' = ação \| 'f' = fantasia |
| sinopse             | texto       | sim         | "Eles enfrentaram os mistérios mais sinistros do..."           |
| classificacaoEtaria | número      | sim         | 18                                                             |
| dataEscrita         | data        | não         | 2025-08-20                                                     |
| idioma              | texto       | sim         | "Português do Brasil"                                          |
| urlImagem           | texto       | não         | '/img/capa.png'                                                |
| dataCriacao         | data/hora   | sim         | 2025-08-20 14:50                                               |
| dataAtualizacao     | data/hora   | sim         | 2025-08-20 14:50                                               |


### 9.3 Relações entre entidades
<!-- Frases simples bastam. EXEMPLO:
     Um Usuario tem muitos Chamados (1→N).
     Um Chamado pertence a um Usuario (N→1). -->
- Um [A] tem muitos [B]. (1→N)
- Um [B] pertence a um [A]. (N→1)


### 9.4 Modelagem do banco de dados no POSTGRES

```sql

-- Drop tables if they exist to start with a clean slate
DROP TABLE IF EXISTS Livros;
DROP TABLE IF EXISTS Usuario;

-- =============================================
-- Tabela de Usuários
-- Armazena informações sobre alunos e professores.
-- =============================================
CREATE TABLE Usuario (
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
    Usuarios_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    autores VARCHAR(255) NOT NULL,
    genero CHAR(1) NOT NULL, -- 't' = terror, 'r' = romance, 'a' = ação, 'f' = fantasia
    sinopse TEXT NOT NULL,
    classificacaoEtaria INT NOT NULL,
    dataEscrita DATE,
    idioma VARCHAR(50) NOT NULL,
    urlImagem VARCHAR(255),
    dataCriacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario
        FOREIGN KEY(Usuarios_id)
        REFERENCES Usuario(id)
        ON DELETE CASCADE -- Se um usuário for deletado, seus livros também serão.
);

-- =============================================
-- Inserindo dados de exemplo na tabela Usuario
-- =============================================
INSERT INTO Usuario (nome, email, senha_hash, papel, dataCriacao, dataAtualizacao) VALUES
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

```


