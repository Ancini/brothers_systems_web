const supabase = supabase.createClient(
  "https://SEU_PROJECT.supabase.co",
  "SUA_ANON_KEY"
);

async function cadastrarUsuario(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const confirmarsenha = document.getElementById("confirmarsenha").value;

    if (senha !== confirmarsenha) {
        alert("Senhas diferentes");
        return;
    }

    try {

        // 🔥 1. Criar no Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: senha,
        });

        if (error) throw error;

        const authId = data.user.id;

        // 🔥 2. Salvar no seu banco via Cloud Code
        const resposta = await Parse.Cloud.run("cadastrarUsuario", {
            nome: nome,
            email: email,
            telefone: telefone,
            auth_id: authId // 👈 mudou aqui
        });

        alert("Usuário cadastrado com sucesso");

        console.log(resposta);

    } catch (erro) {

        console.error(erro);
        alert("Erro ao cadastrar");

    }
}