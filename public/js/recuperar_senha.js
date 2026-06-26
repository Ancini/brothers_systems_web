const supabaseClient = supabase.createClient(
  "https://hnaapsbkrokrkmnzayyr.supabase.co",
  "SUA_CHAVE"
);

async function redefinirSenha(event) {
    event.preventDefault();

    const novaSenha =
        document.getElementById("novaSenha").value;

    const confirmarSenha =
        document.getElementById("confirmarSenha").value;

    if (novaSenha !== confirmarSenha) {
        alert("As senhas não coincidem");
        return;
    }

    if (novaSenha.length < 6) {
        alert("A senha deve ter no mínimo 6 caracteres");
        return;
    }

    try {

        // verifica se a sessão foi criada pelo link
        const {
            data: { session }
        } = await supabaseClient.auth.getSession();

        if (!session) {
            alert("Link inválido ou expirado");
            return;
        }

        // atualiza a senha
        const { error } =
            await supabaseClient.auth.updateUser({
                password: novaSenha
            });

        if (error) throw error;

        alert("Senha alterada com sucesso!");

        window.location.href = "index.html";

    } catch (erro) {
        console.error("Erro:", erro);
        alert(erro.message || "Erro ao redefinir senha");
    }
}

document
.getElementById("formSenha")
.addEventListener("submit", redefinirSenha);