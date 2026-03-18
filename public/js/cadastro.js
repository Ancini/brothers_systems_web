Parse.initialize("RFqDC4TzWQhojTYJImCifE2Ig1aAxOYl3XmAYhEE");
Parse.serverURL = "https://parseapi.back4app.com";

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

        const resposta = await Parse.Cloud.run("cadastrarUsuario", {
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha
        });

        alert("Usuário cadastrado com sucesso");

        console.log(resposta);

    } catch (erro) {

        console.error(erro);
        alert("Erro ao cadastrar");

    }

}