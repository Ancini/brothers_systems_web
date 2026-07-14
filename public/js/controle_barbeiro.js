// Nome do barbeiro logado (pode ser recuperado dinamicamente do seu sistema futuramente)
const BARBEIRO_LOGADO = "Gabriel Eduardo Ancini"; 

document.addEventListener("DOMContentLoaded", () => {
    inicializarLinhaDoTempo();
});

// 1. GERA OS 4 DIAS DINAMICAMENTE
function inicializarLinhaDoTempo() {
    const meses = ["JAN", "FEB", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
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
    const hojeFormatado = new Date().toISOString().split('T')[0];
    buscarAgendamentosDaAPI(hojeFormatado);
}

// 2. BUSCA OS AGENDAMENTOS NA VIEW (ATRAVÉS DA SUA API)
async function buscarAgendamentosDaAPI(dataFiltro) {
    try {
        // Substitua pela rota real da sua API que lê a view 'agendamentos_barbeiro'
        const response = await fetch(`/api/agendamentos?barbeiro=${encodeURIComponent(BARBEIRO_LOGADO)}&data=${dataFiltro}`);
        const agendamentos = await response.json();

        // Atualiza o contador de agendamentos do topo
        atualizarContadorAgendamentos(agendamentos.length);

        // Renderiza os cards na tela
        renderizarAgendamentos(agendamentos);
    } catch (error) {
        console.error("Erro ao buscar agendamentos do banco:", error);
    }
}

// 3. ATUALIZA O CARD DE CONTATEM DO TOPO (VERMELHO)
function atualizarContadorAgendamentos(quantidade) {
    const cardContador = document.querySelector(".total_agendamentos .titulo2");
    if (cardContador) {
        cardContador.textContent = quantidade;
    }
}

// 4. FORMATA O HORÁRIO DE "17:00" PARA "05:00" E RETORNA "PM" OU "AM"
function formatarHora12h(horarioStr) {
    // Separa horas e minutos de formatos como "17:00" ou "09:30"
    const partes = horarioStr.split(":");
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

// 5. RENDERIZA OS CARDS EM ORDEM DE HORÁRIO
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

    // Ordena por horário crescente
    listaAgendamentos.sort((a, b) => a.horario.localeCompare(b.horario));

    listaAgendamentos.forEach(item => {
        const { horaFormatada, periodo } = formatarHora12h(item.horario);

        const blocoAgendamento = document.createElement("div");
        blocoAgendamento.className = "borda-mostrar-agendamentos";

        blocoAgendamento.innerHTML = `
            <div class="card agendamentos_por_ordem">
                <div class="texto-agendamento_ordem"></div>
                <span class="titulo1">Cliente</span>
                <span class="titulo2">${item.cliente}</span>
                <span class="titulo3">Serviço</span>
                <span class="titulo4">${item.servico}</span>
                <span class="titulo5">${periodo}</span>
                <span class="titulo5">${horaFormatada}</span>
            </div>
        `;

        container.appendChild(blocoAgendamento);
    });
}