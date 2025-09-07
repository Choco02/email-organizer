// Sample address data with category classification (produtivo or improdutivo)
const tabData = {
    todos: [],
    produtivo: [],
    improdutivo: []
};

function clearData() {
    tabData.todos = []
    tabData.produtivo = []
    tabData.improdutivo = []

    updateTabCounts();
}


// Get all tab buttons and content container
const tabs = document.querySelectorAll('.py-2.px-4');
const contentContainer = document.getElementById('tab-content');


// Add click event listener to each tab
[...tabs].filter(tab => tab.id.includes("tab")).forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.id.replace('tab-', '');
        changeTabContent(tabId);
    });
});


// Initialize with "Todos" tab active and update the counts
updateTabCounts();
changeTabContent('todos');


// Função assíncrona para enviar o FormData
async function sendData(formData) {
    clearData()
    // 1. Cria o controlador de aborto
    const controller = new AbortController();

    // 2. Define o tempo limite (timeout) para a requisição
    const timeout = 10000; // 10 segundos em milissegundos
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
            // 3. Associa o sinal do controlador à requisição fetch
            signal: controller.signal,
        });

        // 4. Se a requisição for bem-sucedida, limpa o temporizador
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Sucesso!', result);
        tabData.todos = result.emails
        tabData.produtivo = result.emails.filter(i => i.category === "Produtivo");
        tabData.improdutivo = result.emails.filter(i => i.category === "Improdutivo");
        updateTabCounts()
        createTabContent('todos')
        alert('Dados enviados com sucesso!');

    } catch (error) {
        // 5. Trata o erro de cancelamento (timeout)
        if (error.name === 'AbortError') {
            console.error('A requisição excedeu o tempo limite.');
            alert('A requisição demorou muito para responder. Por favor, tente novamente.');
        } else {
            console.error('Falha ao enviar:', error);
            alert('Falha ao enviar os dados.');
        }

    } finally {
        // Garantir que o temporizador seja limpo em qualquer cenário
        clearTimeout(timeoutId);
        submitEmails.disabled = false
    }
}
