// Создание звездного неба
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 3500;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const sizeType = Math.random();
        if (sizeType < 0.4) star.classList.add('star', 'small');
        else if (sizeType < 0.7) star.classList.add('star', 'medium');
        else if (sizeType < 0.9) star.classList.add('star', 'large');
        else if (sizeType < 0.97) star.classList.add('star', 'xlarge');
        else star.classList.add('star', 'xxlarge');

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 10}s`;

        const animationType = Math.random();
        if (animationType < 0.3) star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite, drift ${20 + Math.random() * 30}s infinite alternate`;
        else if (animationType < 0.6) star.style.animation = `twinkle ${3 + Math.random() * 4}s infinite, drift-slow ${25 + Math.random() * 35}s infinite alternate`;
        else if (animationType < 0.8) star.style.animation = `twinkle ${1 + Math.random() * 2}s infinite, drift-fast ${15 + Math.random() * 20}s infinite alternate`;
        else star.style.animation = `twinkle ${4 + Math.random() * 5}s infinite`;

        starsContainer.appendChild(star);
    }
}

// Получаем элементы
const mainScreen = document.getElementById('mainScreen');
const videoScreen = document.getElementById('videoScreen');
const mapScreen = document.getElementById('mapScreen');
const locationScreen = document.getElementById('locationScreen');
const introVideo = document.getElementById('introVideo');
const skipButton = document.getElementById('skipButton');
const playButton = document.getElementById('playButton');
const newGameButton = document.getElementById('newGameButton');
const settingsBtn = document.getElementById('settingsBtn');
const rulesBtn = document.getElementById('rulesBtn');
const settingsModal = document.getElementById('settingsModal');
const rulesModal = document.getElementById('rulesModal');
const closeSettings = document.getElementById('closeSettingsBtn');
const closeRules = document.getElementById('closeRulesBtn');
const bookModal = document.getElementById('bookModal');
const closeBookBtn = document.getElementById('closeBookBtn');
const bookModalImage = document.getElementById('bookModalImage');

// Модальное окно мини-игры
const poemMinigameModal = document.getElementById('poemMinigameModal');
const closePoemBtn = document.getElementById('closePoemBtn');
const backButtonMinigame = document.getElementById('back-button-minigame');

// Элементы мини-игры
const baseImageMinigame = document.getElementById('base-image-minigame');
const fragmentsContainerMinigame = document.getElementById('fragments-container-minigame');
const checkButtonMinigame = document.getElementById('check-button-minigame');
const resetButtonMinigame = document.getElementById('reset-button-minigame');
const messageElMinigame = document.getElementById('message-minigame');
const progressTextMinigame = document.getElementById('progress-text-minigame');
const progressFillMinigame = document.getElementById('progress-fill-minigame');

// Получаем элементы домиков
const karHouse = document.querySelector('.kar-house');
const ejHouse = document.querySelector('.ej-house');
const kroHouse = document.querySelector('.kro-house');
const losHouse = document.querySelector('.los-house');
const kopHouse = document.querySelector('.kop-house');
const pinHouse = document.querySelector('.pin-house');
const nyHouse = document.querySelector('.ny-house');
const barHouse = document.querySelector('.bar-house');
const sovHouse = document.querySelector('.sov-house');

// Переменные для системы диалогов
let currentDialogueStep = 0;
let currentBranch = '';
let playerChoices = [];
let currentLocation = '';

// Переменная для хранения состояния книги
let hasBook = false;

// Переменные для мини-игры со стихом
let currentFragments = [];
let placedFragments = [];
let currentStep = 0;
const backgroundImages = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png'];
const fragmentsData = [
    { id: 1, filename: 'st1.jpg' },
    { id: 2, filename: 'st2.jpg' },
    { id: 3, filename: 'st3.jpg' },
    { id: 4, filename: 'st4.jpg' },
    { id: 6, filename: 'st6.jpg' }
];
const correctOrder = [4, 6, 3, 2, 1];
let draggedCard = null;

// Создаем звезды при загрузке страницы
window.addEventListener('load', function() {
    console.log('🔍 Загрузка игры...');

    // Убираем надпись "Загрузка..." из обложки
    const coverOverlay = document.querySelector('.cover-overlay');
    if (coverOverlay) {
        coverOverlay.textContent = '';
    }

    // Скрываем анимацию книги при загрузке
    const bookAnimation = document.getElementById('bookAnimation');
    if (bookAnimation) {
        bookAnimation.style.display = 'none';
        bookAnimation.style.opacity = '0';
    }

    createStars();
    loadGameState();
    console.log('📚 Состояние книги при запуске:', hasBook);

    setupHouseClickListeners();
    setupHouseErrorHandlers();
    setupBookClickHandlers();
    setupModalEventListeners();
    setupPoemMinigameListeners();

    // Убедимся, что главный экран виден
    if (mainScreen) {
        mainScreen.style.display = 'flex';
    }
    
    // Отладочное сообщение для проверки элементов
    console.log('🏠 Найдены домики:', {
        karHouse: !!karHouse,
        ejHouse: !!ejHouse,
        barHouse: !!barHouse
    });
});

// Загрузка состояния игры
function loadGameState() {
    const savedBookState = localStorage.getItem('hasBook');
    if (savedBookState === 'true') {
        console.log('📚 Состояние игры загружено: книга была получена в предыдущей сессии');
        hasBook = true;
    } else {
        console.log('📚 Состояние игры: книга еще не получена');
        hasBook = false;
    }
    
    // Проверяем, была ли пройдена мини-игра
    const poemCompleted = localStorage.getItem('poemCompleted') === 'true';
    if (poemCompleted) {
        console.log('🏆 Мини-игра со стихом уже пройдена');
        // Обновление книги будет выполнено при открытии модального окна
    }
}

// Настройка обработчиков кликов на книгу
function setupBookClickHandlers() {
    if (closeBookBtn) closeBookBtn.addEventListener('click', closeBookModal);

    if (bookModal) {
        bookModal.addEventListener('click', (event) => {
            if (event.target === bookModal) {
                closeBookModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && bookModal && bookModal.style.display === 'flex') {
            closeBookModal();
        }
    });

    // Инициализация изображения книги в модальном окне
    if (bookModalImage) {
        bookModalImage.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
    
    // Глобальный обработчик кликов для всех иконок книги
    document.addEventListener('click', function(event) {
        // Проверяем, кликнули ли по иконке книги или ее заглушке
        const clickedElement = event.target;
        const isBookIcon = clickedElement.closest('.book-on-map') || 
                          clickedElement.closest('.book-on-location') ||
                          clickedElement.closest('.book-placeholder') ||
                          clickedElement.classList.contains('book-on-map') ||
                          clickedElement.classList.contains('book-on-location') ||
                          clickedElement.classList.contains('book-placeholder') ||
                          (clickedElement.tagName === 'IMG' && 
                           (clickedElement.closest('.book-on-map') || 
                            clickedElement.closest('.book-on-location')));
        
        if (isBookIcon && hasBook) {
            event.preventDefault();
            event.stopPropagation();
            console.log('📖 Клик по иконке книги (глобальный обработчик)');
            openBookModal();
        }
    });
}

// Настройка обработчиков мини-игры со стихом
function setupPoemMinigameListeners() {
    if (closePoemBtn) closePoemBtn.addEventListener('click', closePoemMinigame);
    if (backButtonMinigame) backButtonMinigame.addEventListener('click', closePoemMinigame);
    
    if (poemMinigameModal) {
        poemMinigameModal.addEventListener('click', (event) => {
            if (event.target === poemMinigameModal) {
                closePoemMinigame();
            }
        });
    }
    
    if (checkButtonMinigame) checkButtonMinigame.addEventListener('click', checkOrderMinigame);
    if (resetButtonMinigame) resetButtonMinigame.addEventListener('click', initMinigame);
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && poemMinigameModal && poemMinigameModal.style.display === 'flex') {
            closePoemMinigame();
        }
    });
}

// Функция открытия модального окна книги
function openBookModal() {
    if (!bookModal) {
        console.error('❌ bookModal не найден');
        return;
    }
    
    console.log('📖 Открытие книги. Состояние hasBook:', hasBook);
    
    if (!hasBook) {
        console.log('❌ Книга еще не получена');
        return;
    }
    
    // Проверяем состояние мини-игры
    const poemCompleted = localStorage.getItem('poemCompleted') === 'true';
    console.log('📖 Мини-игра пройдена:', poemCompleted);
    
    // Обновляем источник изображения в зависимости от прогресса
    if (bookModalImage) {
        if (poemCompleted) {
            console.log('📖 Загружаем обновленную книгу (kniga2.png)');
            bookModalImage.src = 'kniga2.png';
        } else {
            console.log('📖 Загружаем обычную книгу (kniga.png)');
            bookModalImage.src = 'kniga.png';
        }
        
        bookModalImage.onload = function() {
            console.log('✅ Изображение книги успешно загружено');
        };
        
        bookModalImage.onerror = function() {
            console.log('❌ Ошибка загрузки изображения книги');
            // Пробуем загрузить альтернативное изображение
            const poemCompleted = localStorage.getItem('poemCompleted') === 'true';
            this.src = poemCompleted ? 'kniga.png' : 'book.png';
        };
    }
    
    bookModal.style.display = 'flex';
    setTimeout(() => {
        bookModal.style.opacity = '1';
    }, 10);
    document.body.style.overflow = 'hidden';
}

// Функция закрытия модального окна книги
function closeBookModal() {
    if (!bookModal) return;
    
    bookModal.style.opacity = '0';
    setTimeout(() => {
        bookModal.style.display = 'none';
        bookModal.style.opacity = '1';
    }, 300);
    document.body.style.overflow = 'auto';
}

// Открытие мини-игры со стихом
function openPoemMinigame() {
    if (!poemMinigameModal) return;
    
    console.log('📜 Открытие мини-игры со стихом');
    poemMinigameModal.style.display = 'flex';
    setTimeout(() => {
        poemMinigameModal.style.opacity = '1';
    }, 10);
    document.body.style.overflow = 'hidden';
    
    // Инициализируем мини-игру
    setTimeout(() => {
        initMinigame();
    }, 50);
}

// Закрытие мини-игры со стихом
function closePoemMinigame() {
    if (!poemMinigameModal) return;
    
    console.log('❌ Закрытие мини-игры со стихом');
    poemMinigameModal.style.opacity = '0';
    setTimeout(() => {
        poemMinigameModal.style.display = 'none';
        poemMinigameModal.style.opacity = '1';
    }, 300);
    document.body.style.overflow = 'auto';
    
    // Сбрасываем состояние мини-игры
    resetMinigame();
}

// Инициализация мини-игры
function initMinigame() {
    currentStep = 0;
    placedFragments = [];
    
    // Сбрасываем состояние
    if (baseImageMinigame) baseImageMinigame.src = '1.png';
    if (baseImageMinigame) baseImageMinigame.style.opacity = '1';
    if (fragmentsContainerMinigame) fragmentsContainerMinigame.innerHTML = '';
    if (messageElMinigame) messageElMinigame.textContent = '';
    if (messageElMinigame) messageElMinigame.className = 'message-minigame';
    
    // Обновляем прогресс
    updateProgressMinigame();

    // Создаем копию массива и перемешиваем его
    currentFragments = [...fragmentsData];
    shuffleArray(currentFragments);

    // Создаем пустые ячейки-плейсхолдеры для сохранения структуры
    if (fragmentsContainerMinigame) {
        for (let i = 0; i < 5; i++) {
            const placeholder = document.createElement('div');
            placeholder.className = 'fragment-placeholder-minigame';
            fragmentsContainerMinigame.appendChild(placeholder);
        }

        // Создаем карточки для отрывков и заменяем плейсхолдеры
        currentFragments.forEach((frag, index) => {
            // Заменяем плейсхолдер на карточку
            const placeholder = fragmentsContainerMinigame.children[index];
            
            const card = document.createElement('div');
            card.className = 'fragment-card-minigame';
            card.dataset.id = frag.id;
            card.dataset.filename = frag.filename;
            card.setAttribute('draggable', 'true');
            
            // Создаем изображение внутри карточки
            const img = document.createElement('img');
            img.src = frag.filename;
            img.alt = 'Отрывок стиха';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'contain';
            card.appendChild(img);

            // Добавляем обработчики перетаскивания
            card.addEventListener('dragstart', handleDragStartMinigame);
            card.addEventListener('dragend', handleDragEndMinigame);
            card.addEventListener('click', () => handleFragmentClickMinigame(frag.id));

            // Заменяем плейсхолдер на карточку
            fragmentsContainerMinigame.replaceChild(card, placeholder);
        });

        // Добавляем обработчики для стиха
        if (baseImageMinigame) {
            baseImageMinigame.addEventListener('dragover', handleDragOverMinigame);
            baseImageMinigame.addEventListener('drop', handleDropMinigame);
            baseImageMinigame.addEventListener('dragenter', handleDragEnterMinigame);
            baseImageMinigame.addEventListener('dragleave', handleDragLeaveMinigame);
        }
    }
}

// Сброс мини-игры
function resetMinigame() {
    currentStep = 0;
    placedFragments = [];
    draggedCard = null;
}

// Функции для Drag & Drop в мини-игре
function handleDragStartMinigame(e) {
    const card = e.target.closest('.fragment-card-minigame');
    if (!card) {
        e.preventDefault();
        return;
    }
    
    draggedCard = card;
    e.dataTransfer.setData('text/plain', card.dataset.id);
    card.classList.add('dragging');
    
    setTimeout(() => {
        card.style.opacity = '0.85';
    }, 0);
}

function handleDragEndMinigame() {
    if (draggedCard) {
        draggedCard.classList.remove('dragging');
        draggedCard.style.opacity = '';
        draggedCard.style.transform = '';
        draggedCard = null;
    }
}

function handleDragOverMinigame(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnterMinigame(e) {
    e.preventDefault();
    if (baseImageMinigame) {
        baseImageMinigame.style.boxShadow = '0 0 25px rgba(212, 175, 55, 0.8)';
    }
}

function handleDragLeaveMinigame(e) {
    if (baseImageMinigame && !baseImageMinigame.contains(e.relatedTarget)) {
        baseImageMinigame.style.boxShadow = '';
    }
}

function handleDropMinigame(e) {
    e.preventDefault();
    if (baseImageMinigame) {
        baseImageMinigame.style.boxShadow = '';
    }
    
    if (!draggedCard) return;

    const fragmentId = parseInt(draggedCard.dataset.id);
    
    // Проверяем правильный порядок
    const expectedFragmentId = correctOrder[currentStep];
    
    if (fragmentId !== expectedFragmentId) {
        showMessageMinigame('Неверный порядок! Попробуйте другой отрывок', 'error');
        draggedCard.classList.add('wrong');
        setTimeout(() => {
            draggedCard.classList.remove('wrong');
        }, 800);
        return;
    }

    // Успешное добавление
    handleCorrectFragmentMinigame(fragmentId, draggedCard);
}

// Обработчик клика по отрывку
function handleFragmentClickMinigame(fragmentId) {
    const fragmentCard = document.querySelector(`.fragment-card-minigame[data-id="${fragmentId}"]`);
    if (!fragmentCard) return;
    
    const expectedFragmentId = correctOrder[currentStep];
    
    if (fragmentId !== expectedFragmentId) {
        showMessageMinigame('Неверный порядок! Попробуйте другой отрывок', 'error');
        fragmentCard.classList.add('wrong');
        setTimeout(() => fragmentCard.classList.remove('wrong'), 800);
        return;
    }
    
    handleCorrectFragmentMinigame(fragmentId, fragmentCard);
}

function handleCorrectFragmentMinigame(fragmentId, fragmentCard) {
    placedFragments.push(fragmentId);
    currentStep++;
    
    if (baseImageMinigame && currentStep < backgroundImages.length) {
        baseImageMinigame.src = backgroundImages[currentStep];
    }
    
    fragmentCard.classList.add('correct');
    setTimeout(() => {
        const placeholder = document.createElement('div');
        placeholder.className = 'fragment-placeholder-minigame';
        
        if (fragmentCard.parentNode) {
            fragmentCard.parentNode.replaceChild(placeholder, fragmentCard);
        }
        
        updateProgressMinigame();
        showMessageMinigame('Отрывок добавлен верно', 'info');
        
        if (placedFragments.length === correctOrder.length) {
            setTimeout(() => {
                showMessageMinigame('Все отрывков размещены', 'info');
            }, 500);
        }
    }, 300);
}

function updateProgressMinigame() {
    const progress = (placedFragments.length / correctOrder.length) * 100;
    if (progressTextMinigame) {
        progressTextMinigame.textContent = `Отрывков собрано: ${placedFragments.length}/${correctOrder.length}`;
    }
    if (progressFillMinigame) {
        progressFillMinigame.style.width = `${progress}%`;
    }
}

// Проверка правильности порядка в мини-игре
function checkOrderMinigame() {
    if (placedFragments.length !== correctOrder.length) {
        showMessageMinigame(`Добавьте все отрывки! (${placedFragments.length} из ${correctOrder.length})`, 'warning');
        return;
    }

    let isCorrect = true;
    for (let i = 0; i < correctOrder.length; i++) {
        if (placedFragments[i] !== correctOrder[i]) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        showMessageMinigame('Поздравляем! Стихотворение собрано правильно!', 'success');
        
        if (baseImageMinigame) {
            baseImageMinigame.src = backgroundImages[6];
        }
        
        createConfettiMinigame();
        
        // ПОКАЗАТЬ ДОСТИЖЕНИЕ
        setTimeout(() => {
            showAchievement();
        }, 1000);
        
    } else {
        showMessageMinigame('Порядок неверный. Попробуйте снова!', 'error');
    }
}

// Функция показа достижения
function showAchievement() {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-notification';
    
    achievement.innerHTML = `
        <div class="achievement-icon">🎉</div>
        <h3>ДОСТИЖЕНИЕ!</h3>
        <p>Вы успешно собрали стихотворение Бараша!</p>
        <p>Теперь мы знаем, где спрятан фантик!</p>
        <p style="font-size: 18px; color: #a8d8ff;">Книга Ёжика обновлена новой информацией</p>
    `;
    
    document.body.appendChild(achievement);
    
    // Добавляем конфетти
    const confetti = document.createElement('div');
    confetti.className = 'achievement-confetti';
    document.body.appendChild(confetti);
    createAchievementConfetti();
    
    // Сохраняем достижение в localStorage
    localStorage.setItem('poemCompleted', 'true');
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        achievement.style.opacity = '0';
        achievement.style.transform = 'translate(-50%, -50%) scale(0.9)';
        achievement.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            achievement.remove();
            confetti.remove();
        }, 500);
    }, 5000);
    
    // Обработчик клика для закрытия
    achievement.addEventListener('click', () => {
        achievement.style.opacity = '0';
        achievement.style.transform = 'translate(-50%, -50%) scale(0.9)';
        achievement.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            achievement.remove();
            confetti.remove();
        }, 500);
    });
}

// Функция для конфетти достижения
function createAchievementConfetti() {
    const confettiContainer = document.querySelector('.achievement-confetti');
    if (!confettiContainer) return;
    
    const colors = ['#ffd700', '#4caf50', '#2196f3', '#9c27b0', '#ff5722'];
    const shapes = ['circle', 'rect', 'triangle'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = `${Math.random() * 12 + 6}px`;
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        
        // Для треугольников
        if (Math.random() > 0.7) {
            confetti.style.width = '0';
            confetti.style.height = '0';
            confetti.style.borderLeft = '8px solid transparent';
            confetti.style.borderRight = '8px solid transparent';
            confetti.style.borderBottom = `14px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
            confetti.style.backgroundColor = 'transparent';
            confetti.style.borderRadius = '0';
        }
        
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-20px';
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        confetti.style.boxShadow = '0 0 6px currentColor';
        
        confettiContainer.appendChild(confetti);
        
        const animationDuration = Math.random() * 3000 + 2000;
        
        const animation = confetti.animate([
            { 
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1 
            },
            { 
                transform: `translate(${(Math.random() - 0.5) * 300}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 1080}deg)`,
                opacity: 0 
            }
        ], {
            duration: animationDuration,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Вспомогательные функции для мини-игры
function showMessageMinigame(text, type) {
    if (!messageElMinigame) return;
    
    messageElMinigame.textContent = text;
    messageElMinigame.className = `message-minigame ${type}`;
    
    if (type === 'info' || type === 'warning') {
        setTimeout(() => {
            if (messageElMinigame.className.includes(type)) {
                messageElMinigame.textContent = '';
                messageElMinigame.className = 'message-minigame';
            }
        }, 2500);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Эффект конфетти при победе в мини-игре
function createConfettiMinigame() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9998';
    document.body.appendChild(confettiContainer);

    const colors = ['#d4af37', '#4caf50', '#f44336', '#2196f3', '#9c27b0'];
    
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = '-20px';
        confetti.style.opacity = '0.9';
        confetti.style.boxShadow = '0 0 4px currentColor';
        
        confettiContainer.appendChild(confetti);
        
        const animation = confetti.animate([
            { 
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1 
            },
            { 
                transform: `translate(${(Math.random() - 0.5) * 100}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
                opacity: 0 
            }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
    
    setTimeout(() => {
        confettiContainer.remove();
    }, 4000);
}

// Настройка обработчиков модальных окон
function setupModalEventListeners() {
    if (settingsBtn) settingsBtn.addEventListener('click', () => {
        console.log('⚙️ Открытие настроек');
        if (settingsModal) settingsModal.style.display = 'flex';
    });

    if (rulesBtn) rulesBtn.addEventListener('click', () => {
        console.log('📖 Открытие правил');
        if (rulesModal) rulesModal.style.display = 'flex';
    });

    if (closeSettings) closeSettings.addEventListener('click', () => {
        console.log('❌ Закрытие настроек');
        if (settingsModal) settingsModal.style.display = 'none';
    });

    if (closeRules) closeRules.addEventListener('click', () => {
        console.log('❌ Закрытие правил');
        if (rulesModal) rulesModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === rulesModal) {
            rulesModal.style.display = 'none';
        }
    });
}

// Запуск игры - показ видео
if (playButton) {
    playButton.addEventListener('click', () => {
        console.log('🎬 Начало игры');
        mainScreen.style.display = 'none';
        videoScreen.style.display = 'flex';
        setTimeout(() => {
            if (skipButton) skipButton.style.display = 'flex';
        }, 3000);
        if (introVideo) {
            introVideo.play().catch(e => {
                console.log('Автовоспроизведение заблокировано:', e);
                if (skipButton) skipButton.style.display = 'flex';
            });
        }
    });
}

// Обработчик кнопки "Новая игра"
if (newGameButton) {
    newGameButton.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите начать новую игру?\nВесь текущий прогресс будет сброшен.\n(Включая найденный фантик и собранный стих)')) {
            resetGameState();
        }
    });
}

// Функция сброса состояния игры
function resetGameState() {
    hasBook = false;
    localStorage.removeItem('hasBook');
    localStorage.removeItem('poemCompleted'); // Удаляем достижение
    playerChoices = [];
    currentDialogueStep = 0;
    currentBranch = '';
    placedFragments = [];
    currentStep = 0;
    
    alert('Состояние игры сброшено! Начинаем новую игру.');
    if (mapScreen && mapScreen.style.display === 'flex' || 
        locationScreen && locationScreen.style.display === 'flex') {
        if (mapScreen) mapScreen.style.display = 'none';
        if (locationScreen) locationScreen.style.display = 'none';
        if (videoScreen) videoScreen.style.display = 'none';
        if (mainScreen) mainScreen.style.display = 'flex';
    }
}

// Пропуск видео
if (skipButton) {
    skipButton.addEventListener('click', () => {
        console.log('⏩ Пропуск видео');
        if (introVideo) introVideo.pause();
        if (videoScreen) videoScreen.style.display = 'none';
        showMapScreen();
    });
}

// Когда видео заканчивается
if (introVideo) {
    introVideo.addEventListener('ended', () => {
        console.log('🎬 Видео завершено');
        if (videoScreen) videoScreen.style.display = 'none';
        showMapScreen();
    });
}

// Показать экран карты
function showMapScreen() {
    if (!mapScreen) return;
    
    console.log('🗺️ Показать карту');
    mapScreen.style.display = 'flex';
    if (hasBook) {
        setTimeout(() => {
            addBookToMap();
        }, 100);
    } else {
        removeBookFromMap();
    }
}

// Функция добавления книги на карту (в виде иконки book.png)
function addBookToMap() {
    removeBookFromMap();
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;

    const bookElement = document.createElement('div');
    bookElement.className = 'book-on-map';
    bookElement.style.position = 'absolute';
    bookElement.style.bottom = '19px';
    bookElement.style.left = '110px';
    bookElement.style.zIndex = '20';
    bookElement.style.cursor = 'pointer';

    const bookImg = document.createElement('img');
    bookImg.src = 'book.png';
    bookImg.alt = 'Книга Ёжика';
    bookImg.style.width = '132px';
    bookImg.style.height = '132px';
    bookImg.style.objectFit = 'contain';
    bookImg.style.cursor = 'pointer';
    bookImg.style.pointerEvents = 'none'; // Важно: события на изображении не блокируют клик

    bookElement.appendChild(bookImg);
    mapContainer.appendChild(bookElement);

    // Добавляем обработчик клика на весь элемент
    bookElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('📖 Клик по книге на карте');
        openBookModal();
    });

    bookImg.onerror = function() {
        const placeholder = document.createElement('div');
        placeholder.className = 'book-placeholder';
        placeholder.textContent = '📖';
        placeholder.style.fontSize = '70px';
        placeholder.style.color = '#888888';
        placeholder.style.width = '132px';
        placeholder.style.height = '132px';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.background = 'rgba(255, 255, 255, 0.05)';
        placeholder.style.borderRadius = '10px';
        placeholder.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        placeholder.style.cursor = 'pointer';
        
        // Обработчик клика для заглушки
        placeholder.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📖 Клик по заглушке книги на карте');
            openBookModal();
        });
        
        bookElement.appendChild(placeholder);
        bookImg.style.display = 'none';
    };
}

// Функция удаления книги с карты
function removeBookFromMap() {
    const existingBook = document.querySelector('.book-on-map');
    if (existingBook) existingBook.remove();
}

// Функция добавления книги на текущую открытую локацию
function addBookToCurrentLocation() {
    if (!hasBook) return;
    
    const locationScreen = document.getElementById('locationScreen');
    if (!locationScreen || locationScreen.style.display === 'none') return;
    
    removeBookFromCurrentLocation();

    const locationContainer = document.querySelector('.location-content');
    if (!locationContainer) return;

    const bookElement = document.createElement('div');
    bookElement.className = 'book-on-location';
    bookElement.style.position = 'absolute';
    // РАСПОЛОЖЕНИЕ КАК НА DOMEJ.JPG: правый нижний угол
    bookElement.style.bottom = '19px';
    bookElement.style.left = '110px';
    bookElement.style.zIndex = '5';
    bookElement.style.cursor = 'pointer';

    const bookImg = document.createElement('img');
    bookImg.src = 'book.png';
    bookImg.alt = 'Книга Ёжика';
    bookImg.style.width = '132px';
    bookImg.style.height = '132px';
    bookImg.style.objectFit = 'contain';
    bookImg.style.cursor = 'pointer';
    bookImg.style.pointerEvents = 'none'; // Важно: события на изображении не блокируют клик

    bookElement.appendChild(bookImg);
    locationContainer.appendChild(bookElement);

    // Добавляем обработчик клика на весь элемент
    bookElement.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('📖 Клик по книге на локации');
        openBookModal();
    });

    bookImg.onerror = function() {
        const placeholder = document.createElement('div');
        placeholder.className = 'book-placeholder';
        placeholder.textContent = '📖';
        placeholder.style.width = '132px';
        placeholder.style.height = '132px';
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.fontSize = '70px';
        placeholder.style.color = '#888888';
        placeholder.style.background = 'rgba(255, 255, 255, 0.05)';
        placeholder.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        placeholder.style.borderRadius = '10px';
        placeholder.style.cursor = 'pointer';
        
        // Обработчик клика для заглушки
        placeholder.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📖 Клик по заглушке книги на локации');
            openBookModal();
        });
        
        bookElement.appendChild(placeholder);
        bookImg.style.display = 'none';
    };
}

// Функция удаления книги с текущей локации
function removeBookFromCurrentLocation() {
    const existingBook = document.querySelector('.book-on-location');
    if (existingBook) existingBook.remove();
}

// Обработка клика по домикам
function setupHouseClickListeners() {
    console.log('🖱️ Настройка обработчиков кликов для домиков');
    
    const houses = [
        { element: karHouse, id: 'kar' },
        { element: ejHouse, id: 'ej' },
        { element: kroHouse, id: 'kro' },
        { element: losHouse, id: 'los' },
        { element: kopHouse, id: 'kop' },
        { element: pinHouse, id: 'pin' },
        { element: nyHouse, id: 'ny' },
        { element: barHouse, id: 'bar' },
        { element: sovHouse, id: 'sov' }
    ];

    houses.forEach(house => {
        if (house.element) {
            console.log(`✅ Найден домик: ${house.id}`);
            
            house.element.addEventListener('click', () => {
                console.log(`🎯 Клик по домику: ${house.id}`);
                
                if (house.id === 'ej' || house.id === 'bar') {
                    console.log(`📍 Переход на локацию: ${house.id}`);
                    showLocation(house.id);
                } else {
                    console.log(`🚫 Локация ${house.id} недоступна`);
                    showLocationNotAvailable(house.id);
                }
            });
        } else {
            console.log(`❌ Домик не найден: ${house.id}`);
        }
    });
    
    console.log('✅ Обработчики кликов настроены');
}

// Функция показа сообщения о недоступности локации
function showLocationNotAvailable(houseId) {
    const availableLocations = ['Ёжика (EJ)', 'Бараша (BAR)'];
    const availableLocationsText = availableLocations.join(', ');

    const messageBox = document.createElement('div');
    messageBox.className = 'location-not-available-modal';
    messageBox.innerHTML = `
        <div class="location-not-available-content">
            <h2>Локация временно недоступна</h2>
            <p>Домик персонажа ${houseId.toUpperCase()} пока закрыт.</p>
            <p>В данный момент доступны домики: ${availableLocationsText}.</p>
            <p>Нажмите на доступный домик на карте, чтобы начать поиск фантиков!</p>
            <button class="close-message-btn">Понятно</button>
        </div>
    `;

    document.body.appendChild(messageBox);
    setTimeout(() => {
        messageBox.classList.add('show');
    }, 10);

    const closeBtn = messageBox.querySelector('.close-message-btn');
    closeBtn.addEventListener('click', () => {
        messageBox.classList.remove('show');
        setTimeout(() => {
            messageBox.remove();
        }, 300);
    });

    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            messageBox.classList.remove('show');
            setTimeout(() => {
                messageBox.remove();
            }, 300);
        }
    });
}

// Функция показа локации
function showLocation(houseId) {
    if (houseId !== 'ej' && houseId !== 'bar') return;

    console.log(`🏠 Показ локации: ${houseId}`);
    currentLocation = houseId;
    currentDialogueStep = 0;
    currentBranch = '';
    playerChoices = [];

    if (mapScreen) mapScreen.style.display = 'none';
    if (locationScreen) locationScreen.style.display = 'flex';
    loadLocationImage(houseId);
}

// Функция для загрузки изображения локации
function loadLocationImage(houseId) {
    const locationScreen = document.getElementById('locationScreen');
    if (!locationScreen) return;
    
    console.log(`🖼️ Загрузка изображения локации: ${houseId}`);
    locationScreen.innerHTML = '';

    const contentContainer = document.createElement('div');
    contentContainer.className = 'location-content';

    const locationImage = document.createElement('img');
    locationImage.src = houseId === 'ej' ? 'domej.jpg' : 'dombar.jpg';
    locationImage.alt = `Локация ${houseId.toUpperCase()}`;
    locationImage.className = 'location-image';
    
    locationImage.style.width = '100%';
    locationImage.style.height = '100%';
    locationImage.style.objectFit = 'contain';

    const backIcon = document.createElement('img');
    backIcon.src = 'ikkart.png';
    backIcon.alt = 'Вернуться на карту';
    backIcon.className = 'back-to-map-icon';
    backIcon.style.position = 'absolute';
    backIcon.style.bottom = '30px';
    backIcon.style.left = '30px';
    backIcon.style.width = '100px';
    backIcon.style.height = '100px';
    backIcon.style.zIndex = '15';
    backIcon.style.cursor = 'pointer';
    backIcon.addEventListener('click', () => {
        console.log('🔙 Возврат на карту');
        if (locationScreen) locationScreen.style.display = 'none';
        showMapScreen();
    });

    contentContainer.appendChild(locationImage);
    contentContainer.appendChild(backIcon);
    
    // Добавляем иконку стиха только для локации Бараша
    if (houseId === 'bar') {
        const poemIconElement = document.createElement('div');
        poemIconElement.className = 'poem-icon';
        poemIconElement.style.display = 'block';
        poemIconElement.style.position = 'absolute';
        poemIconElement.style.bottom = 'calc(40% - 3.1cm)';
        poemIconElement.style.right = 'calc(40% + 1.9cm)';
        poemIconElement.style.transform = 'translate(50%, 50%)';
        poemIconElement.style.zIndex = '5';
        poemIconElement.style.cursor = 'pointer';
        
        const poemImg = document.createElement('img');
        poemImg.src = 'ikstih.png';
        poemImg.alt = 'Стих Бараша';
        poemImg.style.width = '135px';
        poemImg.style.height = '135px';
        poemImg.style.objectFit = 'contain';
        
        poemIconElement.appendChild(poemImg);
        contentContainer.appendChild(poemIconElement);
        
        poemIconElement.addEventListener('click', openPoemMinigame);
        
        poemImg.onerror = function() {
            poemImg.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'poem-placeholder';
            placeholder.textContent = '📜';
            placeholder.style.width = '135px';
            placeholder.style.height = '135px';
            placeholder.style.display = 'flex';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.fontSize = '52px';
            placeholder.style.color = '#ffd700';
            placeholder.style.background = 'rgba(255, 215, 0, 0.1)';
            placeholder.style.border = '2px solid rgba(255, 215, 0, 0.3)';
            placeholder.style.borderRadius = '20px';
            placeholder.style.cursor = 'pointer';
            placeholder.addEventListener('click', openPoemMinigame);
            poemIconElement.appendChild(placeholder);
        };
    }
    
    locationScreen.appendChild(contentContainer);

    locationImage.onload = function() {
        console.log(`✅ Изображение локации загружено: ${houseId}`);
        
        // Добавляем книгу на обе локации (Ёжика и Бараша) в правом нижнем углу
        if (hasBook) {
            setTimeout(() => {
                addBookToCurrentLocation();
            }, 200);
        }
        
        if (houseId === 'ej') {
            createDialogueSystemEJ();
        } else if (houseId === 'bar') {
            createDialogueSystemBAR();
        }
    };

    locationImage.onerror = function() {
        console.log(`❌ Ошибка загрузки изображения локации: ${houseId}`);
        contentContainer.innerHTML = '';
        const placeholder = document.createElement('div');
        placeholder.className = 'location-placeholder';
        placeholder.innerHTML = `
            <h3 class="location-title">Локация ${houseId.toUpperCase()}</h3>
            <p class="location-description">Вы находитесь в домике персонажа ${houseId.toUpperCase()}.</p>
        `;
        placeholder.style.position = 'absolute';
        placeholder.style.top = '50%';
        placeholder.style.left = '50%';
        placeholder.style.transform = 'translate(-50%, -50%)';
        placeholder.style.color = 'white';
        placeholder.style.textAlign = 'center';

        const backButton = document.createElement('div');
        backButton.className = 'back-to-map-text';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Вернуться на карту';
        backButton.style.position = 'absolute';
        backButton.style.bottom = '30px';
        backButton.style.left = '30px';
        backButton.style.padding = '15px 25px';
        backButton.style.background = 'rgba(42, 140, 255, 0.3)';
        backButton.style.color = '#e3f2fd';
        backButton.style.border = '2px solid rgba(100, 180, 255, 0.6)';
        backButton.style.borderRadius = '8px';
        backButton.style.cursor = 'pointer';
        backButton.style.zIndex = '15';
        backButton.addEventListener('click', () => {
            console.log('🔙 Возврат на карту (заглушка)');
            if (locationScreen) locationScreen.style.display = 'none';
            showMapScreen();
        });

        contentContainer.appendChild(placeholder);
        contentContainer.appendChild(backButton);

        if (houseId === 'ej') {
            createDialogueSystemEJ();
        } else if (houseId === 'bar') {
            createDialogueSystemBAR();
        }
    };
}

// Создание системы диалогов для Ёжика
function createDialogueSystemEJ() {
    console.log('🗣️ Создание системы диалогов для Ёжика');
    
    const locationScreen = document.getElementById('locationScreen');
    if (!locationScreen) return;
    
    const existingDialogue = locationScreen.querySelector('.dialogue-container');
    if (existingDialogue) existingDialogue.remove();

    const dialogueContainer = document.createElement('div');
    dialogueContainer.className = 'dialogue-container';

    const dialogueWindow = document.createElement('div');
    dialogueWindow.className = 'dialogue-window';

    const dialogueText = document.createElement('div');
    dialogueText.className = 'dialogue-text';

    const dialogueOptions = document.createElement('div');
    dialogueOptions.className = 'dialogue-options';

    const kroshCharacter = document.createElement('div');
    kroshCharacter.className = 'character krosh-character hidden';
    kroshCharacter.style.left = '-20px';
    const kroshImage = document.createElement('img');
    kroshImage.src = 'krosh.webp';
    kroshImage.alt = 'Крош';
    kroshImage.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'character-placeholder krosh-placeholder';
        placeholder.textContent = 'Крош';
        kroshCharacter.appendChild(placeholder);
    };
    kroshCharacter.appendChild(kroshImage);

    const ejikCharacter = document.createElement('div');
    ejikCharacter.className = 'character ejik-character hidden';
    ejikCharacter.style.right = '-20px';
    const ejikImage = document.createElement('img');
    ejikImage.src = 'ejic.png';
    ejikImage.alt = 'Ёжик';
    ejikImage.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'character-placeholder ejik-placeholder';
        placeholder.textContent = 'Ёжик';
        ejikCharacter.appendChild(placeholder);
    };
    ejikCharacter.appendChild(ejikImage);

    dialogueWindow.appendChild(dialogueText);
    dialogueWindow.appendChild(dialogueOptions);
    dialogueContainer.appendChild(kroshCharacter);
    dialogueContainer.appendChild(ejikCharacter);
    dialogueContainer.appendChild(dialogueWindow);

    const contentContainer = document.querySelector('.location-content');
    if (contentContainer) {
        contentContainer.appendChild(dialogueContainer);
        startDialogueEJ(dialogueText, dialogueOptions, dialogueWindow);
    }
}

// Создание системы диалогов для Бараша
function createDialogueSystemBAR() {
    console.log('🗣️ Создание системы диалогов для Бараша');
    
    const locationScreen = document.getElementById('locationScreen');
    if (!locationScreen) return;
    
    const existingDialogue = locationScreen.querySelector('.dialogue-container');
    if (existingDialogue) existingDialogue.remove();

    const dialogueContainer = document.createElement('div');
    dialogueContainer.className = 'dialogue-container';

    const dialogueWindow = document.createElement('div');
    dialogueWindow.className = 'dialogue-window';

    const dialogueText = document.createElement('div');
    dialogueText.className = 'dialogue-text';

    const dialogueOptions = document.createElement('div');
    dialogueOptions.className = 'dialogue-options';

    const kroshCharacter = document.createElement('div');
    kroshCharacter.className = 'character krosh-character hidden';
    kroshCharacter.style.left = '-20px';
    const kroshImage = document.createElement('img');
    kroshImage.src = 'krosh.webp';
    kroshImage.alt = 'Крош';
    kroshImage.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'character-placeholder krosh-placeholder';
        placeholder.textContent = 'Крош';
        kroshCharacter.appendChild(placeholder);
    };
    kroshCharacter.appendChild(kroshImage);

    const barashCharacter = document.createElement('div');
    barashCharacter.className = 'character barash-character hidden';
    barashCharacter.style.right = '-20px';
    const barashImage = document.createElement('img');
    barashImage.src = 'barash.webp';
    barashImage.alt = 'Бараш';
    barashImage.onerror = function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'character-placeholder barash-placeholder';
        placeholder.textContent = 'Бараш';
        barashCharacter.appendChild(placeholder);
    };
    barashCharacter.appendChild(barashImage);

    dialogueWindow.appendChild(dialogueText);
    dialogueWindow.appendChild(dialogueOptions);
    dialogueContainer.appendChild(kroshCharacter);
    dialogueContainer.appendChild(barashCharacter);
    dialogueContainer.appendChild(dialogueWindow);

    const contentContainer = document.querySelector('.location-content');
    if (contentContainer) {
        contentContainer.appendChild(dialogueContainer);
        startDialogueBAR(dialogueText, dialogueOptions, dialogueWindow);
    }
}

// Запуск диалога для Ёжика
function startDialogueEJ(dialogueText, dialogueOptions, dialogueWindow) {
    currentDialogueStep = 0;
    currentBranch = '';
    playerChoices = [];
    showDialogueStepEJ(dialogueText, dialogueOptions, dialogueWindow);
}

// Показать шаг диалога для Ёжика
function showDialogueStepEJ(dialogueText, dialogueOptions, dialogueWindow) {
    if (!dialogueText || !dialogueOptions) return;
    
    dialogueOptions.innerHTML = '';
    const dialogueStep = getDialogueStepEJ(currentDialogueStep, currentBranch);

    if (!dialogueStep) {
        endDialogueEJ();
        return;
    }

    if (dialogueStep.options && dialogueStep.options.length > 0) {
        dialogueWindow.classList.add('choice-mode');
        const characterQuestion = document.createElement('div');
        characterQuestion.className = `character-question ${dialogueStep.character === 'Крош' ? 'krosh' : 'ejik'}`;
        characterQuestion.innerHTML = `${dialogueStep.character}<span class="ellipsis">...</span>`;
        dialogueText.innerHTML = '';
        dialogueText.appendChild(characterQuestion);
        updateCharacterVisibilityEJ(dialogueStep.character);

        dialogueStep.options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'dialogue-option';
            optionButton.textContent = option.text;
            optionButton.addEventListener('click', () => {
                playerChoices.push({
                    step: currentDialogueStep,
                    choice: option.text,
                    branch: option.branch
                });
                currentDialogueStep = option.nextStep !== undefined ? option.nextStep : currentDialogueStep + 1;
                if (option.branch) currentBranch = option.branch;
                showDialogueStepEJ(dialogueText, dialogueOptions, dialogueWindow);
            });
            dialogueOptions.appendChild(optionButton);
        });
    } else {
        dialogueWindow.classList.remove('choice-mode');
        let textColor = '';
        if (dialogueStep.character === 'Крош') textColor = 'krosh-text';
        else if (dialogueStep.character === 'Ёжик') textColor = 'ejik-text';
        else textColor = 'system-text';

        dialogueText.innerHTML = `<span class="dialogue-speaker ${textColor}">${dialogueStep.character}:</span> <span class="dialogue-content ${textColor}">${dialogueStep.text}</span>`;
        updateCharacterVisibilityEJ(dialogueStep.character);

        const continueButton = document.createElement('button');
        continueButton.className = 'dialogue-option continue-btn';
        continueButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
        continueButton.addEventListener('click', () => {
            currentDialogueStep++;
            showDialogueStepEJ(dialogueText, dialogueOptions, dialogueWindow);
        });
        dialogueOptions.appendChild(continueButton);
    }
}

// Запуск диалога для Бараша
function startDialogueBAR(dialogueText, dialogueOptions, dialogueWindow) {
    currentDialogueStep = 0;
    currentBranch = '';
    playerChoices = [];
    showDialogueStepBAR(dialogueText, dialogueOptions, dialogueWindow);
}

// Показать шаг диалога для Бараша
function showDialogueStepBAR(dialogueText, dialogueOptions, dialogueWindow) {
    if (!dialogueText || !dialogueOptions) return;
    
    dialogueOptions.innerHTML = '';
    const dialogueStep = getDialogueStepBAR(currentDialogueStep, currentBranch);

    if (!dialogueStep) {
        endDialogueBAR();
        return;
    }

    if (dialogueStep.options && dialogueStep.options.length > 0) {
        dialogueWindow.classList.add('choice-mode');
        const characterQuestion = document.createElement('div');
        characterQuestion.className = `character-question ${dialogueStep.character === 'Крош' ? 'krosh' : 'barash'}`;
        characterQuestion.innerHTML = `${dialogueStep.character}<span class="ellipsis">...</span>`;
        dialogueText.innerHTML = '';
        dialogueText.appendChild(characterQuestion);
        updateCharacterVisibilityBAR(dialogueStep.character);

        dialogueStep.options.forEach(option => {
            const optionButton = document.createElement('button');
            optionButton.className = 'dialogue-option';
            optionButton.textContent = option.text;
            optionButton.addEventListener('click', () => {
                playerChoices.push({
                    step: currentDialogueStep,
                    choice: option.text,
                    branch: option.branch
                });
                currentDialogueStep = option.nextStep !== undefined ? option.nextStep : currentDialogueStep + 1;
                if (option.branch) currentBranch = option.branch;
                showDialogueStepBAR(dialogueText, dialogueOptions, dialogueWindow);
            });
            dialogueOptions.appendChild(optionButton);
        });
    } else {
        dialogueWindow.classList.remove('choice-mode');
        let textColor = '';
        if (dialogueStep.character === 'Крош') textColor = 'krosh-text';
        else if (dialogueStep.character === 'Бараш') textColor = 'barash-text';
        else textColor = 'system-text';

        dialogueText.innerHTML = `<span class="dialogue-speaker ${textColor}">${dialogueStep.character}:</span> <span class="dialogue-content ${textColor}">${dialogueStep.text}</span>`;
        updateCharacterVisibilityBAR(dialogueStep.character);

        const continueButton = document.createElement('button');
        continueButton.className = 'dialogue-option continue-btn';
        continueButton.innerHTML = '<i class="fas fa-arrow-right"></i>';
        continueButton.addEventListener('click', () => {
            currentDialogueStep++;
            showDialogueStepBAR(dialogueText, dialogueOptions, dialogueWindow);
        });
        dialogueOptions.appendChild(continueButton);
    }
}

// Обновление видимости персонажей для Ёжика
function updateCharacterVisibilityEJ(speakingCharacter) {
    const kroshCharacter = document.querySelector('.krosh-character');
    const ejikCharacter = document.querySelector('.ejik-character');
    if (!kroshCharacter || !ejikCharacter) return;

    if (speakingCharacter === 'Крош') {
        kroshCharacter.classList.add('active');
        kroshCharacter.classList.remove('hidden');
        ejikCharacter.classList.add('hidden');
        ejikCharacter.classList.remove('active');
        kroshCharacter.style.left = '-60px';
        kroshCharacter.style.right = 'auto';
    } else if (speakingCharacter === 'Ёжик') {
        ejikCharacter.classList.add('active');
        ejikCharacter.classList.remove('hidden');
        kroshCharacter.classList.add('hidden');
        kroshCharacter.classList.remove('active');
        ejikCharacter.style.right = '-60px';
        ejikCharacter.style.left = 'auto';
    } else {
        kroshCharacter.classList.add('hidden');
        ejikCharacter.classList.add('hidden');
    }
}

// Обновление видимости персонажей для Бараша
function updateCharacterVisibilityBAR(speakingCharacter) {
    const kroshCharacter = document.querySelector('.krosh-character');
    const barashCharacter = document.querySelector('.barash-character');
    if (!kroshCharacter || !barashCharacter) return;

    if (speakingCharacter === 'Крош') {
        kroshCharacter.classList.add('active');
        kroshCharacter.classList.remove('hidden');
        barashCharacter.classList.add('hidden');
        barashCharacter.classList.remove('active');
        kroshCharacter.style.left = '-60px';
        kroshCharacter.style.right = 'auto';
    } else if (speakingCharacter === 'Бараш') {
        barashCharacter.classList.add('active');
        barashCharacter.classList.remove('hidden');
        kroshCharacter.classList.add('hidden');
        kroshCharacter.classList.remove('active');
        barashCharacter.style.right = '-60px';
        barashCharacter.style.left = 'auto';
    } else {
        kroshCharacter.classList.add('hidden');
        barashCharacter.classList.add('hidden');
    }
}

// Завершение диалога для Ёжика
function endDialogueEJ() {
    const dialogueContainer = document.querySelector('.dialogue-container');
    if (dialogueContainer) {
        dialogueContainer.style.opacity = '0';
        dialogueContainer.style.transform = 'translateY(50px)';
        dialogueContainer.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            dialogueContainer.remove();
        }, 500);
    }

    const hasCorrectAnswers = playerChoices.some(choice =>
        choice.branch === 'positive' &&
        (choice.choice.includes('Успокойся') ||
         choice.choice.includes('Йу-ху') ||
         choice.choice.includes('составим план') ||
         choice.choice.includes('Представляю, как обрадуешься'))
    );

    if (hasCorrectAnswers && !hasBook) {
        startBookAnimation();
    } else if (hasBook && currentLocation === 'ej') {
        setTimeout(() => {
            addBookToCurrentLocation();
        }, 500);
    }
}

// Завершение диалога для Бараша
function endDialogueBAR() {
    const dialogueContainer = document.querySelector('.dialogue-container');
    if (dialogueContainer) {
        dialogueContainer.style.opacity = '0';
        dialogueContainer.style.transform = 'translateY(50px)';
        dialogueContainer.style.transition = 'all 0.5s ease';
        setTimeout(() => {
            dialogueContainer.remove();
        }, 500);
    }
}

// Функция запуска анимации книги
function startBookAnimation() {
    const bookAnimation = document.getElementById('bookAnimation');
    if (!bookAnimation) return;

    bookAnimation.style.display = 'flex';
    setTimeout(() => {
        bookAnimation.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        bookAnimation.style.opacity = '0';
        setTimeout(() => {
            bookAnimation.style.display = 'none';
        }, 500);

        hasBook = true;
        localStorage.setItem('hasBook', 'true');
        showBookNotification();

        // Добавляем книгу на текущую локацию (правый нижний угол)
        setTimeout(() => {
            addBookToCurrentLocation();
        }, 300);
    }, 2000);
}

// Функция показа уведомления о получении книги
function showBookNotification() {
    const notification = document.getElementById('bookNotification');
    if (!notification) return;

    notification.style.display = 'flex';
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 3000);
}

// Данные диалога для Ёжика
function getDialogueStepEJ(step, branch) {
    const dialogueDataEJ = {
        0: {
            character: 'Ёжик',
            text: '(в панике) Ой-ой-ой! Беда! Пропало всё! Моя бедная коллекция!',
            options: []
        },
        1: {
            character: 'Крош',
            text: '(подскакивает) Ёжик, что случилось? Ты как будто на муравейник сел!',
            options: []
        },
        2: {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '«Успокойся и расскажи по порядку. Что пропало?»',
                    branch: 'positive',
                    nextStep: 3
                },
                {
                    text: '«Йу-ху! Кто-то потерял что-то важное? Включаем режим супер-поиска!»',
                    branch: 'positive',
                    nextStep: 3
                },
                {
                    text: '«Опять твои фантики? Может, просто новые насобираешь?»',
                    branch: 'conflict',
                    nextStep: 10
                },
                {
                    text: '«Подожди, а может, их кто-то взял? Надо устроить допрос!»',
                    branch: 'conflict',
                    nextStep: 10
                }
            ]
        }
    };

    if (branch === 'positive') {
        dialogueDataEJ[3] = {
            character: 'Ёжик',
            text: '(всхлипывая) Мешочек с фантиками... Самые ценные... С памятью о наших приключениях...',
            options: []
        };
        dialogueDataEJ[4] = {
            character: 'Крош',
            text: '(серьёзно) Не крутись, как юла. Где ты их последний раз видел?',
            options: []
        };
        dialogueDataEJ[5] = {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '«Давай составим план. Ты был в библиотеке, на стадионе или у ручья?»',
                    nextStep: 6
                },
                {
                    text: '«Щас мы их как найдём! Я ношусь быстрее ветра, прочешу всё!»',
                    nextStep: 6
                }
            ]
        };
        dialogueDataEJ[6] = {
            character: 'Ёжик',
            text: '(успокаиваясь) Я... кажется, был у ручья, потом на стадионе...',
            options: []
        };
        dialogueDataEJ[7] = {
            character: 'Крош',
            text: 'Отлично! Значит, есть зацепки!',
            options: []
        };
        dialogueDataEJ[8] = {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '«Держи карман шире! То есть, погоди, я серьёзно. Мы их найдём.»',
                    nextStep: 9
                },
                {
                    text: '«Представляю, как обрадуешься, когда мы их вернём! Давай быстрее!»',
                    nextStep: 9
                }
            ]
        };
        dialogueDataEJ[9] = {
            character: 'Ёжик',
            text: 'Спасибо, Крош...',
            options: []
        };
    }

    if (branch === 'conflict') {
        dialogueDataEJ[10] = {
            character: 'Ёжик',
            text: '(обиженно) Это не просто фантики! Это память о наших приключениях!',
            options: []
        };
        dialogueDataEJ[11] = {
            character: 'Крош',
            text: '(раздражаясь) Ну вот, опять ты разнылся!',
            options: []
        };
        dialogueDataEJ[12] = {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '«Ладно-ладно, я помогу. Но если найду — ты мне мороженое должен!»',
                    nextStep: 13
                },
                {
                    text: '«Если бы ты был аккуратнее, ничего бы не терял!»',
                    nextStep: 13
                }
            ]
        };
        dialogueDataEJ[13] = {
            character: 'Ёжик',
            text: 'Мороженое?! Да ты вообще не понимаешь!',
            options: []
        };
        dialogueDataEJ[14] = {
            character: 'Крош',
            text: 'Понимаю, что ты меня не ценишь!',
            options: []
        };
        dialogueDataEJ[15] = {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '«Ага, а сам сидишь и ноешь! Я хоть дело делать предлагаю!»',
                    nextStep: 16
                },
                {
                    text: '«Знаешь что? Ищи сам свои фантики!»',
                    nextStep: 16
                }
            ]
        };
        dialogueDataEJ[16] = {
            character: 'Ёжик',
            text: '(вспыхнув) И буду! И без тебя обойдусь!',
            options: []
        };
        dialogueDataEJ[17] = {
            character: 'Крош',
            text: '(упрямо) А я всё равно пойду искать! Докажу, что могу!',
            options: []
        };
    }

    return dialogueDataEJ[step];
}

// Данные диалога для Бараша
function getDialogueStepBAR(step, branch) {
    const dialogueDataBAR = {
        0: {
            character: 'Крош',
            text: 'Бараш! Чрезвычайная ситуация! Фантики Ёжика по всему лесу! Ты не видел?',
            options: []
        },
        1: {
            character: 'Бараш',
            text: '(качаясь, не глядя) Видел… один-единственный. Он был столь красив, что я объявил его вне закона для обыденности и поместил в поэтическую тюрьму.',
            options: []
        },
        2: {
            character: 'Крош',
            text: 'В тюрьму? То есть в стишок? И где теперь этот стишок? И, главное, где ключ от тюрьмы — сам фантик?',
            options: []
        },
        3: {
            character: 'Бараш',
            text: '(махнув лапой в сторону комода) Тюрьма разрушена. Я её разрушил, ибо ни одна стена не была достойна удержать такую красоту. Теперь лишь руины. (На комоде лежат 4-5 крупных рваных кусков бумаги.)',
            options: []
        },
        4: {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '«Руины? А давай я попробую их восстановить! Как древний свиток!»',
                    branch: 'respectful',
                    nextStep: 5
                },
                {
                    text: '«Опять всё сломал… Ладно, дай сюда эти руины, быстренько гляну, что к чему.»',
                    branch: 'rude',
                    nextStep: 5
                }
            ]
        },
        5: { character: 'Бараш', text: '', options: [] },
        6: {
            character: 'Крош',
            text: '(подходит к комоду, видит обрывки) Так, куски есть. Но они нестыкуются. И где сам узник? Куда ты дел фантик после того, как тюрьму разрушил?',
            options: []
        },
        7: {
            character: 'Бараш',
            text: '(закрывает глаза) Когда стены рухнули… он исчез. Растворился в мире. Или был спрятан в нём. Я уже и не помню. Я помню только обломки.',
            options: []
        },
        8: {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '«Спрятан в мире? Но в каком именно месте этого мира? Может, ты оставил подсказку в самом стихе?»',
                    branch: 'respectful',
                    nextStep: 9
                },
                {
                    text: '(С недовольством) «Опять загадки! Может, просто скажешь, в какую сторону идти?»',
                    branch: 'rude',
                    nextStep: 9
                }
            ]
        },
        9: { character: 'Бараш', text: '', options: [] },
        10: {
            character: 'Крош',
            text: 'Значит, всё упирается в этот стих. Если я соберу его, я пойму, где искать? Ты в этом уверен?',
            options: []
        },
        11: {
            character: 'Бараш',
            text: 'Уверен? Нет. Но это единственный путь. Собранный стих — это карта. Разорванный стих — просто мусор.',
            options: []
        },
        12: {
            character: 'Крош',
            text: 'Выберите ответ:',
            options: [
                {
                    text: '(Берёт обрывки бережно) «Значит, мне нужно собрать эту карту. Я сделаю это. Ты разрешаешь?»',
                    branch: 'respectful',
                    nextStep: 13
                },
                {
                    text: '(Сжимает обрывки в лапах) «Что ж, придётся собирать. Только не мешай, если я что-то не так соединю.»',
                    branch: 'rude',
                    nextStep: 13
                }
            ]
        },
        13: { character: 'Бараш', text: '', options: [] },
        14: {
            character: 'Крош',
            text: '(внимательно изучает обрывки) Хорошо. Я начинаю. Но это твоё творение. Если я соберу его неправильно… подсказка собьёт меня с пути. Я прав?',
            options: []
        },
        15: {
            character: 'Бараш',
            text: 'Абсолютно. Порядок строк — это скелет смысла. Сломай скелет — и смысл расползётся, как медуза.',
            options: []
        },
        16: {
            character: 'Крош',
            text: 'ФИНАЛЬНЫЙ ВЫБОР:',
            options: [
                {
                    text: '«Тогда я буду очень внимателен. Это как головоломка. Я соберу её с почтением к автору.»',
                    branch: 'respectful_path',
                    nextStep: 17
                },
                {
                    text: '«Бараш, я собираюсь положить эти куски перед тобой и собирать. Молча. Но если в конце твоё поэтическое сердце екнет от неправильной строки — просто кашляни. Хорошо?»',
                    branch: 'respectful_path',
                    nextStep: 17
                },
                {
                    text: '(Нетерпеливо) «Ладно, сиди там в своём кресле. Я сам во всём разберусь. Не нужна мне твоя помощь!»',
                    branch: 'rude_path',
                    nextStep: 17
                },
                {
                    text: '«Слушай, а если я соберу как попало и найду фантик по ложной подсказке, Ёжик мне этого не простит. Ты хоть это понимаешь?»',
                    branch: 'rude_path',
                    nextStep: 17
                }
            ]
        },
        17: { character: 'Крош', text: '...', options: [] }
    };

    if (step === 5) {
        const previousChoice = playerChoices.find(choice => choice.step === 4);
        if (previousChoice && previousChoice.branch === 'respectful') {
            dialogueDataBAR[5].text = '(с лёгким любопытством) «Восстановить свиток… Романтично. Пожалуйста».';
        } else if (previousChoice && previousChoice.branch === 'rude') {
            dialogueDataBAR[5].text = '(фыркает) «Быстренько… Древние свитки так не читают».';
        }
    } else if (step === 9) {
        const previousChoice1 = playerChoices.find(choice => choice.step === 4);
        const previousChoice2 = playerChoices.find(choice => choice.step === 8);
        if (previousChoice1 && previousChoice1.branch === 'respectful' &&
            previousChoice2 && previousChoice2.branch === 'respectful') {
            dialogueDataBAR[9].text = '(приоткрывает один глаз) «Подсказка… Возможно. Поэзия — всегда подсказка. Но чтобы её прочесть… нужно увидеть текст целиком».';
        } else {
            dialogueDataBAR[9].text = '(отворачивается к стене) «Идти… Иди. Иди куда глаза глядят. Мои глаза сейчас глядят внутрь».';
        }
    } else if (step === 13) {
        const respectfulCount = playerChoices.filter(choice =>
            choice.branch === 'respectful' || choice.branch === 'respectful_path'
        ).length;
        const rudeCount = playerChoices.filter(choice =>
            choice.branch === 'rude' || choice.branch === 'rude_path'
        ).length;
        if (respectfulCount > rudeCount) {
            dialogueDataBAR[13].text = '(кивает, не глядя) «Разрешаю. Это твой путь теперь. Моё дело — создать. Твоё — расшифровать».';
        } else {
            dialogueDataBAR[13].text = '(пожимает плечами) «Мешать? Я и не думал. У меня свои битвы».';
        }
    }

    return dialogueDataBAR[step];
}

// Обработка ошибки загрузки видео
if (introVideo) {
    introVideo.addEventListener('error', function() {
        console.log('❌ Ошибка загрузки видео');
        if (videoScreen) videoScreen.style.display = 'none';
        showMapScreen();
    });
}

// Обработка ошибки загрузки карты
const mapImage = document.querySelector('.map-image');
if (mapImage) {
    mapImage.addEventListener('error', function() {
        console.log('❌ Ошибка загрузки карты');
        this.style.display = 'none';
        const container = this.parentElement;
        container.innerHTML = '<div style="color: #e3f2fd; font-size: 24px; padding: 100px; text-align: center;">Карта игры<br><small>karta.png</small></div>';
        container.style.background = 'linear-gradient(45deg, #1a3a5f, #2a5a8a)';
    });
}

// Обработка ошибки загрузки домиков
function setupHouseErrorHandlers() {
    const houses = [
        { element: karHouse, top: 'calc(80% + 0.2cm)', left: 'calc(20% + 2.2cm)', width: '7.1%', height: '7.1%' },
        { element: ejHouse, top: '72%', left: '72%', width: '130px', height: '130px' },
        { element: kroHouse, top: 'calc(70% - 1.2cm)', left: 'calc(50% + 4.4cm)', width: '192px', height: '192px' },
        { element: losHouse, top: 'calc(60% + 4.2cm)', left: 'calc(35% - 12.3cm)', width: '130px', height: '130px' },
        { element: kopHouse, top: 'calc(50% + 10cm)', left: 'calc(50% + 0.8cm)', width: '206px', height: '206px' },
        { element: pinHouse, top: '50%', left: '50%', width: '130px', height: '130px' },
        { element: nyHouse, top: '50%', left: '50%', width: '110px', height: '130px' },
        { element: barHouse, top: '50%', left: '50%', width: '130px', height: '130px' },
        { element: sovHouse, top: '50%', left: '50%', width: '130px', height: '130px' }
    ];

    houses.forEach(house => {
        if (house.element) {
            house.element.addEventListener('error', function() {
                console.log(`Ошибка загрузки домика: ${house.element.id}`);
                this.style.display = 'none';
                const container = this.parentElement;
                const placeholder = document.createElement('div');
                placeholder.className = 'house-area';
                placeholder.style.top = house.top;
                placeholder.style.left = house.left;
                placeholder.style.width = house.width;
                placeholder.style.height = house.height;
                placeholder.style.background = 'rgba(100, 180, 255, 0.3)';
                placeholder.style.borderRadius = '8px';
                placeholder.style.cursor = 'pointer';
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.color = 'white';
                placeholder.style.fontWeight = 'bold';
                placeholder.innerHTML = house.element.id.replace('House', '');
                placeholder.addEventListener('click', () => {
                    const houseId = house.element.id.replace('House', '').toLowerCase();
                    if (houseId === 'ej' || houseId === 'bar') {
                        showLocation(houseId);
                    } else {
                        showLocationNotAvailable(houseId);
                    }
                });
                container.appendChild(placeholder);
            });
        }
    });
}

// Обработка ошибки загрузки изображения обложки
const gameCoverImg = document.querySelector('.game-cover img');
if (gameCoverImg) {
    gameCoverImg.addEventListener('error', function() {
        this.style.display = 'none';
        const coverOverlay = document.querySelector('.cover-overlay');
        if (coverOverlay) {
            coverOverlay.innerHTML = '';
        }
    });
}

// Обработчики для мини-игры
document.body.addEventListener('dragend', () => {
    if (baseImageMinigame) {
        baseImageMinigame.style.boxShadow = '';
    }
});

// Инициализация игры
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Игра "В поисках фантика" успешно загружена');
    
    // Обработчики для мини-игры
    if (checkButtonMinigame) checkButtonMinigame.addEventListener('click', checkOrderMinigame);
    if (resetButtonMinigame) resetButtonMinigame.addEventListener('click', initMinigame);
    if (backButtonMinigame) backButtonMinigame.addEventListener('click', closePoemMinigame);
});