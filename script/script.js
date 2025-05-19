// Teste de cores
  const botoesCor = document.querySelectorAll('.button__cor');
  botoesCor.forEach(botao => {
    botao.addEventListener('click', () => {
      const corSelecionada = botao.dataset.cor;
      document.body.style.backgroundColor = corSelecionada;
    });
  });
