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
            width: 240px;
            height: 120px;
            position: relative;
        `;

        // Criar várias plantas/flores com diferentes animações
        const plantCount = 5;
        for (let i = 0; i < plantCount; i++) {
            // Definir que tipo de planta será (flor, folha, árvore pequena)
            const plantType = Math.floor(Math.random() * 3);
            
            const plant = document.createElement('div');
            plant.style.position = 'absolute';
            plant.style.bottom = '0';
            plant.style.left = `${20 + (i * 50)}px`;
            
            // Altura inicial (começará pequeno)
            const initialHeight = 0;
            const maxHeight = 60 + Math.random() * 40; // Entre 60px e 100px
            
            // Atraso para cada planta começar a crescer em momentos diferentes
            const delay = i * 200;
            
            // Diferentes tipos de plantas baseado no plantType
            if (plantType === 0) {
                // Flor
                const stem = document.createElement('div');
                stem.style.cssText = `
                    width: 3px;
                    height: ${initialHeight}px;
                    background: #006629;
                    margin: 0 auto;
                    transition: height 1.5s ease;
                    transition-delay: ${delay}ms;
                `;
                
                const flower = document.createElement('div');
                flower.style.cssText = `
                    width: 20px;
                    height: 20px;
                    background: #e8917c;
                    border-radius: 50%;
                    position: relative;
                    left: -8.5px;
                    top: -10px;
                    transform: scale(0);
                    transition: transform 0.8s ease;
                    transition-delay: ${delay + 1000}ms;
                `;
                
                // Pétalas da flor
                for (let p = 0; p < 5; p++) {
                    const petal = document.createElement('div');
                    petal.style.cssText = `
                        width: 15px;
                        height: 15px;
                        background: #ff6b6b;
                        border-radius: 50%;
                        position: absolute;
                        top: ${Math.sin((p / 5) * Math.PI * 2) * 10}px;
                        left: ${Math.cos((p / 5) * Math.PI * 2) * 10}px;
                        transform: scale(0);
                        transition: transform 0.5s ease;
                        transition-delay: ${delay + 1200 + (p * 100)}ms;
                    `;
                    flower.appendChild(petal);
                }
                
                plant.appendChild(stem);
                plant.appendChild(flower);
                
                // Iniciar a animação após um breve atraso
                setTimeout(() => {
                    stem.style.height = `${maxHeight}px`;
                    setTimeout(() => {
                        flower.style.transform = 'scale(1)';
                        Array.from(flower.children).forEach(petal => {
                            petal.style.transform = 'scale(1)';
                        });
                    }, 1000);
                }, delay);
                
            } else if (plantType === 1) {
                // Folha/planta
                const stem = document.createElement('div');
                stem.style.cssText = `
                    width: 3px;
                    height: ${initialHeight}px;
                    background: #006629;
                    margin: 0 auto;
                    transition: height 1.5s ease;
                    transition-delay: ${delay}ms;
                `;
                
                const leafCount = 3 + Math.floor(Math.random() * 3);
                const leaves = [];
                
                for (let l = 0; l < leafCount; l++) {
                    const leaf = document.createElement('div');
                    const side = l % 2 === 0 ? -1 : 1;
                    const leafDelay = delay + 800 + (l * 200);
                    
                    leaf.style.cssText = `
                        width: 15px;
                        height: 8px;
                        background: #4caf50;
                        position: absolute;
                        top: ${maxHeight - 10 - (l * (maxHeight / (leafCount + 1)))}px;
                        left: ${side * 7}px;
                        border-radius: 50%;
                        transform: rotate(${side * 30}deg) scale(0);
                        transform-origin: ${side === -1 ? 'right' : 'left'} center;
                        transition: transform 0.6s ease;
                        transition-delay: ${leafDelay}ms;
                    `;
                    
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
                        }, 800 + (index * 200));
                    });
                }, delay);
                
            } else {
                // Árvore pequena
                const stem = document.createElement('div');
                stem.style.cssText = `
                    width: 5px;
                    height: ${initialHeight}px;
                    background: #795548;
                    margin: 0 auto;
                    transition: height 1.5s ease;
                    transition-delay: ${delay}ms;
                `;
                
                const crown = document.createElement('div');
                crown.style.cssText = `
                    width: 30px;
                    height: 30px;
                    background: #33691e;
                    border-radius: 50%;
                    position: relative;
                    left: -12.5px;
                    top: -15px;
                    transform: scale(0);
                    transition: transform 0.8s ease;
                    transition-delay: ${delay + 1000}ms;
                `;
                
                plant.appendChild(stem);
                plant.appendChild(crown);
                
                // Iniciar a animação após um breve atraso
                setTimeout(() => {
                    stem.style.height = `${maxHeight}px`;
                    setTimeout(() => {
                        crown.style.transform = 'scale(1)';
                    }, 1000);
                }, delay);
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
                0%, 100% { transform: rotate(-3deg); }
                50% { transform: rotate(3deg); }
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

