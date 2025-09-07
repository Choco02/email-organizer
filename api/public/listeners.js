// Get elements
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const cancelBtn = document.getElementById('cancelBtn');
const submitEmails = document.getElementById('submitEmails');
const messageText = document.getElementById('messageText');
const fileInput = document.getElementById('fileInput');
const fileEmailsInput = document.getElementById("fileEmailsInput");
const fileEmailsInputContainer = document.getElementById("fileEmailsInputContainer");
const searchInput = document.getElementById('searchInput');

let filterText = '';

fileEmailsInputContainer.addEventListener("click", () => {
    // fileEmailsInput.click();
})

fileEmailsInput.addEventListener("change", (e) => {
    const [file] = e.target.files
    console.log(e)
    console.log(file)
    if (file) {
        const filenameInputEmails = document.getElementById("filenameInputEmails")
        console.log(filenameInputEmails)
        filenameInputEmails.textContent = file.name;
        filenameInputEmails.classList.remove("hidden");
    }
})

fileEmailsInputContainer.addEventListener("dragover", e => {
    e.preventDefault()
    fileEmailsInputContainer.classList.add("bg-blue-50")
})

fileEmailsInputContainer.addEventListener("dragleave", () => {
    fileEmailsInputContainer.classList.remove("bg-blue-50")
})

fileEmailsInputContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    fileEmailsInputContainer.classList.remove("bg-blue-50")

    const files = e.dataTransfer.files

    if (files.length > 0) {
        fileEmailsInput.files = files
        const [file] = files
        filenameInputEmails.textContent = file.name;
        filenameInputEmails.classList.remove("hidden")
    }
})

searchInput.addEventListener('input', (e) => {
    filterText = e.target.value;
    createTabContent('todos');
});

// Open the modal
openModalBtn.addEventListener('click', function () {
    modalOverlay.classList.remove('hidden');
});

// Close the modal
closeModalBtn.addEventListener('click', function () {
    modalOverlay.classList.add('hidden');
});

// Close modal when clicking outside of the modal content
modalOverlay.addEventListener('click', function (event) {
    if (event.target === modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
});

// Handle the cancel button click
cancelBtn.addEventListener('click', function () {
    modalOverlay.classList.add('hidden');
});

// Handle the send button click
submitEmails.addEventListener('click', async function (event) {
    // 1. Previne o comportamento padrão do form para não recarregar a página
    event.preventDefault();
    submitEmails.disabled = true

    const message = messageText.value.trim(); // .trim() remove espaços em branco extras
    const file = fileEmailsInput.files[0];

    // Cria um objeto FormData vazio para ser preenchido
    let formData = new FormData();

    // 2. Lógica para decidir o que enviar
    if (file) {
        // Cenário 1: Arquivo presente. Apenas adicione o arquivo ao FormData.
        console.log("Arquivo anexado. Ignorando a textarea.");
        formData.append('file', file);

        // Opcional: Adicionar a mensagem também se houver
        // formData.append('message', message);

        await sendData(formData);

    } else {
        // Cenário 2: Sem arquivo anexado. Verifique a textarea.
        if (message === '') {
            // Cenário 2a: TextArea vazia.
            console.log("Nenhum arquivo ou mensagem fornecida.");
            alert('Por favor, forneça uma mensagem ou anexe um arquivo.');
            // Não fazemos nada mais, apenas saímos da função.

        } else {
            // Cenário 2b: TextArea com conteúdo.
            console.log("Conteúdo na textarea. Criando Blob e enviando.");

            // Cria um Blob com o conteúdo da textarea
            const blob = new Blob([message], { type: 'text/plain' });

            // Adiciona o Blob ao FormData com um nome de arquivo
            formData.append('file', blob, 'conteudo.txt');

            await sendData(formData);
        }
    }

    // Fecha o modal após o processamento, independentemente do resultado
    modalOverlay.classList.add('hidden');
});
