/* ============================================================
   CHURROVA — Main JavaScript
   Twist. Dip. Delight.
   ============================================================ */

'use strict';

// ── Utility ──────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// Professional SVG replacement for legacy emoji-based UI artwork.
const IconSystem = (() => {
  const paths = {
    check: '<polyline points="20 6 9 17 4 12"/>',
    star: '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    celebration: '<path d="m4 22 4-14 8 8-12 6Z"/><path d="m9 7 1-3M14 10l3-3M17 15l3-1M14 4l1-2M20 9l2-1"/>',
    dessert: '<path d="M6 10h12l-1.2 10H7.2L6 10Z"/><path d="M8 10a4 4 0 0 1 8 0M12 6V2"/>',
    flavor: '<path d="M12 22c5-3 8-7 8-12a8 8 0 1 0-16 0c0 5 3 9 8 12Z"/><path d="M8 11c2-3 6-3 8 0"/>',
    fire: '<path d="M12 22c4 0 7-3 7-7 0-5-4-8-5-12-3 2-5 5-5 8-1-1-2-2-3-2-1 2-1 4-1 6 0 4 3 7 7 7Z"/>',
    box: '<path d="m21 8-9 5-9-5M3 8l9-5 9 5v10l-9 5-9-5V8Z"/><path d="M12 13v10"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2"/>',
    transport: '<rect x="5" y="3" width="14" height="16" rx="3"/><path d="M8 19l-2 3M16 19l2 3M8 8h8M8 13h.01M16 13h.01"/>',
    sparkle: '<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>'
  };
  const groups = {
    check: ['✓'], star: ['★','🌟'], pin: ['📍'], users: ['👥','👫','👨‍👩‍👧‍👦'],
    celebration: ['🎉','🎪','🎓','🥂','💍'], dessert: ['🍦','🍡','🥣','🎂','🎃','🥐'],
    flavor: ['🍫','🍯','🍓','🍪','🟢','☕','🤍','🌾'], fire: ['🔥','⚡'], box: ['📦'],
    search: ['🔍'], building: ['🏢'], transport: ['🚇','🏃'], sparkle: ['✨','🌀'],
    heart: ['💝','🛋️']
  };
  const names = Object.entries(groups).reduce((all, [name, chars]) => {
    chars.forEach(char => { all[char] = name; });
    return all;
  }, {});
  const tokens = Object.keys(names).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${tokens.map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gu');

  function svg(name) {
    const fill = name === 'star' ? 'currentColor' : 'none';
    return `<svg class="ui-icon" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sparkle}</svg>`;
  }

  function replaceText(node) {
    const text = node.nodeValue;
    if (!text || !pattern.test(text)) return;
    pattern.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    text.split(pattern).filter(Boolean).forEach(part => {
      const name = names[part];
      if (!name) return fragment.appendChild(document.createTextNode(part));
      const holder = document.createElement('span');
      holder.className = `ui-icon-wrap ui-icon-${name}`;
      holder.innerHTML = svg(name);
      fragment.appendChild(holder);
    });
    node.replaceWith(fragment);
  }

  function scan(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (parent && !['SCRIPT','STYLE','TEXTAREA'].includes(parent.tagName)) nodes.push(walker.currentNode);
    }
    nodes.forEach(replaceText);
  }

  function init() {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) { favicon.href = 'assets/images/common/light-logo.png'; favicon.type = 'image/png'; }
    scan();
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) replaceText(node);
      else if (node.nodeType === Node.ELEMENT_NODE) scan(node);
    }))).observe(document.body, { childList: true, subtree: true });
  }

  return { init, scan, svg };
})();

function initThemeLogos() {
  $$('.logo-icon, .footer-logo-icon').forEach(container => {
    container.innerHTML = `
      <img class="theme-logo theme-logo-light" src="assets/images/common/light-logo.png" alt="" aria-hidden="true">
      <img class="theme-logo theme-logo-dark" src="assets/images/common/dark-logo.png" alt="" aria-hidden="true">`;
  });
}

function initBrandLockups() {
  $$('.brand-sub, .footer-tagline').forEach(tagline => {
    tagline.textContent = 'Twist. Dip. Delight.';
  });

  const footerLogo = $('.footer-logo');
  if (!footerLogo) return;
  footerLogo.setAttribute('aria-label', 'CHURROVA — Twist. Dip. Delight.');
  footerLogo.innerHTML = `
    <div class="footer-logo-icon" aria-hidden="true"></div>
    <div class="footer-logo-copy">
      <div class="footer-brand-name">CHURROVA</div>
      <span class="footer-tagline">Twist. Dip. Delight.</span>
    </div>`;
}

// ── Theme Manager ─────────────────────────────────────────────
const Theme = (() => {
  const STORAGE_KEY = 'churrova-theme';
  let current = localStorage.getItem(STORAGE_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function apply(theme) {
    current = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = `assets/images/common/${theme === 'dark' ? 'dark' : 'light'}-logo.png`;
    $$('[data-theme-icon]').forEach(el => {
      el.innerHTML = theme === 'dark'
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    });
  }

  function toggle() { apply(current === 'dark' ? 'light' : 'dark'); }
  function init() { apply(current); }

  return { init, toggle, get: () => current };
})();

// ── RTL Manager ───────────────────────────────────────────────
const RTL = (() => {
  const STORAGE_KEY = 'churrova-dir';
  let current = localStorage.getItem(STORAGE_KEY) || 'ltr';

  function apply(dir) {
    current = dir;
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    $$('[data-rtl-label]').forEach(el => {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  function toggle() { apply(current === 'rtl' ? 'ltr' : 'rtl'); }
  function init() { apply(current); }

  return { init, toggle };
})();

// ── Header ────────────────────────────────────────────────────
const Header = (() => {
  function init() {
    const header = $('.site-header');
    if (!header) return;

    $$('.btn-header-cta').forEach(link => {
      link.href = 'signature-flavors.html';
      link.textContent = 'Signature Flavors';
    });

    // Scroll effect
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Active nav link
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-list a, .drawer-nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (href && href === path) a.classList.add('active');
    });
  }
  return { init };
})();

// ── Mobile Drawer ─────────────────────────────────────────────
const Drawer = (() => {
  let isOpen = false;

  function open() {
    isOpen = true;
    $('.mobile-drawer')?.classList.add('open');
    $('.mobile-drawer')?.setAttribute('aria-hidden', 'false');
    $('.drawer-overlay')?.classList.add('active');
    $('.mobile-toggle')?.classList.add('active');
    $('.mobile-toggle')?.setAttribute('aria-expanded', 'true');
    $('.mobile-toggle')?.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    isOpen = false;
    $('.mobile-drawer')?.classList.remove('open');
    $('.mobile-drawer')?.setAttribute('aria-hidden', 'true');
    $('.drawer-overlay')?.classList.remove('active');
    $('.mobile-toggle')?.classList.remove('active');
    $('.mobile-toggle')?.setAttribute('aria-expanded', 'false');
    $('.mobile-toggle')?.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  function toggle() { isOpen ? close() : open(); }

  function init() {
    // Keep Signature Flavors as the dedicated drawer CTA, not a duplicate menu item.
    $$('.drawer-nav a[href="signature-flavors.html"]').forEach(link => link.remove());

    $('.mobile-toggle')?.addEventListener('click', toggle);
    $('.drawer-close')?.addEventListener('click', close);
    $('.drawer-overlay')?.addEventListener('click', close);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  return { init, open, close };
})();

// ── Reveal on Scroll & Comprehensive Section / Banner Animator ─
const Reveal = (() => {
  let observer;

  function init() {
    // 1. Automatically scan every section and banner to ensure complete animation coverage
    const sections = $$('main > section, body > section, .section-py, [role="region"], .hero, .hero-split, .page-hero, .cta-banner, .cta-gradient, .final-cta');
    
    sections.forEach(sec => {
      // Auto-tag section header elements (section-label, h2, title, lead) with staggered reveal
      const headerElements = sec.querySelectorAll('.section-label, h2, .section-title, .lead, p.section-intro, .page-hero-title, .page-hero-lead');
      headerElements.forEach((el, idx) => {
        if (!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-scale')) {
          el.classList.add('reveal');
          if (idx === 1) el.classList.add('delay-1');
          if (idx === 2) el.classList.add('delay-2');
          if (idx >= 3) el.classList.add('delay-3');
        }
      });

      // Auto-tag cards and grid collections with cascading delays
      const grids = sec.querySelectorAll('.menu-grid, .event-types-grid, .packages-grid, .locations-grid, .gallery-grid, .testimonials-grid, .values-grid, .team-grid, .booking-steps, .prep-steps, .mood-grid, .filled-grid, .flavor-grid, .event-stat-grid, .builder-grid, .event-gallery-grid');
      grids.forEach(grid => {
        Array.from(grid.children).forEach((child, idx) => {
          if (child.hasAttribute('data-no-reveal')) return;
          if (!child.classList.contains('reveal') && !child.classList.contains('reveal-left') && !child.classList.contains('reveal-right') && !child.classList.contains('reveal-scale')) {
            child.classList.add('reveal');
            const delayNum = (idx % 4) + 1;
            child.classList.add(`delay-${delayNum}`);
          }
        });
      });

      // Auto-tag individual cards and feature components
      const cards = sec.querySelectorAll('.menu-card, .flavor-card, .event-type-card, .package-card, .location-card, .testimonial-card, .value-card, .team-card, .event-stat-card, .step-card, .story-card, .booking-step, .prep-step, .faq-item, .anatomy-card, .feature-card');
      cards.forEach((card, idx) => {
        if (!card.classList.contains('reveal') && !card.classList.contains('reveal-left') && !card.classList.contains('reveal-right') && !card.classList.contains('reveal-scale')) {
          card.classList.add('reveal');
          const delayNum = (idx % 4) + 1;
          card.classList.add(`delay-${delayNum}`);
        }
      });

      // Auto-tag CTA Banners content
      if (sec.classList.contains('cta-banner') || sec.classList.contains('cta-gradient') || sec.classList.contains('final-cta')) {
        sec.querySelectorAll('h2, p, .btn, .btn-group').forEach((item, idx) => {
          if (!item.classList.contains('reveal')) {
            item.classList.add('reveal');
            if (idx > 0) item.classList.add(`delay-${Math.min(idx, 4)}`);
          }
        });
      }
    });

    const revealElements = $$('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-pop');

    if (!window.IntersectionObserver) {
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    revealElements.forEach(el => {
      // Immediately reveal elements already visible above the fold (like hero banners)
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }

  return { init };
})();

// ── Fresh Strip ───────────────────────────────────────────────
const FreshStrip = (() => {
  function init() {
    const strip = $('#fresh-strip');
    if (!strip) return;

    const setStripHeight = (height = strip.offsetHeight) => {
      document.documentElement.style.setProperty('--fresh-strip-height', `${height}px`);
    };

    setStripHeight();
    const resizeObserver = window.ResizeObserver
      ? new ResizeObserver(() => setStripHeight())
      : null;
    resizeObserver?.observe(strip);

    const closeBtn = strip.querySelector('.strip-close');
    closeBtn?.addEventListener('click', () => {
      strip.style.maxHeight = strip.offsetHeight + 'px';
      strip.style.overflow = 'hidden';
      strip.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
      requestAnimationFrame(() => {
        strip.style.maxHeight = '0';
        strip.style.opacity = '0';
        document.documentElement.style.setProperty('--fresh-strip-height', '0px');
      });
      setTimeout(() => {
        resizeObserver?.disconnect();
        strip.remove();
      }, 380);
    });
  }
  return { init };
})();

// ── Flavor Rail ───────────────────────────────────────────────
const FlavorRail = (() => {
  function init() {
    $$('.flavor-rail').forEach(rail => {
      const wrapper = rail.closest('.flavor-rail-wrapper');
      const section = rail.closest('section');
      if (!wrapper || !section) return;

      const prevBtn = section.querySelector('.rail-btn-prev');
      const nextBtn = section.querySelector('.rail-btn-next');

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let autoMoveTimer = null;
      let paused = false;

      const cardWidth = () => {
        const card = rail.querySelector('.flavor-card');
        return card ? card.offsetWidth + 24 : 284;
      };

      // Chrome exposes RTL horizontal scrolling with negative scrollLeft
      // values. Read the direction dynamically so switching LTR/RTL while the
      // page is open also changes the rail's movement immediately.
      const motionDirection = () => getComputedStyle(rail).direction === 'rtl' ? -1 : 1;

      const movePrevious = () => {
        rail.scrollBy({ left: -cardWidth() * 2 * motionDirection(), behavior: 'smooth' });
      };

      const moveNext = () => {
        rail.scrollBy({ left: cardWidth() * 2 * motionDirection(), behavior: 'smooth' });
      };

      const stopAutoMove = () => {
        paused = true;
      };

      const startAutoMove = () => {
        paused = false;
      };

      const restartAutoMove = () => {
        stopAutoMove();
        window.setTimeout(startAutoMove, 900);
      };

      if (!prefersReducedMotion && rail.scrollWidth > rail.clientWidth) {
        [...rail.children].forEach(card => {
          const clone = card.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          // Clones are added after the reveal observer has already scanned the
          // page, so they must not keep the hidden reveal animation state.
          clone.classList.remove('reveal', 'reveal-up', 'reveal-left', 'reveal-right', 'reveal-scale', 'reveal-pop');
          clone.classList.remove('delay-1', 'delay-2', 'delay-3', 'delay-4');
          clone.classList.add('rail-clone');
          rail.appendChild(clone);
        });

        const firstCard = rail.querySelector('.flavor-card:not(.rail-clone)');
        const firstClone = rail.querySelector('.rail-clone');
        const loopWidth = firstCard && firstClone
          ? Math.abs(firstClone.offsetLeft - firstCard.offsetLeft)
          : rail.scrollWidth / 2;

        const animate = () => {
          if (!paused && !document.hidden) {
            const direction = motionDirection();
            rail.scrollLeft += direction;
            if (Math.abs(rail.scrollLeft) >= loopWidth) {
              rail.scrollLeft -= direction * loopWidth;
            }
          }
        };
        rail.classList.add('is-continuous');
        autoMoveTimer = window.setInterval(animate, 20);
      }

      prevBtn?.addEventListener('click', () => {
        movePrevious();
        restartAutoMove();
      });
      nextBtn?.addEventListener('click', () => {
        moveNext();
        restartAutoMove();
      });

      wrapper.addEventListener('focusin', stopAutoMove);
      wrapper.addEventListener('focusout', startAutoMove);
      wrapper.addEventListener('touchstart', stopAutoMove, { passive: true });
      wrapper.addEventListener('touchend', restartAutoMove, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoMove();
        else startAutoMove();
      });
    });
  }
  return { init };
})();

// ── Menu Filters ──────────────────────────────────────────────
const MenuFilter = (() => {
  let activeCategory = 'all';
  let activeFilter = {};
  let searchQuery = '';

  function filterCards() {
    const cards = $$('.menu-card[data-category]');
    let visible = 0;

    cards.forEach(card => {
      const cat = card.dataset.category || '';
      const flavor = card.dataset.flavor || '';
      const type = card.dataset.type || '';
      const name = card.querySelector('.menu-card-name')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.menu-card-desc')?.textContent.toLowerCase() || '';

      const matchCat = activeCategory === 'all' || cat === activeCategory;
      const matchSearch = !searchQuery ||
        name.includes(searchQuery.toLowerCase()) ||
        desc.includes(searchQuery.toLowerCase());
      const matchFlavor = !activeFilter.flavor || flavor === activeFilter.flavor;
      const matchType = !activeFilter.type || type === activeFilter.type;

      const show = matchCat && matchSearch && matchFlavor && matchType;

      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    const noResults = $('.no-results');
    if (noResults) {
      noResults.style.display = visible === 0 ? 'block' : 'none';
    }

    updateCounts();
  }

  function updateCounts() {
    $$('.menu-section-count').forEach(el => {
      const section = el.closest('[data-section]');
      if (!section) return;
      const sectionCat = section.dataset.section;
      const visible = $$('.menu-card[data-category]', section)
        .filter(c => c.style.display !== 'none').length;
      el.textContent = `${visible} item${visible !== 1 ? 's' : ''}`;
    });
  }

  function init() {
    // Category chips
    $$('.chip[data-filter]').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('.chip[data-filter]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.filter;
        filterCards();
      });
    });

    // Search
    const searchInput = $('#menu-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        filterCards();
      });
    }

    // Filter selects
    $$('.filter-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        activeFilter[e.target.dataset.filterKey] = e.target.value || '';
        filterCards();
      });
    });

    filterCards();
  }

  return { init };
})();

// ── FAQ Accordion ─────────────────────────────────────────────
const FAQ = (() => {
  function init() {
    $$('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        $$('.faq-item.open').forEach(el => el.classList.remove('open'));

        // Open clicked (toggle)
        if (!isOpen) item.classList.add('open');
      });

      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }
  return { init };
})();

// ── Dip Pairing Explorer ──────────────────────────────────────
const DipExplorer = (() => {
  const pairings = {
    'chocolate': ['classic-cinnamon', 'churro-bites', 'chocolate-filled'],
    'caramel': ['classic-cinnamon', 'caramel-twist', 'churro-bites'],
    'strawberry': ['strawberry-cream', 'vanilla-custard', 'churro-bites'],
    'white-chocolate': ['vanilla-custard', 'cookies-cream', 'pistachio'],
    'nutella': ['chocolate-filled', 'churro-bites', 'classic-cinnamon'],
  };

  function highlight(dip) {
    const matched = pairings[dip] || [];

    $$('[data-churro-id]').forEach(el => {
      const id = el.dataset.churroId;
      el.classList.toggle('pairing-match', matched.includes(id));
      el.classList.toggle('pairing-dim', dip && !matched.includes(id));
    });

    $$('[data-dip-id]').forEach(el => {
      el.classList.toggle('pairing-active', el.dataset.dipId === dip);
    });
  }

  function init() {
    $$('[data-dip-id]').forEach(el => {
      el.addEventListener('click', () => {
        const dip = el.dataset.dipId;
        const isActive = el.classList.contains('pairing-active');
        highlight(isActive ? '' : dip);
      });
    });
  }

  return { init };
})();

// ── Flavor Finder Quiz ────────────────────────────────────────
const FlavorFinder = (() => {
  const quiz = [
    {
      q: "What's your flavor vibe?",
      options: [
        { icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="10" y="5" width="20" height="30" rx="3"/><path d="M10 15h20M10 25h20M20 5v30"/></svg>', label: 'Cocoa', key: 'choc' },
        { icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4S9 17 9 25a11 11 0 0 0 22 0C31 17 20 4 20 4Z"/><path d="M14 26c1.2 3.2 3.2 4.8 6 5"/></svg>', label: 'Caramel', key: 'caramel' },
        { icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 12c8-5 14 1 12 9-2 8-8 14-12 15-4-1-10-7-12-15-2-8 4-14 12-9Z"/><path d="M14 12c1-4 4-6 6-7 2 1 5 3 6 7M13 8c3 0 5 1 7 4M27 8c-3 0-5 1-7 4"/><path d="M15 20h.01M24 19h.01M20 27h.01"/></svg>', label: 'Fruity', key: 'fruity' },
        { icon: '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="m17 4 2.6 8.4L28 15l-8.4 2.6L17 26l-2.6-8.4L6 15l8.4-2.6L17 4Z"/><path d="m30 23 1.5 4.5L36 29l-4.5 1.5L30 35l-1.5-4.5L24 29l4.5-1.5L30 23Z"/></svg>', label: 'Classic', key: 'classic' },
      ]
    },
    {
      q: "How do you like your churro?",
      options: [
        { icon: '🔥', label: 'Crispy outside', key: 'crispy' },
        { icon: '💝', label: 'Filled', key: 'filled' },
        { icon: '🍦', label: 'With ice cream', key: 'sundae' },
        { icon: '🍡', label: 'Bite-sized', key: 'bites' },
      ]
    },
    {
      q: "Perfect occasion?",
      options: [
        { icon: '👫', label: 'Sharing', key: 'sharing' },
        { icon: '🎉', label: 'Celebrating', key: 'celebrate' },
        { icon: '🛋️', label: 'Solo treat', key: 'solo' },
        { icon: '🏃', label: 'On-the-go', key: 'go' },
      ]
    }
  ];

  const recommendations = {
    'choc-filled': 'Chocolate Filled Churro',
    'choc-sundae': 'Churro Sundae',
    'caramel-crispy': 'Salted Caramel Twist',
    'classic-crispy': 'Classic Cinnamon Sugar',
    'fruity-filled': 'Strawberry Cream Churro',
    'default': 'Classic Cinnamon Sugar Churro',
  };

  let answers = [];
  let step = 0;

  function getRecommendation() {
    const key = `${answers[0]}-${answers[1]}`;
    return recommendations[key] || recommendations.default;
  }

  function render() {
    const container = $('#flavor-finder-quiz');
    if (!container) return;

    if (step >= quiz.length) {
      const rec = getRecommendation();
      container.innerHTML = `
        <div style="text-align:center;padding:2rem 1rem;">
          <div style="font-size:2.5rem;margin-bottom:1rem;">✨</div>
          <h3 style="margin-bottom:0.5rem;">Your Perfect Match</h3>
          <p style="color:var(--accent);font-weight:700;font-size:1.2rem;margin-bottom:1.5rem;">${rec}</p>
          <p style="margin-bottom:2rem;color:var(--text-muted);max-width:40ch;margin-left:auto;margin-right:auto;">
            Based on your preferences, we think you'll absolutely love this! Visit us to try it fresh.
          </p>
          <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
            <a href="menu.html" class="btn btn-primary">See on Menu <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            <button class="btn btn-secondary" onclick="FlavorFinder.reset()">Try Again</button>
          </div>
        </div>`;
      return;
    }

    const q = quiz[step];
    const dots = quiz.map((_, i) =>
      `<div class="finder-progress-dot ${i < step ? 'done' : i === step ? 'active' : ''}"></div>`
    ).join('');

    container.innerHTML = `
      <div class="finder-progress">${dots}</div>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.5rem;">Question ${step + 1} of ${quiz.length}</p>
      <h4 style="margin-bottom:1.5rem;">${q.q}</h4>
      <div class="finder-options">
        ${q.options.map(opt => `
          <div class="finder-option" data-key="${opt.key}" role="button" tabindex="0" aria-label="${opt.label}">
            <span class="finder-option-icon">${opt.icon}</span>
            <span class="finder-option-name">${opt.label}</span>
          </div>`).join('')}
      </div>`;

    $$('.finder-option', container).forEach(opt => {
      const select = () => {
        answers[step] = opt.dataset.key;
        step++;
        render();
      };
      opt.addEventListener('click', select);
      opt.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }});
    });
  }

  function reset() {
    answers = [];
    step = 0;
    render();
  }

  function init() { render(); }

  window.FlavorFinder = { reset };

  return { init, reset };
})();

// ── Event Builder ─────────────────────────────────────────────
const EventBuilder = (() => {
  let selections = { type: '', guests: '', service: '' };

  function updateEnquiryLink() {
    const link = $('#event-enquiry-link');
    if (!link) return;
    const params = new URLSearchParams();
    if (selections.type) params.set('type', selections.type);
    if (selections.guests) params.set('guests', selections.guests);
    link.href = `events.html?${params}#event-enquiry`;
  }

  function init() {
    $$('.builder-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const group = opt.dataset.group;
        $$(`.builder-option[data-group="${group}"]`).forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selections[group] = opt.dataset.value;
        updateEnquiryLink();
      });
    });
  }

  return { init };
})();

// ── Event Enquiry Form ────────────────────────────────────────
const EventForm = (() => {
  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;
    const error = group.querySelector('.form-error');
    let valid = true;
    let msg = '';

    if (input.hasAttribute('required') && !input.value.trim()) {
      valid = false;
      msg = 'This field is required.';
    } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      valid = false;
      msg = 'Please enter a valid email address.';
    } else if (input.type === 'tel' && input.value && !/^[\d\s\+\-\(\)]{7,}$/.test(input.value)) {
      valid = false;
      msg = 'Please enter a valid phone number.';
    }

    group.classList.toggle('has-error', !valid);
    input.classList.toggle('error', !valid);
    if (error) error.textContent = msg;
    return valid;
  }

  function validateForm(form) {
    const fields = $$('input[required], select[required], textarea[required]', form);
    return fields.map(f => validateField(f)).every(Boolean);
  }

  function init() {
    $$('form[data-validate]').forEach(form => {
      // Live validation
      $$('input, select, textarea', form).forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.closest('.form-group')?.classList.contains('has-error')) {
            validateField(field);
          }
        });
      });

      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!validateForm(form)) return;

        const btn = form.querySelector('[type="submit"]');
        btn.classList.add('loading');
        btn.disabled = true;

        // Simulate submission
        setTimeout(() => {
          btn.classList.remove('loading');
          btn.disabled = false;
          const success = form.nextElementSibling;
          if (success?.classList.contains('form-success')) {
            form.style.display = 'none';
            success.classList.add('show');
          } else {
            form.innerHTML = `
              <div class="form-success show">
                <div class="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3>Enquiry Received!</h3>
                <p>Thank you for reaching out. Our team will review your request and get back to you within 24–48 hours.</p>
              </div>`;
          }
        }, 1600);
      });
    });
  }

  return { init };
})();

// ── Newsletter ────────────────────────────────────────────────
const Newsletter = (() => {
  function init() {
    $$('.newsletter-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button');
        if (!input || !input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          input?.focus();
          return;
        }
        btn.textContent = 'Subscribed!';
        btn.style.background = '#27AE60';
        input.value = '';
        setTimeout(() => {
          btn.textContent = 'Subscribe';
          btn.style.background = '';
        }, 3000);
      });
    });
  }
  return { init };
})();

// ── Smooth anchor scroll ──────────────────────────────────────
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.getElementById(anchor.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    const headerH = $('.site-header')?.offsetHeight || 80;
    window.scrollTo({ top: target.offsetTop - headerH - 16, behavior: 'smooth' });
  });
}

// ── Back to Top ───────────────────────────────────────────────
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Location Search ───────────────────────────────────────────
function initLocationSearch() {
  const input = $('#location-search');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    $$('.location-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = !q || text.includes(q) ? '' : 'none';
    });
    const grid = $('.location-grid');
    const visible = grid ? $$('.location-card', grid).filter(c => c.style.display !== 'none').length : 0;
    const noRes = $('.location-no-results');
    if (noRes) noRes.style.display = visible === 0 ? 'block' : 'none';
  });
}

// ── Image lazy load ───────────────────────────────────────────
function initLazyImages() {
  if (!window.IntersectionObserver) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  $$('img[data-src]').forEach(img => obs.observe(img));
}

function initStatCounters() {
  const numbers = $$('.event-stat-number');
  if (!numbers.length) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const render = (element, value, complete = false) => {
    element.textContent = `${value}${element.dataset.suffix || ''}`;
    if (complete && element.dataset.iconSuffix) {
      element.insertAdjacentHTML('beforeend', IconSystem.svg(element.dataset.iconSuffix));
    }
  };

  const animate = element => {
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';
    const target = Number(element.dataset.count || 0);
    if (reduced) return render(element, target, true);
    const start = performance.now();
    const duration = 1400;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      render(element, Math.round(target * eased), progress === 1);
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    render(element, 0);
    window.requestAnimationFrame(tick);
  };

  if (!('IntersectionObserver' in window)) return numbers.forEach(animate);
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animate(entry.target);
    observer.unobserve(entry.target);
  }), { threshold: 0.35 });
  numbers.forEach(number => observer.observe(number));
}

// Add the extended social set to the shared footer without duplicating markup.
function initFooterSocials() {
  $$('.brand-sub, .footer-tagline').forEach(tagline => {
    tagline.textContent = 'Twist. Dip. Delight.';
  });

  let social = $('.footer-social');
  if (!social) {
    const footerDescription = $('.footer-brand p');
    if (!footerDescription) return;
    social = document.createElement('div');
    social.className = 'footer-social';
    footerDescription.insertAdjacentElement('afterend', social);
  }

  const networks = [
    {
      label: 'Instagram',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r="1" fill="currentColor"/></svg>'
    },
    {
      label: 'TikTok',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>'
    },
    {
      label: 'Facebook',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.438H7.078v-3.489h3.047V9.413c0-3.024 1.792-4.693 4.533-4.693 1.312 0 2.686.235 2.686.235v2.972h-1.513c-1.491 0-1.956.93-1.956 1.886v2.26h3.328l-.532 3.489h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>'
    },
    {
      label: 'YouTube',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.5 3.57 12 3.57 12 3.57s-7.5 0-9.4.51A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12c1.9.51 9.4.51 9.4.51s7.5 0 9.4-.51a3 3 0 0 0 2.1-2.12A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.26 3.6-6.26 3.6z"/></svg>'
    }
  ];

  networks.forEach(({ label, svg }) => {
    const existingLink = social.querySelector(`[aria-label="${label}"]`);
    if (existingLink) {
      existingLink.innerHTML = svg;
      return;
    }
    const link = document.createElement('a');
    link.href = '#';
    link.className = 'social-btn';
    link.setAttribute('aria-label', label);
    link.innerHTML = svg;
    social.appendChild(link);
  });
}

// ── Dip Pairing Styles (injected) ────────────────────────────
function injectDipStyles() {
  const style = document.createElement('style');
  style.textContent = `
    [data-churro-id] { transition: opacity 0.3s ease, transform 0.3s ease; }
    [data-churro-id].pairing-match { outline: 2px solid var(--caramel); outline-offset: 3px; transform: scale(1.02); }
    [data-churro-id].pairing-dim { opacity: 0.4; }
    [data-dip-id] { cursor: pointer; transition: all 0.3s ease; }
    [data-dip-id].pairing-active { border-color: var(--caramel); box-shadow: 0 0 0 3px rgba(200,121,50,.25); }
    #back-to-top {
      position: fixed; bottom: 2rem; right: 2rem;
      width: 44px; height: 44px;
      background: var(--caramel); color: white;
      border: none; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 999;
      opacity: 0; transform: translateY(16px);
      transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease;
      box-shadow: 0 4px 16px rgba(200,121,50,.4);
    }
    #back-to-top.visible { opacity: 1; transform: translateY(0); }
    #back-to-top:hover { background: var(--caramel-dark); }
    #back-to-top svg { width: 20px; height: 20px; }
  `;
  document.head.appendChild(style);
}

// ── Shared footer ─────────────────────────────────────────────
function initSharedFooter() {
  let footer = document.querySelector('.site-footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.setAttribute('role', 'contentinfo');
    document.body.appendChild(footer);
  }

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="footer-logo">
            <div class="footer-logo-icon"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm0 2c5.52 0 10 4.48 10 10S21.52 26 16 26 6 21.52 6 16 10.48 6 16 6zm-1 3v2.28A5.01 5.01 0 0 0 11 16a5 5 0 0 0 5 5 5 5 0 0 0 5-5 5.01 5.01 0 0 0-4-4.9V9h-2zm1 4a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3z"/></svg></div>
            <div><div class="footer-brand-name">CHURROVA</div><span class="footer-tagline">Twist. Dip. Delight.</span></div>
          </a>
          <p>London's favourite freshly fried churro bar. Made with quality ingredients, served with passion. Every bite is golden.</p>
          <div class="footer-social">
            <a href="#" class="social-btn" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="#" class="social-btn" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg></a>
            <a href="#" class="social-btn" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          </div>
        </div>
        <div><div class="footer-col-title">Menu</div><ul class="footer-links"><li><a href="menu.html">Classic Churros</a></li><li><a href="menu.html">Filled Churros</a></li><li><a href="menu.html">Churro Bites</a></li><li><a href="menu.html">Churro Sundaes</a></li><li><a href="menu.html">Signature Dips</a></li></ul></div>
        <div>
          <div class="footer-col-title">Company</div><ul class="footer-links"><li><a href="about.html">Our Story</a></li><li><a href="flavors.html">Signature Flavors</a></li><li><a href="events.html">Events &amp; Festivals</a></li><li><a href="locations.html">Locations</a></li><li><a href="contact.html">Contact Us</a></li></ul>
          <div class="footer-col-title" style="margin-top:1.5rem;">Opening Hours</div><div class="hours-list"><div class="hours-item"><span class="day">Mon–Fri</span><span>11am – 10pm</span></div><div class="hours-item"><span class="day">Saturday</span><span>10am – 11pm</span></div><div class="hours-item"><span class="day">Sunday</span><span>10am – 9pm</span></div></div>
        </div>
        <div>
          <div class="footer-col-title">Contact</div><ul class="footer-links footer-contact-links">
            <li><a href="tel:+442012345678"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/></svg><span>+44 (0)20 1234 5678</span></a></li>
            <li><a href="mailto:hello@churrova.co.uk"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><span>hello@churrova.co.uk</span></a></li>
            <li><a href="locations.html"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>12 Wardour St, W1D</span></a></li>
            <li><a href="contact.html"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>General Enquiries</span></a></li>
            <li><a href="events.html"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2v4M16 2v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2Z"/><path d="M8 13h3v3H8z"/></svg><span>Event Enquiries</span></a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom"><p class="footer-copyright">&copy; 2026 CHURROVA Churro &amp; Fried Dessert Co. All rights reserved.</p><nav class="footer-legal" aria-label="Legal"><a href="#">Privacy Policy</a><a href="#">Terms of Use</a><a href="#">Allergen Info</a><a href="#">Cookies</a></nav></div>
    </div>`;
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSharedFooter();
  IconSystem.init();
  initBrandLockups();
  initThemeLogos();
  Theme.init();
  RTL.init();
  Header.init();
  Drawer.init();
  Reveal.init();
  FreshStrip.init();
  FlavorRail.init();
  MenuFilter.init();
  FAQ.init();
  DipExplorer.init();
  FlavorFinder.init();
  EventBuilder.init();
  EventForm.init();
  initSmoothScroll();
  initBackToTop();
  initLocationSearch();
  initLazyImages();
  initStatCounters();
  initFooterSocials();
  injectDipStyles();

  // Theme toggle buttons
  $$('[data-action="toggle-theme"]').forEach(btn => {
    btn.addEventListener('click', () => Theme.toggle());
  });

  // RTL toggle buttons
  $$('[data-action="toggle-rtl"]').forEach(btn => {
    btn.addEventListener('click', () => RTL.toggle());
  });

  // Add back to top button
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
  document.body.appendChild(btt);
  initBackToTop();
});
