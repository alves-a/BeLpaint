// --- VARIÁVEIS GLOBAIS ---
let imgFundo;
let circulos = [];
let caminhoDoDesenho = [];

// Variáveis para controlar o Replay e o estado do jogo
let replayAtivo = false;
let indiceReplay = 0;
let podeDesenhar = true;

// Botões para controlar o jogo
let btnJogarNovamente;
let btnReplay;

// --- FUNÇÕES ESSENCIAIS DO P5.JS ---
function preload() {
  const temas = [
    "./src/img/fase01_cimento.jpg", 
    "./src/img/fase01_chao.jpg",
    "./src/img/fase01_cimento2.jpg", 
    "./src/img/fase01_chao2.jpg"
  ];
  const indiceAleatorio = Math.floor(Math.random() * temas.length);
  const urlDaImagemSorteada = temas[indiceAleatorio];
  imgFundo = loadImage(urlDaImagemSorteada);
}

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("canvas-container");

  circulos = [
    { x: 150, y: 520, d: 90, cor: "red" },
    { x: 680, y: 500, d: 120, cor: "lime" },
    { x: 180, y: 380, d: 45, cor: "deeppink" },
    { x: 100, y: 100, d: 40, cor: "green" },
    { x: 650, y: 80, d: 60, cor: "CornflowerBlue" },
    { x: 300, y: 150, d: 50, cor: "blue" },
    { x: 560, y: 120, d: 40, cor: "purple" },
  ];

  for (const circulo of circulos) {
    const raio = circulo.d / 2;
    circulo.areaTotal = Math.round(Math.PI * (raio ** 2));
  }

  btnJogarNovamente = createButton('Jogar Novamente');
  btnJogarNovamente.parent("canvas-container"); 
  btnJogarNovamente.mousePressed(resetarJogo);
  btnJogarNovamente.touchStarted(resetarJogo);
  btnJogarNovamente.class('botao-sobre-canvas');
  btnJogarNovamente.id('btnJogarNovamente');
  btnJogarNovamente.hide();

  btnReplay = createButton('Replay');
  btnReplay.parent("canvas-container");
  btnReplay.mousePressed(iniciarReplay);
  btnReplay.touchStarted(iniciarReplay);
  btnReplay.class('botao-sobre-canvas');
  btnReplay.id('btnReplay');
  btnReplay.hide();
}

function draw() {
  image(imgFundo, 0, 0, width, height);

  if (replayAtivo) {
    for (let i = 0; i < indiceReplay; i++) {
      const ponto = caminhoDoDesenho[i];
      stroke(ponto.cor);
      strokeWeight(ponto.tamanho);
      line(ponto.px, ponto.py, ponto.x, ponto.y);
    }
    animarReplay();
  } else {
    for (const ponto of caminhoDoDesenho) {
      stroke(ponto.cor);
      strokeWeight(ponto.tamanho);
      line(ponto.px, ponto.py, ponto.x, ponto.y);
    }
  }

  desenharContornos();

  if ((mouseIsPressed || touches.length > 0) && podeDesenhar) {
    desenharNovoPonto();
  }
}

// --- FUNÇÕES DE CONTROLE DO JOGO ---
function verificarPrecisao() {
  if (caminhoDoDesenho.length === 0) return;
  
  let resultados = circulos.map(() => ({ dentro: 0, fora: 0 }));
  let dentroGeral = 0;
  let foraGeral = 0;
  let todasPrecisoesAcima90 = true;
  
  for (const ponto of caminhoDoDesenho) {
    const i = ponto.circuloId;
    const c = circulos[i];
    const distancia = dist(ponto.x, ponto.y, c.x, c.y);
    const raio = c.d / 2;
    const limiteInterno = distancia - ponto.tamanho / 2;
    const limiteExterno = distancia + ponto.tamanho / 2;
    if (limiteExterno <= raio) { resultados[i].dentro++; dentroGeral++; } 
    else if (limiteInterno > raio) { resultados[i].fora++; foraGeral++; } 
    else { resultados[i].dentro += 0.5; resultados[i].fora += 0.5; dentroGeral += 0.5; foraGeral += 0.5; }
  }

  let div = document.getElementById("resultado");
  div.innerHTML = "<h3>Resultados por Círculo</h3>";
  
  resultados.forEach((res, i) => {
    let total = res.dentro + res.fora;
    let precisao = total > 0 ? (res.dentro / total) * 100 : 0;
    if (precisao <= 90) { todasPrecisoesAcima90 = false; }
    let erro = total > 0 ? (res.fora / total) * 100 : 0;
    const swatch = `<span style=\"display:inline-block; width:14px; height:14px; background:${circulos[i].cor}; margin-right:8px; border:1px solid #000; vertical-align:middle;\"></span>`;
    div.innerHTML += `<p>${swatch}<b style=\"vertical-align:middle;color:${circulos[i].cor}\">Círculo ${i + 1} (Total: ${circulos[i].areaTotal} pixels)</b><br>Dentro: ${res.dentro.toFixed(1)} | Fora: ${res.fora.toFixed(1)}<br>Precisão: ${precisao.toFixed(2)}% | Erro: ${erro.toFixed(2)}%</p>`;
  });
  
  let totalGeral = dentroGeral + foraGeral;
  let precisaoGeral = totalGeral > 0 ? (dentroGeral / totalGeral) * 100 : 0;
  let erroGeral = totalGeral > 0 ? (foraGeral / totalGeral) * 100 : 0;
  
  div.innerHTML += `<hr><h3>Resumo Geral</h3><p>Dentro: ${dentroGeral.toFixed(1)} | Fora: ${foraGeral.toFixed(1)}</p><p><b>Precisão Total:</b> ${precisaoGeral.toFixed(2)}%</p><p><b>Erro Total:</b> ${erroGeral.toFixed(2)}%</p>`;
  
  btnJogarNovamente.show();
  if (todasPrecisoesAcima90) {
    btnReplay.show();
  }
}

function resetarJogo() {
  caminhoDoDesenho = [];
  podeDesenhar = true;
  document.getElementById("resultado").innerHTML = "";
  btnJogarNovamente.hide();
  btnReplay.hide();
}

function iniciarReplay() {
  replayAtivo = true;
  indiceReplay = 0;
  btnReplay.elt.disabled = true;
  btnJogarNovamente.elt.disabled = true;
}

function animarReplay() {
  if (indiceReplay < caminhoDoDesenho.length) {
    const pontosPorFrame = 1; 
    indiceReplay = min(indiceReplay + pontosPorFrame, caminhoDoDesenho.length);
  } else {
    replayAtivo = false;
    btnReplay.elt.disabled = false;
    btnJogarNovamente.elt.disabled = false;
  }
}

// --- FUNÇÕES DE DESENHO E INTERAÇÃO ---
function desenharNovoPonto() {
  let x, y, px, py;

  if (touches.length > 0) {
    x = touches[0].x;
    y = touches[0].y;
    px = pmouseX;
    py = pmouseY;
  } else {
    x = mouseX;
    y = mouseY;
    px = pmouseX;
    py = pmouseY;
  }

  if (x < 0 || x > width || y < 0 || y > height) return;

  let selectedIndex = -1;
  let minDist = Infinity;
  for (let i = 0; i < circulos.length; i++) {
    const circulo = circulos[i];
    const distancia = dist(x, y, circulo.x, circulo.y);
    if (distancia < circulo.d / 2 && distancia < minDist) {
      minDist = distancia;
      selectedIndex = i;
    }
  }

  if (selectedIndex !== -1) {
    const ponto = { x: x, y: y, px: px, py: py, cor: circulos[selectedIndex].cor, tamanho: 15, circuloId: selectedIndex };
    caminhoDoDesenho.push(ponto);
  }
}

function desenharContornos() {
  strokeWeight(3);
  noFill();
  for (const circulo of circulos) {
    stroke('black');
    circle(circulo.x, circulo.y, circulo.d);
  }
}

// --- FUNÇÕES DE EVENTOS (MOUSE E TOQUE) ---
function mouseReleased() {
  if (caminhoDoDesenho.length > 0) {
    verificarPrecisao();
  }
}

function touchEnded() {
  if (caminhoDoDesenho.length > 0) {
    verificarPrecisao();
  }
}

function touchStarted() {
  if (touches.length > 0) {
    const t = touches[0];
    if (t.x >= 0 && t.x <= width && t.y >= 0 && t.y <= height) {
      return false;
    }
  }
}

function touchMoved() {
  if (touches.length > 0) {
    const t = touches[0];
    if (t.x >= 0 && t.x <= width && t.y >= 0 && t.y <= height) {
      return false;
    }
  }
}