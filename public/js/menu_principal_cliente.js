import {
    buscarAbertos,
    buscarFechados
} from "./estabelecimentos.js";

const abertos = await buscarAbertos();
const fechados = await buscarFechados();

renderizar(abertos, "abertos");
renderizar(fechados, "fechados");


function renderizar(lista, containerId) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = "";

    lista.forEach(est => {

        container.innerHTML += `
            <div class="estabelecimento-item">
                <div class="estabelecimento-logo">
                    <img src="${est.imagem_url}" 
                         alt="${est.nome}">
                </div>

                <span class="estabelecimento-nome">
                    ${est.nome}
                </span>
            </div>
        `;
    });

}