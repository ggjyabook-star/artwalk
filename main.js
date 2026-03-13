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

  // Hero Ken Burns Slider Logic
  const heroImages = document.querySelectorAll('.ken-burns-img');
  if (heroImages.length > 0) {
    let currentHeroIndex = 0;

    setInterval(() => {
      heroImages[currentHeroIndex].classList.remove('active');
      currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
      heroImages[currentHeroIndex].classList.add('active');
    }, 6000);
  }

  // Modals Logic — with data-source wiring
  const modals = document.querySelectorAll('.modal-overlay');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const closeBtns = document.querySelectorAll('.modal-close');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      const source = btn.getAttribute('data-source') || btn.textContent.trim();

      // Open modal
      const modal = document.getElementById(modalId);
      modal.classList.add('active');
      document.body.classList.add('modal-open');

      // Write the source label into the hidden field of that modal's form
      // modal-pricing → source-pricing, modal-schedule → source-schedule
      const sourceFieldId = 'source-' + modalId.replace('modal-', '');
      const sourceField = document.getElementById(sourceFieldId);
      if (sourceField) sourceField.value = source;
    });
  });

  const closeModal = () => {
    modals.forEach(m => m.classList.remove('active'));
    document.body.classList.remove('modal-open');
  };

  closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
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
      if (counter) counter.textContent = `${currentIndex + 1} / ${slides.length}`;
    };

    track.addEventListener('scroll', () => {
      const scrollPos = track.scrollLeft;
      const slideWidth = slides[0].offsetWidth;
      currentIndex = Math.round(scrollPos / slideWidth);
      updateCounter();
    });

    if (btnPrev && btnNext) {
      btnNext.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
          slides[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });

      btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
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
      if (!isActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });

  // ─── REAL FORM SUBMISSION → /api/contact ───────────────────────────────────
  async function submitForm(formEl, btnEl) {
    const originalText = btnEl.textContent;

    // Read fields
    const data = {
      name:   formEl.querySelector('[name="name"]')?.value?.trim(),
      email:  formEl.querySelector('[name="email"]')?.value?.trim(),
      phone:  formEl.querySelector('[name="phone"]')?.value?.trim(),
      source: formEl.querySelector('[name="source"]')?.value || 'Website form',
      tourPreference: formEl.querySelector('[name="tourPreference"]')?.value || null,
    };

    // Loading state
    btnEl.textContent = 'Sending…';
    btnEl.disabled = true;
    btnEl.style.opacity = '0.7';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.ok) {
        // Success
        btnEl.textContent = '✓ Sent! We\'ll be in touch soon.';
        btnEl.style.opacity = '1';
        btnEl.style.backgroundColor = '#25D366'; // whatsapp green
        btnEl.style.borderColor = 'transparent';

        setTimeout(() => {
          formEl.closest('.modal-overlay')?.classList.remove('active');
          document.body.classList.remove('modal-open');
          formEl.reset();
          btnEl.textContent = originalText;
          btnEl.style.backgroundColor = '';
          btnEl.style.borderColor = '';
          btnEl.disabled = false;
        }, 2800);
      } else {
        throw new Error(json.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      btnEl.textContent = 'Error — try WhatsApp instead';
      btnEl.style.opacity = '1';
      btnEl.style.backgroundColor = '#e53e3e';

      setTimeout(() => {
        btnEl.textContent = originalText;
        btnEl.style.backgroundColor = '';
        btnEl.disabled = false;
        btnEl.style.opacity = '1';
      }, 3500);
    }
  }

  // Attach to both forms
  const formPricing  = document.getElementById('form-pricing');
  const formSchedule = document.getElementById('form-schedule');

  if (formPricing) {
    formPricing.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(formPricing, document.getElementById('btn-pricing'));
    });
  }

  if (formSchedule) {
    formSchedule.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm(formSchedule, document.getElementById('btn-schedule'));
    });
  }

});


