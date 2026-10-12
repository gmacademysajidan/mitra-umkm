/* ==========================================================================
   MITRA UMKM INTERACTIVE JAVASCRIPT
   Handles Navbar, Mobile Drawer, Floating Back to Top, WA, Filters & Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Drawer Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileToggle.innerHTML = '☰';
      } else {
        mobileDrawer.classList.add('open');
        mobileToggle.innerHTML = '✕';
      }
    });
  }

  // Mobile Submenu Toggle
  const mobileDropdownTriggers = document.querySelectorAll('.mobile-dropdown-trigger');
  mobileDropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const submenu = trigger.nextElementSibling;
      if (submenu) {
        const isDisplayed = submenu.style.display === 'block';
        submenu.style.display = isDisplayed ? 'none' : 'block';
      }
    });
  });

  // 2. Floating Back to Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Accordion Toggle
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. Filter Chips (Program & Blog Catalog)
  const filterChips = document.querySelectorAll('.chip');
  const programCards = document.querySelectorAll('.program-card-wrapper');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const selectedCategory = chip.getAttribute('data-category');
      let visibleCount = 0;

      programCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const emptyState = document.getElementById('emptyState');
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  });

  // 5. Live Search Filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      programCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(query) || desc.includes(query)) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const emptyState = document.getElementById('emptyState');
      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    });
  }

  // 6. Form Submission (Formulir Pendaftaran & Kontak)
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const fields = [
        { id: 'namaLengkap', errorId: 'errNamaLengkap', msg: 'Nama lengkap wajib diisi.' },
        { id: 'namaUsaha', errorId: 'errNamaUsaha', msg: 'Nama usaha wajib diisi.' },
        { id: 'jenisUsaha', errorId: 'errJenisUsaha', msg: 'Pilih jenis usaha Anda.' },
        { id: 'noWhatsapp', errorId: 'errNoWhatsapp', msg: 'Nomor WhatsApp wajib diisi (min. 10 digit).' },
        { id: 'wilayahUsaha', errorId: 'errWilayahUsaha', msg: 'Wilayah atau kota lokasi usaha wajib diisi.' },
        { id: 'programPilihan', errorId: 'errProgramPilihan', msg: 'Pilih program yang ingin diikuti.' }
      ];

      fields.forEach(field => {
        const input = document.getElementById(field.id);
        const errEl = document.getElementById(field.errorId);

        if (!input || !input.value.trim()) {
          isValid = false;
          if (input) input.classList.add('error');
          if (errEl) {
            errEl.textContent = field.msg;
            errEl.style.display = 'block';
          }
        } else {
          if (input) input.classList.remove('error');
          if (errEl) errEl.style.display = 'none';
        }
      });

      const waInput = document.getElementById('noWhatsapp');
      const waErr = document.getElementById('errNoWhatsapp');
      if (waInput && waInput.value.trim() && waInput.value.trim().length < 10) {
        isValid = false;
        waInput.classList.add('error');
        if (waErr) {
          waErr.textContent = 'Nomor WhatsApp minimal 10 angka.';
          waErr.style.display = 'block';
        }
      }

      const consentCheck = document.getElementById('persetujuan');
      const errConsent = document.getElementById('errPersetujuan');
      if (consentCheck && !consentCheck.checked) {
        isValid = false;
        if (errConsent) {
          errConsent.textContent = 'Anda harus menyetujui persetujuan pemrosesan data.';
          errConsent.style.display = 'block';
        }
      } else if (errConsent) {
        errConsent.style.display = 'none';
      }

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Memproses Pendaftaran...';
        }
        
        const progSelect = document.getElementById('programPilihan');
        const progName = progSelect ? progSelect.options[progSelect.selectedIndex].text : 'Program Mitra UMKM';
        localStorage.setItem('registeredProgram', progName);
        localStorage.setItem('registeredName', document.getElementById('namaLengkap').value);

        setTimeout(() => {
          window.location.href = 'sukses.html';
        }, 1000);
      }
    });
  }

  // Load Saved Data on Success Page
  const successProgName = document.getElementById('successProgName');
  const successRegistrant = document.getElementById('successRegistrant');
  if (successProgName) {
    const savedProg = localStorage.getItem('registeredProgram') || 'Pelatihan Marketing Digital & Marketplace';
    const savedName = localStorage.getItem('registeredName') || 'Bapak/Ibu Pelaku UMKM';
    successProgName.textContent = savedProg;
    if (successRegistrant) successRegistrant.textContent = savedName;
  }

  // 7. Scroll Reveal Animation for All Cards (Bootstrap Animation Style)
  const cardsToAnimate = document.querySelectorAll('.category-card, .program-card, .photo-card-slot, .step-card, .cta-card, .form-card');
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-animated');
          cardObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    cardsToAnimate.forEach(card => {
      cardObserver.observe(card);
    });
  } else {
    cardsToAnimate.forEach(card => card.classList.add('card-animated'));
  }

  // 8. Handle URL Query Parameters (Category Filter & Pre-selected Program)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const targetChip = document.querySelector(`.chip[data-category="${catParam}"]`);
    if (targetChip) {
      targetChip.click();
    }
  }

  const progParam = urlParams.get('program');
  const progSelect = document.getElementById('programPilihan');
  if (progParam && progSelect) {
    const paramNormalized = progParam.toLowerCase();
    const mapping = {
      'marketing': 'marketing',
      'marketing-digital': 'marketing',
      'pelatihan': 'marketing',
      'branding': 'branding',
      'fotografi': 'branding',
      'marketplace': 'marketplace',
      'pemasaran': 'marketplace',
      'tokopedia-shopee': 'marketplace',
      'website': 'website',
      'web-catalog': 'website',
      'financial': 'financial',
      'keuangan': 'financial',
      'pengembangan': 'financial',
      'qris': 'financial'
    };
    const targetVal = mapping[paramNormalized] || paramNormalized;
    for (let i = 0; i < progSelect.options.length; i++) {
      if (progSelect.options[i].value === targetVal) {
        progSelect.selectedIndex = i;
        break;
      }
    }
  }
});
