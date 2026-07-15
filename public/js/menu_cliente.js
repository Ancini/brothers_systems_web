import { buscarEstabelecimentos } from "./abertos_fechados.js";

async function inicializarEstabelecimentos() {
    try {
        // Agora buscamos tudo de uma vez
        const { abertos, fechados } = await buscarEstabelecimentos();

        renderizar(abertos, "abertos");
        renderizar(fechados, "fechados");
    } catch (error) {
        console.error("Erro ao carregar os estabelecimentos:", error);
    }
}

function renderizar(lista, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Container com ID '${containerId}' não foi encontrado no HTML.`);
        return;
    }

    container.innerHTML = "";

    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <p style="color: #999; font-size: 14px; grid-column: 1/-1; text-align: center; padding: 20px;">
                Nenhum estabelecimento encontrado nesta categoria.
            </p>
        `;
        return;
    }

    lista.forEach(est => {
        const imagem = est.imagem_estab;
        const nome = est.nome_estabelecimento; // 🔥 CORREÇÃO: Corrigi o nome da propriedade

        container.innerHTML += `
            <div class="estabelecimento-item">
                <div class="estabelecimento-logo">
                    <img src="${imagem}" alt="${nome}">
                </div>
                <span class="estabelecimento-nome">
                    ${nome}
                </span>
            </div>
        `;
    });
}

// Dispara a busca automaticamente
inicializarEstabelecimentos();



