import { supabase } from "./supabase.js";

// Função para calcular se o estabelecimento está aberto agora
function estaAberto(horarioAbertura, horarioFechamento) {
    if (!horarioAbertura || !horarioFechamento) return false;

    const agora = new Date();
    const horaAtual = agora.getHours() * 60 + agora.getMinutes(); 

    const [hA, mA] = horarioAbertura.split(':').map(Number);
    const [hF, mF] = horarioFechamento.split(':').map(Number);
    
    const minAbertura = hA * 60 + mA;
    const minFechamento = hF * 60 + mF;

    return horaAtual >= minAbertura && horaAtual < minFechamento;
}

// Busca todos e filtra no JavaScript
export async function buscarEstabelecimentos() {
    const { data, error } = await supabase
        .from("estabelicimento") 
        .select("*");

    if (error) {
        console.error("Erro ao buscar estabelecimentos:", error);
        return { abertos: [], fechados: [] };
    }

    // Filtra baseando-se na função criada acima
    const abertos = data.filter(e => estaAberto(e.horario_abertura, e.horario_fechamento));
    const fechados = data.filter(e => !estaAberto(e.horario_abertura, e.horario_fechamento));

    return { abertos, fechados };
}