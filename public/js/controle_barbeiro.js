// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = "https://hnaapsbkrokrkmnzayyr.supabase.co";
const SUPABASE_KEY = "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let idBarbeiroLogado = null; 

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Identifica quem é o barbeiro primeiro
    const sucesso = await inicializarIdentidadeBarbeiro();
    
    // 2. Só inicializa a interface se a identidade for confirmada
    if (sucesso) {
        inicializarLinhaDoTempo();
    } else {
        console.error("Não foi possível identificar o barbeiro. Verifique o login ou o vínculo no banco.");
    }
});

// FUNÇÃO DA PONTE
async function inicializarIdentidadeBarbeiro() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
        console.warn("Usuário não está logado.");
        return false;
    }

    const { data: vinculo, error } = await supabaseClient
        .from('prestador')
        .select('id_prestador')
        .eq('uuid_vinculo', user.id) 
        .limit(1); 

    if (error) {
        console.error("Erro na busca de vínculo:", error);
        return false;
    } 
    
    if (vinculo && vinculo.length > 0) {
        idBarbeiroLogado = vinculo[0].id_prestador;
        console.log("Barbeiro logado com sucesso. ID:", idBarbeiroLogado);
        return true;
    } else {
        console.warn("Nenhum prestador vinculado a este usuário.");
        return false;
    }
}

// 2. GERA OS 4 DIAS DINAMICAMENTE
function inicializarLinhaDoTempo() {
    const containerDias = document.querySelector(".linha-tempo-dias");
    containerDias.innerHTML = ""; 

    for (let i = 0; i < 4; i++) {
        const dataRef = new Date();
        dataRef.setDate(dataRef.getDate() + i);

        // Formatação simples para o banco e para exibição
        const dataFormatadaBanco = dataRef.toISOString().split('T')[0];
        
        const cardDia = document.createElement("div");
        cardDia.className = `card agendamento ${i === 0 ? 'ativo' : ''}`;
        cardDia.dataset.data = dataFormatadaBanco;

        cardDia.innerHTML = `
            <div class="texto-dia">
                <span class="titulo1">${dataRef.getDate()} DE ${["JAN","FEV","MAR","ABR","MAI","JUN","JUL","AGO","SET","OUT","NOV","DEZ"][dataRef.getMonth()]}</span>
                <span class="titulo2">${["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"][dataRef.getDay()]}</span>
            </div>
        `;

        cardDia.addEventListener("click", () => {
            document.querySelectorAll(".linha-tempo-dias .card").forEach(c => c.classList.remove("ativo"));
            cardDia.classList.add("ativo");
            buscarAgendamentosDaAPI(dataFormatadaBanco);
        });

        containerDias.appendChild(cardDia);
    }

    // Carrega o dia de hoje ao iniciar
    buscarAgendamentosDaAPI(new Date().toISOString().split('T')[0]);
}

// 3. BUSCA OS AGENDAMENTOS
async function buscarAgendamentosDaAPI(dataFiltro) {
    if (!idBarbeiroLogado) return;

    try {
        const { data: agendamentos, error } = await supabaseClient
            .from('vw_agenda_do_barbeiro')
            .select('*')
            .eq('id_prestador', idBarbeiroLogado)
            .eq('data_agendamento', dataFiltro) 
            .order('horario_inicio', { ascending: true });

        if (error) throw error;

        // Chame suas funções de renderização aqui
        if (typeof renderizarAgendamentos === 'function') {
            renderizarAgendamentos(agendamentos);
            atualizarContadorAgendamentos(agendamentos.length);
        }
    } catch (error) {
        console.error("Erro na busca de agendamentos:", error);
    }
}