// ───────────────────────────────────────────────────────────────
// Настройки
// ───────────────────────────────────────────────────────────────

const circle = document.getElementById('circle');
const icons = [...document.querySelectorAll('.svg-icon-hero')];
const isDesktop = window.matchMedia('(min-width: 1250px)').matches;

const cx = isDesktop ? 198 : 126;
const cy = isDesktop ? 198 : 126;
const r = isDesktop ? 198 : 126;
const iconSize = isDesktop ? 80 : 50;
const totalIcons = icons.length;
const startAngle = -2.2;
const rotationDistance = Math.PI;

// const animationSettings = {
//     circleFade: 1500,
//     iconFadeStep: 800,
//     iconFadeTime: 200,
//     rotationTime: 2000
// };

const animationSettings = {
    circleFade: 800,
    iconFadeStep: 600,
    iconFadeTime: 0,
    rotationTime: 1000
};

// ───────────────────────────────────────────────────────────────
// Анимация круга и иконок
// ───────────────────────────────────────────────────────────────

function setIconPosition(el, angle) {
    const x = cx + r * Math.cos(angle) - iconSize / 2;
    const y = cy + r * Math.sin(angle) - iconSize / 2;
    el.style.transform = `translate(${x}px, ${y}px)`;
}

function showCircle(duration) {
    return new Promise(resolve => {
        circle.classList.remove('visible');
        circle.offsetHeight; // принудительный рефлоу
        circle.classList.add('visible');
        setTimeout(resolve, duration);
    });
}

function showIcons(delayBetween, iconFadeTime) {
    return new Promise(resolve => {
        icons.forEach((icon, i) => {
            const angle = startAngle + (2 * Math.PI / totalIcons) * i;
            setIconPosition(icon, angle);
            setTimeout(() => {
                icon.style.opacity = '1';
            }, i * delayBetween);
        });
        const totalTime = delayBetween * totalIcons + iconFadeTime;
        setTimeout(resolve, totalTime);
    });
}

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function rotateIconsOneTurn(duration) {
    return new Promise(resolve => {
        const baseAngles = icons.map((_, i) => startAngle + (2 * Math.PI / totalIcons) * i);
        icons.forEach((icon, i) => setIconPosition(icon, baseAngles[i]));

        requestAnimationFrame(now => {
            const start = now;

            function animateFrame(now) {
                const progress = Math.min((now - start) / duration, 1);
                const easedProgress = easeInOutCubic(progress);
                const angleOffset = -rotationDistance * easedProgress;

                icons.forEach((icon, i) => {
                    const currentAngle = baseAngles[i] + angleOffset;
                    setIconPosition(icon, currentAngle);
                });

                if (progress < 1) {
                    requestAnimationFrame(animateFrame);
                } else {
                    resolve();
                }
            }

            animateFrame(now);
        });
    });
}

async function runSequence(settings) {
    const { circleFade, iconFadeStep, iconFadeTime, rotationTime } = settings;

    await showCircle(circleFade);
    await showIcons(iconFadeStep, iconFadeTime);
    await rotateIconsOneTurn(rotationTime);

    document.querySelector('.hero').classList.add('animation-all');
}

// ───────────────────────────────────────────────────────────────
// Параллакс-эффект для блоков
// ───────────────────────────────────────────────────────────────

const scrollBlock1 = document.querySelector('.scroll-block1');
const scrollBlock2 = document.querySelector('.scroll-block2');

const rows1 = [
    {
        el: document.querySelector('.row1'),
        direction: -1,
        speeds: [
            { minWidth: 768, speed: 0.75 },
            { minWidth: 1250, speed: 0.75 },
            { minWidth: 1440, speed: 0.3 }
        ],
        offset: 0,
        speed: 0
    },
    {
        el: document.querySelector('.row2'),
        direction: 1,
        speeds: [
            { minWidth: 768, speed: 0.2 },
            { minWidth: 1250, speed: 0.2 },
            { minWidth: 1440, speed: 0.1 }
        ],
        offset: 0,
        speed: 0
    },
    {
        el: document.querySelector('.row3'),
        direction: -1,
        speeds: [
            { minWidth: 768, speed: 0.2 },
            { minWidth: 1250, speed: 0.08 },
            { minWidth: 1440, speed: 0.1 }
        ],
        offset: 0,
        speed: 0
    }
];

function updateSpeedsOne() {
    const w = window.innerWidth;
    rows1.forEach(row => {
        let matched = row.speeds[0];
        for (const sp of row.speeds) {
            if (w >= sp.minWidth && sp.minWidth >= matched.minWidth) {
                matched = sp;
            }
        }
        row.speed = matched.speed;
    });
}

function updateScrollOne() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    const blockRect = scrollBlock1.getBoundingClientRect();
    const blockTop = scrollY + blockRect.top;
    const blockHeight = scrollBlock1.offsetHeight;

    const offsetStart = viewportHeight * 0.4; // начинаем анимацию заранее на 40% высоты экрана

    let progress = scrollY - blockTop + offsetStart;

    // Ограничиваем прогресс внутри блока
    if (progress < 0) progress = 0;
    if (progress > blockHeight) progress = blockHeight;

    rows1.forEach(row => {
        row.offset = progress * row.speed * row.direction;
        row.el.style.transform = `translateX(${row.offset}px)`;
    });
}

const rows2 = [
    {
        el: document.querySelector('.row4'),
        direction: -1,
        speeds: [
            { minWidth: 0, speed: 0.5 },
            { minWidth: 768, speed: 1 },
            { minWidth: 1200, speed: 0.3 }
        ],
        offset: 0,
        speed: 0
    },
    {
        el: document.querySelector('.row5'),
        direction: 1,
        speeds: [
            { minWidth: 0, speed: 0.3 },
            { minWidth: 768, speed: 0.6 },
            { minWidth: 1200, speed: 0.1 }
        ],
        offset: 0,
        speed: 0
    },
    {
        el: document.querySelector('.row6'),
        direction: -1,
        speeds: [
            { minWidth: 0, speed: 0.2 },
            { minWidth: 768, speed: 0.4 },
            { minWidth: 1200, speed: 0.08 }
        ],
        offset: 0,
        speed: 0
    }
];

function updateSpeedsTwo() {
    const w = window.innerWidth;
    rows2.forEach(row => {
        let matched = row.speeds[0];
        for (const sp of row.speeds) {
            if (w >= sp.minWidth && sp.minWidth >= matched.minWidth) {
                matched = sp;
            }
        }
        row.speed = matched.speed;
    });
}

function updateScrollTwo() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    const blockRect = scrollBlock2.getBoundingClientRect();
    const blockTop = scrollY + blockRect.top;
    const blockHeight = scrollBlock2.offsetHeight;

    const offsetStart = viewportHeight * 0.4; // анимация начнётся за ~40% до появления блока в экран

    // Вычисляем прогресс с учетом offsetStart
    let progress = scrollY - blockTop + offsetStart;

    // Ограничим от 0 до высоты блока
    if (progress < 0) progress = 0;
    if (progress > blockHeight) progress = blockHeight;

    rows2.forEach(row => {
        row.offset = progress * row.speed * row.direction;
        row.el.style.transform = `translateX(${row.offset}px)`;
    });
}

// ───────────────────────────────────────────────────────────────
// Swiper и дебаунс
// ───────────────────────────────────────────────────────────────

const mobileSwipers = new Map();

function initGlobalSwipers() {
    document.querySelectorAll('.swiper:not(.swiper-mobile)').forEach(container => {
        if (!container.classList.contains('swiper-initialized')) {
            const swiper = new Swiper(container, {
                slidesPerView: 'auto',
                spaceBetween: 32,
                pagination: {
                    el: container.querySelector('.swiper-pagination'),
                    clickable: true
                }
            });

            container.classList.add('swiper-initialized');

            let autoplayTimeout = null;
            let isInView = false;
            let isMobile = window.matchMedia('(max-width: 767px)').matches;

            const slideDelays = {
                0: 3000,
                1: isMobile ? 13000 : 6000,
                2: 3000
            };

            // 🔁 Анимация пагинации
            let activeAnimationToken = null;

            function animatePagination(index, duration) {
                const bullets = container.querySelectorAll('.swiper-pagination .swiper-pagination-bullet');

                // Уникальный токен для текущей анимации
                const currentToken = Symbol('progress');
                activeAnimationToken = currentToken;

                bullets.forEach((bullet, i) => {
                    // Сброс классов и стилей
                    bullet.classList.remove('progress-animate', 'is-complete');
                    bullet.style.setProperty('--progress-duration', '0ms');

                    if (i < index) {
                        // Предыдущие — сразу завершены
                        bullet.classList.add('is-complete');
                        return;
                    }

                    if (i === index) {
                        // Ставим прогресс-анимацию на следующий кадр
                        requestAnimationFrame(() => {
                            bullet.style.setProperty('--progress-duration', `${duration}ms`);
                            bullet.classList.add('progress-animate');
                        });

                        // После завершения — проверяем, не сменился ли токен
                        setTimeout(() => {
                            if (activeAnimationToken === currentToken) {
                                bullet.classList.add('is-complete');
                            }
                        }, duration);
                    }
                });
            }

            let currentSlideIndex = null;
            let animationStartTime = null;

            function scheduleAutoplay() {
                if (!isInView) return;

                if (autoplayTimeout) {
                    clearTimeout(autoplayTimeout);
                    autoplayTimeout = null;
                }

                const index = swiper.realIndex;

                // Если вернулись к уже проигрывающемуся слайду — не перезапускаем анимацию
                const now = Date.now();
                const delay = slideDelays[index] || 3000;

                // Проверка: если это тот же слайд и анимация ещё не закончилась
                if (currentSlideIndex === index && animationStartTime && (now - animationStartTime) < delay) {
                    const remaining = delay - (now - animationStartTime);

                    autoplayTimeout = setTimeout(() => {
                        swiper.slideNext();
                    }, remaining);

                    animatePagination(index, remaining);
                    return;
                }

                // Иначе — сбрасываем всё
                swiper.slides.forEach(slide => slide.classList.remove('is-animate'));
                if (index === 1 || index === 2) {
                    swiper.slides[index].classList.add('is-animate');
                }

                animatePagination(index, delay);

                animationStartTime = now;
                currentSlideIndex = index;

                autoplayTimeout = setTimeout(() => {
                    swiper.slideNext();
                }, delay);
            }

            // 👁 Отслеживаем появление
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    isInView = entry.isIntersecting;

                    if (isInView) {
                        scheduleAutoplay();
                    } else {
                        if (autoplayTimeout) {
                            clearTimeout(autoplayTimeout);
                            autoplayTimeout = null;
                        }
                    }
                });
            }, {
                threshold: 0.5
            });

            observer.observe(container);

            swiper.on('slideChange', scheduleAutoplay);

            // Первый запуск
            scheduleAutoplay();
        }
    });
}

function initMobileSwipers() {
    if (window.innerWidth <= 767) {
        document.querySelectorAll('.slider-mobile').forEach(container => {
            // Добавляем класс для слайдера, если его нет
            if (!container.classList.contains('swiper-mobile')) {
                container.classList.add('swiper-mobile');

                // Добавляем необходимые вложенные элементы для Swiper, если их нет
                if (!container.querySelector('.swiper-wrapper')) {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('swiper-wrapper');

                    // Перемещаем все прямые дети в wrapper
                    while (container.firstChild) {
                        wrapper.appendChild(container.firstChild);
                    }
                    container.appendChild(wrapper);
                }

                // Добавляем класс swiper-slide каждому слайду
                container.querySelectorAll(':scope > .swiper-wrapper > *').forEach(slide => {
                    if (!slide.classList.contains('swiper-slide')) {
                        slide.classList.add('swiper-slide');
                    }
                });
            }

            // Инициализация Swiper
            if (!mobileSwipers.has(container)) {
                const isSpecial = container.classList.contains('slider-mobile_1');
                const title = isSpecial
                    ? container.closest('.programm')?.querySelector('.programm__wrapper')
                    : null;

                const swiper = new Swiper(container, {
                    slidesPerView: 1,
                    spaceBetween: 66,
                    autoplay: {
                        delay: 3000, // время между слайдами в мс
                        disableOnInteraction: false, // не останавливать после ручного перелистывания
                    },
                    pagination: {
                        el: container.closest('[data-wrap-slider]')?.querySelector('.swiper-pagination'),
                        clickable: true
                    },
                    on: isSpecial
                        ? {
                            slideChange(swiper) {
                                if (!title) return;
                                if (swiper.activeIndex >= 2) {
                                    title.classList.add('is-hidden');
                                } else {
                                    title.classList.remove('is-hidden');
                                }
                            }
                        }
                        : {} // для остальных — без логики
                });
                mobileSwipers.set(container, swiper);
                container.classList.add('swiper-initialized');
            }
        });
    } else {
        // Дестрой мобильных слайдеров, если ширина > 767
        mobileSwipers.forEach((swiper, container) => {
            swiper.destroy(true, true);
            container.classList.remove('swiper-initialized', 'swiper-mobile', 'swiper-backface-hidden');
        });
        mobileSwipers.clear();
    }
}

function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ───────────────────────────────────────────────────────────────
// Инициализация при загрузке страницы
// ───────────────────────────────────────────────────────────────

window.addEventListener('load', () => {
    initGlobalSwipers();
    initMobileSwipers();

    const callback5 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.matchMedia("(min-width: 768px)").matches) {
                if (document.querySelector('[data-hero]').classList.contains('is-animate')) return;
                document.querySelector('[data-hero]').classList.add('is-animate')
                runSequence(animationSettings)
            }
        });
    };
    const observer5 = new IntersectionObserver(callback5, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    observer5.observe(document.querySelector('[data-hero]'));

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const isDesktopLgUp = window.matchMedia('(min-width: 1250px)').matches;
    if (!isMobile) {
        updateSpeedsOne();
        updateScrollOne();
    }

    if (isDesktopLgUp) {
        updateSpeedsTwo();
        updateScrollTwo();
    }


    const callback1 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelector('[data-animate-1]').classList.add('is-animate');
            }
        });
    };
    const observer1 = new IntersectionObserver(callback1, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    observer1.observe(document.querySelector('[data-animate-1]'));

    const callback2 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelector('[data-animate-2]').classList.add('is-animate');
            }
        });
    };
    const observer2 = new IntersectionObserver(callback2, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    observer2.observe(document.querySelector('[data-animate-2]'));

    const callback3 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelector('[data-animate-3]').classList.add('is-animate');
            }
        });
    };
    const observer3 = new IntersectionObserver(callback3, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    observer3.observe(document.querySelector('[data-animate-3]'));

    const callback4 = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelector('[data-animate-4]').classList.add('is-animate');
            }
        });
    };
    const observer4 = new IntersectionObserver(callback4, {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    observer4.observe(document.querySelector('[data-animate-4]'));

    function handleHeaderOnScroll() {
        const header = document.querySelector('.nav-header'); // Замените на ваш селектор

        if (!header) return;

        function updateHeaderPosition() {
            if (window.scrollY > 300) {
                header.classList.add('fixed');
            } else {
                header.classList.remove('fixed');
            }
        }

        window.addEventListener('scroll', updateHeaderPosition);
        // Вызовем сразу, на случай если уже прокручено
        updateHeaderPosition();
    }

    handleHeaderOnScroll();

    function enableSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');

                // Пропускаем, если href — просто "#"
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // можно поменять на 'center' или 'end'
                    });
                }
            });
        });
    }

    enableSmoothScroll();

    const calculator = document.getElementById('calc');
    const priceBlock = document.querySelector('.sticky-price');
    const OFFSET = 400; // пикселей до нижнего края экрана

    function updatePricePosition() {
        const calcRect = calculator.getBoundingClientRect();

        const calcBottomInViewport = calcRect.bottom <= window.innerHeight;
        const calcTopInViewport = calcRect.top < (window.innerHeight - OFFSET);

        // Когда калькулятор не дошёл до низа — фиксируем
        if (!calcBottomInViewport && calcTopInViewport) {
            priceBlock.classList.add('fixed');
        }
        // Когда калькулятор уже закончился — абсолютно прижимаем к его низу
        else if (calcBottomInViewport) {
            priceBlock.classList.remove('fixed');
        }
        // Когда калькулятор выше экрана (например, скролл вверх) — убираем вообще
        else {
            priceBlock.classList.remove('fixed');
        }
    }

    window.addEventListener('scroll', updatePricePosition);
    window.addEventListener('resize', updatePricePosition);
    updatePricePosition();
});

// ───────────────────────────────────────────────────────────────
// Обработчики событий
// ───────────────────────────────────────────────────────────────

window.addEventListener('resize', debounce(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const isDesktopLg = window.matchMedia('(min-width: 1250px)').matches;
    if (!isMobile) {
        updateSpeedsOne();
    }

    if (isDesktopLg) {
        updateSpeedsTwo();
    }

    initMobileSwipers();
}, 300));

window.addEventListener('scroll', function () {
    updateScrollOne();
    updateScrollTwo();
});

// ───────────────────────────────────────────────────────────────
// SVG-объект с внешней анимацией (неактивный блок)
// ───────────────────────────────────────────────────────────────

/*
const wrapper = document.querySelector('.hero');
const object = document.getElementById('myIcon');

object.addEventListener('load', () => {
    const svgDoc = object.contentDocument;
    const svg = svgDoc.getElementById('svgRoot');

    const observer = new MutationObserver(() => {
        if (wrapper.classList.contains('animation-all')) {
            svg.classList.add('animated');
        } else {
            svg.classList.remove('animated');
        }
    });

    observer.observe(wrapper, { attributes: true, attributeFilter: ['class'] });
});
*/