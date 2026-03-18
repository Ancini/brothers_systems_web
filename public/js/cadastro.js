Parse.initialize("RFqDC4TzWQhojTYJImCifE2Ig1aAxOYl3XmAYhEE");
Parse.serverURL = "https://parseapi.back4app.com";

async function cadastrarUsuario(event){

    event.preventDefault();

    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if(senha !== confirmarSenha){
        alert("Senhas diferentes");
        return;
    }

    try{

        await Parse.Cloud.run("cadastrarUsuario", {
            email,
            telefone,
            senha
        });

        alert("Cadastrado!");

    }catch(e){

        console.error(e);
        alert("Erro");

    }

}