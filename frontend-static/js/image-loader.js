// Sistema de carga elegante de imágenes
class ImageLoader {
    constructor() {
        this.images = document.querySelectorAll('.image-container img');
        this.init();
    }

    init() {
        // Configurar Intersection Observer para lazy loading
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback para navegadores que no soportan Intersection Observer
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const container = img.closest('.image-container');
                    
                    if (container && !container.classList.contains('loaded')) {
                        this.loadImage(img, container);
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        this.images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadImage(img, container) {
        // Crear una nueva imagen para precargar
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Imagen cargada exitosamente
            setTimeout(() => {
                container.classList.add('loaded');
                this.addShimmerEffect(container);
            }, 100);
        };

        tempImg.onerror = () => {
            // Error al cargar la imagen
            container.classList.add('loaded');
            img.style.opacity = '0.5';
            img.style.filter = 'grayscale(100%)';
        };

        // Iniciar la carga
        tempImg.src = img.src;
    }

    addShimmerEffect(container) {
        // Agregar efecto shimmer después de la carga
        const shimmer = document.createElement('div');
        shimmer.className = 'shimmer-effect';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
            z-index: 3;
            animation: shimmer 0.8s ease-out;
        `;

        container.appendChild(shimmer);

        // Remover el efecto shimmer después de la animación
        setTimeout(() => {
            if (shimmer.parentNode) {
                shimmer.parentNode.removeChild(shimmer);
            }
        }, 800);
    }

    loadAllImages() {
        // Fallback: cargar todas las imágenes inmediatamente
        this.images.forEach(img => {
            const container = img.closest('.image-container');
            if (container) {
                this.loadImage(img, container);
            }
        });
    }
}

// Animación CSS para el efecto shimmer
const shimmerStyle = document.createElement('style');
shimmerStyle.textContent = `
    @keyframes shimmer {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
`;
document.head.appendChild(shimmerStyle);

// Animación de entrada para imágenes de galería
function animateGalleryImages() {
    const galleryImages = document.querySelectorAll('.image-container.project-image');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        galleryImages.forEach(img => observer.observe(img));
    } else {
        galleryImages.forEach(img => img.classList.add('visible'));
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ImageLoader();
    animateGalleryImages();
});

// Inicializar también cuando se cargue la ventana (para casos de carga rápida)
window.addEventListener('load', () => {
    if (!document.querySelector('.image-container.loaded')) {
        new ImageLoader();
    }
    animateGalleryImages();
}); 