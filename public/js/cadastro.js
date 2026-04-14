const supabaseClient = supabase.createClient(
  "https://hnaapsbkrokrkmnzayyr.supabase.co",
  "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

Parse.initialize(
  "RFqDC4TzWQhojTYJImCifE2Ig1aAxOYl3XmAYhEE",
  "a3tRJSImhKFjFbmv4xMba3FWAqnlcrAN0jKKieDK"
);

Parse.serverURL = "https://parseapi.back4app.com";

async function cadastrarUsuario(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const confirmarsenha = document.getElementById("confirmarsenha").value;

    // ✅ validação básica
    if (senha !== confirmarsenha) {
        alert("Senhas diferentes");
        return;
    }

    try {

        // 🔥 1. cria usuário no Supabase Auth + redirect correto
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: senha,
            options: {
                emailRedirectTo: "https://SEU-APP.back4app.io/index.html"
            }
        });

        if (error) {
            console.error("Erro Supabase:", error);
            throw error;
        }

        const authId = data?.user?.id;

        // 🔥 2. salva no banco (mesmo sem confirmação ainda)
        if (authId) {
            const resposta = await Parse.Cloud.run("cadastrarUsuario", {
                nome: nome,
                email: email,
                telefone: telefone,
                auth_id: authId
            });

            console.log("Resposta backend:", resposta);
        }

        // 🔔 mensagem final
        alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");

    } catch (erro) {

        console.error("Erro geral:", erro);
        alert("Erro ao cadastrar usuário");

    }
}