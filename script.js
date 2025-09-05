// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if(mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(event) {
            event.stopPropagation(); // prevent document click
            const opening = !navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            mobileMenuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
            if (opening) {
                // focus first link for accessibility
                const firstLink = navMenu.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            });
        });
        
        // Close mobile menu when clicking outside (only when active)
        document.addEventListener('click', function(event) {
            if (!navMenu.classList.contains('active')) return;
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(0, 56, 23, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(0, 56, 23, 0.9)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.tipo-card, .projeto-card, .galeria-item, .sobre-text, .sobre-image, .contato-info, .contato-form');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image img');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroImage && scrolled < hero.offsetHeight) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });

    // Image hover effects with tilt
    const cards = document.querySelectorAll('.tipo-card, .projeto-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotateX(5deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0)';
        });
    });

    // Gallery lightbox effect
    const galeriaItems = document.querySelectorAll('.galeria-item');
    galeriaItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const lightbox = createLightbox(img.src, img.alt);
            document.body.appendChild(lightbox);
        });
    });

    function createLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            z-index: 10001;
            transition: transform 0.2s ease;
        `;

        closeBtn.addEventListener('click', closeLightbox);
        closeBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        closeBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        function closeLightbox() {
            lightbox.style.opacity = '0';
            img.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(lightbox);
            }, 300);
        }

        lightbox.appendChild(img);
        lightbox.appendChild(closeBtn);

        // Animate in
        setTimeout(() => {
            lightbox.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 10);

        return lightbox;
    }

    // Form validation and submission
    const form = document.querySelector('.contato-form form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                    input.style.animation = 'shake 0.5s ease-in-out';
                } else {
                    input.style.borderColor = '#003817';
                    input.style.animation = '';
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = form.querySelector('.submit-button');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                submitBtn.style.background = '#4a7c59';
                
                setTimeout(() => {
                    submitBtn.textContent = 'Mensagem Enviada!';
                    submitBtn.style.background = '#27ae60';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '#003817';
                        form.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }

    // Add shake animation to CSS
    const shakeStyle = document.createElement('style');
    shakeStyle.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(shakeStyle);

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-text h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #003817';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #003817, #4a7c59);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Floating action button for scroll to top
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #003817;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 56, 23, 0.3);
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(0) scale(1.1)';
        this.style.background = '#2d5a3d';
    });

    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.background = '#003817';
    });

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'translateY(0)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'translateY(100px)';
        }
    });

    // Add loading animation
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #003817;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        `;

        const loaderText = document.createElement('div');
        loaderText.textContent = 'Jardin Paisagismo';
        loaderText.style.cssText = `
            color: #b08766;
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 700;
            animation: pulse 1.5s ease-in-out infinite;
            margin-bottom: 30px;
        `;

        // Container para a animação das plantas
        const gardenContainer = document.createElement('div');
        gardenContainer.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: flex-end;
            width: 320px;
            height: 150px;
            position: relative;
            overflow: visible;
        `;

        // Criar várias plantas/flores com diferentes animações
        const plantCount = 7; // Aumentado número de plantas
        for (let i = 0; i < plantCount; i++) {
            // Definir que tipo de planta será (flor, folha, árvore pequena, vaso, cogumelo ou bambu)
            const plantType = Math.floor(Math.random() * 6);
            
            const plant = document.createElement('div');
            plant.style.position = 'absolute';
            plant.style.bottom = '0';
            
            // Distribuição de plantas mais natural com diferentes posições
            const positionMultiplier = i === 0 ? 0 : (i === plantCount - 1 ? 1 : Math.random());
            plant.style.left = `${10 + (positionMultiplier * 250)}px`;
            
            // Altura inicial (começará pequeno)
            const initialHeight = 0;
            const maxHeight = 60 + Math.random() * 50; // Entre 60px e 110px
            
            // Atraso para cada planta começar a crescer em momentos diferentes
            const delay = i * 180;
            
            // Diferentes tipos de plantas baseado no plantType
            if (plantType === 0) {
                // Flor sofisticada com múltiplas pétalas
                const stem = document.createElement('div');
                stem.style.cssText = `
                    width: 4px;
                    height: ${initialHeight}px;
                    background: linear-gradient(to top, #006629, #4caf50);
                    margin: 0 auto;
                    transition: height 1.5s ease;
                    transition-delay: ${delay}ms;
                    position: relative;
                    z-index: 1;
                    box-shadow: 2px 2px 3px rgba(0,0,0,0.2);
                `;
                
                // Adicionar algumas folhas no caule
                const leafCount = 2 + Math.floor(Math.random() * 2);
                for (let l = 0; l < leafCount; l++) {
                    const leaf = document.createElement('div');
                    const side = l % 2 === 0 ? -1 : 1;
                    const heightPos = 0.3 + (l * 0.25);
                    
                    leaf.style.cssText = `
                        width: 12px;
                        height: 8px;
                        background: linear-gradient(to bottom, #4caf50, #2e7d32);
                        position: absolute;
                        top: ${maxHeight * heightPos}px;
                        left: ${side * 8}px;
                        border-radius: 50% 50% 50% 10%;
                        transform: rotate(${side * 40}deg) scale(0);
                        transform-origin: ${side === -1 ? 'right' : 'left'} center;
                        transition: transform 0.6s ease;
                        transition-delay: ${delay + 800 + (l * 100)}ms;
                        z-index: 0;
                        box-shadow: 1px 1px 2px rgba(0,0,0,0.15);
                    `;
                    
                    setTimeout(() => {
                        leaf.style.transform = `rotate(${side * 40}deg) scale(1)`;
                    }, delay + 800 + (l * 100));
                    
                    stem.appendChild(leaf);
                }
                
                const flowerCenter = document.createElement('div');
                flowerCenter.style.cssText = `
                    width: 22px;
                    height: 22px;
                    background: radial-gradient(circle, #ffeb3b, #ff9800);
                    border-radius: 50%;
                    position: relative;
                    left: -9px;
                    top: -11px;
                    transform: scale(0);
                    transition: transform 0.8s ease;
                    transition-delay: ${delay + 1000}ms;
                    z-index: 2;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                `;
                
                // Pétalas da flor com cores variadas
                const petalCount = 8 + Math.floor(Math.random() * 5);
                const flowerColors = ['#ff6b6b', '#ffb347', '#ff77a9', '#ffd1dc', '#ff9999', '#e0115f', '#ff6347'];
                const flowerColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
                
                for (let p = 0; p < petalCount; p++) {
                    const petal = document.createElement('div');
                    const angle = (p / petalCount) * Math.PI * 2;
                    const distance = 11;
                    
                    petal.style.cssText = `
                        width: 18px;
                        height: 18px;
                        background: linear-gradient(to bottom, ${flowerColor}, ${flowerColor}ee);
                        border-radius: 50% 50% 50% 50%;
                        position: absolute;
                        top: ${Math.sin(angle) * distance}px;
                        left: ${Math.cos(angle) * distance}px;
                        transform: translate(-50%, -50%) rotate(${angle + Math.PI/2}rad) scale(0);
                        transform-origin: center center;
                        transition: transform 0.5s ease;
                        transition-delay: ${delay + 1100 + (p * 50)}ms;
                        z-index: 1;
                        filter: brightness(${0.85 + Math.random() * 0.3});
                    `;
                    
                    flowerCenter.appendChild(petal);
                }
                
                plant.appendChild(stem);
                plant.appendChild(flowerCenter);
                
                // Iniciar a animação após um breve atraso
                setTimeout(() => {
                    stem.style.height = `${maxHeight}px`;
                    setTimeout(() => {
                        flowerCenter.style.transform = 'scale(1)';
                        Array.from(flowerCenter.children).forEach((petal, idx) => {
                            setTimeout(() => {
                                petal.style.transform = `translate(-50%, -50%) rotate(${petal.style.transform.split('rotate(')[1].split('rad')[0]}rad) scale(1)`;
                            }, idx * 50);
                        });
                    }, 1000);
                }, delay);
                
                // Adicionar animação de balanço suave
                setTimeout(() => {
                    plant.style.animation = `sway ${2 + Math.random()}s ease-in-out infinite`;
                    plant.style.transformOrigin = 'bottom center';
                }, delay + 1500);
                
            } else if (plantType === 1) {
                // Planta com folhas mais elaboradas
                const stem = document.createElement('div');
                stem.style.cssText = `
                    width: 3px;
                    height: ${initialHeight}px;
                    background: linear-gradient(to top, #33691e, #7cb342);
                    margin: 0 auto;
                    transition: height 1.7s ease;
                    transition-delay: ${delay}ms;
                    position: relative;
                    box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                `;
                
                const leafCount = 4 + Math.floor(Math.random() * 3);
                const leaves = [];
                
                for (let l = 0; l < leafCount; l++) {
                    const leaf = document.createElement('div');
                    const side = l % 2 === 0 ? -1 : 1;
                    const leafDelay = delay + 800 + (l * 150);
                    const heightPosition = maxHeight * (0.2 + (l * 0.15));
                    
                    leaf.style.cssText = `
                        width: 18px;
                        height: 10px;
                        background: linear-gradient(to ${side > 0 ? 'right' : 'left'}, #388e3c, #66bb6a);
                        position: absolute;
                        top: ${heightPosition}px;
                        left: ${side * 8}px;
                        border-radius: 50% 50% 50% 10%;
                        transform: rotate(${side * 35}deg) scale(0);
                        transform-origin: ${side === -1 ? 'right' : 'left'} center;
                        transition: transform 0.6s ease;
                        transition-delay: ${leafDelay}ms;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
                    `;
                    
                    // Criar veias nas folhas
                    for (let v = 0; v < 3; v++) {
                        const vein = document.createElement('div');
                        vein.style.cssText = `
                            height: 1px;
                            width: 70%;
                            background: rgba(255, 255, 255, 0.4);
                            position: absolute;
                            top: ${30 + v * 25}%;
                            left: 15%;
                            transform: rotate(${side * 10}deg);
                        `;
                        leaf.appendChild(vein);
                    }
                    
                    leaves.push(leaf);
                    plant.appendChild(leaf);
                }
                
                plant.appendChild(stem);
                
                // Iniciar a animação após um breve atraso
                setTimeout(() => {
                    stem.style.height = `${maxHeight}px`;
                    leaves.forEach((leaf, index) => {
                        setTimeout(() => {
                            leaf.style.transform = `rotate(${leaf.style.transform.split('rotate(')[1].split('deg')[0]}deg) scale(1)`;
                        }, 800 + (index * 150));
                    });
                }, delay);
                
                // Adicionar animação de balanço suave
                setTimeout(() => {
                    plant.style.animation = `sway ${2 + Math.random()}s ease-in-out infinite`;
                    plant.style.transformOrigin = 'bottom center';
                }, delay + 1500);
                
            } else if (plantType === 2) {
                // Árvore pequena mais detalhada
                const stem = document.createElement('div');
                stem.style.cssText = `
                    width: 5px;
                    height: ${initialHeight}px;
                    background: linear-gradient(to top, #5d4037, #795548);
                    margin: 0 auto;
                    transition: height 1.5s ease;
                    transition-delay: ${delay}ms;
                    position: relative;
                    box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
                `;
                
                // Adicionar textura de casca à árvore
                for (let b = 0; b < 4; b++) {
                    const bark = document.createElement('div');
                    bark.style.cssText = `
                        width: 3px;
                        height: 3px;
                        background: #3e2723;
                        position: absolute;
                        top: ${20 + (b * 15)}%;
                        left: ${b % 2 === 0 ? '1px' : '-1px'};
                        border-radius: 50%;
                        opacity: 0;
                        transition: opacity 0.5s ease;
                        transition-delay: ${delay + 1000 + (b * 100)}ms;
                    `;
                    
                    setTimeout(() => {
                        bark.style.opacity = '0.7';
                    }, delay + 1000 + (b * 100));
                    
                    stem.appendChild(bark);
                }
                
                const crown = document.createElement('div');
                crown.style.cssText = `
                    width: 36px;
                    height: 36px;
                    background: radial-gradient(circle, #4caf50, #2e7d32);
                    border-radius: 50%;
                    position: relative;
                    left: -15.5px;
                    top: -18px;
                    transform: scale(0);
                    transition: transform 0.8s ease;
                    transition-delay: ${delay + 1100}ms;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                `;
                
                // Adicionar textura à copa
                for (let t = 0; t < 6; t++) {
                    const texture = document.createElement('div');
                    const angle = (t / 6) * Math.PI * 2;
                    const distance = 12;
                    
                    texture.style.cssText = `
                        width: 16px;
                        height: 16px;
                        background: #388e3c;
                        border-radius: 50%;
                        position: absolute;
                        top: ${8 + Math.sin(angle) * distance}px;
                        left: ${8 + Math.cos(angle) * distance}px;
                        transform: scale(0);
                        transition: transform 0.5s ease;
                        transition-delay: ${delay + 1300 + (t * 80)}ms;
                        opacity: 0.9;
                    `;
                    
                    setTimeout(() => {
                        texture.style.transform = 'scale(1)';
                    }, delay + 1300 + (t * 80));
                    
                    crown.appendChild(texture);
                }
                
                plant.appendChild(stem);
                plant.appendChild(crown);
                
                // Iniciar a animação após um breve atraso
                setTimeout(() => {
                    stem.style.height = `${maxHeight}px`;
                    setTimeout(() => {
                        crown.style.transform = 'scale(1)';
                    }, 1100);
                }, delay);
                
                // Animação suave de balanço
                setTimeout(() => {
                    plant.style.animation = `sway ${2.5 + Math.random()}s ease-in-out infinite`;
                    plant.style.transformOrigin = 'bottom center';
                }, delay + 1500);
                
            } else if (plantType === 3) {
                // Planta em vaso
                const pot = document.createElement('div');
                pot.style.cssText = `
                    width: 28px;
                    height: 24px;
                    background: linear-gradient(to bottom, #e65100, #bf360c);
                    border-radius: 3px 3px 14px 14px;
                    position: relative;
                    z-index: 2;
                    transform: translateY(24px);
                    transition: transform 0.5s ease;
                    transition-delay: ${delay}ms;
                    box-shadow: 2px 4px 6px rgba(0,0,0,0.2);
                `;
                
                // Detalhes decorativos no vaso
                const potDecor = document.createElement('div');
                potDecor.style.cssText = `
                    width: 100%;
                    height: 5px;
                    background: #ffc107;
                    position: absolute;
                    top: 4px;
                    left: 0;
                    border-radius: 2px;
                `;
                pot.appendChild(potDecor);
                
                // Terra no vaso
                const soil = document.createElement('div');
                soil.style.cssText = `
                    width: 22px;
                    height: 6px;
                    background: #3e2723;
                    border-radius: 50%;
                    position: absolute;
                    bottom: 18px;
                    left: 3px;
                    z-index: 3;
                `;
                
                // Planta que crescerá do vaso
                const plantSprouts = Math.floor(Math.random() * 3) + 2;
                for (let s = 0; s < plantSprouts; s++) {
                    const sprout = document.createElement('div');
                    const sproutHeight = 30 + Math.random() * 30;
                    const horizontalPos = 5 + (s * 5);
                    
                    sprout.style.cssText = `
                        width: 3px;
                        height: 0px;
                        background: linear-gradient(to top, #2e7d32, #66bb6a);
                        position: absolute;
                        bottom: 23px;
                        left: ${horizontalPos}px;
                        z-index: 4;
                        transition: height 1.2s ease, transform 0.5s ease;
                        transition-delay: ${delay + 400 + (s * 200)}ms;
                        transform-origin: bottom center;
                        border-radius: 2px;
                    `;
                    
                    // Folhas ou flores no topo
                    const topElement = document.createElement('div');
                    const isFlower = Math.random() > 0.5;
                    
                    if (isFlower) {
                        // Flor no topo
                        const flowerColors = ['#e91e63', '#f06292', '#9c27b0', '#ba68c8', '#f44336'];
                        const flowerColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
                        
                        topElement.style.cssText = `
                            width: 12px;
                            height: 12px;
                            background: ${flowerColor};
                            border-radius: 50%;
                            position: absolute;
                            top: -6px;
                            left: -4.5px;
                            transform: scale(0);
                            transition: transform 0.5s ease;
                            transition-delay: ${delay + 1000 + (s * 200)}ms;
                            z-index: 5;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        `;
                        
                        // Pétalas da flor
                        for (let p = 0; p < 5; p++) {
                            const petal = document.createElement('div');
                            petal.style.cssText = `
                                width: 6px;
                                height: 6px;
                                background: ${flowerColor};
                                position: absolute;
                                top: ${Math.sin((p / 5) * Math.PI * 2) * 5}px;
                                left: ${Math.cos((p / 5) * Math.PI * 2) * 5}px;
                                border-radius: 50%;
                                transform: scale(0);
                                transition: transform 0.4s ease;
                                transition-delay: ${delay + 1100 + (s * 200) + (p * 50)}ms;
                            `;
                            
                            setTimeout(() => {
                                petal.style.transform = 'scale(1)';
                            }, delay + 1100 + (s * 200) + (p * 50));
                            
                            topElement.appendChild(petal);
                        }
                    } else {
                        // Folha no topo
                        topElement.style.cssText = `
                            width: 14px;
                            height: 8px;
                            background: linear-gradient(to bottom, #4caf50, #2e7d32);
                            border-radius: 50%;
                            position: absolute;
                            top: -4px;
                            left: -5.5px;
                            transform: scale(0);
                            transition: transform 0.5s ease;
                            transition-delay: ${delay + 1000 + (s * 200)}ms;
                            z-index: 5;
                            box-shadow: 0 2px 3px rgba(0,0,0,0.1);
                        `;
                    }
                    
                    // Aplicar curva aleatória ao broto
                    setTimeout(() => {
                        sprout.style.height = `${sproutHeight}px`;
                        sprout.style.transform = `rotate(${-10 + Math.random() * 20}deg)`;
                        
                        setTimeout(() => {
                            topElement.style.transform = 'scale(1)';
                        }, 600);
                    }, delay + 400 + (s * 200));
                    
                    sprout.appendChild(topElement);
                    plant.appendChild(sprout);
                }
                
                plant.appendChild(pot);
                plant.appendChild(soil);
                
                // Animar o vaso aparecendo
                setTimeout(() => {
                    pot.style.transform = 'translateY(0)';
                }, delay);
                
            } else if (plantType === 4) {
                // Cogumelo fofo
                const stem = document.createElement('div');
                stem.style.cssText = `
                    width: 8px;
                    height: ${initialHeight}px;
                    background: linear-gradient(to top, #eceff1, #b0bec5);
                    margin: 0 auto;
                    border-radius: 2px;
                    transition: height 1.2s ease;
                    transition-delay: ${delay}ms;
                    position: relative;
                    box-shadow: 1px 1px 3px rgba(0,0,0,0.1);
                `;
                
                const cap = document.createElement('div');
                
                // Cores variadas para cogumelos
                const mushroomColors = [
                    ['#e53935', '#ffebee'], // vermelho
                    ['#5e35b1', '#ede7f6'], // roxo
                    ['#039be5', '#e1f5fe'], // azul
                    ['#43a047', '#e8f5e9']  // verde
                ];
                const colorSet = mushroomColors[Math.floor(Math.random() * mushroomColors.length)];
                
                cap.style.cssText = `
                    width: 30px;
                    height: 18px;
                    background: linear-gradient(to bottom, ${colorSet[0]}, ${colorSet[0]}dd);
                    border-radius: 50% 50% 10% 10%;
                    position: relative;
                    left: -11px;
                    top: -10px;
                    transform: scale(0);
                    transition: transform 0.7s ease;
                    transition-delay: ${delay + 800}ms;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.2);
                    z-index: 2;
                `;
                
                // Adicionar bolinhas ao cap do cogumelo
                for (let d = 0; d < 6; d++) {
                    const dot = document.createElement('div');
                    
                    // Posicionar de forma aleatória no cap
                    const topPos = 2 + Math.random() * 10;
                    const leftPos = 2 + Math.random() * 25;
                    
                    dot.style.cssText = `
                        width: 4px;
                        height: 4px;
                        background: ${colorSet[1]};
                        border-radius: 50%;
                        position: absolute;
                        top: ${topPos}px;
                        left: ${leftPos}px;
                        opacity: 0;
                        transition: opacity 0.4s ease;
                        transition-delay: ${delay + 1200 + (d * 100)}ms;
                    `;
                    
                    setTimeout(() => {
                        dot.style.opacity = '0.9';
                    }, delay + 1200 + (d * 100));
                    
                    cap.appendChild(dot);
                }
                
                plant.appendChild(stem);
                plant.appendChild(cap);
                
                // Iniciar a animação
                setTimeout(() => {
                    stem.style.height = `${maxHeight * 0.7}px`; // Cogumelos um pouco menores
                    setTimeout(() => {
                        cap.style.transform = 'scale(1)';
                    }, 800);
                }, delay);
                
                // Balanço suave
                setTimeout(() => {
                    plant.style.animation = `mushroom-wiggle 3s ease-in-out infinite`;
                    plant.style.transformOrigin = 'bottom center';
                }, delay + 1500);
                
            } else {
                // Bambu elegante
                const segments = 3 + Math.floor(Math.random() * 3);
                const segmentHeight = maxHeight / segments;
                const bambooWidth = 7;
                
                for (let s = 0; s < segments; s++) {
                    const segment = document.createElement('div');
                    segment.style.cssText = `
                        width: ${bambooWidth}px;
                        height: 0px;
                        background: linear-gradient(to right, #cddc39, #afb42b, #cddc39);
                        margin: 0 auto;
                        position: absolute;
                        bottom: ${s * segmentHeight}px;
                        left: 0;
                        transition: height 0.7s ease;
                        transition-delay: ${delay + (s * 300)}ms;
                        z-index: ${segments - s};
                        box-shadow: 1px 1px 3px rgba(0,0,0,0.15);
                    `;
                    
                    // Adicionar nó entre segmentos de bambu
                    if (s > 0) {
                        const node = document.createElement('div');
                        node.style.cssText = `
                            width: ${bambooWidth + 2}px;
                            height: 3px;
                            background: #827717;
                            border-radius: 2px;
                            position: absolute;
                            bottom: -1.5px;
                            left: -1px;
                            z-index: ${segments - s + 1};
                            transform: scale(0);
                            transition: transform 0.3s ease;
                            transition-delay: ${delay + (s * 300) + 400}ms;
                        `;
                        
                        setTimeout(() => {
                            node.style.transform = 'scale(1)';
                        }, delay + (s * 300) + 400);
                        
                        segment.appendChild(node);
                    }
                    
                    // Adicionar folhas no topo
                    if (s === segments - 1) {
                        const leavesCount = 3 + Math.floor(Math.random() * 3);
                        
                        for (let l = 0; l < leavesCount; l++) {
                            const leaf = document.createElement('div');
                            const side = l % 2 === 0 ? -1 : 1;
                            const leafAngle = (10 + Math.random() * 20) * side;
                            
                            leaf.style.cssText = `
                                width: 25px;
                                height: 6px;
                                background: linear-gradient(to ${side > 0 ? 'right' : 'left'}, #7cb342, #9ccc65);
                                position: absolute;
                                top: ${5 + (l * 7)}px;
                                left: ${side > 0 ? bambooWidth : -25 + bambooWidth}px;
                                border-radius: 3px 40% 40% 3px;
                                transform-origin: ${side > 0 ? 'left' : 'right'} center;
                                transform: rotate(${leafAngle}deg) scaleX(${side > 0 ? 1 : -1}) scale(0);
                                transition: transform 0.6s ease;
                                transition-delay: ${delay + (segments * 300) + 200 + (l * 100)}ms;
                                z-index: 0;
                                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                            `;
                            
                            setTimeout(() => {
                                leaf.style.transform = `rotate(${leafAngle}deg) scaleX(${side > 0 ? 1 : -1}) scale(1)`;
                            }, delay + (segments * 300) + 200 + (l * 100));
                            
                            segment.appendChild(leaf);
                        }
                    }
                    
                    // Animar o segmento crescendo
                    setTimeout(() => {
                        segment.style.height = `${segmentHeight}px`;
                    }, delay + (s * 300));
                    
                    plant.appendChild(segment);
                }
                
                // Balanço suave
                setTimeout(() => {
                    plant.style.animation = `bamboo-sway ${2.5 + Math.random()}s ease-in-out infinite`;
                    plant.style.transformOrigin = 'bottom center';
                }, delay + (segments * 300) + 500);
            }
            
            gardenContainer.appendChild(plant);
        }
        
        const pulseStyle = document.createElement('style');
        pulseStyle.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.05); }
            }
            @keyframes sway {
                0%, 100% { transform: rotate(-2deg); }
                50% { transform: rotate(2deg); }
            }
            @keyframes mushroom-wiggle {
                0%, 100% { transform: rotate(-1deg); }
                50% { transform: rotate(1deg); }
            }
            @keyframes bamboo-sway {
                0%, 100% { transform: rotate(-1deg); }
                50% { transform: rotate(1.5deg); }
            }
        `;
        document.head.appendChild(pulseStyle);

        loader.appendChild(loaderText);
        loader.appendChild(gardenContainer);
        document.body.appendChild(loader);

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 500);
        }, 5500); // Aumentado para dar mais tempo para visualizar as animações de plantas
    });

    // Mouse cursor trail effect
    const trail = [];
    const trailLength = 10;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: #003817;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transition: all 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }

    document.addEventListener('mousemove', function(e) {
        trail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
            }, index * 20);
        });
    });

    console.log('🌿 Jardim Paisagismo - Landing page carregada com sucesso!');
});

// Performance optimization
window.addEventListener('load', function() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

