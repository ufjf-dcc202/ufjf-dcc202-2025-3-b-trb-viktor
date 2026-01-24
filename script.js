const tabuleiro = document.getElementById("tabuleiro");

        for(let i=0; i<100; i++){
            const novoDiv = document.createElement("div");
            novoDiv.classList.add("quadrado");
            tabuleiro.appendChild(novoDiv);
        }