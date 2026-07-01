import { supabase } from "./supabase.js";

// Buscar abertos
export async function buscarAbertos() {

    const { data, error } = await supabase
        .from("estabelecimentos_abertos")
        .select("*");

    if (error) {
        console.error("Erro ao buscar abertos:", error);
        return [];
    }

    return data;
}

// Buscar fechados
export async function buscarFechados() {

    const { data, error } = await supabase
        .from("estabelecimentos_fechados")
        .select("*");

    if (error) {
        console.error("Erro ao buscar fechados:", error);
        return [];
    }

    return data;
}