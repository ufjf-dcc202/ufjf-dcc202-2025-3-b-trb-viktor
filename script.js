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
        if(i<50){
            novoDiv.dataset.z = "0";
        }
        else if(i>=50 && i<90){
            novoDiv.dataset.z = "1";
        }
        else{
            novoDiv.dataset.z = "2";
        }
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
        robox -= 1;
    }

    const proximoQuadrado = quadradoSeguinte(robox, roboy);

    if(proximoQuadrado) {
        proximoQuadrado.appendChild(robo);
    }
    else{
        robox = robox0;
        roboy = roboy0;
    }
}

function quadradoSeguinte(x, y) {
    const localizador = '.quadrado[data-x="'+ robox +'"][data-y="'+ roboy +'"]';
    return document.querySelector(localizador);
}

function girarHorario() {
    direcaoRobo += 1;
    if(direcaoRobo === 4){
        direcaoRobo = 0;
    }
}

function girarAntiHorario() {
    direcaoRobo -= 1;
    if(direcaoRobo === -1){
        direcaoRobo = 3;
    }
}

function botoes() {
    botao[0].addEventListener("click", movimentacaoRobo);
    botao[1].addEventListener("click", girarAntiHorario);
    botao[2].addEventListener("click", girarHorario);
}