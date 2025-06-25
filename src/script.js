// Obtém referências aos elementos HTML
const gerarJogosButton = document.getElementById('gerar-jogos');
const visualizarHistoricoButton = document.getElementById('visualizar-historico');
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const lotterySelect = document.getElementById('lottery-select');
const numGamesInput = document.getElementById('num-games-input');

// Elementos do histórico (agora dentro do modal de histórico)
const historicoArquivosContainer = document.getElementById('historico-arquivos-container-modal');
const historicoArquivosLista = document.getElementById('historico-arquivos-lista-modal');
const historicoConteudoContainer = document.getElementById('historico-conteudo-container-modal');
const historicoConteudoJogosWrapper = document.getElementById('historico-conteudo-jogos-wrapper-modal');
const currentFilenameSpan = document.getElementById('current-filename-modal');
const voltarHistoricoButton = document.getElementById('voltar-historico-modal');

// Elementos de Assistência (agora dentro do modal de assistência)
const assistenciaBtn = document.getElementById('assistencia-btn'); 
// A div assistenciaContainer na página principal é removida, substituída pelo modal
// const assistenciaContainer = document.getElementById('assistencia-container'); 
// Referências atualizadas para elementos dentro do modal de assistência
const hotNumbersList = document.getElementById('hot-numbers-list-modal');
const coldNumbersList = document.getElementById('cold-numbers-list-modal');

// Elementos de Limpar Histórico
const limparHistoricoBtn = document.getElementById('limpar-historico-btn'); 
const limparHistoricoDiretoBtn = document.getElementById('limpar-historico-direto-btn-modal'); 

// Referências ao Modal Personalizado de Confirmação
const customConfirmModal = document.getElementById('custom-confirm-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// Referências ao Novo Modal de Sucesso
const successModal = document.getElementById('success-modal');
const successModalMessage = document.getElementById('success-modal-message');

// Novas referências para tema e ajuste de fonte
const themeToggle = document.getElementById('theme-toggle');
const increaseFontButton = document.getElementById('increase-font');
const decreaseFontButton = document.getElementById('decrease-font');

// Referências para o novo modal de histórico
const historyModalOverlay = document.getElementById('history-modal-overlay');
const historyModalCloseBtn = document.getElementById('history-modal-close-btn');

// Novas referências para o modal de jogos gerados
const generatedGamesModalOverlay = document.getElementById('generated-games-modal-overlay');
const generatedGamesModalCloseBtn = document.getElementById('generated-games-modal-close-btn');
const jogosGeradosModalDisplay = document.getElementById('jogos-gerados-modal-display');
const copyGamesButtonModal = document.getElementById('copy-games-btn-modal'); 

// Novas referências para o modal de assistência
const assistenciaModalOverlay = document.getElementById('assistencia-modal-overlay');
const assistenciaModalCloseBtn = document.getElementById('assistencia-modal-close-btn');
const assistenciaModalTitle = document.getElementById('assistencia-modal-title');


// Elementos específicos para ajuste de fonte (atualizado com os novos IDs/referências)
const elementsToAdjustFont = [
    document.getElementById('main-title'), 
    lotterySelect,
    numGamesInput,
    ...Array.from(document.querySelectorAll('label')), 
    modalTitle,
    modalMessage,
    successModalMessage,
    document.getElementById('history-modal-title'), 
    historicoArquivosLista, 
    historicoConteudoJogosWrapper, 
    // hotNumbersList e coldNumbersList serão ajustados via displayNumberBalls
    assistenciaModalTitle, // Adicionado título do modal de assistência
    jogosGeradosModalDisplay,
    document.getElementById('generated-games-modal-title')
];


// Mapeamento de cores para cada loteria (deve corresponder ao gerador_loterias.py)
const LOTTERY_COLORS = {
    megasena: {
        primary: '#209869', 
        secondary: '#8FCBB3' 
    },
    lotofacil: {
        primary: '#930089', 
        secondary: '#C87FC3' 
    },
    quina: {
        primary: '#260085', 
        secondary: '#927FC1' 
    }
};

// Variável para armazenar os jogos gerados atualmente para a função de copiar
let currentGeneratedGames = [];

// Funções para gerenciar Tema
function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
    updateDynamicElementColors();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'; 
    applyTheme(savedTheme);
}

// Função para atualizar as cores de elementos que são criados dinamicamente ou têm estilos inline
function updateDynamicElementColors() {
    const mainContainer = document.querySelector('.container');
    if (mainContainer) {
        mainContainer.style.backgroundColor = 'var(--bg-secondary)';
        mainContainer.style.color = 'var(--text-primary)';
    }

    document.querySelectorAll('label').forEach(label => {
        label.style.color = 'var(--text-secondary)';
    });
    document.querySelectorAll('select, input[type="number"]').forEach(input => {
        input.style.borderColor = 'var(--border-color)';
        input.style.backgroundColor = 'var(--bg-secondary)';
        input.style.color = 'var(--text-secondary)';
    });

    document.querySelectorAll('.modal-overlay:not(.hidden) .modal-content').forEach(modalContent => {
        modalContent.style.backgroundColor = 'var(--bg-secondary)';
        modalContent.style.color = 'var(--text-primary)';
        modalContent.querySelector('h3').style.color = 'var(--text-primary)';
        if (modalContent.querySelector('p')) {
            modalContent.querySelector('p').style.color = 'var(--text-secondary)';
        }
        const cancelButton = modalContent.querySelector('.cancel-btn');
        if (cancelButton) {
            cancelButton.style.backgroundColor = 'var(--border-color)';
            cancelButton.style.color = 'var(--text-secondary)';
        }
    });

    // Atualiza elementos específicos dentro do modal de histórico
    if (!historyModalOverlay.classList.contains('hidden')) {
        historicoArquivosContainer.style.borderColor = 'var(--border-color)';
        historicoArquivosContainer.querySelector('h2').style.color = 'var(--text-primary)';
        historicoArquivosLista.style.backgroundColor = 'var(--bg-primary)';
        historicoArquivosLista.style.borderColor = 'var(--border-color)';
        document.querySelectorAll('#historico-arquivos-lista-modal > div').forEach(fileDiv => {
            fileDiv.style.backgroundColor = 'var(--border-color)';
            fileDiv.style.color = 'var(--text-secondary)';
            fileDiv.querySelector('span').style.color = 'var(--text-primary)';
        });

        if (!historicoConteudoContainer.classList.contains('hidden')) {
            historicoConteudoContainer.style.borderColor = 'var(--border-color)';
            historicoConteudoContainer.querySelector('h2').style.color = 'var(--text-primary)';
            historicoConteudoJogosWrapper.style.backgroundColor = 'var(--bg-primary)';
            historicoConteudoJogosWrapper.style.borderColor = 'var(--border-color)';
        }
    }

    // Atualizar elementos da seção de Assistência (dentro do modal)
    if (!assistenciaModalOverlay.classList.contains('hidden')) {
        document.getElementById('hot-numbers-display-modal').style.backgroundColor = 'var(--bg-secondary)';
        document.getElementById('hot-numbers-display-modal').style.borderColor = 'var(--border-color)';
        document.getElementById('cold-numbers-display-modal').style.backgroundColor = 'var(--bg-secondary)';
        document.getElementById('cold-numbers-display-modal').style.borderColor = 'var(--border-color)';
        document.querySelector('#hot-numbers-display-modal h3').style.color = 'var(--text-secondary)';
        document.querySelector('#cold-numbers-display-modal h3').style.color = 'var(--text-secondary)';
    }

    document.querySelector('h1#main-title').style.color = 'var(--text-primary)';
    document.querySelector('#loading-message').style.color = 'var(--text-secondary)';
    document.querySelector('#error-message').style.color = 'var(--text-secondary)';
}


// Funções para gerenciar Tamanho da Fonte
const FONT_STEP = 1; // Incremento/decremento em pixels
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;

function adjustFontSize(direction) {
    let currentBaseFontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-font-size'));
    let newBaseFontSize = currentBaseFontSize;

    if (direction === 'increase') {
        newBaseFontSize = Math.min(currentBaseFontSize + FONT_STEP, MAX_FONT_SIZE);
    } else if (direction === 'decrease') {
        newBaseFontSize = Math.max(currentBaseFontSize - FONT_STEP, MIN_FONT_SIZE);
    }
    
    document.documentElement.style.setProperty('--base-font-size', `${newBaseFontSize}px`);
    document.documentElement.style.setProperty('--h1-font-size', `${(newBaseFontSize * 2.25 / 16)}rem`); 
    document.documentElement.style.setProperty('--h2-font-size', `${(newBaseFontSize * 1.5 / 16)}rem`);
    document.documentElement.style.setProperty('--h3-font-size', `${(newBaseFontSize * 1.25 / 16)}rem`);
    document.documentElement.style.setProperty('--label-font-size', `${(newBaseFontSize * 0.875 / 16)}rem`);
    document.documentElement.style.setProperty('--ball-font-size', `${(newBaseFontSize / 16)}em`); 
    document.documentElement.style.setProperty('--modal-title-size', `${(newBaseFontSize * 1.5 / 16)}em`);
    document.documentElement.style.setProperty('--modal-message-size', `${(newBaseFontSize * 1.1 / 16)}em`);

    localStorage.setItem('baseFontSize', newBaseFontSize);
    
    elementsToAdjustFont.forEach(element => {
        if (element) {
            const style = getComputedStyle(document.documentElement);
            if (element.id === 'main-title') {
                element.style.fontSize = style.getPropertyValue('--h1-font-size');
            } else if (element === lotterySelect || element === numGamesInput) {
                element.style.fontSize = style.getPropertyValue('--base-font-size');
            } else if (element.tagName === 'LABEL') { 
                 element.style.fontSize = style.getPropertyValue('--label-font-size');
            } else if (element === modalTitle || element === document.getElementById('history-modal-title') || element === document.getElementById('generated-games-modal-title') || element === assistenciaModalTitle) {
                element.style.fontSize = style.getPropertyValue('--modal-title-size');
            } else if (element === modalMessage || element === successModalMessage) {
                element.style.fontSize = style.getPropertyValue('--modal-message-size');
            } else if (element === historicoArquivosLista || element === historicoConteudoJogosWrapper || element === hotNumbersList || element === coldNumbersList || element === jogosGeradosModalDisplay) {
                element.style.fontSize = style.getPropertyValue('--base-font-size'); 
            }
        }
    });

    document.querySelectorAll('.number-ball').forEach(ball => {
        ball.style.fontSize = getComputedStyle(document.body).getPropertyValue('--ball-font-size');
    });

    // Re-renderiza o conteúdo dos modais abertos para aplicar o novo tamanho da fonte nas bolinhas
    if (generatedGamesModalOverlay && !generatedGamesModalOverlay.classList.contains('hidden') && currentGeneratedGames.length > 0) {
        displayGamesAsBalls(currentGeneratedGames, jogosGeradosModalDisplay, lotterySelect.value);
    }
    if (!historyModalOverlay.classList.contains('hidden')) {
        // Para o histórico, o re-render ocorre ao carregar ou voltar na lista/conteúdo
    }
    if (!assistenciaModalOverlay.classList.contains('hidden')) {
        // Para a assistência, re-renderiza para aplicar a nova fonte
        fetchHotColdNumbers(lotterySelect.value); // Re-executa a busca e o display
    }
}


function loadFontSize() {
    const savedFontSize = parseFloat(localStorage.getItem('baseFontSize'));
    if (!isNaN(savedFontSize)) {
        document.documentElement.style.setProperty('--base-font-size', `${savedFontSize}px`);
        adjustFontSize(null); 
    } else {
        document.documentElement.style.setProperty('--base-font-size', `16px`);
        adjustFontSize('default'); 
    }
}


// Função utilitária para limpar todas as mensagens e containers
function clearAllDisplays() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
    const jogosGeradosMainDisplay = document.getElementById('jogos-gerados-main-display');
    if (jogosGeradosMainDisplay) jogosGeradosMainDisplay.innerHTML = '';

    loadingMessage.classList.add('hidden');
    // A seção de assistência na página principal foi removida.

    historicoArquivosLista.innerHTML = ''; 
    historicoConteudoJogosWrapper.innerHTML = ''; 
    currentFilenameSpan.textContent = '';
    hotNumbersList.innerHTML = ''; 
    coldNumbersList.innerHTML = ''; 
    jogosGeradosModalDisplay.innerHTML = ''; 

    if (copyGamesButtonModal) { 
        copyGamesButtonModal.classList.add('hidden'); 
    }
    currentGeneratedGames = []; 
    
    customConfirmModal.classList.add('hidden');
    customConfirmModal.setAttribute('aria-hidden', 'true'); 
    successModal.classList.add('hidden');
    successModal.setAttribute('aria-hidden', 'true'); 
    historyModalOverlay.classList.add('hidden'); 
    historyModalOverlay.setAttribute('aria-hidden', 'true');
    generatedGamesModalOverlay.classList.add('hidden'); 
    generatedGamesModalOverlay.setAttribute('aria-hidden', 'true');
    assistenciaModalOverlay.classList.add('hidden'); // Esconde o modal de assistência
    assistenciaModalOverlay.setAttribute('aria-hidden', 'true');
}

// Função para exibir o modal de mensagem de sucesso (Z-index corrigido)
function showSuccessMessageModal(message, duration = 3000) {
    successModalMessage.textContent = message;
    successModal.classList.remove('hidden');
    successModal.setAttribute('aria-hidden', 'false'); 
    
    // O z-index é definido no CSS. Não precisamos manipulá-lo aqui.
    // successModal.style.zIndex = '1003'; 

    setTimeout(() => {
        successModal.classList.add('hidden');
        successModal.setAttribute('aria-hidden', 'true'); 
        // successModal.style.zIndex = ''; // Reseta o z-index se for definido inline
    }, duration);
}

// Função para exibir jogos em "bolinhas" em um container específico
function displayGamesAsBalls(games, targetContainer, lotteryType) {
    targetContainer.innerHTML = ''; 
    if (!games || games.length === 0) {
        targetContainer.textContent = "Nenhum jogo para exibir.";
        targetContainer.classList.add('text-center', 'text-gray-500', 'py-4');
        return;
    }

    const colors = LOTTERY_COLORS[lotteryType];

    games.forEach((jogo, index) => {
        const jogoLineDiv = document.createElement('div');
        jogoLineDiv.classList.add(
            'flex', 'flex-wrap', 'justify-center', 'items-center', 'gap-2', 'mb-2', 'p-3', 'rounded-md', 'shadow-md', 'animate-fadeInScale'
        );
        jogoLineDiv.style.backgroundColor = colors.secondary; 
        jogoLineDiv.style.animationDelay = `${index * 0.05}s`; 

        jogo.forEach(numero => {
            const span = document.createElement('span');
            span.classList.add('number-ball', 'transition', 'duration-200', 'ease-in-out', 'hover:scale-110', 'hover:shadow-lg'); 
            span.textContent = String(numero).padStart(2, '0'); 
            span.style.backgroundColor = colors.primary; 
            span.style.fontSize = getComputedStyle(document.body).getPropertyValue('--ball-font-size'); 
            jogoLineDiv.appendChild(span);
        });
        targetContainer.appendChild(jogoLineDiv);
    });
}

// Função para exibir números em "bolinhas" para Quentes/Frios
function displayNumberBalls(numbers, targetElement, typeClass) {
    targetElement.innerHTML = '';
    if (!numbers || numbers.length === 0) {
        targetElement.textContent = "Nenhum número encontrado.";
        targetElement.classList.add('text-gray-500');
        return;
    }
    numbers.forEach(num => {
        const span = document.createElement('span');
        span.classList.add('number-ball', typeClass, 'transition', 'duration-200', 'ease-in-out', 'hover:scale-110', 'hover:shadow-lg'); 
        span.textContent = String(num).padStart(2, '0'); 
        span.style.backgroundColor = (typeClass === 'hot' ? '#EF4444' : '#6B7280'); 
        span.style.fontSize = getComputedStyle(document.body).getPropertyValue('--ball-font-size'); 
        targetElement.appendChild(span);
    });
}

// Listener para o botão "Gerar Jogos"
gerarJogosButton.addEventListener('click', () => {
    clearAllDisplays(); 
    const selectedLotteryType = lotterySelect.value;
    const numGames = numGamesInput.value; 

    if (numGames < 1 || numGames > 100) {
        errorMessage.textContent = 'Por favor, insira uma quantidade de jogos entre 1 e 100.';
        errorMessage.classList.remove('hidden');
        return;
    }
    
    loadingMessage.textContent = "Gerando jogos...";
    loadingMessage.classList.remove('hidden');
    gerarJogosButton.disabled = true;
    visualizarHistoricoButton.disabled = true; 
    assistenciaBtn.disabled = true;
    limparHistoricoBtn.disabled = true;

    fetch(`/gerar_jogos/${selectedLotteryType}?num_games=${numGames}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { 
                    throw new Error(err.error || 'Erro desconhecido ao gerar jogos'); 
                });
            }
            return response.json();
        })
        .then(jogos => {
            loadingMessage.classList.add('hidden');
            currentGeneratedGames = jogos; 
            
            displayGamesAsBalls(jogos, jogosGeradosModalDisplay, selectedLotteryType);
            generatedGamesModalOverlay.classList.remove('hidden');
            generatedGamesModalOverlay.setAttribute('aria-hidden', 'false');
            copyGamesButtonModal.classList.remove('hidden'); 
            generatedGamesModalCloseBtn.focus(); 

            showSuccessMessageModal(`Foram gerados ${jogos.length} jogos para ${selectedLotteryType}.`);
        })
        .catch(error => {
            loadingMessage.classList.add('hidden');
            errorMessage.textContent = `Erro: ${error.message}`;
            errorMessage.classList.remove('hidden');
            console.error('Erro ao buscar jogos:', error);
        })
        .finally(() => {
            gerarJogosButton.disabled = false;
            visualizarHistoricoButton.disabled = false;
            assistenciaBtn.disabled = false;
            limparHistoricoBtn.disabled = false;
        });
});

// Listener para o botão "Copiar Jogos Gerados" (agora dentro do modal)
if (copyGamesButtonModal) {
    copyGamesButtonModal.addEventListener('click', () => {
        if (currentGeneratedGames.length === 0) {
            errorMessage.textContent = 'Nenhum jogo para copiar.';
            errorMessage.classList.remove('hidden');
            return;
        }

        const formattedGames = currentGeneratedGames.map(game => game.join(' ')).join('\n');

        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = formattedGames;
        document.body.appendChild(tempTextArea);
        tempTextArea.select(); 
        try {
            const successful = document.execCommand('copy'); 
            if (successful) {
                showSuccessMessageModal('Jogos copiados para a área de transferência!');
            } else {
                errorMessage.textContent = 'Falha ao copiar jogos. Por favor, copie manualmente.';
                errorMessage.classList.remove('hidden');
            }
        } catch (err) {
            errorMessage.textContent = 'Falha ao copiar jogos. Por favor, copie manualmente.';
            errorMessage.classList.remove('hidden');
            console.error('Erro ao copiar: ', err);
        }
        document.body.removeChild(tempTextArea); 
    });
}

// Listener para o botão de fechar do modal de jogos gerados
generatedGamesModalCloseBtn.addEventListener('click', () => {
    generatedGamesModalOverlay.classList.add('hidden');
    generatedGamesModalOverlay.setAttribute('aria-hidden', 'true');
    gerarJogosButton.focus();
});


// Função para buscar e exibir os arquivos de histórico (agora exibe no modal)
async function fetchFilesAndDisplayHistory(lotteryType) {
    clearAllDisplays(); 

    loadingMessage.textContent = "Carregando histórico...";
    loadingMessage.classList.remove('hidden');
    historyModalOverlay.classList.remove('hidden');
    historyModalOverlay.setAttribute('aria-hidden', 'false');
    historyModalCloseBtn.focus(); 

    historicoArquivosContainer.classList.remove('hidden');
    historicoConteudoContainer.classList.add('hidden');

    gerarJogosButton.disabled = true;
    visualizarHistoricoButton.disabled = true;
    assistenciaBtn.disabled = true;
    limparHistoricoBtn.disabled = true;

    try {
        const response = await fetch(`/get_history_files/${lotteryType}`);
        if (!response.ok) {
            const err = await response.json(); 
            throw new Error(err.error || 'Erro ao carregar histórico'); 
        }
        const data = await response.json();

        loadingMessage.classList.add('hidden');
        
        if (data.files && data.files.length > 0) {
            historicoArquivosLista.innerHTML = ''; 
            data.files.forEach(filename => {
                const fileDiv = document.createElement('div');
                fileDiv.classList.add(
                    'p-2', 'rounded-md', 'cursor-pointer', 'transition', 'text-sm', 'truncate', 'mb-2', 'flex',
                    'items-center', 'justify-between' 
                );
                fileDiv.style.backgroundColor = 'var(--border-color)';
                fileDiv.style.color = 'var(--text-secondary)';
                fileDiv.onmouseover = () => fileDiv.style.backgroundColor = 'var(--input-border-hover)';
                fileDiv.onmouseout = () => fileDiv.style.backgroundColor = 'var(--border-color)';

                fileDiv.dataset.filename = filename; 

                const match = filename.match(/_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})\.csv$/);
                let displayDate = filename; 
                if (match) {
                    const date = match[1].replace(/-/g, '/'); 
                    const time = match[2].replace(/-/g, ':'); 
                    displayDate = `${date} ${time}`;
                }
                
                const textSpan = document.createElement('span');
                textSpan.textContent = displayDate;
                textSpan.classList.add('font-medium', 'flex-grow'); 
                textSpan.style.color = 'var(--text-primary)'; 

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('flex', 'items-center', 'gap-2');

                const viewIconSpan = document.createElement('span');
                viewIconSpan.innerHTML = `
                    <svg class="w-5 h-5 text-blue-500 hover:text-blue-700 cursor-pointer transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                `;
                viewIconSpan.title = "Visualizar conteúdo";
                viewIconSpan.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                    loadHistoricalFile(filename, lotteryType);
                });
                
                const deleteIconSpan = document.createElement('span');
                deleteIconSpan.innerHTML = `
                    <svg class="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer transition" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                `;
                deleteIconSpan.title = "Apagar arquivo";
                deleteIconSpan.addEventListener('click', (event) => {
                    event.stopPropagation(); 
                    showCustomConfirmModal(
                        'Confirmar Exclusão', 
                        `Tem certeza que deseja apagar o arquivo "${filename}"? Esta ação é irreversível!`,
                        () => confirmDeleteFileAction(filename, lotteryType)
                    );
                });

                actionsDiv.appendChild(viewIconSpan);
                actionsDiv.appendChild(deleteIconSpan);
                
                fileDiv.appendChild(textSpan);
                fileDiv.appendChild(actionsDiv);

                historicoArquivosLista.appendChild(fileDiv);
            });
            historicoArquivosLista.style.backgroundColor = 'var(--bg-primary)'; 
            historicoArquivosLista.style.borderColor = 'var(--border-color)'; 
        } else {
            historicoArquivosLista.textContent = "Nenhum arquivo de histórico encontrado para esta loteria.";
            historicoArquivosLista.classList.add('text-gray-500'); 
            historicoArquivosLista.style.backgroundColor = 'var(--bg-primary)';
            historicoArquivosLista.style.borderColor = 'var(--border-color)';
        }
    } catch (error) {
        loadingMessage.classList.add('hidden');
        errorMessage.textContent = `Erro: ${error.message}`;
        errorMessage.classList.remove('hidden');
        console.error('Erro ao listar arquivos de histórico:', error);
        historyModalOverlay.classList.add('hidden');
        historyModalOverlay.setAttribute('aria-hidden', 'true');
    } finally {
        gerarJogosButton.disabled = false;
        visualizarHistoricoButton.disabled = false;
        assistenciaBtn.disabled = false;
        limparHistoricoBtn.disabled = false;
    }
}

// Listener para o botão "Visualizar Histórico"
visualizarHistoricoButton.addEventListener('click', () => {
    const selectedLotteryType = lotterySelect.value;
    fetchFilesAndDisplayHistory(selectedLotteryType);
});


// Nova função para mostrar o modal de confirmação personalizado
function showCustomConfirmModal(title, message, onConfirmCallback) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    customConfirmModal.classList.remove('hidden');
    customConfirmModal.setAttribute('aria-hidden', 'false'); 
    requestAnimationFrame(() => modalConfirmBtn.focus()); 

    modalConfirmBtn.onclick = null;
    modalCancelBtn.onclick = null;

    modalConfirmBtn.onclick = () => {
        customConfirmModal.classList.add('hidden'); 
        customConfirmModal.setAttribute('aria-hidden', 'true'); 
        onConfirmCallback(); 
    };

    modalCancelBtn.onclick = () => {
        customConfirmModal.classList.add('hidden'); 
        customConfirmModal.setAttribute('aria-hidden', 'true'); 
    };
}


// Função que executa a exclusão de um único arquivo (chamada pelo modal)
async function confirmDeleteFileAction(filename, lotteryType) {
    loadingMessage.textContent = `Apagando ${filename}...`;
    loadingMessage.classList.remove('hidden');
    gerarJogosButton.disabled = true;
    visualizarHistoricoButton.disabled = true;
    assistenciaBtn.disabled = true;
    limparHistoricoBtn.disabled = true;

    try {
        const response = await fetch(`/delete_file/${filename}`, {
            method: 'POST'
        });

        if (!response.ok) {
            const err = await response.json(); 
            throw new Error(err.error || 'Erro ao apagar arquivo'); 
        }
        const data = await response.json();

        loadingMessage.classList.add('hidden');
        showSuccessMessageModal(data.message); 
        fetchFilesAndDisplayHistory(lotteryType); 

    } catch (error) {
        loadingMessage.classList.add('hidden');
        errorMessage.textContent = `Erro: ${error.message}`;
        errorMessage.classList.remove('hidden');
        console.error(`Erro ao apagar o arquivo ${filename}:`, error);
    } finally {
        gerarJogosButton.disabled = false;
        visualizarHistoricoButton.disabled = false;
        assistenciaBtn.disabled = false;
        limparHistoricoBtn.disabled = false;
    }
}


// Função para carregar e exibir o conteúdo de um arquivo histórico (dentro do modal)
function loadHistoricalFile(filename, lotteryType) { 
    historicoArquivosContainer.classList.add('hidden'); 
    historicoConteudoContainer.classList.remove('hidden'); 

    loadingMessage.textContent = `Carregando ${filename}...`;
    loadingMessage.classList.remove('hidden');
    gerarJogosButton.disabled = true;
    visualizarHistoricoButton.disabled = true;
    assistenciaBtn.disabled = true;
    limparHistoricoBtn.disabled = true;

    fetch(`/get_file_content/${filename}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { 
                    throw new Error(err.error || 'Erro ao carregar conteúdo do arquivo'); 
                });
            }
            return response.json();
        })
        .then(data => {
            loadingMessage.classList.add('hidden');
            
            const match = filename.match(/_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})\.csv$/);
            let displayDate = filename;
            if (match) {
                const date = match[1].replace(/-/g, '/');
                const time = match[2].replace(/-/g, ':');
                displayDate = `${date} ${time}`;
            }
            currentFilenameSpan.textContent = `Histórico de ${lotteryType.charAt(0).toUpperCase() + lotteryType.slice(1)} - ${displayDate}`;
            
            displayGamesAsBalls(data.content, historicoConteudoJogosWrapper, lotteryType); 
            historicoConteudoJogosWrapper.style.backgroundColor = 'var(--bg-primary)';
            historicoConteudoJogosWrapper.style.borderColor = 'var(--border-color)';
        })
        .catch(error => {
            loadingMessage.classList.add('hidden');
            errorMessage.textContent = `Erro: ${error.message}`;
            errorMessage.classList.remove('hidden');
            console.error(`Erro ao carregar o arquivo ${filename}:`, error);
            historicoArquivosContainer.classList.remove('hidden');
            historicoConteudoContainer.classList.add('hidden');
        })
        .finally(() => {
            gerarJogosButton.disabled = false;
            visualizarHistoricoButton.disabled = false;
            assistenciaBtn.disabled = false;
            limparHistoricoBtn.disabled = false;
        });
}

// Listener para o botão "Voltar para Arquivos" no histórico (dentro do modal)
voltarHistoricoButton.addEventListener('click', () => {
    historicoConteudoContainer.classList.add('hidden');
    historicoArquivosContainer.classList.remove('hidden');
    requestAnimationFrame(() => {
        const firstFile = historicoArquivosLista.querySelector('[data-filename]');
        if (firstFile) {
            firstFile.focus();
        } else {
            historyModalCloseBtn.focus(); 
        }
    });
});

// Função para buscar e exibir números quentes/frios (agora exibe no modal)
async function fetchHotColdNumbers(lotteryType) {
    loadingMessage.textContent = "Obtendo números de assistência...";
    loadingMessage.classList.remove('hidden');

    try {
        const response = await fetch(`/get_hot_cold_numbers/${lotteryType}`);
        if (!response.ok) {
            const err = await response.json(); 
            throw new Error(err.error || 'Erro ao obter números de assistência'); 
        }
        const data = await response.json();

        loadingMessage.classList.add('hidden');
        // Agora, exibe os números dentro do modal de assistência
        displayNumberBalls(data.hot_numbers, hotNumbersList, 'hot');
        displayNumberBalls(data.cold_numbers, coldNumbersList, 'cold');
        
        // Aplica as cores do tema aos containers de números quentes/frios dentro do modal
        document.getElementById('hot-numbers-display-modal').style.backgroundColor = 'var(--bg-secondary)'; 
        document.getElementById('hot-numbers-display-modal').style.borderColor = 'var(--border-color)';
        document.getElementById('cold-numbers-display-modal').style.backgroundColor = 'var(--bg-secondary)'; 
        document.getElementById('cold-numbers-display-modal').style.borderColor = 'var(--border-color)';

    } catch (error) {
        loadingMessage.classList.add('hidden');
        errorMessage.textContent = `Erro: ${error.message}`;
        errorMessage.classList.remove('hidden');
        console.error('Erro ao obter assistência:', error);
        // Em caso de erro, fecha o modal de assistência
        assistenciaModalOverlay.classList.add('hidden');
        assistenciaModalOverlay.setAttribute('aria-hidden', 'true');
    }
}

// Listener para o botão "Assistência"
assistenciaBtn.addEventListener('click', () => {
    clearAllDisplays(); // Limpa tudo, incluindo outros modais
    const selectedLotteryType = lotterySelect.value;

    loadingMessage.textContent = "Abrindo assistência...";
    loadingMessage.classList.remove('hidden');

    // Habilita o modal de assistência
    assistenciaModalOverlay.classList.remove('hidden');
    assistenciaModalOverlay.setAttribute('aria-hidden', 'false');
    assistenciaModalCloseBtn.focus(); // Foca no botão de fechar para acessibilidade

    // Desabilita botões da tela principal enquanto o modal está aberto
    gerarJogosButton.disabled = true;
    visualizarHistoricoButton.disabled = true;
    assistenciaBtn.disabled = true;
    limparHistoricoBtn.disabled = true;

    fetchHotColdNumbers(selectedLotteryType).finally(() => {
        // Reabilita os botões somente quando o fetch estiver completo
        gerarJogosButton.disabled = false;
        visualizarHistoricoButton.disabled = false;
        assistenciaBtn.disabled = false;
        limparHistoricoBtn.disabled = false;
    });
});

// Listener para o botão de fechar do modal de assistência
assistenciaModalCloseBtn.addEventListener('click', () => {
    assistenciaModalOverlay.classList.add('hidden');
    assistenciaModalOverlay.setAttribute('aria-hidden', 'true');
    // Opcional: retornar o foco para o botão "Assistência"
    assistenciaBtn.focus();
});


// Função para limpar o histórico (todos os arquivos de uma loteria)
function confirmClearHistory(lotteryType) {
    showCustomConfirmModal(
        'Limpar Histórico', 
        `Tem certeza que deseja DELETAR TODOS os arquivos de histórico para ${lotteryType}? Esta ação é irreversível!`,
        async () => { 
            clearAllDisplays(); 
            loadingMessage.textContent = `Limpando histórico para ${lotteryType}...`;
            loadingMessage.classList.remove('hidden');
            gerarJogosButton.disabled = true;
            visualizarHistoricoButton.disabled = true;
            assistenciaBtn.disabled = true;
            limparHistoricoBtn.disabled = true;

            try {
                const response = await fetch(`/clear_history/${lotteryType}`, {
                    method: 'POST'
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || 'Erro ao limpar histórico');
                }
                const data = await response.json();
                
                loadingMessage.classList.add('hidden');
                showSuccessMessageModal(data.message); 
                fetchFilesAndDisplayHistory(lotteryType); 

            } catch (error) {
                loadingMessage.classList.add('hidden');
                errorMessage.textContent = `Erro: ${error.message}`;
                errorMessage.classList.remove('hidden');
                console.error('Erro ao limpar histórico:', error);
            } finally {
                gerarJogosButton.disabled = false;
                visualizarHistoricoButton.disabled = false;
                assistenciaBtn.disabled = false;
                limparHistoricoBtn.disabled = false;
            }
        }
    );
}

// Listener para o botão "Limpar Histórico" (principal)
limparHistoricoBtn.addEventListener('click', () => {
    const selectedLotteryType = lotterySelect.value;
    confirmClearHistory(selectedLotteryType);
});

// Listener para o botão "Limpar Histórico desta Loteria" (dentro da seção de histórico)
limparHistoricoDiretoBtn.addEventListener('click', () => {
    const selectedLotteryType = lotterySelect.value;
    historyModalOverlay.classList.add('hidden');
    historyModalOverlay.setAttribute('aria-hidden', 'true');
    confirmClearHistory(selectedLotteryType);
});

// Listener para o botão de fechar do modal de histórico
historyModalCloseBtn.addEventListener('click', () => {
    historyModalOverlay.classList.add('hidden');
    historyModalOverlay.setAttribute('aria-hidden', 'true');
    visualizarHistoricoButton.focus();
});


// Listeners para alternar tema
themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
});

// Listeners para ajuste de fonte
increaseFontButton.addEventListener('click', () => adjustFontSize('increase'));
decreaseFontButton.addEventListener('click', () => adjustFontSize('decrease'));

// Carrega o tema e o tamanho da fonte salvos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadFontSize();
});
