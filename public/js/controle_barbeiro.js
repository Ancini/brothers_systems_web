// 1. CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = "https://hnaapsbkrokrkmnzayyr.supabase.co";
const SUPABASE_KEY = "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let idBarbeiroReal = null;
let nomeBarbeiroReal = "Barbeiro";

document.addEventListener("DOMContentLoaded", async () => {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        alert("Acesso negado. Faça login para acessar o painel.");
        window.location.href = "index.html"; 
        return;
    }

    try {
        // Se já tiver o id_banco salvo, usa ele. Caso contrário, busca na tabela 'usuario' pelo UUID ou E-mail
        if (usuarioLogado.id_banco) {
            idBarbeiroReal = usuarioLogado.id_banco;
            nomeBarbeiroReal = usuarioLogado.nome || "Gabriel Eduardo Ancini";
        } else {
            const identificador = usuarioLogado.id || usuarioLogado.email;
            const colunaBusca = typeof usuarioLogado.id === 'string' && usuarioLogado.id.length > 20 ? 'auth_id' : 'email';
            
            const { data: userDb, error } = await supabaseClient
                .from('usuario')
                .select('id_usuario, nome_usuario')
                .eq(colunaBusca, identificador)
                .single();

            if (error || !userDb) {
                throw new Error("Não foi possível localizar o registro do barbeiro no banco.");
            }

            idBarbeiroReal = userDb.id_usuario;
            nomeBarbeiroReal = userDb.nome_usuario;
        }

        // Atualiza o nome na interface
        const elNomeBarbeiro = document.querySelector('.texto-barbeiro .titulo2');
        if (elNomeBarbeiro) elNomeBarbeiro.textContent = nomeBarbeiroReal;

        inicializarLinhaDoTempo();

    } catch (err) {
        console.error("Erro ao validar sessão do barbeiro:", err);
    }
});

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
            document.querySelectorAll(".linha-tempo-dias .card.agendamento").forEach(card => {
                card.classList.remove("ativo");
            });
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
    if (!idBarbeiroReal) return;

    try {
        const { data: agendamentos, error } = await supabaseClient
            .from('vw_agenda_do_barbeiro')
            .select('*')
            .eq('id_prestador', idBarbeiroReal) 
            .eq('data_agendamento', dataFiltro)   
            .order('horario_inicio', { ascending: true }); 

        if (error) throw error;

        atualizarContadorAgendamentos(agendamentos.length);
        renderizarAgendamentos(agendamentos);
    } catch (error) {
        console.error("Erro ao buscar agendamentos do banco:", error);
    }
}

// 4. ATUALIZA O CARD DE CONTAGEM DO TOPO (VERMELHO)
function atualizarContadorAgendamentos(quantidade) {
    const cardContador = document.querySelector(".total_agendamentos .titulo2");
    if (cardContador) {
        cardContador.textContent = quantidade;
    }
}

// 5. FORMATA O HORÁRIO PARA 12H (AM/PM)
function formatarHora12h(horarioStr) {
    if (!horarioStr) return { horaFormatada: "--:--", periodo: "" };

    const horarioLimpo = horarioStr.substring(0, 5); 
    const partes = horarioLimpo.split(":");
    let horas = parseInt(partes[0], 10);
    const minutos = partes[1];
    
    const periodo = horas >= 12 ? "PM" : "AM";
    
    horas = horas % 12;
    horas = horas ? horas : 12; 
    const horasStr = String(horas).padStart(2, '0');

    return {
        horaFormatada: `${horasStr}:${minutos}`,
        periodo: periodo
    };
}

// 6. RENDERIZA OS CARDS DE AGENDAMENTO
function renderizarAgendamentos(listaAgendamentos) {
    const container = document.getElementById("container-lista-agendamentos");
    container.innerHTML = ""; 

    if (listaAgendamentos.length === 0) {
        container.innerHTML = `
            <div class="borda-mostrar-agendamentos" style="justify-content: center; padding: 20px;">
                <span class="titulo2">Nenhum agendamento para este dia!</span>
            </div>
        `;
        return;
    }

    listaAgendamentos.forEach(item => {
        const { horaFormatada, periodo } = formatarHora12h(item.horario_inicio);
        const nomeCliente = item.nome_cliente || "Cliente não informado";
        const nomeServico = item.nome_servico || "Serviço padrão";

        const blocoAgendamento = document.createElement("div");
        blocoAgendamento.className = "borda-mostrar-agendamentos";
        blocoAgendamento.style.width = "100%"; 

        blocoAgendamento.innerHTML = `
            <div class="card agendamentos_por_ordem" style="width: 100%; max-width: 400px; margin: 0 auto; position: relative;">
                <span class="titulo1">Cliente</span>
                <span class="titulo2">${nomeCliente}</span>
                <span class="titulo3 mt-1">Serviço</span>
                <span class="titulo4">${nomeServico}</span>
                
                <div style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center;">
                    <span class="titulo5" style="margin: 0; font-size: 32px; font-weight: 900; line-height: 1;">${horaFormatada}</span>
                    <span style="font-size: 20px; font-weight: 900;">${periodo}</span>
                </div>
            </div>
        `;

        container.appendChild(blocoAgendamento);
    });
}