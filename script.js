const tabuleiro = document.querySelector("#tabuleiro");
let faseAtual = 0;
const niveis = [{
    //Nível 1
    casasApagadas: [2, 7, 20, 29, 70, 79, 92, 97],
    z0: [],
    z1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 19, 29, 39, 49, 59, 69, 79, 89, 99, 91, 92, 93, 94, 95, 96, 97, 98],
    z2: [], z3: [], z4: []
},
{
    //Nível 2
    casasApagadas: [41, 32, 45, 68],
    z0: [],
    z1: [4, 5, 14, 15],
    z2: [23, 24, 25, 26, 41, 51, 48, 58],
    z3: [31, 33, 34, 35, 36, 38, 68],
    z4: [22, 32, 42, 43, 44, 45, 46, 47, 37, 27]
},
{
    //Nível 3
    casasApagadas: [31, 38, 81, 88, 64, 65, 54, 55],
    z0: [],
    z1: [21, 28, 71, 78],
    z2: [22, 27, 72, 77],
    z3: [20, 30, 40, 50, 60, 70, 80, 90, 29, 39, 49, 59, 69, 79, 89, 99, 91, 92, 93, 94, 95, 96, 97, 98, 32, 37, 82, 87, 84, 85, 74, 75],
    z4: [31, 38, 81, 88, 54, 55, 64, 65]
}
];

const robo = document.querySelector("#robo");
criarTabuleiro();
const primeiroQuadrado = tabuleiro.firstChild;
primeiroQuadrado.appendChild(robo);

alert("Bem vindo ao LightBot!\nNesse jogo, seu objetivo é acender todas as casas apagadas através de uma sequência de comandos que você irá escolher!\nClique nos botões para adicioná-los às áreas de comando e depois clique em executar!");

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
let listaIniciada = false;

let lista = [];

const botaoExe = document.querySelectorAll(".executaveis");
botoesExecutaveis();

let iconeAnterior = null;
let velocidade = 500;
let tempoExecucao = null;



function criarTabuleiro() {
    tabuleiro.innerHTML = "";
    const fase = niveis[faseAtual];
    for(let i=0; i<100; i++){
        const novoDiv = document.createElement("div");
        novoDiv.classList.add("quadrado");
        
        novoDiv.dataset.x = i % 10;
        novoDiv.dataset.y = Math.floor(i / 10);
        
        if(fase.z4 && fase.z4.includes(i)) {
            novoDiv.dataset.z = "4";
        }
        else if(fase.z3 && fase.z3.includes(i)) {
            novoDiv.dataset.z = "3";
        }
        else if(fase.z2 && fase.z2.includes(i)) {
            novoDiv.dataset.z = "2";
        }
        else if(fase.z1.includes(i)) {
            novoDiv.dataset.z = "1";
        }
        else {
            novoDiv.dataset.z = "0";
        }

        if(fase.casasApagadas.includes(i)) {
            novoDiv.classList.add("apagado");
        }

        tabuleiro.appendChild(novoDiv);
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
    robo.dataset.direcao = direcaoRobo;
}

function girarAntiHorario() {
    direcaoRobo -= 1;
    if(direcaoRobo === -1){
        direcaoRobo = 3;
    }
    robo.dataset.direcao = direcaoRobo;
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
    vitoria();
}

function listaComandos(areaAtiva, lista, loop = 0) {
    if(loop>20){
        alert("Você fez um loop que se repetiu mais de 20 vezes, o nível será reiniciado!");
        reset();
        return;
    }

    const comandos = areaAtiva.querySelectorAll(".icone-area");
    for(const comando of comandos){
        lista.push(comando);
        if(comando.dataset.comando === "p1"){
            listaComandos(areas[1], lista, loop+1);
        }
        else if(comando.dataset.comando === "p2"){
            listaComandos(areas[2], lista, loop+1);
        }
    }
}

function executar(lista) {
    if(lista.length === 0){
        executando = false;
        return;
    }

    tempoExecucao = setTimeout(() => {
        executarAcoes(lista);
        executar(lista);
    }, velocidade);
}

function executarAcoes(lista) {
    if(iconeAnterior) {
        iconeAnterior.classList.remove("comando-atual");
    }

    const iconeAtual = lista.shift();
    if(!iconeAtual) {
        return;
    }
    iconeAtual.classList.add("comando-atual");

    iconeAnterior = iconeAtual;

    const comando = iconeAtual.dataset.comando;

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
}

function passo_a_passo() {
    if(executando) {
        return;
    }

    if(!listaIniciada && lista.length === 0) {
        listaComandos(areas[0], lista);
        listaIniciada = true;
    }

    if(lista.length > 0){
        executarAcoes(lista);
    }
}

function reset() {
    clearTimeout(tempoExecucao);
    listaIniciada = false;
    executando = false;
    lista = [];
    roboX = 0;
    roboY = 0;
    direcaoRobo = 1;
    robo.dataset.direcao = direcaoRobo;
    tabuleiro.firstChild.appendChild(robo);
    const quadrado = tabuleiro.querySelectorAll(".quadrado");
    for(const atual of quadrado) {
        if(atual.classList.contains("aceso")){
            atual.classList.replace("aceso", "apagado");
        }
    }
    const proximaFase = document.querySelector("#proxima-fase");
    proximaFase.classList.add("invisivel");
    proximaFase.classList.remove("visivel");

    if(iconeAnterior){
        iconeAnterior.classList.remove("comando-atual");
        iconeAnterior = null;
    }
}

function adaptarVelocidade(velocidadeEscolhida) {
    if(executando){
            return;
        }
        velocidade = velocidadeEscolhida;
        executando = true;
        listaIniciada = true;
        lista = [];
        listaComandos(areas[0], lista);
        executar(lista);
}

function vitoria() {
    const apagados = tabuleiro.querySelectorAll(".apagado");
    const proximaFase = document.querySelector("#proxima-fase");
    if(apagados.length === 0) {
        proximaFase.classList.replace("invisivel", "visivel");
    }
    else{
        proximaFase.classList.add("invisivel");
        proximaFase.classList.remove("visivel");
    }
}

function limparAreaComandos() {
    const icones = document.querySelectorAll(".icone-area");
    for(const icone of icones) {
        icone.remove();
    }
    for(const area of areas) {
        area.classList.remove("selecionada");
        area.classList.add("nao-selecionada");
    }
    areas[0].classList.replace("nao-selecionada", "selecionada");
    lista = [];
    listaIniciada = false;
    iconeAnterior = null;
}

function selecaoArea(event) {
    if(executando) {
        return;
    }

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
        if(executando) {
        return;
        }
        iconeArea.remove();
    });

    areaAtiva.appendChild(iconeArea);
}

function lixeira() {
    const lixeiras = document.querySelectorAll(".lixeira");
    for(const lixeira of lixeiras){
        lixeira.addEventListener("click", (event)=>{
            if(executando) {
                return;
            }
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
        adaptarVelocidade(500);
    })
    botaoExe[1].addEventListener("click", () => {
        adaptarVelocidade(250);
    })
    botaoExe[2].addEventListener("click", passo_a_passo);
    botaoExe[3].addEventListener("click", reset);
    botaoExe[4].addEventListener("click", () => {
        if(faseAtual < niveis.length - 1) {
            faseAtual++;
            if(faseAtual === 1) {
                alert("Nível 2\nPara acessar áres de diferentes alturas (sinalizadas por diferentes cores), você irá usar comando 'Pular'(4º comando da lista)!")
            }
            limparAreaComandos();
            criarTabuleiro();
            reset();
        }
        else {
            alert("Parabéns, você concluiu o jogo!!!");
        }
    })
}