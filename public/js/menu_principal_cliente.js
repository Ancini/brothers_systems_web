const supabaseClient = supabase.createClient(
    "https://hnaapsbkrokrkmnzayyr.supabase.co",
    "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

import {
    buscarAbertos,
    buscarFechados
} from "./abertos_fechados.js";

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
        // Mapeando para as colunas exatas da sua View (imagem_estab e nome_estabelicimento)
        const imagem = est.imagem_estab || "css/imagens/default-barber.png";
        const nome = est.nome_estabelicimento;

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

// Dispara a busca
await inicializarEstabelecimentos();