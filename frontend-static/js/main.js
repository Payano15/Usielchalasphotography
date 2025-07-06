// Variables globales
let allPhotos = [];
let currentFilter = 'todos';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    loadPhotos();
    setupEventListeners();
    setupScrollToTop();
});

// Cargar fotos desde la API
async function loadPhotos() {
    const galleryGrid = document.getElementById('galeria-grid');
    
    // Mostrar loading
    galleryGrid.innerHTML = `
        <div class="col-12 loading">
            <div class="spinner"></div>
        </div>
    `;
    
    try {
        const response = await fetch('/api/photos');
        const photos = await response.json();
        
        allPhotos = photos;
        displayPhotos(photos);
    } catch (error) {
        console.error('Error cargando fotos:', error);
        galleryGrid.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Error cargando las fotos. Intenta de nuevo más tarde.</p>
            </div>
        `;
    }
}

// Mostrar fotos en la galería
function displayPhotos(photos) {
    const galleryGrid = document.getElementById('galeria-grid');
    
    if (photos.length === 0) {
        galleryGrid.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No hay fotos disponibles.</p>
            </div>
        `;
        return;
    }
    
    const photosHTML = photos.map(photo => `
        <div class="gallery-item fade-in" data-category="${photo.category || 'otros'}">
            <div class="position-relative">
                <img src="${photo.image_path}" alt="${photo.title}" class="img-fluid">
                <div class="gallery-overlay">
                    <div class="w-100">
                        <h5>${photo.title}</h5>
                        ${photo.description ? `<small>${photo.description}</small>` : ''}
                    </div>
                </div>
                <div class="position-absolute top-0 end-0 m-3">
                    <button class="btn btn-sm btn-light rounded-circle" onclick="viewPhoto(${photo.id})" style="width: 40px; height: 40px; padding: 0;">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    galleryGrid.innerHTML = photosHTML;
}

// Ver foto en modal
async function viewPhoto(photoId) {
    try {
        const response = await fetch(`/api/photos/${photoId}`);
        const photo = await response.json();
        
        document.getElementById('photoModalTitle').textContent = photo.title;
        document.getElementById('photoModalImage').src = photo.image_path;
        document.getElementById('photoModalImage').alt = photo.title;
        document.getElementById('photoModalDescription').textContent = photo.description || '';
        
        const modal = new bootstrap.Modal(document.getElementById('photoModal'));
        modal.show();
    } catch (error) {
        console.error('Error cargando foto:', error);
        alert('Error cargando la foto');
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros de galería
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterPhotos(filter);
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Navegación suave
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar activo en scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Filtrar fotos
function filterPhotos(filter) {
    currentFilter = filter;
    
    if (filter === 'todos') {
        displayPhotos(allPhotos);
    } else {
        const filteredPhotos = allPhotos.filter(photo => 
            photo.category && photo.category.toLowerCase() === filter.toLowerCase()
        );
        displayPhotos(filteredPhotos);
    }
}

// Configurar botón de scroll to top
function setupScrollToTop() {
    // Crear botón
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollButton.onclick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    document.body.appendChild(scrollButton);
    
    // Mostrar/ocultar botón
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    });
}

// Función para subir nueva foto (para uso futuro)
async function uploadPhoto(formData) {
    try {
        const response = await fetch('/api/photos', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Foto subida:', result);
            loadPhotos(); // Recargar galería
            return result;
        } else {
            throw new Error('Error subiendo foto');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Función para eliminar foto (para uso futuro)
async function deletePhoto(photoId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/photos/${photoId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('Foto eliminada');
            loadPhotos(); // Recargar galería
        } else {
            throw new Error('Error eliminando foto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error eliminando la foto');
    }
}

// Animación de entrada para elementos
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Event listener para animaciones en scroll
window.addEventListener('scroll', animateOnScroll);

// Lazy loading para imágenes
function setupLazyLoading() {
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
}

// Inicializar lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading); 

// Script para scroll y resaltar tarjeta con dropdown
const items = document.querySelectorAll('.proyecto-item');
items.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const value = this.getAttribute('data-proyecto');
        // Hacer scroll a la sección de proyectos
        const section = document.getElementById('proyectos');
        if(section) section.scrollIntoView({ behavior: 'smooth' });
        // Resaltar la tarjeta correspondiente
        setTimeout(() => {
            document.querySelectorAll('#proyectos .card').forEach(card => {
                card.classList.remove('border-primary');
            });
            let cardTitle = Array.from(document.querySelectorAll('#proyectos .card-title'));
            let card = cardTitle.find(el => el.textContent.trim().toLowerCase() === value.toLowerCase());
            if(card) {
                card.closest('.card').classList.add('border-primary');
            }
        }, 500);
    });
});
// Forzar despliegue del dropdown por hover con JS
const proyectosDropdown = document.querySelectorAll('.proyectos-hover');
proyectosDropdown.forEach(function(item) {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.dropdown-menu').classList.add('show');
    });
    item.addEventListener('mouseleave', function() {
        this.querySelector('.dropdown-menu').classList.remove('show');
    });
});
// Scroll suave para enlaces internos
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
// Resaltar sección activa en el navbar
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}); 