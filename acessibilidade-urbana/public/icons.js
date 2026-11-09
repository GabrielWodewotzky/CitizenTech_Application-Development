// Ícones SVG (24x24, traço). Usados em categorias, indicadores e mensagens.
const ICONES = {
  // Categorias
  'Calçada':     '<path d="M12 3 7 19h10z"/><path d="M9.2 11h5.6"/><path d="M4 21h16"/>',
  'Rampa':       '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
  'Sinalização': '<rect x="8" y="2" width="8" height="20" rx="3"/><circle cx="12" cy="7" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="17" r="1.4"/>',
  'Transporte':  '<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16"/><path d="M7 17v3"/><path d="M17 17v3"/><circle cx="8" cy="14" r=".6"/><circle cx="16" cy="14" r=".6"/>',
  'Outros':      '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',

  // Introdução
  'problema':    '<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><path d="M12 16.5v.01"/>',
  'publico':     '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2A5 5 0 0 1 21.5 19"/>',
  'objetivo':    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  'ods':         '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/>',

  // Indicadores e ações
  'total':       '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v2H9z"/><path d="M9 11h6"/><path d="M9 15h6"/>',
  'alerta':      '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4"/><path d="M12 17.5v.01"/>',
  'grafico':     '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/>',
  'enviar':      '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  'ok':          '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  'erro':        '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6"/><path d="m15 9-6 6"/>',
  'vazio':       '<path d="M3 7h18v12H3z"/><path d="M3 7l3-4h12l3 4"/><path d="M9 13h6"/>'
};

function svg(nome, tamanho = 20) {
  const conteudo = ICONES[nome] || ICONES['Outros'];
  return `<svg class="svg-icone" width="${tamanho}" height="${tamanho}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${conteudo}</svg>`;
}

// Preenche os elementos estáticos do HTML: <span data-icone="Rampa" data-tam="24">
document.querySelectorAll('[data-icone]').forEach((el) => {
  el.insertAdjacentHTML('afterbegin', svg(el.dataset.icone, Number(el.dataset.tam) || 20));
});