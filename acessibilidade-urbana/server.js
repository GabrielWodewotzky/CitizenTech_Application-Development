require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/acessibilidade';

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Modelo (coleção "registros")
const CATEGORIAS = ['Calçada', 'Rampa', 'Sinalização', 'Transporte', 'Outros'];
const PRIORIDADES = ['Baixa', 'Média', 'Alta'];

const registroSchema = new mongoose.Schema({
  local: { type: String, required: true, trim: true },
  categoria: { type: String, required: true, enum: CATEGORIAS },
  descricao: { type: String, required: true, trim: true },
  prioridade: { type: String, required: true, enum: PRIORIDADES },
  criadoEm: { type: Date, default: Date.now }
});

const Registro = mongoose.model('Registro', registroSchema);

// POST: cadastrar registro (com validação básica)
app.post('/api/registros', async (req, res) => {
  const { local, categoria, descricao, prioridade } = req.body;

  if (!local || !categoria || !descricao || !prioridade) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }
  if (local.trim().length < 3) {
    return res.status(400).json({ erro: 'Informe um local com pelo menos 3 caracteres.' });
  }
  if (descricao.trim().length < 10) {
    return res.status(400).json({ erro: 'A descrição deve ter pelo menos 10 caracteres.' });
  }
  if (!CATEGORIAS.includes(categoria) || !PRIORIDADES.includes(prioridade)) {
    return res.status(400).json({ erro: 'Categoria ou prioridade inválida.' });
  }

  try {
    const novo = await Registro.create({ local, categoria, descricao, prioridade });
    res.status(201).json({ mensagem: 'Registro cadastrado com sucesso!', registro: novo });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar o registro.' });
  }
});

// GET: listar registros
app.get('/api/registros', async (req, res) => {
  try {
    const registros = await Registro.find().sort({ criadoEm: -1 });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar registros.' });
  }
});

// GET: indicadores (total + resumo por categoria e por prioridade)
app.get('/api/indicadores', async (req, res) => {
  try {
    const total = await Registro.countDocuments();
    const porCategoria = await Registro.aggregate([
      { $group: { _id: '$categoria', quantidade: { $sum: 1 } } },
      { $sort: { quantidade: -1 } }
    ]);
    const porPrioridade = await Registro.aggregate([
      { $group: { _id: '$prioridade', quantidade: { $sum: 1 } } }
    ]);
    res.json({ total, porCategoria, porPrioridade });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao calcular indicadores.' });
  }
});

// Navegadores antigos pedem /favicon.ico: redireciona para o SVG
app.get('/favicon.ico', (req, res) => res.redirect(301, '/favicon.svg'));

// 404 para qualquer rota inexistente
app.use((req, res) => {
  res.status(404).send(`
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Acessibilidade Urbana</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="stylesheet" href="/style.css">
  </head>
  <body>
    <header>
      <a class="logo" href="/"><img src="/favicon.svg" alt="" width="32" height="32"> Acessibilidade Urbana</a>
    </header>
    <main style="margin-top:40px">
      <section class="card" style="text-align:center">
        <h2 style="font-size:3rem;margin-bottom:8px">404</h2>
        <p>Página não encontrada.</p>
        <a href="/"><button type="button">Voltar para o início</button></a>
      </section>
    </main>
  </body>
  </html>
`);
});

// Conexão e start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB conectado.');
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Falha ao conectar no MongoDB:', err.message);
    process.exit(1);
  });