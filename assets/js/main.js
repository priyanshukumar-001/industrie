/* ==========================================================================
   Industrie Laboratory - Main JS (GSAP + ScrollTrigger + Swiper + Odometer)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Preloader
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => preloader?.classList.add('loaded');
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 150);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 200));
    setTimeout(hidePreloader, 1200);
  }

  /* ------------------------------------------------------------------------
     2. GSAP ScrollTrigger + Native Smooth Scrolling
     ------------------------------------------------------------------------ */
  gsap.registerPlugin(ScrollTrigger);

  // Smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const top = targetEl.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. Sticky Navbar & ScrollUp Button
     ------------------------------------------------------------------------ */
  const stickyNav = document.getElementById('stickyNavbar');
  const scrollUpBtn = document.getElementById('scrollUp');

  const onScrollUpdate = () => {
    if (window.scrollY > 120) {
      stickyNav?.classList.add('is-sticky');
      scrollUpBtn?.classList.add('visible');
    } else {
      stickyNav?.classList.remove('is-sticky');
      scrollUpBtn?.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScrollUpdate, { passive: true });
  onScrollUpdate();

  scrollUpBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------------
     4. Custom Cursor Ball (#rs-mouse #cursor-ball)
     ------------------------------------------------------------------------ */
  const cursorBall = document.getElementById('cursor-ball');
  if (cursorBall && window.matchMedia('(hover: hover)').matches) {
    let mouseX = 0, mouseY = 0;
    let ballX = 0, ballY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      ballX += (mouseX - ballX) * 0.18;
      ballY += (mouseY - ballY) * 0.18;
      cursorBall.style.transform = `translate3d(${ballX}px, ${ballY}px, 0) translate(-50%, -50%)`;
    });

    const hoverTargets = 'a, button, .rs-team-card, .rs-portfolio-card, .rs-service-card';
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => cursorBall.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorBall.classList.remove('cursor-hover'));
    });
  }

  /* ------------------------------------------------------------------------
     5. Hero Slider (GSAP Layer Animations + Autoplay + Controls)
     ------------------------------------------------------------------------ */
  const slides = document.querySelectorAll('.rs-hero-slide');
  const dots = document.querySelectorAll('#heroDots button');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let currentSlide = 0;
  let slideTimer = null;

  function animateSlideContent(slide) {
    const els = slide.querySelectorAll('.anim-el');
    gsap.fromTo(
      els,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform'
      }
    );
  }

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide]?.classList.add('active');
    animateSlideContent(slides[currentSlide]);
  }

  function startAutoSlide() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 6500);
  }

  if (slides.length) {
    animateSlideContent(slides[0]);
    startAutoSlide();

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startAutoSlide();
    });

    nextBtn?.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startAutoSlide();
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToSlide(idx);
        startAutoSlide();
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Circular Text ("Watch Video - Watch Video - ")
     ------------------------------------------------------------------------ */
  const circularEl = document.getElementById('circularText');
  if (circularEl) {
    const text = circularEl.dataset.text || 'Watch Video - Watch Video - ';
    const deg = 360 / text.length;
    circularEl.innerHTML = text
      .split('')
      .map((char, i) => `<span style="transform: rotate(${i * deg}deg)">${char}</span>`)
      .join('');
  }

  /* ------------------------------------------------------------------------
     7. GSAP Split-Text Fade & Scroll Reveal Animations
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.rs-split-text').forEach((heading) => {
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (part.trim().length > 0) {
            const outer = document.createElement('span');
            outer.className = 'split-word';
            const inner = document.createElement('span');
            inner.className = 'split-word-inner';
            inner.textContent = part;
            outer.appendChild(inner);
            frag.appendChild(outer);
          } else {
            frag.appendChild(document.createTextNode(part));
          }
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(walk);
      }
    };
    walk(heading);

    const words = heading.querySelectorAll('.split-word-inner');
    gsap.from(words, {
      yPercent: 100,
      opacity: 0,
      duration: 0.75,
      stagger: 0.035,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Fade-up elements
  document.querySelectorAll('.gsap-fade-up').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || '0');
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        once: true
      }
    });
  });

  // Fade-right elements
  document.querySelectorAll('.gsap-fade-right').forEach((el) => {
    gsap.from(el, {
      x: -50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Zoom-in elements
  document.querySelectorAll('.gsap-zoom-in').forEach((el) => {
    gsap.from(el, {
      scale: 0.75,
      opacity: 0,
      duration: 0.85,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Partner hand image: pop + right-to-left transition
  const partnerHandImg = document.querySelector('.rs-partner-hand-img');
  if (partnerHandImg) {
    gsap.from(partnerHandImg, {
      x: 110,
      scale: 0.88,
      opacity: 0,
      duration: 1.05,
      ease: 'back.out(1.35)',
      scrollTrigger: {
        trigger: partnerHandImg,
        start: 'top 90%',
        once: true
      }
    });
  }

  // Subtle scroll parallax on ABOUT INDUSTRIE watermark
  document.querySelectorAll('.rs-about-bg-watermark').forEach((wm) => {
    gsap.fromTo(
      wm,
      { xPercent: -54 },
      {
        xPercent: -46,
        ease: 'none',
        scrollTrigger: {
          trigger: wm.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );
  });

  // Smooth GSAP reveal when switching About or Journey tabs
  document.querySelectorAll('#aboutTab button[data-bs-toggle="pill"], #journeyTabs button[data-bs-toggle="pill"]').forEach((tabBtn) => {
    tabBtn.addEventListener('shown.bs.tab', (e) => {
      const targetPane = document.querySelector(e.target.dataset.bsTarget);
      if (targetPane) {
        gsap.fromTo(
          targetPane,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }
        );
      }
    });
  });

  /* ------------------------------------------------------------------------
     8. Odometer Rolling Digit Counters
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.counter-num').forEach((counter) => {
    const target = parseInt(counter.dataset.target || '0', 10);
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        counter.innerHTML = target;
      }
    });
  });

  /* ------------------------------------------------------------------------
     8b. Desktop Hover Dropdowns & Subtle 3D Card Tilt
     ------------------------------------------------------------------------ */
  if (window.matchMedia('(min-width: 1200px)').matches) {
    document.querySelectorAll('.rs-navbar .dropdown').forEach((drop) => {
      drop.addEventListener('mouseenter', () => {
        drop.querySelector('.dropdown-menu')?.classList.add('show');
      });
      drop.addEventListener('mouseleave', () => {
        drop.querySelector('.dropdown-menu')?.classList.remove('show');
      });
    });
  }

  document.querySelectorAll('.rs-about-img-wrap').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 900,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
    });
  });

  /* ------------------------------------------------------------------------
     9. Testimonials Swiper Slider
     ------------------------------------------------------------------------ */
  if (document.querySelector('.rs-testimonial-swiper')) {
    new Swiper('.rs-testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoHeight: false,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 }
      }
    });
  }

  if (document.querySelector('.rs-partner-swiper')) {
    new Swiper('.rs-partner-swiper', {
      slidesPerView: 2,
      spaceBetween: 16,
      loop: true,
      speed: 800,
      autoplay: {
        delay: 2400,
        disableOnInteraction: false
      },
      breakpoints: {
        576: { slidesPerView: 3 },
        992: { slidesPerView: 6 }
      }
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 600);

  /* ------------------------------------------------------------------------
     10. Video Modal (Auto-play / Stop YouTube on Close)
     ------------------------------------------------------------------------ */
  const videoModal = document.getElementById('videoModal');
  const youtubeIframe = document.getElementById('youtubeIframe');
  if (videoModal && youtubeIframe) {
    videoModal.addEventListener('show.bs.modal', () => {
      youtubeIframe.src = youtubeIframe.dataset.src;
    });
    videoModal.addEventListener('hidden.bs.modal', () => {
      youtubeIframe.src = '';
    });
  }

  /* ------------------------------------------------------------------------
     11. Team Member Detail Modal
     ------------------------------------------------------------------------ */
  const teamModalEl = document.getElementById('teamModal');
  if (teamModalEl) {
    const teamModal = new bootstrap.Modal(teamModalEl);
    document.querySelectorAll('.rs-team-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.team-socials a')) return;
        document.getElementById('modalTeamName').textContent = card.dataset.name;
        document.getElementById('modalTeamRole').textContent = card.dataset.role;
        document.getElementById('modalTeamImg').src = card.dataset.img;
        teamModal.show();
      });
    });
  }

  /* ------------------------------------------------------------------------
     12. Floating Right Sidebar Panel & 34+ Demos Drawer
     ------------------------------------------------------------------------ */
  const floatingPanel = document.getElementById('floatingPanel');
  const panelToggleBtn = document.getElementById('panelToggleBtn');
  const openDemosBtn = document.getElementById('openDemosBtn');
  const closeDemosBtn = document.getElementById('closeDemosBtn');
  const demosDrawer = document.getElementById('demosDrawer');

  panelToggleBtn?.addEventListener('click', () => {
    floatingPanel?.classList.toggle('is-collapsed');
    const icon = panelToggleBtn.querySelector('i');
    if (icon) {
      icon.className = floatingPanel?.classList.contains('is-collapsed')
        ? 'ri-add-line'
        : 'ri-close-line';
    }
  });

  openDemosBtn?.addEventListener('click', () => {
    demosDrawer?.classList.add('open');
  });

  closeDemosBtn?.addEventListener('click', () => {
    demosDrawer?.classList.remove('open');
  });

  /* ------------------------------------------------------------------------
     13. Blog Page Pagination, Search, Category & Tag Filtering
     ------------------------------------------------------------------------ */
  const blogCards = document.querySelectorAll('.rs-blog-list-card');
  const pageBtns = document.querySelectorAll('.rs-blog-pagination .page-btn[data-page-target]');
  const blogPrevBtn = document.getElementById('blogPrevPage');
  const blogNextBtn = document.getElementById('blogNextPage');
  const blogSearch = document.getElementById('blogSearchInput');
  const catBtns = document.querySelectorAll('#blogCategoryList button');
  const tagBtns = document.querySelectorAll('#blogTagList button');

  if (blogCards.length) {
    let activePage = '1';

    const showPage = (page) => {
      activePage = page;
      blogCards.forEach((c) => {
        c.classList.toggle('d-none', c.dataset.page !== page);
      });
      pageBtns.forEach((b) => b.classList.toggle('active', b.dataset.pageTarget === page));
      blogPrevBtn?.classList.toggle('d-none', page === '1');
      blogNextBtn?.classList.toggle('d-none', page === '2');
      window.scrollTo({ top: document.getElementById('blogList').offsetTop - 90, behavior: 'smooth' });
    };

    pageBtns.forEach((btn) => {
      btn.addEventListener('click', () => showPage(btn.dataset.pageTarget));
    });

    blogPrevBtn?.addEventListener('click', () => showPage('1'));
    blogNextBtn?.addEventListener('click', () => showPage('2'));

    blogSearch?.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (!q) {
        showPage(activePage);
        return;
      }
      blogCards.forEach((c) => {
        const text = c.textContent.toLowerCase();
        c.classList.toggle('d-none', !text.includes(q));
      });
    });

    catBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const wasActive = btn.classList.contains('active');
        catBtns.forEach((b) => b.classList.remove('active'));
        tagBtns.forEach((b) => b.classList.remove('active'));
        if (wasActive) {
          showPage('1');
          return;
        }
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        blogCards.forEach((c) => c.classList.toggle('d-none', c.dataset.category !== cat));
      });
    });

    tagBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const wasActive = btn.classList.contains('active');
        tagBtns.forEach((b) => b.classList.remove('active'));
        catBtns.forEach((b) => b.classList.remove('active'));
        if (wasActive) {
          showPage('1');
          return;
        }
        btn.classList.add('active');
        const tag = btn.dataset.tag;
        blogCards.forEach((c) => {
          const tags = (c.dataset.tags || '').split(',');
          c.classList.toggle('d-none', !tags.includes(tag));
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     14. Product Details Page (Quantity, Add to Cart & Live Reviews)
     ------------------------------------------------------------------------ */
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const cartNotice = document.getElementById('cartNotice');
  const cartNoticeText = document.getElementById('cartNoticeText');

  if (qtyInput && addToCartBtn) {
    // Check if redirected/reloaded after adding to cart
    const savedCart = sessionStorage.getItem('rs_cart_added');
    if (savedCart) {
      sessionStorage.removeItem('rs_cart_added');
      try {
        const { qty, name } = JSON.parse(savedCart);
        if (name === 'Modern Hammer') {
          qtyInput.value = qty;
        }
        const verb = qty > 1 ? 'have' : 'has';
        cartNoticeText.textContent = `${qty} × “${name}” ${verb} been added to your cart.`;
        cartNotice?.classList.remove('d-none');
        cartNotice?.classList.add('d-flex');
      } catch (_) {}
    }

    qtyMinus?.addEventListener('click', () => {
      const val = Math.max(1, parseInt(qtyInput.value || '1', 10) - 1);
      qtyInput.value = val;
    });

    qtyPlus?.addEventListener('click', () => {
      const val = Math.min(99, parseInt(qtyInput.value || '1', 10) + 1);
      qtyInput.value = val;
    });

    addToCartBtn.addEventListener('click', () => {
      const qty = Math.max(1, parseInt(qtyInput.value || '1', 10));
      sessionStorage.setItem('rs_cart_added', JSON.stringify({ qty, name: 'Modern Hammer' }));
      window.location.reload();
    });

    document.querySelectorAll('.product-hover-cart-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.product || 'Product';
        sessionStorage.setItem('rs_cart_added', JSON.stringify({ qty: 1, name }));
        window.location.reload();
      });
    });
  }

  const starPicker = document.getElementById('starPicker');
  const reviewForm = document.getElementById('productReviewForm');
  if (starPicker && reviewForm) {
    let selectedRating = 5;
    const starBtns = starPicker.querySelectorAll('button');

    const paintStars = (n) => {
      starBtns.forEach((b, idx) => {
        const icon = b.querySelector('i');
        icon.className = idx < n ? 'ri-star-fill' : 'ri-star-line';
      });
    };
    paintStars(selectedRating);

    starBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedRating = parseInt(btn.dataset.star, 10);
        paintStars(selectedRating);
      });
    });

    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reviewName').value.trim();
      const text = document.getElementById('reviewText').value.trim();
      if (!name || !text) return;

      document.getElementById('noReviewsMsg')?.remove();
      const list = document.getElementById('reviewsList');
      const card = document.createElement('div');
      card.className = 'p-3 mb-3 border rounded bg-white';
      const starsHtml = Array.from({ length: 5 }, (_, i) =>
        `<i class="${i < selectedRating ? 'ri-star-fill' : 'ri-star-line'} text-primary"></i>`
      ).join('');
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong>${name}</strong>
          <span>${starsHtml}</span>
        </div>
        <p class="mb-0 text-muted small">${text}</p>
      `;
      list.appendChild(card);

      const countEl = document.getElementById('reviewCount');
      countEl.textContent = parseInt(countEl.textContent || '0', 10) + 1;
      reviewForm.reset();
      selectedRating = 5;
      paintStars(5);
    });
  }
});
