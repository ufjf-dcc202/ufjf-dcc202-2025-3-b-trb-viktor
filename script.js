criarTabuleiro();

function criarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");

    for(let i=0; i<100; i++){
        const novoDiv = document.createElement("div");
        novoDiv.classList.add("quadrado");
        tabuleiro.appendChild(novoDiv);
    }

    const robo = document.getElementById("robo");
    const primeiroQuadrado = tabuleiro.firstChild;
    primeiroQuadrado.appendChild(robo);
}
