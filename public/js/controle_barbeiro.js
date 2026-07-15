// 1. CONFIGURAÇÃO DO SUPABASE
// Substitua pelas suas chaves reais do projeto
const supabaseClient = supabase.createClient(
    "https://hnaapsbkrokrkmnzayyr.supabase.co",
    "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

// Puxa o usuário logado (usando o ID 53 do Gabriel que vi no seu print para teste)
const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado")) || { id: 53, nome: "Gabriel Ancini" };

document.addEventListener("DOMContentLoaded", () => {
    // Atualiza o nome na interface
    const elNomeBarbeiro = document.querySelector('.texto-barbeiro .titulo2');
    if (elNomeBarbeiro) elNomeBarbeiro.textContent = usuarioLogado.nome;

    inicializarLinhaDoTempo();
});

// 2. GERA OS 4 DIAS DINAMICAMENTE
function inicializarLinhaDoTempo() {
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const diasSemana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    
    const containerDias = document.querySelector(".linha-tempo-dias");
    containerDias.innerHTML = ""; // Limpa itens estáticos

    for (let i = 0; i < 4; i++) {
        const dataRef = new Date();
        dataRef.setDate(dataRef.getDate() + i);

        const diaNum = dataRef.getDate();
        const mesStr = meses[dataRef.getMonth()];
        const diaSemanaStr = diasSemana[dataRef.getDay()];
        
        // Formata a data para comparar com o banco (AAAA-MM-DD)
        const ano = dataRef.getFullYear();
        const mesZero = String(dataRef.getMonth() + 1).padStart(2, '0');
        const diaZero = String(diaNum).padStart(2, '0');
        const dataFormatadaBanco = `${ano}-${mesZero}-${diaZero}`;

        // Cria o card de agendamento/dia do HTML original
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

        // Evento de clique para mudar o dia ativo e recarregar dados
        cardDia.addEventListener("click", () => {
            document.querySelectorAll(".linha-tempo-dias .card.agendamento").forEach(card => {
                card.classList.remove("ativo");
            });
            cardDia.classList.add("ativo");
            
            buscarAgendamentosDaAPI(dataFormatadaBanco);
        });

        containerDias.appendChild(cardDia);
    }

    // Carrega os dados de HOJE na primeira execução
    // Mudança: Pega a data formatada localmente para evitar problemas de fuso horário com o ISOString
    const hoje = new Date();
    const dataFiltroHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
    buscarAgendamentosDaAPI(dataFiltroHoje);
}

// 3. BUSCA OS AGENDAMENTOS NA VIEW (SUPABASE)
async function buscarAgendamentosDaAPI(dataFiltro) {
    try {
        const { data: agendamentos, error } = await supabaseClient
            .from('vw_agenda_do_barbeiro')
            .select('*')
            .eq('id_prestador', usuarioLogado.id) // Filtra pelo ID do barbeiro (53)
            .eq('data_agendamento', dataFiltro)   // Filtra pela data clicada
            .order('horario_inicio', { ascending: true }); // Já traz em ordem de horário do banco

        if (error) throw error;

        // Atualiza o contador de agendamentos do topo
        atualizarContadorAgendamentos(agendamentos.length);

        // Renderiza os cards na tela
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

// 5. FORMATA O HORÁRIO DE "17:00" PARA "05:00" E RETORNA "PM" OU "AM"
function formatarHora12h(horarioStr) {
    if (!horarioStr) return { horaFormatada: "--:--", periodo: "" };

    // Pega só os 5 primeiros caracteres (ex: "14:30:00" vira "14:30")
    const horarioLimpo = horarioStr.substring(0, 5); 
    const partes = horarioLimpo.split(":");
    let horas = parseInt(partes[0], 10);
    const minutos = partes[1];
    
    const periodo = horas >= 12 ? "PM" : "AM";
    
    horas = horas % 12;
    horas = horas ? horas : 12; // A hora 0 deve ser 12
    const horasStr = String(horas).padStart(2, '0');

    return {
        horaFormatada: `${horasStr}:${minutos}`,
        periodo: periodo
    };
}

// 6. RENDERIZA OS CARDS
function renderizarAgendamentos(listaAgendamentos) {
    const container = document.getElementById("container-lista-agendamentos");
    container.innerHTML = ""; // Limpa a lista antiga

    if (listaAgendamentos.length === 0) {
        container.innerHTML = `
            <div class="borda-mostrar-agendamentos" style="justify-content: center; padding: 20px;">
                <span class="titulo2">Nenhum agendamento para este dia!</span>
            </div>
        `;
        return;
    }

    listaAgendamentos.forEach(item => {
        // Usa os nomes das colunas da View: horario_inicio, nome_cliente, nome_servico
        const { horaFormatada, periodo } = formatarHora12h(item.horario_inicio);
        const nomeCliente = item.nome_cliente || "Cliente não informado";
        const nomeServico = item.nome_servico || "Serviço padrão";

        const blocoAgendamento = document.createElement("div");
        blocoAgendamento.className = "borda-mostrar-agendamentos";
        blocoAgendamento.style.width = "100%"; // Garante que ocupe o espaço corretamente

        blocoAgendamento.innerHTML = `
            <div class="card agendamentos_por_ordem" style="width: 100%; max-width: 400px; margin: 0 auto;">
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