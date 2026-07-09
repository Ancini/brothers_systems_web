import { supabase } from "./supabase.js";

const supabaseClient = supabase.createClient(
    "https://hnaapsbkrokrkmnzayyr.supabase.co",
    "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

// Buscar abertos
export async function buscarAbertos() {
    const { data, error } = await supabase
        .from("estabelicimentos_abertos") // Ajustado para corresponder à view do banco
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
        .from("estabelicimentos_fechados") // Ajustado para corresponder à view do banco
        .select("*");

    if (error) {
        console.error("Erro ao buscar fechados:", error);
        return [];
    }

    return data;
}