# Acessibilidade Urbana

Global Solution 2026.2 · Application Development · FIAP
Prof. Allan Roberto Molto · Desafio CitizenTech

## Autores

- Nome do integrante 1 (RM 00000)
- Nome do integrante 2 (RM 00000)
- Nome do integrante 3 (RM 00000)

## Vídeo pitch

Link: https://youtu.be/COLE_O_LINK_AQUI

## Print do projeto

![Página inicial com o formulário](docs/print-home.png)

![Painel de registros e indicadores](docs/print-registros.png)

> Para os prints aparecerem, salve as imagens na pasta `docs/` com esses nomes.

---

## 1. Introdução

**Problema:** barreiras de acessibilidade nas ruas (calçadas quebradas, rampas ausentes ou sem corrimão, piso tátil danificado, elevadores parados) dificultam a locomoção de muitas pessoas e, em geral, não são registradas de forma organizada. Sem dados, fica difícil priorizar o que consertar primeiro.

**Público-alvo:** pessoas com deficiência, idosos, pessoas com mobilidade reduzida e a comunidade em geral.

**Objetivo:** permitir que qualquer pessoa registre uma barreira de acessibilidade e acompanhe, por meio de indicadores, quais categorias e níveis de prioridade concentram mais ocorrências, apoiando a tomada de decisão sobre melhorias.

## 2. ODS relacionados

- **ODS 11: Cidades e Comunidades Sustentáveis**, que trata de cidades inclusivas, seguras e acessíveis.
- **ODS 10: Redução das Desigualdades**, que trata da inclusão de todas as pessoas, independentemente de suas condições.

## 3. Tecnologias

HTML, CSS, JavaScript, Node.js, Express e MongoDB (com Mongoose, uma biblioteca que facilita o acesso ao MongoDB a partir do Node.js).

## 4. Estrutura do projeto

```
acessibilidade-urbana/
├── server.js          # servidor Express, rotas e acesso ao MongoDB
├── package.json
├── .env.example       # modelo das variáveis de ambiente
├── README.md
├── docs/              # prints usados neste README
└── public/
    ├── index.html     # introdução e formulário de cadastro
    ├── registros.html # listagem e indicadores
    ├── style.css
    ├── script.js      # lógica do front-end (fetch, tabela, indicadores)
    ├── icons.js       # ícones SVG
    ├── favicon.svg
    └── bg-cidade.svg
```

## 5. Como executar

**Pré-requisitos:** Node.js instalado e um banco MongoDB (local ou MongoDB Atlas).

1. Extraia o `.zip` e abra a pasta no terminal.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo `.env` a partir do modelo:
   ```bash
   cp .env.example .env
   ```
   No Windows (PowerShell): `copy .env.example .env`
4. Abra o `.env` e ajuste `MONGO_URI` com a sua string de conexão. Exemplos:
   ```
   # MongoDB local
   MONGO_URI=mongodb://127.0.0.1:27017/acessibilidade

   # MongoDB Atlas
   MONGO_URI=mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/acessibilidade?retryWrites=true&w=majority

   PORT=3000
   ```
   Se usar o Atlas, libere o seu IP em **Network Access**.
5. Inicie o servidor:
   ```bash
   npm start
   ```
   O terminal deve mostrar `MongoDB conectado.` e `Servidor rodando em http://localhost:3000`.
6. Acesse `http://localhost:3000` no navegador.

## 6. Registro (documento no MongoDB)

Banco `acessibilidade`, coleção `registros`. Cada registro tem:

| Campo | Tipo | Regra |
|---|---|---|
| `local` | texto | obrigatório, mínimo de 3 caracteres |
| `categoria` | texto | obrigatória: Calçada, Rampa, Sinalização, Transporte ou Outros |
| `descricao` | texto | obrigatória, mínimo de 10 caracteres |
| `prioridade` | texto | obrigatória: Baixa, Média ou Alta |
| `criadoEm` | data | preenchida automaticamente |

## 7. Rotas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | página com a introdução e o formulário |
| GET | `/registros.html` | página com a listagem e os indicadores |
| POST | `/api/registros` | valida e salva um novo registro (201 em caso de sucesso, 400 se houver erro de validação) |
| GET | `/api/registros` | retorna todos os registros, do mais recente ao mais antigo |
| GET | `/api/indicadores` | retorna o total e os resumos por categoria e por prioridade |
| qualquer outra | `*` | retorna a mensagem de erro 404 |

## 8. Indicadores

Os indicadores são calculados no servidor, na rota `GET /api/indicadores`, e exibidos na página de registros.

1. **Total de registros:** contagem de todos os documentos da coleção (`countDocuments`).
2. **Resumo por categoria:** agrupamento dos registros por categoria, com a quantidade de cada uma, em ordem decrescente (`$group` + `$sort`). Mostra onde estão as barreiras mais frequentes.
3. **Resumo por prioridade:** agrupamento por prioridade (Baixa, Média, Alta). Mostra o quanto das ocorrências é urgente.

No front-end, além desses números, a página mostra o total de registros de prioridade alta, a categoria mais frequente e barras proporcionais (em %) para cada categoria e prioridade. A tabela também pode ser filtrada por categoria e por prioridade.

## 9. Mensagens e tratamento de erros

- Cadastro com sucesso: mensagem verde de confirmação.
- Campos vazios, texto curto demais ou valores inválidos: mensagem vermelha com o motivo, vinda do servidor (status 400).
- Falha de conexão ou erro interno: mensagem de erro (status 500).
- Rota inexistente: resposta 404 (página HTML para rotas comuns e JSON para rotas `/api`).

## 10. Observações

- Não há login, hospedagem, inteligência artificial nem APIs externas, conforme o escopo do enunciado.
- A pasta `node_modules` e o arquivo `.env` não fazem parte da entrega.