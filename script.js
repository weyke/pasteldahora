let itens;
let totalEl;

/* 🔄 Inicialização correta */
window.onload = () => {
  itens = document.querySelectorAll('.item');
  totalEl = document.getElementById('total');
  calcularTotal();
};

/* ➕ / − quantidade */
function alterarQtd(botao, delta) {
  const item = botao.closest('.item');
  const valorEl = item.querySelector('.valor');

  let qtd = Number(valorEl.innerText);
  qtd += delta;

  if (qtd < 0) qtd = 0;
  valorEl.innerText = qtd;

  calcularTotal();
}

/* 🧮 Calcular total */
function calcularTotal() {
  let total = 0;

  itens.forEach(item => {
    const qtd = Number(item.querySelector('.valor').innerText);
    const preco = Number(item.dataset.preco);

    if (!isNaN(qtd) && !isNaN(preco)) {
      total += qtd * preco;
    }
  });

  totalEl.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

/* 📲 Enviar pedido para WhatsApp */
function enviarWhatsApp() {
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const pagamentoEl = document.querySelector('input[name="pagamento"]:checked');

  if (!nome || !endereco) {
    alert("⚠️ Informe seu nome e endereço.");
    irParaCliente();
    return;
  }

  if (!pagamentoEl) {
    alert("⚠️ Selecione a forma de pagamento.");
    irParaCliente();
    return;
  }

  let mensagem = `🍽️ *NOVO PEDIDO* 🍽️%0A`;
  mensagem += `━━━━━━━━━━━━━━%0A%0A`;

  mensagem += `👤 *Cliente*%0A`;
  mensagem += `Nome: ${nome}%0A`;
  mensagem += `Endereço: ${endereco}%0A%0A`;

  mensagem += `*Forma de pagamento*%0A`;
  mensagem += `${pagamentoEl.value}%0A%0A`;

  mensagem += `🛒 *Itens do pedido*%0A`;

  let total = 0;
  let temItem = false;

  itens.forEach(item => {
    const qtd = Number(item.querySelector('.valor').innerText);

    if (qtd > 0) {
      temItem = true;
      const nomeItem = item.dataset.nome;
      const preco = Number(item.dataset.preco);
      total += qtd * preco;

      mensagem += `• ${qtd}x ${nomeItem}%0A`;
    }
  });

  if (!temItem) {
    alert("⚠️ Selecione pelo menos um item.");
    return;
  }

  mensagem += `%0A━━━━━━━━━━━━━━%0A`;
  mensagem += `💰 *Total:* R$ ${total.toFixed(2).replace('.', ',')}`;

  const telefone = "5585981423131";
  window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
}


/* ⬇️ Ir até dados do cliente */
function irParaCliente() {
  document.getElementById('cliente').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

/* 🧹 Limpar carrinho */
function limparCarrinho() {
  itens.forEach(item => {
    item.querySelector('.valor').innerText = 0;
  });

  calcularTotal();

  document.getElementById('nome').value = '';
  document.getElementById('endereco').value = '';
  document.querySelectorAll('input[name="pagamento"]').forEach(r => r.checked = false);
}

/* ✅ Finalizar pedido */
function finalizarPedido() {
  irParaCliente();
  setTimeout(enviarWhatsApp, 300);
}

function verificarHorario() {
  const agora = new Date();
  const hora = agora.getHours();

  const lojaAberta = hora >= 17 && hora < 22;

  const loja = document.getElementById('conteudo-loja');
  const fechada = document.getElementById('loja-fechada');
  const botaoFinalizar = document.querySelector('.footer button');

  if (!loja || !fechada) return;

  if (lojaAberta) {
    loja.style.display = 'block';
    fechada.style.display = 'none';
  } else {
    loja.style.display = 'none';
    fechada.style.display = 'block';
  }
  if (botaoFinalizar) {
  botaoFinalizar.disabled = !lojaAberta;
  botaoFinalizar.style.opacity = lojaAberta ? '1' : '0.5';
}

if (!lojaAberta) {
  fechada.innerHTML = `
 <h2>⛔ Loja Fechada</h2>
  <p>Atendimento das <strong>18h às 22h</strong>.</p>
  <p>O pastel descansa agora 😄</p>`;
}

}

// garante que o HTML já carregou
document.addEventListener("DOMContentLoaded", () => {
  verificarHorario();
  setInterval(verificarHorario, 60000);
});

