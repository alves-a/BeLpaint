document.addEventListener("DOMContentLoaded", ()=>{
    
    // pegando os elementos do HTML
    const canvas = document.getElementById("telaPintura")
    const contexto = canvas.getContext("2d")
    const botoesCor = document.querySelectorAll(".button__cor")
    const tamanhoPincelRange = document.getElementById("tamanhoPincel")

    // valores iniciais
    let tamanhoPincel = 10
    let estaPintando = false
    let corAtual = "#111"

    contexto.fillStyle = corAtual // define a cor de preenchimento inicial
    contexto.strokeStyle = corAtual // define a cor da linha e espessura inicial
    contexto.lineWidth = tamanhoPincel
    contexto.lineCap = "round" // Deixa as pontas das linhas arredondadas
    contexto.lineJoin = "round" // Deixa as junções das linhas arredondadas

    /* PINCEL */
    const atualizarTamanhoPincel = (novoTamanho) => {
        tamanhoPincel = novoTamanho
        contexto.lineWidth = tamanhoPincel
        tamanhoPincelRange.value = novoTamanho
    }

    tamanhoPincelRange.addEventListener("input", (event) =>{
        atualizarTamanhoPincel(event.target.value)
    })

    // inicializa tamanho pincel
    atualizarTamanhoPincel(10)

    /* CORES */
    // passando um event listener para cada botão de cor
    botoesCor.forEach(botao => {
        botao.addEventListener("click", () => {
            corAtual = botao.dataset.cor
                contexto.fillStyle = corAtual
                contexto.strokeStyle = corAtual
        })
    })

    /* CANVAS - MOUSE */
    const getPosMouse = (event) => {
        const rect = canvas.getBoundingClientRect()
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }

    let ultimoX, ultimoY

    canvas.addEventListener("mousedown", (event) => {
        estaPintando = true
        const pos = getPosMouse(event)
        ultimoX = pos.x
        ultimoY = pos.y
        contexto.beginPath()
        contexto.moveTo(ultimoX, ultimoY)
    })

    canvas.addEventListener("mousemove", (event) => {
        if (estaPintando) {
            const pos = getPosMouse(event)
            desenharLinha(pos.x, pos.y)
        }
    })

    canvas.addEventListener("mouseup", () => {
        if (estaPintando) {
                contexto.closePath()
            estaPintando = false
        }
    })

    canvas.addEventListener("mouseleave", () => {
        if (estaPintando) {
            contexto.closePath()
            estaPintando = false
        }
    })
            
    /* CANVAS - TOUCH */
    canvas.addEventListener("touchstart", (event) => {
        event.preventDefault() // Previne o scroll da página ao desenhar
        const touch = event.touches[0]
        const pos = getPosMouse(touch)
                
        estaPintando = true
        ultimoX = pos.x
        ultimoY = pos.y
        contexto.beginPath()
        contexto.moveTo(ultimoX, ultimoY)

    }, { passive: false })

    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault()
        if (estaPintando) {
            const touch = event.touches[0]
            const pos = getPosMouse(touch)
            desenharLinha(pos.x, pos.y)
        }
    }, { passive: false })

    canvas.addEventListener("touchend", () => {
        if (estaPintando) {
            contexto.closePath()
            estaPintando = false
        }
    })

    /* DESENHAR LINHAS */
    const desenharLinha = (x,y) => {
        contexto.lineTo(x, y)
        contexto.stroke()
        contexto.beginPath()
        contexto.moveTo(x,y)
    }
})