const tabuleiro = document.querySelector("#tabuleiro");
const robo = document.querySelector("#robo");
criarTabuleiro();
const primeiroQuadrado = tabuleiro.firstChild;
primeiroQuadrado.appendChild(robo);

let direcaoRobo = 1; //0: cima, 1: direita, 2: baixo, 3: esquerda
let robox = 0;
let roboy = 0;

const botao = document.querySelectorAll("button"); //7 botões
botoes();

function criarTabuleiro() {
    for(let i=0; i<100; i++){
        const novoDiv = document.createElement("div");
        novoDiv.classList.add("quadrado");
        tabuleiro.appendChild(novoDiv);
        novoDiv.dataset.x = i % 10;
        novoDiv.dataset.y = Math.floor(i / 10);
    }
}

function movimentacaoRobo() {
    const robox0 = robox;
    const roboy0 = roboy;
    if(direcaoRobo===0){
        roboy -= 1;
    }
    else if(direcaoRobo===1){
        robox += 1;
    }
    else if(direcaoRobo===2){
        roboy += 1;
    }
    else{
        roboy -= 1;
    }

    const localizador = '.quadrado[data-x="'+ robox +'"][data-y="'+ roboy +'"]';
    const proximoQuadrado = document.querySelector(localizador);

    if(proximoQuadrado) {
        proximoQuadrado.appendChild(robo);
    }
    else{
        robox = robox0;
        roboy = roboy0;
    }
}

function botoes() {
    botao[0].addEventListener("click", movimentacaoRobo);
}