/* =========================
   VARIÁVEIS GLOBAIS
========================= */
let itens;
let totalEl;

/* =========================
   INICIALIZAÇÃO
========================= */
document.addEventListener("DOMContentLoaded", () => {
  itens = document.querySelectorAll('.item');
  totalEl = document.getElementById('total');

  calcularTotal();
  verificarHorario();
  setInterval(verificarHorario, 60000);
});

/* =========================
   FUNÇÕES UTILITÁRIAS
========================= */
function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
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
  return total;
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
  const hora = agora.getHours();
  const minuto = agora.getMinutes();

  // Atendimento das 18h às 22h10
  const lojaAberta =
    (hora > 18 && hora < 22) ||
    (hora === 18 && minuto >= 0) ||
    (hora === 22 && minuto <= 1);

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
      <p>Quinta, Sexta e Sábado</p>
    `;
  } 
  
}
