import {
    buscarAbertos,
    buscarFechados
} from "./estabelecimentos.js";

// Executa a busca e renderização encapsulada para tratar possíveis erros de rede
async function inicializarEstabelecimentos() {
    try {
        const abertos = await buscarAbertos();
        const fechados = await buscarFechados();

        renderizar(abertos, "abertos");
        renderizar(fechados, "fechados");
    } catch (error) {
        console.error("Erro ao carregar os estabelecimentos:", error);
    }
}

function renderizar(lista, containerId) {
    const container = document.getElementById(containerId);
    
    // Evita erros caso o ID não exista no HTML
    if (!container) {
        console.warn(`Container com ID '${containerId}' não foi encontrado no HTML.`);
        return;
    }

    container.innerHTML = "";

    // Se não houver barbearias nessa categoria, exibe uma mensagem discreta
    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <p style="color: #999; font-size: 14px; grid-column: 1/-1; text-align: center; padding: 20px;">
                Nenhum estabelecimento encontrado nesta categoria.
            </p>
        `;
        return;
    }

    lista.forEach(est => {
        // Fallback para uma imagem padrão caso o banco não tenha uma URL válida
        const imagem = est.imagem_url || "css/imagens/default-barber.png";

        container.innerHTML += `
            <div class="estabelecimento-item">
                <div class="estabelecimento-logo">
                    <img src="${imagem}" alt="${est.nome}">
                </div>
                <span class="estabelecimento-nome">
                    ${est.nome}
                </span>
            </div>
        `;
    });
}

// Dispara a busca assim que o arquivo é carregado
await inicializarEstabelecimentos();