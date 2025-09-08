// Function to create an accordion item with reply and file input
function createAccordionItem(data, renderCategoryLabel) {
    // console.log(data)
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('border-b', 'border-gray-300', 'my-2');

    // Create accordion header (clickable title)
    const accordionHeader = document.createElement('button');
    accordionHeader.classList.add('w-full', 'text-left', 'py-3', 'px-4', 'text-md', 'font-semibold', 'text-gray-800', 'hover:bg-gray-100', 'flex');

    const accordionHeaderUsername = document.createElement("p")
    const accordionHeaderSubject = document.createElement("p")
    const accordionHeaderDate = document.createElement("p")

    accordionHeaderUsername.textContent = data.username;
    accordionHeaderUsername.classList.add("w-40")
    accordionHeaderSubject.textContent = data.subject;
    accordionHeaderSubject.classList.add("grow")
    accordionHeaderDate.textContent = formatSingleDate(data.date);
    accordionHeaderDate.classList.add("w-20", "ml-2", "text-sm")

    const accountHeaderData = [accordionHeaderUsername, accordionHeaderSubject]

    accountHeaderData.forEach(i => accordionHeader.appendChild(i))


    // Add category label to all tabs (show in Todos, Produtivo, and Improdutivo)
    if (data.category && renderCategoryLabel) {
        const categoryLabel = document.createElement('span');
        categoryLabel.classList.add('ml-2', 'text-sm', 'py-1', 'px-2', 'rounded-full');

        // Assign color based on category
        if (data.category === "Produtivo") {
            categoryLabel.classList.add('bg-green-200', 'text-green-800'); // Green for "Produtivo"
            categoryLabel.textContent = "Produtivo";
        } else if (data.category === "Improdutivo") {
            categoryLabel.classList.add('bg-red-200', 'text-red-800'); // Red for "Improdutivo"
            categoryLabel.textContent = "Improdutivo";
        }

        accordionHeader.appendChild(categoryLabel);
    }

    accordionHeader.appendChild(accordionHeaderDate)
    accordionItem.appendChild(accordionHeader);

    // Create accordion content (hidden by default)
    const accordionContent = document.createElement('div');
    accordionContent.classList.add('accordion-content', 'h-0', 'overflow-hidden', 'transition-[height]', 'duration-300', 'px-4', 'py-2', 'text-gray-600');
    accordionContent.innerHTML = `<p class="mt-2"><strong>${data.address}</strong></br>${data.content}</p>`;
    accordionItem.appendChild(accordionContent);

    // Add event listener to toggle the content visibility
    accordionHeader.addEventListener('click', () => {
        accordionContent.classList.toggle('h-60')
        // Toggle the visibility of reply section
        replySection.classList.toggle('hidden');
    });

    data.files.forEach(f => {
        const fileReceived = downloadFileFromBase64(f.content, f.name, f.content_type)
        fileReceived.classList.add('text-blue-600', 'text-sm', 'font-semibold')

        const attachmentLabel = document.createElement('p')
        const attachmentContainer = document.createElement('div')

        attachmentContainer.classList.add('mt-2', 'flex', 'gap-2')

        attachmentLabel.textContent = 'Anexos'
        attachmentLabel.classList.add('text-sm')

        attachmentContainer.appendChild(attachmentLabel)
        attachmentContainer.appendChild(fileReceived)
        accordionContent.appendChild(attachmentContainer)
    })

    // Create reply section with textarea and reply button
    const replySection = document.createElement('div');
    replySection.classList.add('mt-4', 'space-y-4', 'hidden'); // Initially hidden

    // Textarea for reply
    const replyTextarea = document.createElement('textarea');
    replyTextarea.classList.add('w-full', 'p-4', 'border', 'rounded-md', 'bg-gray-100', 'resize-none', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
    replyTextarea.rows = 4;
    replyTextarea.value = data.suggested_reply;
    replySection.appendChild(replyTextarea);

    // Attachment and Reply button in the same row
    const actionRow = document.createElement('div');
    actionRow.classList.add('flex', 'items-center', 'justify-between', 'space-x-4');

    // Attachment input (Drag and drop functionality)
    const fileInputContainer = document.createElement('div');
    fileInputContainer.classList.add('border', 'border-gray-300', 'rounded-md', 'w-full', 'p-4', 'text-center', 'cursor-pointer', 'transition-all', 'hover:bg-blue-50');

    // Visual feedback for dragging
    const fileInputLabel = document.createElement('span');
    fileInputLabel.textContent = "Arraste e solte um arquivo aqui ou clique para escolher";
    fileInputLabel.classList.add('text-gray-500', 'block', 'mb-2');

    // Hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.classList.add('hidden');
    fileInputContainer.appendChild(fileInputLabel);
    fileInputContainer.appendChild(fileInput);

    // Create file name display
    const fileNameDisplay = document.createElement('div');
    fileNameDisplay.classList.add('mt-2', 'text-gray-600', 'text-sm');
    fileNameDisplay.classList.add('hidden');  // Initially hidden
    fileInputContainer.appendChild(fileNameDisplay);

    // Trigger click on file input when container is clicked
    fileInputContainer.addEventListener('click', () => {
        fileInput.click(); // This opens the file picker dialog
    });

    // Handle file input change event (triggered when user selects a file)
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name; // Display file name
            fileNameDisplay.classList.remove('hidden'); // Make filename visible
        }
    });

    // Drag and drop events
    fileInputContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileInputContainer.classList.add('bg-blue-50'); // Highlight the area when dragging
    });

    fileInputContainer.addEventListener('dragleave', () => {
        fileInputContainer.classList.remove('bg-blue-50'); // Remove highlight when leaving
    });

    fileInputContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        fileInputContainer.classList.remove('bg-blue-50'); // Remove highlight after drop
        const files = e.dataTransfer.files; // Get the dropped files
        if (files.length > 0) {
            fileInput.files = files; // Assign the files to the input
            const file = files[0];
            fileNameDisplay.textContent = file.name; // Display file name
            fileNameDisplay.classList.remove('hidden'); // Make filename visible
        }
    });

    // Reply button
    const replyButton = document.createElement('button');
    replyButton.textContent = "Responder";
    replyButton.classList.add('py-2', 'px-4', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');

    // Add event listener to handle the reply button click
    replyButton.addEventListener('click', () => {
        // For now, just alert the reply content for demo
        alert(`Replying to ${data.username}: ${replyTextarea.value}`);
        // Clear the textarea after reply
        replyTextarea.value = '';
    });

    actionRow.appendChild(fileInputContainer);
    actionRow.appendChild(replyButton);

    replySection.appendChild(actionRow);
    accordionItem.appendChild(replySection);

    return accordionItem;
}


function formatSingleDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();

    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
        // Return HH:MM format for today
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Intl.DateTimeFormat('pt-BR', options).format(date);
    } else {
        // Return DD/MM format for earlier days
        const options = { day: '2-digit', month: 'short' };
        return new Intl.DateTimeFormat('pt-BR', options).format(date);
    }
}


// Function to create tab content (filtering based on category)
function createTabContent(tabId) {
    // Clear the content container before adding new content
    contentContainer.innerHTML = '';

    // Filter the tabData based on the selected tab
    let filteredItems;
    if (tabId === 'todos') {
        filteredItems = tabData.todos; // Show all items in the Todos tab
    } else {
        filteredItems = tabData[tabId].filter(item => item.category.toLowerCase() === tabId); // Filter based on category
    }

    // Create the accordions for each filtered item
    filteredItems.filter(
        item => filterText.length < 1 ||
            item.content.toLowerCase()
                .includes(filterText.toLowerCase())
    ).forEach(item => {
        const accordionItem = createAccordionItem(item, tabId === "todos");
        contentContainer.classList.remove('flex', 'justify-center')
        contentContainer.appendChild(accordionItem);
    });

    if (filteredItems.length < 1) {
        const emptyTabLabel = document.createElement('p')
        emptyTabLabel.textContent = 'Classifique seus e-mails entre mais importante (produtivo) e menos importante (improdutivo) e receba sugestões de respostas automáticas'
        emptyTabLabel.classList.add('text-lg', 'text-blue-500', 'font-semibold')
        contentContainer.classList.add('flex', 'justify-center')
        contentContainer.appendChild(emptyTabLabel)
    }
}


// Function to update count next to each tab
function updateTabCounts() {
    document.getElementById('todos-count').textContent = tabData.todos.length > 0 ? `(${tabData.todos.length})` : '';
    document.getElementById('produtivo-count').textContent = tabData.produtivo.length > 0 ? `(${tabData.produtivo.length})` : '';
    document.getElementById('improdutivo-count').textContent = tabData.improdutivo.length > 0 ? `(${tabData.improdutivo.length})` : '';
}


// Function to change tab content
function changeTabContent(tabId) {
    // Remove 'active' class from all tabs
    [...tabs].filter(tab => tab.id.includes("tab")).forEach(tab => {
        tab.classList.remove('bg-blue-500', 'text-white');
        tab.children[0].classList.remove('text-white');
    });

    // Add 'active' class to the clicked tab
    const clickedTab = document.getElementById(`tab-${tabId}`);
    clickedTab.classList.add('bg-blue-500', 'text-white');
    clickedTab.children[0].classList.add('text-white')

    // Create content for the selected tab
    createTabContent(tabId);
}


function downloadFileFromBase64(base64String, fileName, mimeType) {
    // 1. Decodifique a string base64
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 2. Crie um Blob com o tipo MIME correto
    const blob = new Blob([byteArray], { type: mimeType });

    // 3. Crie uma URL de Objeto
    const url = URL.createObjectURL(blob);

    // 4. Crie um link de download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.textContent = fileName
    return link
}

