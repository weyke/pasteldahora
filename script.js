const itens = document.querySelectorAll('.item');
const totalEl = document.getElementById('total');

/* ➕ / − quantidade */
function alterarQtd(botao, delta) {
  const item = botao.closest('.item');
  const valorEl = item.querySelector('.valor');
  const adicionaisBox = item.querySelector('.adicionais');

  let qtd = Number(valorEl.innerText);
  qtd += delta;

  if (qtd < 0) qtd = 0;
  valorEl.innerText = qtd;

  // Mostrar ou esconder adicionais
  if (adicionaisBox) {
    adicionaisBox.style.display = qtd > 0 ? 'block' : 'none';

    // Se zerar, limpa os adicionais
    if (qtd === 0) {
      adicionaisBox.querySelectorAll('input').forEach(input => {
        input.checked = false;
      });
    }
  }

  calcularTotal();
}

/* 🧮 Calcular total geral e total por item */
function calcularTotal() {
  let total = 0;

  itens.forEach(item => {
    const qtd = Number(item.querySelector('.valor').innerText);
    const precoBase = Number(item.dataset.preco);
    const precoItemEl = item.querySelector('.preco-dinamico');

    let adicionaisTotal = 0;
    let adicionaisTexto = [];

    item.querySelectorAll('.adicionais input:checked').forEach(add => {
      adicionaisTotal += Number(add.dataset.preco);
      adicionaisTexto.push(add.dataset.nome);
    });

    const subtotal = qtd * (precoBase + adicionaisTotal);
    total += subtotal;

    // Atualiza preço do item em tempo real
    if (precoItemEl) {
      precoItemEl.innerText =
        qtd > 0
          ? `Total do item: R$ ${subtotal.toFixed(2).replace('.', ',')}`
          : '';
    }
  });

  totalEl.innerText = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

/* 📲 Enviar pedido para WhatsApp */
function enviarWhatsApp() {
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !endereco) {
    alert("Informe seu nome e endereço.");
    return;
  }

  let mensagem = `Olá! 👋%0A%0A`;
  mensagem += `👤 Nome: ${nome}%0A`;
  mensagem += `📍 Endereço: ${endereco}%0A%0A`;
  mensagem += `🛒 Pedido:%0A`;

  let total = 0;
  let temItem = false;

  itens.forEach(item => {
    const qtd = Number(item.querySelector('.valor').innerText);

    if (qtd > 0) {
      temItem = true;
      const nomeItem = item.dataset.nome;
      const precoBase = Number(item.dataset.preco);

      let adicionaisTotal = 0;
      let adicionaisTexto = [];

      item.querySelectorAll('.adicionais input:checked').forEach(add => {
        adicionaisTotal += Number(add.dataset.preco);
        adicionaisTexto.push(add.dataset.nome);
      });

      const subtotal = qtd * (precoBase + adicionaisTotal);
      total += subtotal;

      mensagem += `- ${qtd}x ${nomeItem}`;

      if (adicionaisTexto.length > 0) {
        mensagem += ` (%0A   ➕ ${adicionaisTexto.join(', ')})`;
      }

      mensagem += `%0A`;
    }
  });

  if (!temItem) {
    alert("Selecione pelo menos um item.");
    return;
  }

  mensagem += `%0A💰 Total: R$ ${total.toFixed(2).replace('.', ',')}`;

  const telefone = "5585981423131";
  window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
}

/* 🔄 Inicializa totais ao abrir a página */
window.onload = calcularTotal;

function irParaCliente() {
  document.getElementById('cliente').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function limparCarrinho() {
  itens.forEach(item => {
    item.querySelector('.valor').innerText = 0;
  });

  calcularTotal();

  // Opcional: limpar dados do cliente
  document.getElementById('nome').value = '';
  document.getElementById('endereco').value = '';
}

function finalizarPedido() {
  const nome = document.getElementById('nome').value.trim();
  const endereco = document.getElementById('endereco').value.trim();

  if (!nome || !endereco) {
    alert("⚠️ Para finalizar o pedido, informe seu nome e endereço de entrega.");
    irParaCliente();
    return;
  }

  enviarWhatsApp();
}


