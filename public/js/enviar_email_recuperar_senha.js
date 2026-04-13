const supabaseClient = supabase.createClient(
  "https://hnaapsbkrokrkmnzayyr.supabase.co",
  "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

async function recuperarSenha(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;

    try {

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
            redirectTo: "esqueci_minha_senha.html"
        });

        if (error) throw error;

        alert("Se o email existir, você receberá um link para redefinir a senha.");

    } catch (erro) {
        console.error(erro);
        alert("Erro ao enviar email");
    }
}