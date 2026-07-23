import { buscarAbertos, buscarFechados } from "./abertos_fechados.js";

async function carregarPontuacaoUsuario() {
    try {
        // Supondo que você pegue o ID ou o nome do usuário logado (exemplo usando localStorage ou sessão)
        // Substitua '53' ou a variável correta do seu sistema de login
        const idUsuarioLogado = 53; // Pegue da sua sessão atual

        const { data, error } = await supabase
            .from('vw_pontuacao_usuario') 
            .select('pontuacao_total')
            .eq('id_usuario', idUsuarioLogado)
            .single();

        if (error) throw error;

        // Atualiza o HTML com o valor vindo do banco
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
        const abertos = await buscarAbertos();
        const fechados = await buscarFechados();

        renderizar(abertos, "abertos");
        renderizar(fechados, "fechados");
    } catch (error) {
        console.error("Erro ao carregar os estabelecimentos:", error);
    }
}

// Dispara as buscas automaticamente ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    inicializarEstabelecimentos();
    carregarPontuacaoUsuario();
});