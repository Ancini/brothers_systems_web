import { buscarAbertos, buscarFechados } from "./abertos_fechados.js";
import { pegarSessao } from "./session.js";

async function carregarPontuacaoUsuario() {
    try {
        // Pega o objeto do usuário logado que salvamos no localStorage
        const usuario = pegarSessao();

        if (!usuario || !usuario.id_tabela) {
            console.warn("Nenhum usuário logado ou ID não encontrado.");
            return;
        }

        const idUsuarioLogado = usuario.id_tabela; // O ID numérico da sua tabela 'usuario'

        const { data, error } = await supabaseClient
            .from('view_pontuacao_usuario') // Substitua pelo nome exato da View
            .select('pontuacao_total')
            .eq('id_usuario', idUsuarioLogado) // Coluna da sua view que filtra o usuário
            .single();

        if (error) throw error;

        const elementoPontuacao = document.getElementById('pontuacao-usuario');
        if (elementoPontuacao && data) {
            elementoPontuacao.textContent = data.pontuacao_total;
        }

    } catch (error) {
        console.error("Erro ao carregar a pontuação:", error);
    }
}

async function inicializarEstabelecimentos() {
    try {
        // Busca os estabelecimentos abertos e fechados das Views
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
        const imagem = est.imagem_estab;
        const nome = est.nome_estabelecimento || est.nome_estabelicimento; 

        container.innerHTML += `
            <div class="estabelecimento-item">
                <div class="estabelecimento-logo">
                    <img src="${imagem}" alt="${nome}">
                </div>
                <div class="estabelecimento-nome">${nome}</div>
            </div>
        `;
    });
}

// Dispara as funções automaticamente quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
    inicializarEstabelecimentos();
    carregarPontuacaoUsuario();
});