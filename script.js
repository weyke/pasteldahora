/* =========================
   VARIÁVEIS GLOBAIS
========================= */
let itens;
let totalEl;
let _lightboxTimer = null;
const LIGHTBOX_TIMEOUT = 2000; // tempo em ms antes de fechar o lightbox automaticamente
let customSectionLocked = false; // controla se a seção customizada está bloqueada (aberta)

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  itens = document.querySelectorAll('.item');
  totalEl = document.getElementById('total');

  calcularTotal();
  verificarHorario();
  setInterval(verificarHorario, 60000);
  // ligar botões de quantidade (suporta novos botões com data-delta)
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const delta = Number(btn.dataset.delta) || 0;
      alterarQtd(btn, delta);
    });
  });

  const btnFinalizar = document.getElementById('btn-finalizar');
  if (btnFinalizar) btnFinalizar.addEventListener('click', finalizarPedido);

  const btnLimpar = document.getElementById('btn-limpar');
  if (btnLimpar) btnLimpar.addEventListener('click', limparCarrinho);

  // Lightbox: abrir imagem ao clicar e fechar após 2 segundos
  document.querySelectorAll('.foto-produto').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      openLightbox(img.src, img.alt || img.getAttribute('data-nome') || 'Imagem do produto');
    });
  });

  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // Pastel Customizado
  setupCustomPastel();

  // Toggle para expandir/contrair "Monte Seu Pastel"
  const toggleCustomBtn = document.querySelector('.toggle-custom');
  if (toggleCustomBtn) {
    toggleCustomBtn.addEventListener('click', () => {
      const content = document.getElementById('custom-content');
      if (content) {
        // Se a seção está bloqueada (cliente já clicou), não permite fechar
        if (customSectionLocked) {
          return;
        }
        // Senão, abre a seção e bloqueia
        content.classList.remove('custom-card-hidden');
        content.classList.add('custom-card-visible');
        customSectionLocked = true;
      }
    });
  }
});

/* =========================
   FUNÇÕES UTILITÁRIAS
========================= */
function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function mostrarAviso(mensagem) {
  const aviso = document.getElementById('aviso');
  if (!aviso) return;

  aviso.innerText = mensagem;
  aviso.classList.add('mostrar');

  clearTimeout(aviso.timer);
  aviso.timer = setTimeout(() => {
    aviso.classList.remove('mostrar');
  }, 3000);
}

/* =========================
   QUANTIDADE DE ITENS
========================= */
function alterarQtd(botao, delta) {
  const item = botao.closest('.item');
  const valorEl = item.querySelector('.valor');

  let qtd = Number(valorEl.innerText) + delta;
  if (qtd < 0) qtd = 0;

  valorEl.innerText = qtd;
  calcularTotal();
}

/* =========================
   CÁLCULO DO TOTAL
========================= */
function calcularTotal() {
  let total = 0;

  itens.forEach(item => {
    const qtd = Number(item.querySelector('.valor').innerText);
    const preco = Number(item.dataset.preco);

    if (!isNaN(qtd) && !isNaN(preco)) {
      total += qtd * preco;
    }
  });

  totalEl.innerText = `Total: ${formatarMoeda(total)}`;
  // atualizar lista visível do carrinho
  atualizarListaCarrinho();
  return total;
}

function atualizarListaCarrinho() {
  const listEl = document.getElementById('cart-list');
  if (!listEl) return;

  listEl.innerHTML = '';
  let any = false;

  itens.forEach(item => {
    const qtd = Number(item.querySelector('.valor').innerText);
    if (qtd > 0) {
      any = true;
      const nome = item.dataset.nome || (item.querySelector('.info h3') ? item.querySelector('.info h3').innerText : 'Item');
      const preco = Number(item.dataset.preco) || 0;
      const subtotal = qtd * preco;

      const li = document.createElement('li');
      li.innerHTML = `<span class="name">${qtd}x ${nome}</span><span class="subtotal">${formatarMoeda(subtotal)}</span>`;
      listEl.appendChild(li);
    }
  });

  if (!any) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.innerText = 'Carrinho vazio';
    listEl.appendChild(li);
  }
}

/* =========================
   WHATSAPP
========================= */
function enviarWhatsApp() {
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamentoEl = document.querySelector('input[name="pagamento"]:checked');

  if (!nome || !endereco) {
    mostrarAviso("Informe seu nome e endereço.");
    irParaCliente();
    return;
  }

  if (!pagamentoEl) {
    mostrarAviso("Selecione a forma de pagamento.");
    irParaCliente();
    return;
  }

  let mensagem = `🍽️ *NOVO PEDIDO* 🍽️%0A`;
  mensagem += `━━━━━━━━━━━━━━%0A%0A`;
  mensagem += `👤 *Cliente*%0A`;
  mensagem += `Nome: ${nome}%0A`;
  mensagem += `Endereço: ${endereco}%0A%0A`;
  mensagem += `💳 *Pagamento*%0A`;
  mensagem += `${pagamentoEl.value}%0A%0A`;
  mensagem += `🛒 *Itens do pedido*%0A`;

  let temItem = false;
  let total = 0;

  itens.forEach(item => {
    const qtd = Number(item.querySelector('.valor').innerText);

    if (qtd > 0) {
      temItem = true;
      const nomeItem = item.dataset.nome;
      const preco = Number(item.dataset.preco);
      const subtotal = qtd * preco;

      total += subtotal;
      mensagem += `• ${qtd}x ${nomeItem} (${formatarMoeda(preco)})%0A`;
    }
  });

  if (!temItem) {
    mostrarAviso("Selecione pelo menos um item do cardápio.");
    return;
  }

  mensagem += `%0A━━━━━━━━━━━━━━%0A`;
  mensagem += `💰 *Total:* ${formatarMoeda(total)}`;

  const telefone = "5585981423131";
  window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
}

/* =========================
   LIGHTBOX (ABRIR/FECHAR AUTOMÁTICO)
========================= */
function openLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;

  // limpar timer anterior
  if (_lightboxTimer) {
    clearTimeout(_lightboxTimer);
    _lightboxTimer = null;
  }

  img.src = src;
  img.alt = alt || '';
  lb.classList.add('show');
  lb.setAttribute('aria-hidden', 'false');

  // fecha automaticamente após LIGHTBOX_TIMEOUT (2s por padrão)
  _lightboxTimer = setTimeout(() => {
    closeLightbox();
  }, LIGHTBOX_TIMEOUT);
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;

  if (_lightboxTimer) {
    clearTimeout(_lightboxTimer);
    _lightboxTimer = null;
  }

  lb.classList.remove('show');
  lb.setAttribute('aria-hidden', 'true');
  // pequena espera para transição antes de limpar src
  setTimeout(() => (img.src = ''), 200);
}

/* =========================
   NAVEGAÇÃO
========================= */
function irParaCliente() {
  const cliente = document.getElementById('cliente');
  if (!cliente) return;

  cliente.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

/* =========================
   LIMPAR CARRINHO
========================= */
function limparCarrinho() {
  itens.forEach(item => {
    item.querySelector('.valor').innerText = 0;
  });

  calcularTotal();

  document.getElementById('nome').value = '';
  document.getElementById('endereco').value = '';
  document
    .querySelectorAll('input[name="pagamento"]')
    .forEach(r => (r.checked = false));
}

/* =========================
   FINALIZAR PEDIDO
========================= */
function finalizarPedido() {
  irParaCliente();
  setTimeout(enviarWhatsApp, 300);
}

/* =========================
   HORÁRIO DE FUNCIONAMENTO
========================= */
function verificarHorario() {
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0 a 6
  const hora = agora.getHours();
  const minuto = agora.getMinutes();

  // Dias permitidos: Quinta(4), Sexta(5), Sábado(6)
  const diasAbertos = [4, 5, 6];
  const diaPermitido = diasAbertos.includes(diaSemana);

  // Atendimento das 18h às 22h
  const horarioPermitido =
    (hora > 11 && hora < 22) ||
    (hora === 11 && minuto >= 0) ||
    (hora === 22 && minuto <= 0);

  const lojaAberta = diaPermitido && horarioPermitido;

  const loja = document.getElementById('conteudo-loja');
  const fechada = document.getElementById('loja-fechada');
  const botaoFinalizar = document.querySelector('.footer button');

  if (!loja || !fechada) return;

  loja.style.display = lojaAberta ? 'block' : 'none';
  fechada.style.display = lojaAberta ? 'none' : 'block';

  if (botaoFinalizar) {
    botaoFinalizar.disabled = !lojaAberta;
    botaoFinalizar.style.opacity = lojaAberta ? '1' : '0.5';
  }

  if (!lojaAberta) {
    fechada.innerHTML = `
      <h2>⛔ Loja fechada</h2>
      <p>Atendimento das <strong>18h às 22h</strong>.</p>
      <p><strong>Quinta, Sexta e Sábado</strong></p>
    `;
  }
}

/* =========================
   PASTEL CUSTOMIZADO
========================= */
function setupCustomPastel() {
  const toppingCheckboxes = document.querySelectorAll('input[name="custom-topping"]');
  const totalEl = document.getElementById('custom-total');
  const addBtn = document.getElementById('custom-add-btn');

  // listeners para adicionais
  toppingCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', atualizarPrecoCustom);
  });

  // listener para adicionar
  if (addBtn) {
    addBtn.addEventListener('click', adicionarCustomAoCarrinho);
  }

  // atualizar preço inicial
  atualizarPrecoCustom();
}

function atualizarPrecoCustom() {
  const toppingCheckboxes = document.querySelectorAll('input[name="custom-topping"]:checked');
  
  let preco = 6.00; // preço base fixo

  toppingCheckboxes.forEach(checkbox => {
    preco += Number(checkbox.dataset.preco) || 0;
  });

  const totalEl = document.getElementById('custom-total');
  if (totalEl) {
    totalEl.innerText = formatarMoeda(preco);
  }
}

function adicionarCustomAoCarrinho() {
  const toppingCheckboxesChecked = document.querySelectorAll('input[name="custom-topping"]:checked');

  // validação: exigir pelo menos 1 topping selecionado
  if (toppingCheckboxesChecked.length === 0) {
    mostrarAviso('❌ Selecione pelo menos 1 sabor para montar seu pastel!');
    return;
  }

  // construir nome com sabores escolhidos
  const toppingNames = Array.from(toppingCheckboxesChecked)
    .map(cb => cb.value)
    .join(', ');

  const nomePastel = toppingNames 
    ? `Pastel Customizado (${toppingNames})`
    : `Pastel Customizado`;

  // calcular preço: base 6.00 + adicionais
  let preco = 6.00;
  toppingCheckboxesChecked.forEach(checkbox => {
    preco += Number(checkbox.dataset.preco) || 0;
  });

  // criar item fake e adicionar ao carrinho
  const itemFake = document.createElement('div');
  itemFake.className = 'item';
  itemFake.dataset.nome = nomePastel;
  itemFake.dataset.preco = preco;

  const valorEl = document.createElement('span');
  valorEl.className = 'valor';
  valorEl.setAttribute('aria-live', 'polite');
  valorEl.innerText = '1';
  itemFake.appendChild(valorEl);

  itemFake.style.display = 'none';
  document.body.appendChild(itemFake);

  // atualizar referência de itens e total
  itens = document.querySelectorAll('.item');
  calcularTotal();

  // limpar checkboxes do customizador
  const allToppings = document.querySelectorAll('input[name="custom-topping"]');
  allToppings.forEach(cb => cb.checked = false);

  // resetar preço exibido do customizador
  atualizarPrecoCustom();

  // fechar a seção customizada e desbloquear
  const customContent = document.getElementById('custom-content');
  if (customContent) {
    customContent.classList.add('custom-card-hidden');
    customContent.classList.remove('custom-card-visible');
    customSectionLocked = false;
  }

  mostrarAviso(`✅ ${nomePastel} adicionado!`);
}

