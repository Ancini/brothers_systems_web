const supabaseClient = supabase.createClient(
    "https://hnaapsbkrokrkmnzayyr.supabase.co",
    "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

// Salva usuário no navegador
export function salvarSessao(user) {
  localStorage.setItem("usuarioLogado", JSON.stringify(user));
}

// Pega usuário logado
export function pegarSessao() {
  return JSON.parse(localStorage.getItem("usuarioLogado"));
}

// Remove sessão (logout)
export function logout() {
  localStorage.removeItem("usuarioLogado");
  console.log("Usuário deslogado, sessão removida");
}

/* ==========================================
   NOVA FUNÇÃO: VERIFICAÇÃO DE PERFIL E ROTA
   ========================================== */

/**
 * Avalia o perfil do usuário logado e retorna a tela de destino correta
 * ou define se o botão extra deve ser exibido.
 */
export function verificarFluxoUsuario() {
  const usuario = pegarSessao();
  
  if (!usuario) {
      console.log("Nenhum usuário logado.");
      return "login.html"; // Se não tiver sessão, manda pro login
  }

  // Verifica a flag booleana que você criou/vai alterar no banco
  if (usuario.is_barbeiro === true) {
      console.log(`O usuário ${usuario.nome} é um barbeiro ativo.`);
      
      // Retorna um objeto indicando que ele tem acesso especial
      return {
          eBarbeiro: true,
          telaInicial: "home_cliente.html", // Ele entra na tela comum do cliente...
          exibirBotaoPainel: true           // ...mas o sistema sabe que deve mostrar o botão extra!
      };
  }

  // Usuário comum (cliente)
  return {
      eBarbeiro: false,
      telaInicial: "home_cliente.html",
      exibirBotaoPainel: false
  };
}