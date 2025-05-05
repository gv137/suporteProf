document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("chamado-form");
    const statusMessage = document.getElementById("mensagem-status");
    // URL do Google Apps Script fornecida pelo usuário
    const scriptURL = "https://script.google.com/macros/s/AKfycbzEdEfLrZdTRCbpq5aahiioRZ7BWyqOdsHovJKsjR6OHnH5JhI7yrFnx3E4CKn58XKMjQ/exec";

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário
        statusMessage.textContent = ""; // Limpa mensagens anteriores
        statusMessage.className = ""; // Limpa classes de estilo anteriores

        // --- Validação Simples --- 
        const nomeProfessor = document.getElementById("nome-professor").value.trim();
        const sala = document.getElementById("sala").value.trim();
        const tipoProblema = document.getElementById("tipo-problema").value;
        const descricao = document.getElementById("descricao").value.trim();

        if (!nomeProfessor) {
            mostrarErro("Por favor, informe o nome do professor.");
            return;
        }
        if (!sala) {
            mostrarErro("Por favor, informe a sala.");
            return;
        }
        if (!tipoProblema) {
            mostrarErro("Por favor, selecione o tipo de problema.");
            return;
        }
        if (!descricao) {
            mostrarErro("Por favor, forneça uma descrição detalhada do problema.");
            return;
        }

        // Se a validação passar, prossegue para o envio
        console.log("Formulário validado. Enviando...");
        mostrarStatus("Enviando chamado...", false); // Mensagem de status

        // Desabilita o botão de envio para evitar múltiplos cliques
        const submitButton = form.querySelector("button[type='submit']");
        submitButton.disabled = true;

        // Cria um objeto FormData a partir do formulário
        const formData = new FormData(form);

        // Envia os dados para a planilha
        enviarDadosParaPlanilha(formData, submitButton);

    });

    function mostrarErro(mensagem) {
        statusMessage.textContent = mensagem;
        statusMessage.className = "erro"; // Adiciona classe CSS para erro
    }

    function mostrarStatus(mensagem, sucesso = true) {
        statusMessage.textContent = mensagem;
        statusMessage.className = sucesso ? "sucesso" : ""; // Adiciona classe CSS para sucesso ou remove
    }

    // --- Função de envio --- 
    function enviarDadosParaPlanilha(formData, button) {
        fetch(scriptURL, { method: "POST", body: formData })
            .then(response => {
                if (response.ok) {
                    mostrarStatus("Chamado enviado com sucesso!", true);
                    form.reset(); // Limpa o formulário
                } else {
                    // Tenta obter uma mensagem de erro do script, se houver
                    response.json().then(data => {
                        mostrarErro("Erro ao enviar chamado: " + (data.error || "Verifique a URL do script ou as permissões da planilha."));
                    }).catch(() => {
                        mostrarErro("Erro ao enviar chamado. Resposta inválida do servidor. Verifique a URL do script ou as permissões da planilha.");
                    });
                }
            })
            .catch(error => {
                console.error("Erro no fetch:", error);
                mostrarErro("Erro de rede ao tentar enviar o chamado: " + error.message);
            })
            .finally(() => {
                // Reabilita o botão de envio após a tentativa
                button.disabled = false;
            });
    }

});

