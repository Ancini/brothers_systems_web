async function recuperarSenha(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: 'http://localhost:5500/nova-senha.html'
      // depois troque pela URL real do site
    }
  );

  if (error) {
    console.log(error.message);
    alert("Erro ao enviar email");
    return;
  }

  alert("Email de recuperação enviado!");
}