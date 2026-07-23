const supabaseClient = supabase.createClient(
    "https://hnaapsbkrokrkmnzayyr.supabase.co",
    "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

// Salva usuário no navegador
export function salvarSessao(user) {
    localStorage.setItem("usuarioLogado", JSON.stringify(user)); // Corrigido de localSatorage para localStorage
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
   NOVA FUNÇÃO: LOGIN COM BUSCA DE PERFIL
   ========================================== */
export async function efetuarLogin(email, senha) {
    try {
        // 1. Faz o login no sistema de autenticação do Supabase
        const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: senha
        });

        if (authError) throw authError;

        // 2. Busca a sua tabela customizada 'usuario' para trazer o campo 'barbeiro'
        const { data: dadosUsuario, error: dbError } = await supabaseClient
            .from('usuario') 
            .select('barbeiro')
            .eq('id', authData.user.id) // Vincula pelo ID gerado na autenticação
            .single();

        if (dbError) {
            console.warn("Aviso: Não foi possível buscar o perfil na tabela usuario:", dbError.message);
        }

        // 3. Mescla o objeto criando as propriedades 'barbeiro' e 'id_usuario' no objeto final
        const usuarioCompleto = {
            ...authData.user,
            id_usuario: authData.user.id, // Adicionado para facilitar a busca de pontuação nas views
            barbeiro: dadosUsuario ? dadosUsuario.barbeiro : false
        };

        // 4. Salva no localStorage com o dado atualizado do banco!
        salvarSessao(usuarioCompleto);

        return { sucesso: true, usuario: usuarioCompleto };

    } catch (error) {
        return { sucesso: false, erro: error.message };
    }
}

/* ==========================================
   VERIFICAÇÃO DE PERFIL E ROTA
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

  // Verifica a flag booleana que veio do banco
  if (usuario.barbeiro === true || usuario.barbeiro === "true" || usuario.barbeiro === "s") {
      console.log(`O usuário é um barbeiro ativo.`);
      
      // Retorna um objeto indicando que ele tem acesso especial
      return {
          eBarbeiro: true,
          telaInicial: "home_cliente.html", 
          exibirBotaoPainel: true           
      };
  }

  // Usuário comum (cliente)
  return {
      eBarbeiro: false,
      telaInicial: "home_cliente.html",
      exibirBotaoPainel: false
  };
}