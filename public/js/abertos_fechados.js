import { supabase } from "./supabase.js";

// Busca os estabelecimentos abertos
export async function buscarAbertos() {
    // A tabela correta é "estabelecimento"
    // Vamos filtrar pela coluna 'aberto' (ajuste se o nome for diferente no seu banco)
    const { data, error } = await supabase
        .from("estabelecimento") 
        .select("*")
        .eq("aberto", true); 

    if (error) {
        console.error("Erro ao buscar abertos:", error);
        return [];
    }
    return data;
}

// Busca os estabelecimentos fechados
export async function buscarFechados() {
    const { data, error } = await supabase
        .from("estabelecimento")
        .select("*")
        .eq("aberto", false); // Ajuste se o nome da coluna for outro

    if (error) {
        console.error("Erro ao buscar fechados:", error);
        return [];
    }
    return data;
}