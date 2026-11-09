// Cores por categoria e prioridade (os ícones ficam em icons.js)
const CORES_CATEGORIA = {
  'Calçada': '#fd7e14',
  'Rampa': '#0d6efd',
  'Sinalização': '#198754',
  'Transporte': '#6f42c1',
  'Outros': '#6c757d'
};

const CORES_PRIORIDADE = {
  'Alta': '#dc3545',
  'Média': '#fd7e14',
  'Baixa': '#198754'
};

function icone(categoria, tamanho = 18) {
  const cor = CORES_CATEGORIA[categoria] || CORES_CATEGORIA['Outros'];
  return `<span class="icone" style="--cor:${cor}">${svg(categoria, tamanho)}</span>`;
}

// Evita injeção de HTML nos textos digitados pelo usuário
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// ----- Página de cadastro -----
const form = document.getElementById('form-registro');
if (form) {
  const msg = document.getElementById('mensagem');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));

    try {
      const resp = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      const json = await resp.json();

      if (resp.ok) {
        msg.innerHTML = svg('ok', 20) + ' ' + escapar(json.mensagem);
        msg.className = 'sucesso';
        form.reset();
      } else {
        msg.innerHTML = svg('erro', 20) + ' ' + escapar(json.erro);
        msg.className = 'erro';
      }
    } catch {
      msg.innerHTML = svg('erro', 20) + ' Erro de conexão com o servidor.';
      msg.className = 'erro';
    }
  });
}

// ----- Página de listagem -----
const lista = document.getElementById('lista');
let todosRegistros = [];

if (lista) {
  carregarRegistros();
  carregarIndicadores();
  document.getElementById('filtro-categoria').addEventListener('change', renderizarTabela);
  document.getElementById('filtro-prioridade').addEventListener('change', renderizarTabela);
}

async function carregarRegistros() {
  try {
    const resp = await fetch('/api/registros');
    todosRegistros = await resp.json();
    renderizarTabela();
  } catch {
    document.getElementById('contador').textContent = 'Erro ao carregar registros.';
  }
}

function renderizarTabela() {
  const cat = document.getElementById('filtro-categoria').value;
  const pri = document.getElementById('filtro-prioridade').value;

  const filtrados = todosRegistros.filter((r) =>
    (!cat || r.categoria === cat) && (!pri || r.prioridade === pri)
  );

  document.getElementById('contador').textContent =
    `Exibindo ${filtrados.length} de ${todosRegistros.length} registro(s)`;
  document.getElementById('vazio').hidden = filtrados.length > 0;

  lista.innerHTML = filtrados.map((r) => `
    <tr>
      <td><div class="celula-cat">${icone(r.categoria)}<span>${escapar(r.categoria)}</span></div></td>
      <td><strong>${escapar(r.local)}</strong></td>
      <td>${escapar(r.descricao)}</td>
      <td><span class="tag ${r.prioridade}">${r.prioridade}</span></td>
      <td class="data">${new Date(r.criadoEm).toLocaleDateString('pt-BR')}</td>
    </tr>
  `).join('');
}

async function carregarIndicadores() {
  const alvo = document.getElementById('indicadores');
  try {
    const resp = await fetch('/api/indicadores');
    const ind = await resp.json();

    const totalAlta = (ind.porPrioridade.find((p) => p._id === 'Alta') || {}).quantidade || 0;
    const topo = ind.porCategoria[0]; // já vem ordenado do maior para o menor

    const barrasCategoria = ind.porCategoria.map((c) =>
      barra(`${icone(c._id, 16)} ${escapar(c._id)}`, c.quantidade, ind.total,
        CORES_CATEGORIA[c._id] || CORES_CATEGORIA['Outros'])
    ).join('');

    const barrasPrioridade = Object.keys(CORES_PRIORIDADE).map((nome) => {
      const item = ind.porPrioridade.find((p) => p._id === nome);
      return barra(nome, item ? item.quantidade : 0, ind.total, CORES_PRIORIDADE[nome]);
    }).join('');

    alvo.innerHTML = `
      <div class="stats">
        <div class="stat">
          <span class="stat-icone" style="--cor:#0b5ed7">${svg('total', 28)}</span>
          <div><p class="stat-num">${ind.total}</p><p class="stat-label">Total de registros</p></div>
        </div>
        <div class="stat">
          <span class="stat-icone" style="--cor:#dc3545">${svg('alerta', 28)}</span>
          <div><p class="stat-num">${totalAlta}</p><p class="stat-label">Prioridade alta</p></div>
        </div>
        <div class="stat">
          <span class="stat-icone" style="--cor:#6f42c1">${svg('grafico', 28)}</span>
          <div><p class="stat-num stat-texto">${topo ? escapar(topo._id) : '-'}</p><p class="stat-label">Categoria mais frequente</p></div>
        </div>
      </div>

      <div class="graficos">
        <div><h3>Por categoria</h3>${barrasCategoria || '<p>Sem dados.</p>'}</div>
        <div><h3>Por prioridade</h3>${barrasPrioridade}</div>
      </div>
    `;
  } catch {
    alvo.textContent = 'Erro ao carregar indicadores.';
  }
}

function barra(rotulo, quantidade, total, cor) {
  const pct = total ? Math.round((quantidade / total) * 100) : 0;
  return `
    <div class="barra-linha">
      <div class="barra-topo"><span>${rotulo}</span><strong>${quantidade} (${pct}%)</strong></div>
      <div class="barra"><div class="barra-preenchida" style="width:${pct}%; background:${cor}"></div></div>
    </div>`;
}