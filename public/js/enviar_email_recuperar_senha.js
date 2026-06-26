const supabaseClient = supabase.createClient(
    "https://hnaapsbkrokrkmnzayyr.supabase.co",
    "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

async function recuperarSenha(email) {

  const { error } =
    await supabaseClient.auth.resetPasswordForEmail(
      email,
      {
        redirectTo:
        'http://localhost:3000/redefinir_senha.html'
      }
    );

  if (error) {
    console.log(error.message);
    alert(error.message);
    return;
  }

  alert("Email de recuperação enviado!");
}