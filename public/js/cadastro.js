const supabaseClient = supabase.createClient(
  "https://hnaapsbkrokrkmnzayyr.supabase.co",
  "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

async function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarsenha = document.getElementById("confirmarsenha").value;

    // validação básica
    if (senha !== confirmarsenha) {
        alert("Senhas diferentes");
        return;
    }

    try {

        // 1. Cria usuário no Auth
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password: senha,
            options: {
                emailRedirectTo: "https://brotherssystems1-w1o4fqya.b4a.run/redefinir_senha.html"
            }
        });

        if (error) {
            throw error;
        }

        const authId = data?.user?.id;

        console.log("Usuário Auth criado:", authId);

        // verifica se ID existe
        if (!authId) {
            throw new Error("Não foi possível obter o ID do usuário");
        }

        // 2. Salva dados adicionais na tabela usuario
        const { data: usuarioData, error: usuarioError } =
            await supabaseClient
                .from("usuario")
                .insert({
                    nome,
                    email,
                    telefone,
                    auth_id: authId
                });

        if (usuarioError) {
            throw usuarioError;
        }

        console.log("Usuário salvo:", usuarioData);

        alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");

    } catch (erro) {

        console.error("Erro geral:", erro);

        alert(
            erro.message ||
            "Erro ao cadastrar usuário"
        );
    }
}