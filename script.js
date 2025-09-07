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

    // Ensure hero title stays static (typing removed)
    const heroTitle = document.querySelector('.hero-text h2');
    if (heroTitle) heroTitle.style.borderRight = 'none';

    // Loader, flower animations and cursor trail intentionally removed.
    // This keeps the page static on load and avoids visual distractions.
    // --- I18n: language selector ---
    const translations = {
        'pt-BR': {
            'nav.home': 'Home',
            'nav.types': 'Tipos',
            'nav.projects': 'Projetos',
            'nav.clients': 'Clientes',
            'nav.contact': 'Contato',
            'hero.line1': 'Paisagismo moderno,',
            'hero.line2': 'do seu jeito.',
            'hero.lead': 'Especializados em paisagismo (natural, permanente e preservado), garantimos ambientes verdes e elegantes o ano todo, sem a necessidade de manutenções constantes. Nosso compromisso é proporcionar uma experiência de bem-estar, que se mantém impecável em todas as estações.',
            'cta.quote': 'FAÇA UM ORÇAMENTO',
            'contact.title': 'Entre em contato',
            'contact.subtitle': 'Crie conosco a sua mudança!',
            'footer.copyright': '© 2025 Jardin Paisagismo. Todos os direitos reservados.'
            ,
            /* types */
            'types.title': 'TIPOS DE PAISAGISMO',
            'types.card1.title': 'NATURAL',
            'types.card1.desc': 'Em vasos, jardineiras, plantados direto em solo ou painéis verticais. O que for melhor para o seu ambiente e de acordo com a entrada de luz natural. Com irrigação automática.',
            'types.card2.title': 'PERMANENTE',
            'types.card2.desc': 'Perfeito para ambientes que não recebem luz natural. Nesses casos são plantas artificiais idênticas às reais, gerando dúvida em muitas das vezes. Confundindo o olhar de quem admira e se beneficia com o bem-estar. Não precisam de manutenção.',
            'types.card3.title': 'PRESERVADO',
            'types.card3.desc': 'São plantas naturais, porém secas. Passam por um minucioso processo. Muito utilizado para quem não quer manutenção mas também não quer utilizar plástico em seu projeto. Seguindo assim uma pegada ecológica.',
            /* projects */
            'projects.title': 'NOSSOS PROJETOS',
            'projects.card1.title': 'PRIO',
            'projects.card1.tag': '(Paisagismo permanente)',
            'projects.card1.desc': 'Desenvolvemos para a PRIO um paisagismo permanente que integra natureza do fundo do mar e arquitetura de forma harmoniosa, criando ambientes acolhedores, inspiradores e inusitados. O novo paisagismo valoriza áreas comuns e espaços de convivência, promovendo bem-estar, conforto e uma experiência sensorial única para os colaboradores. Devido ao sucesso, já passamos de 10 projetos com o mesmo cliente, que replica a identidade criada em todos os seus escritórios e feiras.',
            'projects.card2.title': 'CRISTO REDENTOR',
            'projects.card2.tag': '(Paisagismo permanente)',
            'projects.card2.desc': 'Em parceria com o Grupo Coca-Cola, desenvolvemos o projeto de paisagismo para o Cristo Redentor, um dos principais cartões-postais do mundo e símbolo do Rio de Janeiro. O trabalho foi pensado para replicar a vegetação local, onde recebemos uma lista com todas as espécies nativas. A presença do paisagismo contribui para um ambiente mais harmonioso e convidativo, gerando muitas mídias para os turistas.',
            'projects.card3.title': 'BAT',
            'projects.card3.tag': '(Paisagismo natural e preservado)',
            'projects.card3.desc': 'Este projeto corporativo combina minimalismo e aconchego. São 5 andares para a mesma empresa, onde temos jardim vertical natural com irrigação automática na área externa, muitas plantas naturais em vaso, árvores e aéreos preservados para compor todos os andares. O bem-estar é prioridade ali.',
            'projects.card4.title': 'MDS',
            'projects.card4.tag': '(Paisagismo natural, permanente e preservado)',
            'projects.card4.desc': 'Foram 2 andares para a sede no Rio. Com as malas prontas para as suas filiais em São Paulo e Salvador. Vamos seguir com a mesma identidade onde intercalamos as plantas naturais em vaso, preservados em árvores e jardineiras e aéreos com as plantas permanentes. Esse foi o mix escolhido pelas arquitetas que assinaram esse projeto.',
            /* clients */
            'clients.title': 'NOSSOS CLIENTES'
        },
        'en': {
            'nav.home': 'Home',
            'nav.types': 'Types',
            'nav.projects': 'Projects',
            'nav.clients': 'Clients',
            'nav.contact': 'Contact',
            'hero.line1': 'Modern landscaping,',
            'hero.line2': 'your way.',
            'hero.lead': 'Specialized in landscaping (natural, permanent and preserved), we ensure green and elegant environments all year round, without the need for constant maintenance. Our commitment is to provide a wellness experience that remains impeccable in every season.',
            'cta.quote': 'GET A QUOTE',
            'contact.title': 'Get in touch',
            'contact.subtitle': 'Create your change with us!',
            'footer.copyright': '© 2025 Jardin Paisagismo. All rights reserved.'
            ,
            /* types */
            'types.title': 'TYPES OF LANDSCAPING',
            'types.card1.title': 'NATURAL',
            'types.card1.desc': 'In pots, planters, planted directly in the ground or vertical panels. Whatever works best for your environment and natural light entry. With automatic irrigation.',
            'types.card2.title': 'PERMANENT',
            'types.card2.desc': 'Perfect for spaces that do not receive natural light. In those cases artificial plants identical to real ones are used, often confusing the viewer. They require no maintenance.',
            'types.card3.title': 'PRESERVED',
            'types.card3.desc': 'Natural plants that are preserved and dried. They undergo a meticulous process. Often chosen by those who want minimal maintenance but avoid plastic alternatives.',
            /* projects */
            'projects.title': 'OUR PROJECTS',
            'projects.card1.title': 'PRIO',
            'projects.card1.tag': '(Permanent landscaping)',
            'projects.card1.desc': 'We developed for PRIO a permanent landscaping that integrates marine nature and architecture harmoniously, creating welcoming, inspiring and unexpected environments. The new landscaping values common areas and social spaces, promoting well-being, comfort and a unique sensory experience for employees. Due to its success, we have already completed more than 10 projects with the same client, who replicates the created identity in all its offices and fairs.',
            'projects.card2.title': 'CRISTO REDENTOR',
            'projects.card2.tag': '(Permanent landscaping)',
            'projects.card2.desc': 'In partnership with the Coca-Cola Group, we developed the landscaping project for Christ the Redeemer, one of the main landmarks of the world and a symbol of Rio de Janeiro. The work was designed to replicate the local vegetation, for which we received a list of all native species. The presence of landscaping helps create a more harmonious and welcoming environment, generating lots of media for tourists.',
            'projects.card3.title': 'BAT',
            'projects.card3.tag': '(Natural and preserved landscaping)',
            'projects.card3.desc': 'This corporate project combines minimalism and coziness. There are 5 floors for the same company, where we have a natural vertical garden with automatic irrigation in the outdoor area, many natural potted plants, trees and preserved aerial elements to compose all floors. Well-being is a priority there.',
            'projects.card4.title': 'MDS',
            'projects.card4.tag': '(Natural, permanent and preserved landscaping)',
            'projects.card4.desc': 'There were 2 floors for the headquarters in Rio. With suitcases ready for its branches in São Paulo and Salvador. We will continue with the same identity where we alternate natural plants in pots, preserved in trees and planters and aerials with permanent plants. This was the mix chosen by the architects who signed this project.',
            /* clients */
            'clients.title': 'OUR CLIENTS'
        },
        'es': {
            'nav.home': 'Inicio',
            'nav.types': 'Tipos',
            'nav.projects': 'Proyectos',
            'nav.clients': 'Clientes',
            'nav.contact': 'Contacto',
            'hero.line1': 'Paisajismo moderno,',
            'hero.line2': 'a tu manera.',
            'hero.lead': 'Especializados en paisajismo (natural, permanente y preservado), garantizamos ambientes verdes y elegantes todo el año, sin necesidad de mantenimiento constante. Nuestro compromiso es proporcionar una experiencia de bienestar que se mantiene impecable en todas las estaciones.',
            'cta.quote': 'SOLICITAR PRESUPUESTO',
            'contact.title': 'Ponte en contacto',
            'contact.subtitle': '¡Crea tu cambio con nosotros!',
            'footer.copyright': '© 2025 Jardin Paisagismo. Todos los derechos reservados.'
            ,
            /* types */
            'types.title': 'TIPOS DE PAISAJISMO',
            'types.card1.title': 'NATURAL',
            'types.card1.desc': 'En macetas, jardineras, plantado directamente en el suelo o paneles verticales. Lo que sea mejor para su entorno y la entrada de luz natural. Con riego automático.',
            'types.card2.title': 'PERMANENTE',
            'types.card2.desc': 'Perfecto para espacios que no reciben luz natural. En esos casos se utilizan plantas artificiales idénticas a las reales, lo que a menudo confunde al espectador. No requieren mantenimiento.',
            'types.card3.title': 'PRESERVADO',
            'types.card3.desc': 'Plantas naturales que se conservan y secan. Pasan por un proceso meticuloso. A menudo elegidas por quienes quieren un mantenimiento mínimo pero evitan alternativas plásticas.',
            /* projects */
            'projects.title': 'NUESTROS PROYECTOS',
            'projects.card1.title': 'PRIO',
            'projects.card1.tag': '(Paisajismo permanente)',
            'projects.card1.desc': 'Desarrollamos para PRIO un paisajismo permanente que integra la naturaleza marina y la arquitectura de forma armoniosa, creando entornos acogedores, inspiradores e inesperados. El nuevo paisajismo valora las áreas comunes y los espacios sociales, promoviendo el bienestar, la comodidad y una experiencia sensorial única para los empleados. Debido a su éxito, ya hemos realizado más de 10 proyectos con el mismo cliente, que replica la identidad creada en todas sus oficinas y ferias.',
            'projects.card2.title': 'CRISTO REDENTOR',
            'projects.card2.tag': '(Paisajismo permanente)',
            'projects.card2.desc': 'En asociación con el Grupo Coca-Cola, desarrollamos el proyecto de paisajismo para el Cristo Redentor, uno de los principales hitos del mundo y símbolo de Río de Janeiro. El trabajo fue diseñado para replicar la vegetación local, para lo cual recibimos una lista de todas las especies nativas. La presencia del paisajismo ayuda a crear un entorno más armonioso y acogedor, generando mucha repercusión mediática para los turistas.',
            'projects.card3.title': 'BAT',
            'projects.card3.tag': '(Paisajismo natural y preservado)',
            'projects.card3.desc': 'Este proyecto corporativo combina minimalismo y confort. Hay 5 pisos para la misma empresa, donde tenemos un jardín vertical natural con riego automático en el área exterior, muchas plantas naturales en macetas, árboles y elementos aéreos preservados para componer todos los pisos. El bienestar es una prioridad allí.',
            'projects.card4.title': 'MDS',
            'projects.card4.tag': '(Paisajismo natural, permanente y preservado)',
            'projects.card4.desc': 'Fueron 2 pisos para la sede en Río. Con las maletas listas para sus sucursales en São Paulo y Salvador. Continuaremos con la misma identidad donde alternamos plantas naturales en macetas, preservadas en árboles y jardineras y aéreos con plantas permanentes. Esta fue la combinación elegida por las arquitectas que firmaron este proyecto.',
            /* clients */
            'clients.title': 'NUESTROS CLIENTES'
        }
    };

    function applyTranslations(lang) {
        const els = document.querySelectorAll('[data-i18n]');
        els.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Preserve inner HTML tags for long paragraphs if needed
                if (el.tagName.toLowerCase() === 'p' || el.tagName.toLowerCase() === 'h2' || el.tagName.toLowerCase() === 'h3' || el.tagName.toLowerCase() === 'a' || el.tagName.toLowerCase() === 'h4') {
                    el.innerText = translations[lang][key];
                } else {
                    el.textContent = translations[lang][key];
                }
            }
        });

        // Update active state on buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        localStorage.setItem('siteLang', lang);
    }

    // Wire up language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            applyTranslations(lang);
        });
    });

    // Initialize language from localStorage or fallback to pt-BR
    const initialLang = localStorage.getItem('siteLang') || 'pt-BR';
    applyTranslations(initialLang);

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

