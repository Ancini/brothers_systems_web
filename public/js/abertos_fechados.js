import { supabase } from "./supabase.js";

// Busca os estabelecimentos na tabela correta
export async function buscarAbertos() {
    // Busca onde a coluna 'aberto' (ou o nome que você deu ao campo de status) é true
    const { data, error } = await supabase
        .from("estabelecimento") 
        .select("*")
        .eq("aberto", true); // Ajuste o nome da coluna se for diferente

    if (error) {
        console.error("Erro ao buscar abertos:", error);
        return [];
    }
    return data;
}

export async function buscarFechados() {
    // Busca onde a coluna 'aberto' é false
    const { data, error } = await supabase
        .from("estabelecimento")
        .select("*")
        .eq("aberto", false);

    if (error) {
        console.error("Erro ao buscar fechados:", error);
        return [];
    }
    return data;
}