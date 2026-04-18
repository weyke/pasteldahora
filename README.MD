# README.md

## Sistema de Pedido Online (JavaScript)

Este projeto consiste em um sistema de pedidos online desenvolvido em JavaScript puro. Ele permite ao usuário selecionar produtos, calcular o total automaticamente, montar pedidos personalizados e enviar o pedido diretamente via WhatsApp, além de controlar o horário de funcionamento da loja.

---

## Estrutura Geral do Código

O código está organizado em seções para facilitar a manutenção e entendimento:

* Variáveis globais
* Inicialização
* Funções utilitárias
* Controle de quantidade
* Cálculo do total
* Integração com WhatsApp
* Lightbox (visualização de imagens)
* Navegação
* Limpeza do carrinho
* Finalização do pedido
* Controle de horário
* Produto customizado

---

## 1. Variáveis Globais

Responsáveis por armazenar elementos e estados importantes do sistema:

* itens: lista de produtos disponíveis no cardápio
* totalEl: elemento que exibe o valor total do pedido
* _lightboxTimer: controla o fechamento automático do lightbox
* LIGHTBOX_TIMEOUT: tempo para fechamento automático do lightbox (2000 ms)
* customSectionLocked: controla se a seção de personalização está bloqueada

---

## 2. Inicialização (DOMContentLoaded)

Executada quando o DOM é completamente carregado.

Principais ações:

* Seleciona elementos da página
* Inicializa o cálculo do total
* Verifica o horário da loja
* Configura eventos dos botões de quantidade
* Configura botão de finalizar pedido
* Configura botão de limpar carrinho
* Ativa zoom nas imagens dos produtos
* Inicializa o sistema de lightbox
* Configura o sistema de pastel customizado
* Controla a abertura da seção customizada

---

## 3. Funções Utilitárias

### formatarMoeda(valor)

Formata números para o padrão monetário brasileiro (BRL).

### mostrarAviso(mensagem, tipo)

Exibe mensagens visuais ao usuário.

Tipos disponíveis:

* success: mensagem de sucesso
* error: mensagem de erro
* info: mensagem padrão

A mensagem desaparece automaticamente após 3 segundos.

---

## 4. Controle de Quantidade

### alterarQtd(botao, delta)

Responsável por:

* Aumentar ou diminuir a quantidade de um item
* Impedir valores negativos
* Atualizar o total automaticamente

---

## 5. Cálculo do Total

### calcularTotal()

* Percorre todos os itens
* Multiplica quantidade pelo preço
* Soma o total geral
* Atualiza o valor exibido na tela
* Atualiza a lista do carrinho

Retorna o valor total calculado.

---

### atualizarListaCarrinho()

* Exibe os itens adicionados ao carrinho
* Mostra quantidade e subtotal por item
* Caso não haja itens, exibe "Carrinho vazio"

---

## 6. Integração com WhatsApp

### enviarWhatsApp()

Realiza as seguintes validações:

* Nome do cliente
* Endereço
* Forma de pagamento

Caso válido:

* Monta uma mensagem formatada com os dados do pedido
* Lista todos os itens selecionados
* Calcula o total final
* Abre o WhatsApp com a mensagem pronta para envio

---

## 7. Lightbox (Visualização de Imagens)

### openLightbox(src, alt)

* Exibe a imagem ampliada
* Define atributos de acessibilidade
* Fecha automaticamente após o tempo definido

### closeLightbox()

* Fecha o lightbox
* Limpa o conteúdo da imagem após a transição

---

## 8. Navegação

### irParaCliente()

* Realiza rolagem suave até a seção de dados do cliente

---

## 9. Limpeza do Carrinho

### limparCarrinho()

* Zera todas as quantidades dos itens
* Recalcula o total
* Limpa os campos de nome e endereço
* Desmarca as opções de pagamento

---

## 10. Finalização do Pedido

### finalizarPedido()

* Direciona o usuário para a seção do cliente
* Após pequeno atraso, executa o envio via WhatsApp

---

## 11. Controle de Horário de Funcionamento

### verificarHorario()

Define quando a loja pode receber pedidos:

* Dias permitidos: sexta-feira e sábado
* Horário: das 18:00 às 22:00

Comportamento:

* Se fora do horário:

  * Exibe um modal informando que a loja está fechada
  * Desativa o botão de finalizar pedido
* Se dentro do horário:

  * Permite normalmente a realização de pedidos

---

## 12. Produto Customizado (Pastel Personalizado)

### setupCustomPastel()

* Configura os eventos dos ingredientes adicionais
* Atualiza o preço dinamicamente
* Configura o botão de adicionar ao carrinho

---

### atualizarPrecoCustom()

* Define preço base de R$ 5,00
* Soma os valores dos ingredientes selecionados
* Atualiza o valor exibido na interface

---

### adicionarCustomAoCarrinho()

* Verifica se ao menos um ingrediente foi selecionado
* Monta o nome do produto com os ingredientes escolhidos
* Calcula o preço final
* Cria dinamicamente um item no carrinho
* Atualiza o total geral
* Limpa as seleções
* Fecha a seção de personalização
* Exibe mensagem de sucesso

---

## Funcionalidades Implementadas

* Carrinho dinâmico
* Atualização automática de valores
* Integração direta com WhatsApp
* Validação de dados do cliente
* Controle de horário de funcionamento
* Sistema de produto personalizado
* Interface interativa com feedback visual

---

## Tecnologias Utilizadas

* JavaScript (Vanilla)
* HTML5
* CSS3

---

## Possíveis Melhorias

* Persistência de dados com localStorage
* Integração com sistema de pagamento online
* Backend com banco de dados
* Painel administrativo
* Sistema de notificações

---

## Conclusão

Este projeto é uma solução completa para pedidos online simples, ideal para pequenos negócios. Sua estrutura modular facilita manutenção e expansão, permitindo evolução conforme a necessidade do sistema.
