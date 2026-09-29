/**
 * LAVI PAL — VIDEO EDITOR & MOTION DESIGNER PORTFOLIO
 * High-performance interactive UI, video controls, comparison slider & micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. Toast Notification Helper
     ========================================================================== */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, duration = 3000) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /* ==========================================================================
     2. Sticky Header & Scroll-Spy
     ========================================================================== */
  const header = document.getElementById('main-header');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id], main[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Scroll spy
    let currentId = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === `#${currentId}`);
    });
  }, { passive: true });

  /* ==========================================================================
     3. Mobile Drawer Navigation
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-reel-btn');

  function toggleMobileMenu(open) {
    const shouldOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', shouldOpen);
    mobileNav.setAttribute('aria-hidden', !shouldOpen);
    menuToggle?.setAttribute('aria-expanded', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  menuToggle?.addEventListener('click', () => toggleMobileMenu());
  drawerBackdrop?.addEventListener('click', () => toggleMobileMenu(false));
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMobileMenu(false);
    }
  });

  /* ==========================================================================
     4. Custom Glow Cursor (Desktop only)
     ========================================================================== */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursorDot && cursorGlow) {
    window.addEventListener('pointermove', (e) => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, { passive: true });

    const interactiveTargets = document.querySelectorAll('a, button, .reel-slot, .compare-handle, .lut-btn, .clip, input, select, textarea');
    interactiveTargets.forEach((el) => {
      el.addEventListener('pointerenter', () => cursorGlow.classList.add('cursor-hover'));
      el.addEventListener('pointerleave', () => cursorGlow.classList.remove('cursor-hover'));
    });
  }

  /* ==========================================================================
     5. Scroll Reveal Animations & Number Counters
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const statNumbers = document.querySelectorAll('.proof-stat-item strong');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Animate proof counters when in view
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statNumbers.forEach((stat) => {
          const target = parseFloat(stat.getAttribute('data-target') || '0');
          const suffix = stat.getAttribute('data-suffix') || '';
          if (isNaN(target) || target === 0) return;

          let count = 0;
          const duration = 1600;
          const stepTime = 20;
          const increment = target / (duration / stepTime);

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            stat.textContent = `${Math.floor(count)}${suffix}`;
          }, stepTime);
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const proofGrid = document.querySelector('.proof-grid');
  if (proofGrid) statsObserver.observe(proofGrid);

  /* ==========================================================================
     6. Cinema Video Player Modal
     ========================================================================== */
   const cinemaModal = document.getElementById('cinema-modal');
  const modalVideo = document.getElementById('modal-video-element');
  const modalVideoSource = document.getElementById('modal-video-source');
  const modalTitle = document.getElementById('modal-title');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openCinemaPlayer(src, title = 'LAVI PAL — 2026 MASTER SHOWREEL') {
    if (!cinemaModal || !modalVideo || !modalVideoSource) return;

    modalVideoSource.src = src;
    modalVideo.load();
    if (modalTitle) modalTitle.textContent = title;

    cinemaModal.showModal();
    modalVideo.play().catch(() => {});
  }

  function closeCinemaPlayer() {
    if (!cinemaModal || !modalVideo) return;
    modalVideo.pause();
    cinemaModal.close();
  }

  // Showreel open buttons
  document.querySelectorAll('[data-open-showreel]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCinemaPlayer('https://res.cloudinary.com/aovles4c/video/upload/v1790270425/PORTFOLIO.mp4', 'LAVI PAL — 2026 MASTER SHOWREEL');
    });
  });

  // Reel Card Click to expand in Cinema Player
  document.querySelectorAll('.reel-slot').forEach((card) => {
    const expandBtn = card.querySelector('.card-expand-btn');
    const mediaWrap = card.querySelector('.vertical-media');

    const triggerExpand = (e) => {
      // Avoid triggering if sound toggle was clicked
      if (e.target.closest('.card-sound-btn')) return;

      const src = card.getAttribute('data-video-src') || 'https://res.cloudinary.com/aovles4c/video/upload/v1790270425/PORTFOLIO.mp4';
      const title = card.getAttribute('data-title') || 'PROJECT VIDEO';
      openCinemaPlayer(src, title);
    };

    expandBtn?.addEventListener('click', triggerExpand);
    mediaWrap?.addEventListener('click', triggerExpand);
  });

  modalCloseBtn?.addEventListener('click', closeCinemaPlayer);
  cinemaModal?.addEventListener('click', (e) => {
    if (e.target === cinemaModal) closeCinemaPlayer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaModal?.open) closeCinemaPlayer();
  });

  /* ==========================================================================
     7. Interactive Video Cards (Hover Preview, Sound Toggle & Progress)
     ========================================================================== */
  const videoCards = document.querySelectorAll('.reel-slot');

  videoCards.forEach((card) => {
    const video = card.querySelector('video');
    const soundBtn = card.querySelector('.card-sound-btn');
    const progressBar = card.querySelector('.bar-fill');

    if (!video) return;

    // Hover to play preview on desktop
    card.addEventListener('pointerenter', () => {
      video.play().catch(() => {});
    });

    card.addEventListener('pointerleave', () => {
      // Pause if not muted/clicked
      if (video.muted) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Sound toggle
    soundBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      soundBtn.textContent = video.muted ? '🔇' : '🔊';
      soundBtn.classList.toggle('unmuted', !video.muted);
      if (!video.muted) {
        video.play().catch(() => {});
        showToast('🔊 Audio unmuted');
      }
    });

    // Progress bar update
    video.addEventListener('timeupdate', () => {
      if (progressBar && video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${pct}%`;
      }
    });
  });

  // Optimize performance: Pause out-of-view videos
  const videoViewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const vid = entry.target.querySelector('video');
      if (vid && !entry.isIntersecting) {
        vid.pause();
      }
    });
  }, { threshold: 0.1 });

  videoCards.forEach((card) => videoViewObserver.observe(card));

  /* ==========================================================================
     8. Hero Interactive Preview Video & Sound Toggle
     ========================================================================== */
  const heroVideo = document.getElementById('hero-ambient-video');
  const heroSoundToggle = document.getElementById('hero-sound-toggle');
  const heroTimecode = document.getElementById('hero-timecode');

  if (heroVideo && heroSoundToggle) {
    heroSoundToggle.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      const soundIcon = heroSoundToggle.querySelector('.sound-icon');
      const soundLabel = heroSoundToggle.querySelector('.sound-label');
      if (soundIcon) soundIcon.textContent = heroVideo.muted ? '🔇' : '🔊';
      if (soundLabel) soundLabel.textContent = heroVideo.muted ? 'UNMUTE' : 'MUTED';
      showToast(heroVideo.muted ? '🔇 Hero audio muted' : '🔊 Hero audio unmuted');
    });

    // Update dynamic timecode
    heroVideo.addEventListener('timeupdate', () => {
      if (!heroTimecode) return;
      const current = heroVideo.currentTime;
      const mins = String(Math.floor(current / 60)).padStart(2, '0');
      const secs = String(Math.floor(current % 60)).padStart(2, '0');
      const frames = String(Math.floor((current % 1) * 60)).padStart(2, '0');
      heroTimecode.textContent = `00:${mins}:${secs}:${frames}`;
    });
  }

  /* ==========================================================================
     9. Interactive Color Lab Comparison Slider
     ========================================================================== */
  const compareWrapper = document.getElementById('compare-slider-wrapper');
  const beforeLayer = document.getElementById('before-layer');
  const compareDivider = document.getElementById('compare-divider');
  const lutBtns = document.querySelectorAll('.lut-btn');
  let isDraggingCompare = false;

  function setComparePosition(x) {
    if (!compareWrapper || !beforeLayer || !compareDivider) return;
    const rect = compareWrapper.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    const percentage = pos * 100;

    beforeLayer.style.width = `${percentage}%`;
    compareDivider.style.left = `${percentage}%`;
    compareDivider.setAttribute('aria-valuenow', Math.round(percentage));
  }

  if (compareWrapper && compareDivider) {
    const onStart = (e) => {
      isDraggingCompare = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      setComparePosition(clientX);
    };

    const onMove = (e) => {
      if (!isDraggingCompare) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      setComparePosition(clientX);
    };

    const onEnd = () => {
      isDraggingCompare = false;
    };

    compareDivider.addEventListener('mousedown', onStart);
    compareWrapper.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Touch events
    compareDivider.addEventListener('touchstart', onStart, { passive: true });
    compareWrapper.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    // Keyboard support for accessibility
    compareDivider.addEventListener('keydown', (e) => {
      const current = parseFloat(compareDivider.getAttribute('aria-valuenow') || '50');
      if (e.key === 'ArrowLeft') {
        const next = Math.max(0, current - 5);
        beforeLayer.style.width = `${next}%`;
        compareDivider.style.left = `${next}%`;
        compareDivider.setAttribute('aria-valuenow', next);
      } else if (e.key === 'ArrowRight') {
        const next = Math.min(100, current + 5);
        beforeLayer.style.width = `${next}%`;
        compareDivider.style.left = `${next}%`;
        compareDivider.setAttribute('aria-valuenow', next);
      }
    });
  }

  // LUT Preset Switcher
  lutBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lutBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const lut = btn.getAttribute('data-lut');
      const gradedVideo = document.querySelector('.graded-visual video');

      if (!gradedVideo) return;

      switch (lut) {
        case 'editorial':
          gradedVideo.style.filter = 'contrast(1.18) saturate(1.25) brightness(0.98)';
          break;
        case 'neon':
          gradedVideo.style.filter = 'contrast(1.3) saturate(1.65) hue-rotate(-20deg)';
          break;
        case 'film':
          gradedVideo.style.filter = 'contrast(1.08) saturate(1.1) sepia(0.2) brightness(0.95)';
          break;
        case 'noir':
          gradedVideo.style.filter = 'grayscale(100%) contrast(1.4) brightness(0.9)';
          break;
      }
      showToast(`🎨 Applied LUT: ${btn.textContent}`);
    });
  });

  /* ==========================================================================
     10. Portfolio Category Filtering
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const categoryGroups = document.querySelectorAll('.work-category-group');
  const allReelSlots = document.querySelectorAll('.reel-slot');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      if (filter === 'all') {
        categoryGroups.forEach((group) => group.classList.remove('hidden-group'));
        allReelSlots.forEach((slot) => slot.classList.remove('hidden-card'));
      } else {
        categoryGroups.forEach((group) => {
          const groupCat = group.getAttribute('data-category-group');
          group.classList.toggle('hidden-group', groupCat !== filter);
        });
        allReelSlots.forEach((slot) => {
          const cardCat = slot.getAttribute('data-category');
          slot.classList.toggle('hidden-card', cardCat !== filter);
        });
      }
    });
  });

  /* ==========================================================================
     11. Interactive NLE Timeline Scrubber
     ========================================================================== */
  const timeRuler = document.querySelector('.time-ruler');
  const playhead = document.getElementById('timeline-playhead');
  const scrubTimeVal = document.getElementById('timeline-scrub-time');
  let isScrubbingTimeline = false;

  function updatePlayhead(x) {
    if (!timeRuler || !playhead) return;
    const rect = timeRuler.getBoundingClientRect();
    let pos = (x - rect.left) / rect.width;
    pos = Math.max(0, Math.min(1, pos));
    const percentage = pos * 100;
    playhead.style.left = `${percentage}%`;

    // Calculate timecode from 00:00 to 00:30
    const totalSeconds = pos * 30;
    const secs = String(Math.floor(totalSeconds)).padStart(2, '0');
    const frames = String(Math.floor((totalSeconds % 1) * 60)).padStart(2, '0');
    if (scrubTimeVal) {
      scrubTimeVal.textContent = `00:00:${secs}:${frames}`;
    }
  }

  if (timeRuler) {
    timeRuler.addEventListener('mousedown', (e) => {
      isScrubbingTimeline = true;
      updatePlayhead(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isScrubbingTimeline) updatePlayhead(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isScrubbingTimeline = false;
    });
  }

  // Clip clicks
  document.querySelectorAll('.clip').forEach((clip) => {
    clip.addEventListener('click', () => {
      showToast(`✂ Track Item Selected: "${clip.textContent.trim()}"`);
    });
  });

  /* ==========================================================================
     12. Copy Email to Clipboard
     ========================================================================== */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'hello@lavipal.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('✓ Email copied to clipboard: hello@lavipal.com');
      } catch (err) {
        showToast('hello@lavipal.com');
      }
    });
  }

  /* ==========================================================================
     13. Project Inquiry Form Submission
     ========================================================================== */
  const projectForm = document.getElementById('project-form');
  const submitBtn = document.getElementById('submit-btn');



  /* ==========================================================================
     14. Live Timezone Clock
     ========================================================================== */
  const liveClock = document.getElementById('live-clock');
  function updateClock() {
    if (!liveClock) return;
    const now = new Date();
    // Format to IST or local
    const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeStr = now.toLocaleTimeString('en-US', options);
    liveClock.textContent = `${timeStr} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ==========================================================================
     15. Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  backToTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
