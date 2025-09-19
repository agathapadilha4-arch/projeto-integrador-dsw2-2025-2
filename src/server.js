// server.js
// -----------------------------------------------------------------------------
// OBJETIVO DESTE ARQUIVO
// -----------------------------------------------------------------------------
// Este arquivo implementa uma API REST para um CRUD (Create, Read, Update, Delete)
// de "livros", utilizando:
// - Express.js: Framework para criação de servidores e rotas HTTP em Node.js.
// - PostgreSQL: Banco de dados relacional, acessado via pool de conexões (./db.js).
//
// COMO LER ESTE CÓDIGO (PARA INICIANTES):
// - Linhas que começam com // são comentários e não são executadas.
// - "async/await" é usado para lidar com operações que levam tempo (ex: consulta ao banco).
// - Em cada rota, "req" (request) representa a requisição do cliente e
//   "res" (response) representa a resposta que o servidor enviará.
// - Ao final, `app.listen(PORT)` inicia o servidor para que ele possa receber requisições.
//
// CÓDIGOS DE STATUS HTTP UTILIZADOS:
// - 200 OK: Requisição bem-sucedida. Dados retornados no corpo da resposta.
// - 201 Created: Recurso criado com sucesso. O recurso criado é retornado no corpo.
// - 204 No Content: Operação bem-sucedida, sem conteúdo para retornar (ex: DELETE).
// - 400 Bad Request: A requisição do cliente contém dados inválidos ou malformados.
// - 404 Not Found: O recurso solicitado (ex: um livro com um ID específico) não foi encontrado.
// - 500 Internal Server Error: Ocorreu um erro inesperado no servidor.
//
// SOBRE SEGURANÇA E SQL:
// - Usamos "queries parametrizadas" (com $1, $2, etc.) para prevenir SQL Injection.
//   Exemplo: pool.query("SELECT * FROM livros WHERE id = $1", [id])
// - NUNCA concatene inputs do usuário diretamente em uma string de SQL.
//
// SOBRE O MIDDLEWARE `express.json()`:
// - `app.use(express.json())` permite que o servidor entenda e processe
//   corpos de requisição no formato JSON, disponibilizando-os em `req.body`.
//
// -----------------------------------------------------------------------------
// IMPORTAÇÕES E CONFIGURAÇÃO INICIAL
// -----------------------------------------------------------------------------
import express from "express";
import { pool } from "./db.js"; // "pool" gerencia as conexões com o PostgreSQL.
const app = express();

// Middleware que interpreta o corpo (body) de requisições com Content-Type "application/json"
// e o transforma em um objeto JavaScript acessível via `req.body`.
app.use(express.json());

// -----------------------------------------------------------------------------
// ROTA DE BOAS-VINDAS / DOCUMENTAÇÃO RÁPIDA (GET /)
// -----------------------------------------------------------------------------
// Esta rota serve como uma "página inicial" da API, listando em JSON
// os endpoints disponíveis para facilitar testes e desenvolvimento.
app.get("/", async (_req, res) => {
    try {
        const rotas = {
            "LISTAR": "GET /api/livros",
            "MOSTRAR": "GET /api/livros/:id",
            "CRIAR": "POST /api/livros BODY: { 'Usuarios_id': number,'titulo':string, 'autores': string, 'genero': string, 'sinopse': string, 'classificacaoEtaria': number, 'dataEscrita'?: string, 'idioma': string, 'urlImagem'?: string }",
            "SUBSTITUIR": "PUT /api/livros/:id BODY: { 'Usuarios_id': number,'titulo':string, 'autores': string, 'genero': string, 'sinopse': string, 'classificacaoEtaria': number, 'dataEscrita'?: string, 'idioma': string, 'urlImagem'?: string }",
            "ATUALIZAR": "PATCH /api/livros/:id BODY: { 'Usuarios_id': number || 'titulo':string || 'autores': string || 'genero': string || 'sinopse': string || 'classificacaoEtaria': number || 'dataEscrita'?: string || 'idioma': string || 'urlImagem'?: string }",
            "DELETAR": "DELETE /api/livros/:id",
        };
        res.json(rotas); // Envia o objeto como JSON (status 200 é o padrão).
    } catch {
        // Em um ambiente de produção, é crucial registrar (fazer log) do erro para análise.
        res.status(500).json({ erro: "erro interno" });
    }
});

// -----------------------------------------------------------------------------
// LISTAR TODOS OS LIVROS (GET /api/livros)
// -----------------------------------------------------------------------------
// Objetivo: Retornar uma lista de todos os livros do banco de dados,
// ordenados pelo ID em ordem decrescente (os mais recentes primeiro).
app.get("/api/livros", async (_req, res) => {
    try {
        // A desestruturação `{ rows }` extrai diretamente o array de resultados
        // do objeto que o `pool.query` retorna.
        const { rows } = await pool.query("SELECT * FROM livros ORDER BY id DESC");
        res.json(rows); // Retorna um array de objetos, onde cada objeto é um livro.
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});

// -----------------------------------------------------------------------------
// MOSTRAR UM LIVRO ESPECÍFICO (GET /api/livros/:id)
// -----------------------------------------------------------------------------
// Objetivo: Buscar e retornar um único livro, identificado pelo seu `id`.
app.get("/api/livros/:id", async (req, res) => {
    // Parâmetros de rota (como `:id`) vêm como string. Convertemos para número.
    const id = Number(req.params.id);

    // Validação do ID:
    // - `Number.isInteger(id)`: Garante que é um número inteiro.
    // - `id <= 0`: IDs de banco de dados são geralmente inteiros positivos.
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "id inválido" });
    }

    try {
        // A query é parametrizada: `$1` é substituído de forma segura pelo valor em `[id]`.
        const { rows } = await pool.query("SELECT * FROM livros WHERE id = $1", [id]);

        // Se o array `rows` estiver vazio, significa que o livro não foi encontrado.
        if (!rows[0]) {
            return res.status(404).json({ erro: "não encontrado" });
        }

        res.json(rows[0]); // Retorna o primeiro (e único) resultado.
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});

// -----------------------------------------------------------------------------
// CRIAR UM NOVO LIVRO (POST /api/livros)
// -----------------------------------------------------------------------------
// Objetivo: Adicionar um novo livro ao banco de dados com os dados
// fornecidos no corpo da requisição.
app.post("/api/livros", async (req, res) => {
    // Extrai os dados do corpo da requisição. `?? {}` previne erro se `req.body` for nulo.
    const { Usuarios_id, titulo, autores, genero, sinopse, classificacaoEtaria, dataEscrita, idioma, urlImagem} = req.body ?? {};

    // Converte os campos numéricos para validação.
    const uId = Number(Usuarios_id);
    const cE = Number(classificacaoEtaria);

    // Validação rigorosa dos campos obrigatórios e seus tipos.
    if (!titulo || typeof(titulo) !== "string" ||
        !autores || typeof(autores) !== "string" ||
        !genero || typeof(genero) !== "string" ||
        !sinopse || typeof(sinopse) !== "string" ||
        !dataEscrita || typeof(dataEscrita) !== "string" ||
        !idioma || typeof(idioma) !== "string" ||
        !urlImagem || typeof(urlImagem) !== "string" ||
        Usuarios_id == null || Number.isNaN(uId) || uId < 1 ||
        classificacaoEtaria == null || Number.isNaN(cE) || cE < 0
    ) {
        return res.status(400).json({ erro: "Erro na validação dos campos" });
    }

    try {
        // `INSERT` adiciona uma nova linha. `RETURNING *` retorna a linha recém-criada.
        const { rows } = await pool.query(
            "INSERT INTO livros (Usuarios_id, titulo, autores, genero, sinopse, classificacaoEtaria, dataEscrita, idioma, urlImagem) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
            [Usuarios_id, titulo, autores, genero, sinopse, classificacaoEtaria, dataEscrita, idioma, urlImagem]
        );

        // Retorna o status 201 (Created) e o objeto do livro criado.
        res.status(201).json(rows[0]);
    } catch(error) {
        console.log(error); // Log do erro no console do servidor para depuração.
        res.status(500).json({ erro: "erro interno" });
    }
});

// -----------------------------------------------------------------------------
// SUBSTITUIR UM LIVRO (PUT /api/livros/:id)
// -----------------------------------------------------------------------------
// Objetivo: Substituir COMPLETAMENTE um livro existente. O cliente deve
// enviar TODOS os campos do recurso.
app.put("/api/livros/:id", async (req, res) => {
    // Validação do ID da URL.
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "id inválido" });
    }

    // Extração e validação dos dados do corpo da requisição (similar ao POST).
    const { Usuarios_id, titulo, autores, genero, sinopse, classificacaoEtaria, dataEscrita, idioma, urlImagem} = req.body ?? {};
    const uId = Number(Usuarios_id);
    const cE = Number(classificacaoEtaria);

    if (!titulo || typeof(titulo) !== "string" ||
        !autores || typeof(autores) !== "string" ||
        !genero || typeof(genero) !== "string" ||
        !sinopse || typeof(sinopse) !== "string" ||
        !dataEscrita || typeof(dataEscrita) !== "string" ||
        !idioma || typeof(idioma) !== "string" ||
        !urlImagem || typeof(urlImagem) !== "string" ||
        Usuarios_id == null || Number.isNaN(uId) || uId < 1 ||
        classificacaoEtaria == null || Number.isNaN(cE) || cE < 0
    ) {
        return res.status(400).json({ erro: "Erro na validação dos campos" });
    }

    try {
        // `UPDATE` modifica uma linha existente. `RETURNING *` retorna a linha atualizada.
        const { rows } = await pool.query(
            `UPDATE livros SET
                Usuarios_id = $1,
                titulo = $2,
                autores = $3,
                genero = $4,
                sinopse = $5,
                classificacaoEtaria = $6,
                dataEscrita = $7,
                idioma = $8,
                urlImagem = $9
            WHERE id = $10
            RETURNING *`,
            [Usuarios_id, titulo, autores, genero, sinopse, classificacaoEtaria, dataEscrita, idioma, urlImagem, id]
        );

        // Se `rows` estiver vazio, o ID não corresponde a nenhum livro.
        if (!rows[0]) {
            return res.status(404).json({ erro: "não encontrado" });
        }

        res.json(rows[0]); // Retorna o livro com os dados atualizados.
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});

// -----------------------------------------------------------------------------
// ATUALIZAR PARCIALMENTE UM LIVRO (PATCH /api/livros/:id)
// -----------------------------------------------------------------------------
// Objetivo: Atualizar APENAS os campos enviados no corpo da requisição.
// Campos não enviados permanecerão com seus valores atuais no banco.
// A função `COALESCE(valor1, valor2)` no SQL retorna o primeiro valor que não for NULO.
// Se enviarmos `null` para um campo, o `COALESCE` usará o valor que já existe no banco.
app.patch("/api/livros/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { Usuarios_id, titulo, autores, genero, sinopse, classificacaoEtaria, dataEscrita, idioma, urlImagem } = req.body ?? {};

    // Validação do ID da URL.
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "id inválido" });
    }

    // Validação para garantir que pelo menos um campo foi enviado para atualização.
    if (Usuarios_id === undefined &&
        titulo === undefined &&
        autores === undefined &&
        genero === undefined &&
        sinopse === undefined &&
        classificacaoEtaria === undefined &&
        dataEscrita === undefined &&
        idioma === undefined &&
        urlImagem === undefined
    ) {
        return res.status(400).json({ erro: "envie pelo menos um campo para atualizar" });
    }
    
    // Validação específica se Usuarios_id for fornecido.
    if (Usuarios_id !== undefined) {
        const uId = Number(Usuarios_id);
        if (Number.isNaN(uId) || uId < 1) {
            return res.status(400).json({ erro: "Usuarios_id deve ser um número positivo" });
        }
    }

    try {
        const { rows } = await pool.query(
            `UPDATE livros SET
                Usuarios_id = COALESCE($1, Usuarios_id),
                titulo = COALESCE($2, titulo),
                autores = COALESCE($3, autores),
                genero = COALESCE($4, genero),
                sinopse = COALESCE($5, sinopse),
                classificacaoEtaria = COALESCE($6, classificacaoEtaria),
                dataEscrita = COALESCE($7, dataEscrita),
                idioma = COALESCE($8, idioma),
                urlImagem = COALESCE($9, urlImagem)
            WHERE id = $10 RETURNING *`,
            // `?? null` garante que `null` seja enviado ao banco se um campo for `undefined`.
            [Usuarios_id ?? null, titulo ?? null, autores ?? null, genero ?? null, sinopse ?? null, classificacaoEtaria ?? null, dataEscrita ?? null, idioma ?? null, urlImagem ?? null, id]
        );

        if (!rows[0]) {
            return res.status(404).json({ erro: "não encontrado" });
        }
        res.json(rows[0]);
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});

// -----------------------------------------------------------------------------
// DELETAR UM LIVRO (DELETE /api/livros/:id)
// -----------------------------------------------------------------------------
// Objetivo: Remover um livro existente do banco de dados.
app.delete("/api/livros/:id", async (req, res) => {
    const id = Number(req.params.id);

    // Validação do ID da URL.
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ erro: "id inválido" });
    }

    try {
        // `RETURNING id` faz a query retornar o ID do item deletado, se houver.
        const result = await pool.query("DELETE FROM livros WHERE id = $1 RETURNING id", [id]);

        // `result.rowCount` informa quantas linhas foram afetadas. Se for 0, o ID não existia.
        if (!result.rowCount) {
            return res.status(404).json({ erro: "não encontrado" });
        }

        // Sucesso. Retorna 204 No Content, indicando que a operação funcionou
        // mas não há nada a ser enviado no corpo da resposta.
        res.status(204).end();
    } catch {
        res.status(500).json({ erro: "erro interno" });
    }
});

// -----------------------------------------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR
// -----------------------------------------------------------------------------
// A porta é lida da variável de ambiente `PORT` (comum em serviços de deploy como Heroku).
// Se não estiver definida, o padrão é 3000.
const PORT = process.env.PORT || 3000;

// `app.listen` inicia o servidor HTTP para escutar por requisições na porta especificada.
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
// Abra o link no navegador para ver a rota "/" com a lista de endpoints.