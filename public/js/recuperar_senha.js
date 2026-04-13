const supabaseClient = supabase.createClient(
  "https://hnaapsbkrokrkmnzayyr.supabase.co",
  "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

async function redefinirSenha(event) {
    event.preventDefault();

    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem");
        return;
    }

    if (novaSenha.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres");
        return;
    }

    try {

        // 🔥 verifica se o usuário veio pelo link (tem sessão)
        const { data: sessionData } = await supabaseClient.auth.getSession();

        if (!sessionData.session) {
            alert("Link inválido ou expirado");
            return;
        }

        // 🔥 atualiza senha
        const { error } = await supabaseClient.auth.updateUser({
            password: novaSenha
        });

        if (error) throw error;

        alert("Senha alterada com sucesso!");

        // opcional: redirecionar
        window.location.href = "index.html";

    } catch (erro) {
        console.error(erro);
        alert("Erro ao redefinir senha");
    }
}