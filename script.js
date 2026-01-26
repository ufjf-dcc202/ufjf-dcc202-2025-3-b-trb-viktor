const tabuleiro = document.querySelector("#tabuleiro");
const robo = document.querySelector("#robo");
criarTabuleiro();
const primeiroQuadrado = tabuleiro.firstChild;
primeiroQuadrado.appendChild(robo);
const areas = document.querySelectorAll(".area");
areas.forEach(area => area.classList.add("nao-selecionada"));
areas[0].classList.replace("nao-selecionada", "selecionada");
let areaAtiva = areas[0];
areas.forEach(area => {
    area.addEventListener("click", selecaoArea);
})

let direcaoRobo = 1; //0: cima, 1: direita, 2: baixo, 3: esquerda
let roboX = 0;
let roboY = 0;

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
        if(i===5) {
            novoDiv.classList.add("apagado");
        }
    }
}

function movimentacaoRobo() {
    const roboX0 = roboX;
    const roboY0 = roboY;
    if(direcaoRobo===0){
        roboY -= 1;
    }
    else if(direcaoRobo===1){
        roboX += 1;
    }
    else if(direcaoRobo===2){
        roboY += 1;
    }
    else{
        roboX -= 1;
    }

    const proximoQuadrado = quadradoSeguinte(roboX, roboY);

    if(proximoQuadrado && Number(robo.parentElement.dataset.z) === Number(proximoQuadrado.dataset.z)) {
        proximoQuadrado.appendChild(robo);
    }
    else{
        roboX = roboX0;
        roboY = roboY0;
    }
}

function quadradoSeguinte(x, y) {
    const localizador = '.quadrado[data-x="'+ x +'"][data-y="'+ y +'"]';
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

function pular(){
    let proximoX = roboX;
    let proximoY = roboY;

    if(direcaoRobo === 0){
        proximoY -= 1;
    }
    else if(direcaoRobo === 1){
        proximoX += 1;
    }
    else if(direcaoRobo === 2){
        proximoY += 1;
    }
    else{
        proximoX -= 1;
    }

    const proximoQuadrado = quadradoSeguinte(proximoX, proximoY);
    
    if(proximoQuadrado){
        const alturaAtual = Number(robo.parentElement.dataset.z);
        const alturaSeguinte = Number(proximoQuadrado.dataset.z);
        if(alturaSeguinte === alturaAtual+1 || alturaSeguinte < alturaAtual){
            proximoQuadrado.appendChild(robo);
            roboX = proximoX;
            roboY = proximoY;
        }
    }
}

function acender() {
    if(robo.parentElement.classList.contains("apagado")) {
        robo.parentElement.classList.replace("apagado", "aceso");
    }
    else if(robo.parentElement.classList.contains("aceso")){
        robo.parentElement.classList.replace("aceso", "apagado");
    }
}

function selecaoArea(event) {
    areas.forEach(area =>{
        area.classList.remove("selecionada");
        area.classList.add("nao-selecionada");
    })

    const areaSelecionada = event.currentTarget;
    areaSelecionada.classList.remove("nao-selecionada");
    areaSelecionada.classList.add("selecionada");

    areaAtiva = areaSelecionada;
}

function botoes() {
    botao[0].addEventListener("click", movimentacaoRobo);
    botao[1].addEventListener("click", girarAntiHorario);
    botao[2].addEventListener("click", girarHorario);
    botao[3].addEventListener("click", pular);
    botao[4].addEventListener("click", acender);
}