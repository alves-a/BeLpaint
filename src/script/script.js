// Teste de cores
  const botoesCor = document.querySelectorAll('.button__cor');
  botoesCor.forEach(botao => {
    botao.addEventListener('click', () => {
      const corSelecionada = botao.dataset.cor;
      document.body.style.backgroundColor = corSelecionada;
    });
  });

/*
// Código referência utilizado do autor 'Manual do Dev'
// Repositório do projeto:
// https://github.com/manualdodev/paint


  const canvas = document.querySelector("canvas")
  const contexto = canvas.getContext("2d")
  const inputColor = document.querySelectorAll(".button__cor")

  let tamanhoPincel = 10
  let estaPintando = false

  contexto.fillStyle = "#000"


  canvas.addEventListener("mousedown", (event)=> {
    const {clientX, clientY} = event
    desenhar(clientX, clientY)
    estaPintando = true
  })

  canvas.addEventListener("mousemove", (event)=> {
    const {clientX, clientY} = event
    if(estaPintando){
      desenhar(clientX, clientY)
    }
  })

  canvas.addEventListener("mouseup", (event)=> {
    const {clientX, clientY} = event
    desenhar(clientX, clientY)
    estaPintando = false
  })

  const desenhar = (x, y) => {

    contexto.beginPath()

    contexto.arc(
      x - canvas.offsetLeft, 
      y - canvas.offsetTop, 
      tamanhoPincel/2, 
      0, 2*Math.PI
    )

    contexto.fill()
  }
*/