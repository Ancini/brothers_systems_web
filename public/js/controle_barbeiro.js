// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = "https://hnaapsbkrokrkmnzayyr.supabase.co";
const SUPABASE_KEY = "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let idBarbeiroLogado = null; // Variável global para armazenar o ID numérico encontrado

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Primeiro descobre quem é o barbeiro através do login (a ponte)
    await inicializarIdentidadeBarbeiro();
    
    // 2. Depois inicializa a interface
    inicializarLinhaDoTempo();
});

// FUNÇÃO DA PONTE: Converte o UUID do Auth para o ID numérico da tabela 'cadastro_prestador'
async function inicializarIdentidadeBarbeiro() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // A tabela se chama 'prestador'
    // A coluna que liga ao auth se chama 'id_cadastro_prestador'
    const { data: vinculo, error } = await supabaseClient
        .from('prestador') 
        .select('id_prestador')
        .eq('id_cadastro_prestador', user.id) 
        .single();

    if (error || !vinculo) {
        console.error("Erro ao vincular identidade do barbeiro:", error);
    } else {
        idBarbeiroLogado = vinculo.id_prestador;
    }
}

// 2. GERA OS 4 DIAS DINAMICAMENTE
function inicializarLinhaDoTempo() {
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const diasSemana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    
    const containerDias = document.querySelector(".linha-tempo-dias");
    containerDias.innerHTML = ""; 

    for (let i = 0; i < 4; i++) {
        const dataRef = new Date();
        dataRef.setDate(dataRef.getDate() + i);

        const diaNum = dataRef.getDate();
        const mesStr = meses[dataRef.getMonth()];
        const diaSemanaStr = diasSemana[dataRef.getDay()];
        
        const ano = dataRef.getFullYear();
        const mesZero = String(dataRef.getMonth() + 1).padStart(2, '0');
        const diaZero = String(diaNum).padStart(2, '0');
        const dataFormatadaBanco = `${ano}-${mesZero}-${diaZero}`;

        const cardDia = document.createElement("div");
        cardDia.className = `card agendamento ${i === 0 ? 'ativo' : ''}`;
        cardDia.style.cursor = "pointer";
        cardDia.dataset.data = dataFormatadaBanco;

        cardDia.innerHTML = `
            <div class="texto-dia">
                <span class="titulo1" style="text-align: center">${diaNum} DE ${mesStr}</span>
                <span class="titulo2" style="text-align: center">${diaSemanaStr}</span>
            </div>
        `;

        cardDia.addEventListener("click", () => {
            document.querySelectorAll(".linha-tempo-dias .card.agendamento").forEach(card => card.classList.remove("ativo"));
            cardDia.classList.add("ativo");
            buscarAgendamentosDaAPI(dataFormatadaBanco);
        });

        containerDias.appendChild(cardDia);
    }

    const hoje = new Date();
    const dataFiltroHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    buscarAgendamentosDaAPI(dataFiltroHoje);
}

// 3. BUSCA OS AGENDAMENTOS NA VIEW (SUPABASE)
async function buscarAgendamentosDaAPI(dataFiltro) {
    if (!idBarbeiroLogado) {
        console.warn("Ainda carregando identidade do barbeiro...");
        return;
    }

    try {
        const { data: agendamentos, error } = await supabaseClient
            .from('vw_agenda_do_barbeiro')
            .select('*')
            .eq('id_prestador', idBarbeiroLogado) // Usa a variável global preenchida pela ponte
            .eq('data_agendamento', dataFiltro) 
            .order('horario_inicio', { ascending: true });

        if (error) throw error;

        atualizarContadorAgendamentos(agendamentos.length);
        renderizarAgendamentos(agendamentos);
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
    }
}

// (Mantenha aqui as suas funções formatarHora12h, renderizarAgendamentos e atualizarContadorAgendamentos conforme você já tinha)