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