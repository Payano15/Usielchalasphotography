// Lightbox para galería de proyectos
(function() {
    const images = Array.from(document.querySelectorAll('.image-container.project-image img'));
    let current = 0;
    let overlay, imgEl, closeBtn, prevBtn, nextBtn, caption;

    function createLightbox() {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close" title="Cerrar">&times;</button>
                <button class="lightbox-prev" title="Anterior" style="left:10px;">&#8592;</button>
                <img class="lightbox-img" src="" alt="Proyecto">
                <button class="lightbox-next" title="Siguiente" style="right:10px;">&#8594;</button>
                <div class="lightbox-caption" style="color:#fff; margin-top:1rem; text-align:center;"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        imgEl = overlay.querySelector('.lightbox-img');
        closeBtn = overlay.querySelector('.lightbox-close');
        prevBtn = overlay.querySelector('.lightbox-prev');
        nextBtn = overlay.querySelector('.lightbox-next');
        caption = overlay.querySelector('.lightbox-caption');

        closeBtn.onclick = closeLightbox;
        prevBtn.onclick = showPrev;
        nextBtn.onclick = showNext;
        overlay.onclick = function(e) {
            if (e.target === overlay) closeLightbox();
        };
        document.addEventListener('keydown', handleKey);
    }

    function openLightbox(index) {
        current = index;
        updateLightbox();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev(e) {
        if (e) e.stopPropagation();
        current = (current - 1 + images.length) % images.length;
        updateLightbox();
    }
    function showNext(e) {
        if (e) e.stopPropagation();
        current = (current + 1) % images.length;
        updateLightbox();
    }
    function updateLightbox() {
        const img = images[current];
        imgEl.src = img.src;
        imgEl.alt = img.alt;
        caption.textContent = img.closest('.image-container').getAttribute('data-project') || img.alt;
    }
    function handleKey(e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    }

    images.forEach((img, idx) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', e => {
            e.preventDefault();
            if (!overlay) createLightbox();
            openLightbox(idx);
        });
    });
})(); 