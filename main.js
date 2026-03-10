document.addEventListener('DOMContentLoaded', () => {

  // Sticky CTA Logic
  const stickyBar = document.getElementById('stickyCta');
  const scrollThreshold = 120;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  });

  // Modals Logic
  const modals = document.querySelectorAll('.modal-overlay');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const closeBtns = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      document.getElementById(modalId).classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay').classList.remove('active');
    });
  });

  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Carousel Logic
  const carousels = document.querySelectorAll('.carousel');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const counter = carousel.querySelector('.counter-text');
    const btnPrev = carousel.querySelector('.btn-prev');
    const btnNext = carousel.querySelector('.btn-next');
    
    let currentIndex = 0;
    
    const updateCounter = () => {
      if(counter) counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    };

    track.addEventListener('scroll', () => {
      const scrollPos = track.scrollLeft;
      const slideWidth = slides[0].offsetWidth;
      currentIndex = Math.round(scrollPos / slideWidth);
      updateCounter();
    });

    if(btnPrev && btnNext) {
      btnNext.addEventListener('click', () => {
        if(currentIndex < slides.length - 1) {
          slides[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      
      btnPrev.addEventListener('click', () => {
        if(currentIndex > 0) {
          slides[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }
  });

  // Lightbox Logic
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const galleryImages = document.querySelectorAll('.carousel-slide img, .lightbox-trigger');

  galleryImages.forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-btn');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Optional: Close others
      // faqItems.forEach(faq => faq.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });

  // Form submission handling (Mock for now)
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      
      setTimeout(() => {
        btn.textContent = 'Success! Check your WhatsApp/Email.';
        btn.style.backgroundColor = 'var(--whatsapp)';
        setTimeout(() => {
          form.closest('.modal-overlay').classList.remove('active');
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.opacity = '1';
          form.reset();
        }, 2500);
      }, 1500);
    });
  });

});
