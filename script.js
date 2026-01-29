const tabuleiro = document.querySelector("#tabuleiro");
const robo = document.querySelector("#robo");
criarTabuleiro();
const primeiroQuadrado = tabuleiro.firstChild;
primeiroQuadrado.appendChild(robo);
const areas = document.querySelectorAll(".area");
for(const area of areas){
    area.classList.add("nao-selecionada");
}   
areas[0].classList.replace("nao-selecionada", "selecionada");
let areaAtiva = areas[0];
for(const area of areas){
    area.addEventListener("click", selecaoArea);
}

let direcaoRobo = 1; //0: cima, 1: direita, 2: baixo, 3: esquerda
let roboX = 0;
let roboY = 0;

const botaoComando = document.querySelectorAll(".comando"); //7 botões
botoes();
lixeira();

let executando = false;

let lista = [];

const botaoExe = document.querySelectorAll(".executaveis");
botoesExecutaveis();

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

function listaComandos(areaAtiva, lista, loop = 0) {
    if(loop>20){
        return;
    }

    const comandos = areaAtiva.querySelectorAll(".icone-area");
    for(const comando of comandos){
        switch(comando.dataset.comando){
            case "avancar":
                lista.push(comando.dataset.comando);
                break;
            case "girarAntiHorario":
                lista.push(comando.dataset.comando);
                break;
            case "girarHorario":
                lista.push(comando.dataset.comando);
                break;
            case "pular":
                lista.push(comando.dataset.comando);
                break;
            case "acender":
                lista.push(comando.dataset.comando);
                break;
            case "p1":
                listaComandos(areas[1], lista, loop+1);
                break;
            case "p2":
                listaComandos(areas[2], lista, loop+1);
                break;
            default:
                break;
        }
    }
}

function executar(lista) {
    if(lista.length === 0){
        executando = false;
        return;
    }

    setTimeout(()=> {
        const comando = lista.shift();
        switch(comando){
            case "avancar":
                movimentacaoRobo();
                break;
            case "girarAntiHorario":
                girarAntiHorario();
                break;
            case "girarHorario":
                girarHorario();
                break;
            case "pular":
                pular();
                break;
            case "acender":
                acender();
                break;
            default:
                break;
        }
        executar(lista);
    }, 500);
}

function reset() {
    executando = false;
    roboX = 0;
    roboY = 0;
    direcaoRobo = 1;
    primeiroQuadrado.appendChild(robo);
    const quadrado = tabuleiro.querySelectorAll(".quadrado");
    for(const atual of quadrado) {
        if(atual.classList.contains("aceso")){
            atual.classList.replace("aceso", "apagado");
        }
    }
}

function selecaoArea(event) {
    for(const area of areas){
        area.classList.remove("selecionada");
        area.classList.add("nao-selecionada");
    }

    const areaSelecionada = event.currentTarget;
    areaSelecionada.classList.remove("nao-selecionada");
    areaSelecionada.classList.add("selecionada");

    areaAtiva = areaSelecionada;
}

function iconesNasAreas(event) {
    const icones = areaAtiva.querySelectorAll(".icone-area");
    if(icones.length >= 21){
        return;
    }

    const comandoSelecionado = event.currentTarget.dataset.comando;

    const iconeArea = document.createElement("div");
    iconeArea.classList.add("icone-area");
    iconeArea.dataset.comando = comandoSelecionado;
    iconeArea.innerText = comandoSelecionado;

    iconeArea.addEventListener("click", ()=> {
        iconeArea.remove();
    });

    areaAtiva.appendChild(iconeArea);
}

function lixeira() {
    const lixeiras = document.querySelectorAll(".lixeira");
    for(const lixeira of lixeiras){
        lixeira.addEventListener("click", (event)=>{
            event.stopPropagation();
            const iconesAtualmente = lixeira.parentElement.querySelectorAll(".icone-area"); 
            for(let i=iconesAtualmente.length-1; i>=0; i--){
                iconesAtualmente[i].remove();
            }
        })  
    }
}

function botoes() {
    for(const botao of botaoComando) {
        botao.addEventListener("click", iconesNasAreas);
    }
}

function botoesExecutaveis() {
    botaoExe[0].addEventListener("click", () => {
        if(executando){
            return;
        }
        executando = true;
        lista = [];
        listaComandos(areas[0], lista);
        executar(lista);
    })
    botaoExe[1].addEventListener("click", reset);
}