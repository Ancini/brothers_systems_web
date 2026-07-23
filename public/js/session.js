const supabaseClient = supabase.createClient(
    "https://hnaapsbkrokrkmnzayyr.supabase.co",
    "sb_publishable_AaxUlPsbivnRIu2_iu3Epg_nzr8w-3u"
);

// Salva usuário no navegador
export function salvarSessao(user) {
    localStorage.setItem("usuarioLogado", JSON.stringify(user)); // Corrigido aqui
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

        // 2. Busca a sua tabela customizada 'usuario' para trazer o ID numérico e o campo 'barbeiro'
        // IMPORTANTE: Certifique-se de que o .select() também puxa o 'id' (ou o campo que é a chave na sua tabela)
        const { data: dadosUsuario, error: dbError } = await supabaseClient
            .from('usuario') 
            .select('id, barbeiro') // <-- Garanta que o 'id' da sua tabela customizada está sendo puxado aqui
            .eq('id', authData.user.id) 
            .single();

        if (dbError) {
            console.warn("Aviso: Não foi possível buscar o perfil na tabela usuario:", dbError.message);
        }

        // 3. Mescla o objeto incluindo o ID da sua tabela e a propriedade 'barbeiro'
        const usuarioCompleto = {
            ...authData.user,
            id_tabela: dadosUsuario ? dadosUsuario.id : null, // ID numérico da sua tabela customizada
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
export function verificarFluxoUsuario() {
  const usuario = pegarSessao();
  
  if (!usuario) {
      console.log("Nenhum usuário logado.");
      return "login.html"; 
  }

  if (usuario.barbeiro === true || usuario.barbeiro === "true" || usuario.barbeiro === "s") {
      console.log(`O usuário é um barbeiro ativo.`);
      return {
          eBarbeiro: true,
          telaInicial: "home_cliente.html", 
          exibirBotaoPainel: true           
      };
  }

  return {
      eBarbeiro: false,
      telaInicial: "home_cliente.html",
      exibirBotaoPainel: false
  };
}