/* ================================================================
   DakulTech Portfolio — script.js
   Handles: Projects rendering (home + projects page), tabs, 
            mobile menu, footer date, newsletter
   ================================================================ */

// ── Project Data ───────────────────────────────────────────────
// category values must match tab data-filter:
//   "mobile" | "webapp" | "website" | "backend"

const ALL_PROJECTS = [
  {
    title:    "Kago Wallet",
    tagline:  "A delivery app connecting users, vendors and riders in real time.",
    desc:     "A full-stack delivery platform with three distinct roles — customers browse and order from vendors, riders get assigned deliveries and track routes, and vendors manage their menus and incoming orders. Built with React Native on the frontend and a Golang + PostgreSQL backend, with Firebase for real-time order tracking and AWS for cloud infrastructure.",
    stack:    ["React Native", "TypeScript", "Golang", "PostgreSQL", "Firebase", "AWS"],
    category: "mobile",
    categoryLabel: "Mobile App",
    year:     "2026",
    github:   "https://github.com/DakulTech/kagoWallet",
    live:     "https://kago-wallet.vercel.app/",
    image:    "assets/projects/kago.jpg",
    featured: true
  },
  {
    title:    "PorSaaS",
    tagline:  "All-in-one school management platform trusted by 500+ schools.",
    desc:     "A comprehensive SaaS platform streamlining academic operations — from student enrolment to grading and attendance. Built with React-Vite, Node.js, PostgreSQL and Prisma, deployed on cloud infrastructure.",
    stack:    ["React Vite", "Node.js", "PostgreSQL", "Prisma", "Express", "Supabase", "Firebase"],
    category: "webapp",
    categoryLabel: "Web App",
    year:     "2025",
    github:   "https://github.com/DakulTech",
    live:     "https://www.porsaas.space/",
    image:    "assets/projects/porsaas.png",
    featured: true
  },
  {
    title:    "SereneSuites",
    tagline:  "Luxury hotel booking experience for Nigerian travellers.",
    desc:     "A full-stack hotel discovery and booking platform with destination search, check-in/out scheduling, and user authentication. Features a cinematic hero UI and clean booking flow built with React-Vite and MongoDB.",
    stack:    ["React Vite", "Node.js", "MongoDB", "Clerk Auth", "Express"],
    category: "webapp",
    categoryLabel: "Web App",
    year:     "2023",
    github:   "https://github.com/DakulTech",
    live:     "https://serene-suites.vercel.app/",
    image:    "assets/projects/project2.png",
    featured: true
  },
  {
    title:    "Dakul Delights",
    tagline:  "Food ordering app with web and mobile experience.",
    desc:     "An end-to-end food ordering platform with a React web dashboard and React Native mobile app. Users can browse restaurants, track orders in real time, and pay securely — all backed by a Node.js/MongoDB MERN stack.",
    stack:    ["React", "React Native", "Node.js", "MongoDB", "Express"],
    category: "mobile",
    categoryLabel: "Mobile App",
    year:     "2024",
    github:   "https://github.com/DakulTech",
    live:     "https://dakul-delights.com.ng/",
    apk:      "https://docs.google.com/uc?export=download&id=1HPgSQnwCJf9WsQtzuDX4cFzytvZ585UF",
    image:    "assets/projects/dakul-delights.png",
    featured: false
  },
  {
    title:    "School Portal",
    tagline:  "Student & teacher management portal for modern schools.",
    desc:     "A role-based school portal enabling teachers to manage classes, upload resources and track student performance, while students access results and timetables. Image uploads handled via Cloudinary.",
    stack:    ["React.js", "Node.js", "Express.js", "MongoDB", "Cloudinary"],
    category: "webapp",
    categoryLabel: "Web App",
    year:     "2023",
    github:   "https://github.com/DakulTech",
    live:     "https://raodotulirfaan.vercel.app/",
    image:    "assets/projects/project3.png",
    featured: false
  },
  {
    title:    "CodeWithMe",
    tagline:  "Real-time collaborative code editor for developers.",
    desc:     "A collaborative coding environment where developers can share rooms, write code together in real time, and learn side by side. Built with React, Firebase Realtime Database, and SCSS.",
    stack:    ["React", "Firebase", "SCSS"],
    category: "webapp",
    categoryLabel: "Web App",
    year:     "2022",
    github:   "https://github.com/DakulTech/codeWithMe",
    live:     "https://code-with-me-nine.vercel.app/",
    image:    "assets/projects/8.png",
    featured: false
  },
  {
    title:    "TaCoin",
    tagline:  "Web3 crypto dashboard built with Vue.js.",
    desc:     "A lightweight cryptocurrency tracking and portfolio dashboard built with Vue.js. Connects to live price feeds and presents clean data visualisations for Web3 enthusiasts.",
    stack:    ["Vue.js", "Node.js", "CSS"],
    category: "webapp",
    categoryLabel: "Web3 App",
    year:     "2021",
    github:   "https://github.com/DakulTech",
    live:     "https://vue-playground-dakul.netlify.app",
    image:    "assets/projects/9.png",
    featured: false
  },
  {
    title:    "Waste2Wealth",
    tagline:  "Platform connecting recyclers with waste collection agents.",
    desc:     "A sustainability-focused SaaS that connects households and businesses with certified recyclers. Users schedule pickups, track collection history and earn credits — built with Next.js, Tailwind and MongoDB.",
    stack:    ["Next.js", "Tailwind CSS", "MongoDB"],
    category: "webapp",
    categoryLabel: "Web App",
    year:     "2021",
    github:   "https://github.com/DakulTech",
    live:     "https://next-dakul-project.vercel.app",
    image:    "assets/projects/project7.png",
    featured: false
  },
  {
    title:    "Pelz Secret",
    tagline:  "Full-stack e-commerce store with admin dashboard.",
    desc:     "A custom e-commerce storefront with product management, cart, checkout, and an admin dashboard for inventory control. Media assets managed through Cloudinary, backend powered by Node.js and MongoDB.",
    stack:    ["HTML5", "JavaScript", "CSS", "Node.js", "Express", "MongoDB", "Cloudinary"],
    category: "website",
    categoryLabel: "Website",
    year:     "2024",
    github:   "https://github.com/DakulTech",
    live:     "https://pelzsecret.com.ng/",
    image:    "assets/projects/project4.png",
    featured: false
  },
  {
    title:    "De-embeez",
    tagline:  "Stylish jewellery brand website with smooth animations.",
    desc:     "A beautifully crafted jewellery brand website with smooth scroll animations, product showcases and a fully responsive layout — built with vanilla HTML, JavaScript and SASS.",
    stack:    ["HTML5", "JavaScript", "SASS"],
    category: "website",
    categoryLabel: "Website",
    year:     "2022",
    github:   "https://github.com/DakulTech",
    live:     "https://de-embeez.netlify.app/index.html#",
    image:    "assets/projects/project5.png",
    featured: false
  },
  {
    title:    "TeeHub",
    tagline:  "Modern clothing brand landing page.",
    desc:     "A clean, conversion-focused landing page for a streetwear brand. Designed with a bold typographic style, product grid and responsive layout — crafted with HTML5 and SASS.",
    stack:    ["HTML5", "SASS"],
    category: "website",
    categoryLabel: "Website",
    year:     "2021",
    github:   "https://github.com/DakulTech",
    live:     "https://dakultech.github.io/TeeHub-Home/",
    image:    "assets/projects/project6.png",
    featured: false
  }
];


// ── Helpers ────────────────────────────────────────────────────

/** Build stack tag pills HTML */
function stackTags(stack) {
  return stack.map(s =>
    `<span class="stack-tag">${s}</span>`
  ).join('');
}

/** Build the links row */
function projectLinks(project, context) {
  let html = '';
  if (project.live) {
    html += `<a href="${project.live}" target="_blank" rel="noopener" class="project-link">
               View Live <i class="fas fa-arrow-right"></i>
             </a>`;
  }
  if (project.github) {
    html += `<a href="${project.github}" target="_blank" rel="noopener" class="project-link secondary">
               GitHub <i class="fab fa-github"></i>
             </a>`;
  }
  if (project.apk) {
    html += `<a href="${project.apk}" target="_blank" rel="noopener" class="project-link secondary">
               Download APK <i class="fas fa-download"></i>
             </a>`;
  }
  return html;
}

/** Create a project card element */
function createCard(project, context = 'home') {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.dataset.category = project.category;

  const imgHtml = project.image
    ? `<img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />`
    : `<div class="project-img-placeholder"><span>${project.title.charAt(0)}</span></div>`;

  // Projects page gets an extended description + full stack
  const extraInfo = context === 'projects'
    ? `<p class="project-desc">${project.desc}</p>
       <div class="project-stack">${stackTags(project.stack)}</div>`
    : `<p class="project-desc">${project.tagline}</p>
       <div class="project-stack">${stackTags(project.stack.slice(0, 3))}${project.stack.length > 3 ? `<span class="stack-tag muted">+${project.stack.length - 3} more</span>` : ''}</div>`;

  card.innerHTML = `
    <div class="project-img-wrap" data-year="${project.year}">
      ${imgHtml}
    </div>
    <div class="project-info">
      <p class="project-tag">${project.categoryLabel}</p>
      <h3 class="project-name">${project.title}</h3>
      ${extraInfo}
      <div class="project-links">
        ${projectLinks(project, context)}
      </div>
    </div>
  `;
  return card;
}


// ── Home Page — render featured projects + power tabs ──────────
function initHomePage() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  // Only show featured on home by default (first 6 total)
  const homeProjects = ALL_PROJECTS.slice(0, 6);

  // Clear static placeholder cards
  grid.innerHTML = '';

  homeProjects.forEach(p => grid.appendChild(createCard(p, 'home')));

  // Now init tabs (counts + filtering)
  initTabs(grid, ALL_PROJECTS.slice(0, 6));
}


// ── Projects Page — render all projects + power tabs ──────────
function initProjectsPage() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';
  ALL_PROJECTS.forEach(p => grid.appendChild(createCard(p, 'projects')));

  initTabs(grid, ALL_PROJECTS);

  // Hide "View All" button — already on projects page
  const showMore = document.getElementById('show-more');
  if (showMore) showMore.style.display = 'none';

  const footer = document.querySelector('.projects-footer');
  if (footer) footer.style.display = 'none';
}


// ── Build & Init Tabs from data ────────────────────────────────
function buildTabs(tabsContainer, projects) {
  if (!tabsContainer) return;

  // Derive unique categories in the order they appear in the data
  const seen = new Set();
  const categories = [{ key: 'all', label: 'All' }];
  projects.forEach(p => {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      categories.push({ key: p.category, label: p.categoryLabel });
    }
  });

  // Render tab buttons
  tabsContainer.innerHTML = categories.map((cat, i) => {
    const count = cat.key === 'all'
      ? projects.length
      : projects.filter(p => p.category === cat.key).length;
    const active = i === 0 ? 'active' : '';
    const selected = i === 0 ? 'true' : 'false';
    return `
      <button
        class="tab-btn ${active}"
        data-filter="${cat.key}"
        role="tab"
        aria-selected="${selected}"
      >
        ${cat.label}
        <span class="tab-count">${count}</span>
      </button>`;
  }).join('');
}

function initTabs(grid, projects) {
  const tabsContainer = document.getElementById('project-tabs');
  buildTabs(tabsContainer, projects);

  const tabs  = document.querySelectorAll('.tab-btn');
  const cards = grid.querySelectorAll('.project-card');

  setFirstCardSpan(cards);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const visible = [];
      cards.forEach(card => {
        card.style.gridColumn = '';
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.classList.remove('hidden');
          card.classList.add('fade-enter');
          visible.push(card);
        } else {
          card.classList.add('hidden');
        }
      });

      visible.forEach((card, i) => {
        setTimeout(() => card.classList.remove('fade-enter'), 20 + i * 55);
      });

      if (visible.length) visible[0].style.gridColumn = '1 / -1';
    });
  });
}

function setFirstCardSpan(cards) {
  const visible = [...cards].filter(c => !c.classList.contains('hidden'));
  if (visible.length) visible[0].style.gridColumn = '1 / -1';
}


// ── Footer Date ────────────────────────────────────────────────
function initFooterDate() {
  const el = document.getElementById('datee');
  if (el) el.textContent = new Date().getFullYear();
}


// ── Mobile Menu ────────────────────────────────────────────────
function toggleMobile() {
  document.getElementById('mobileMenu')?.classList.toggle('open');
}
function closeMobile() {
  document.getElementById('mobileMenu')?.classList.remove('open');
}


// ── Profile Modal ──────────────────────────────────────────────
function toggleProfileModal() {
  const modal    = document.getElementById('profileModal');
  const backdrop = document.getElementById('profileBackdrop');
  const btn      = document.getElementById('avatarBtn');
  if (!modal) return;
  const isOpen = modal.classList.contains('open');
  if (isOpen) {
    closeProfileModal();
  } else {
    modal.classList.add('open');
    backdrop?.classList.add('open');
    btn?.setAttribute('aria-expanded', 'true');
  }
}
function closeProfileModal() {
  document.getElementById('profileModal')?.classList.remove('open');
  document.getElementById('profileBackdrop')?.classList.remove('open');
  document.getElementById('avatarBtn')?.setAttribute('aria-expanded', 'false');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProfileModal();
});


// ── Newsletter ─────────────────────────────────────────────────
function handleSubscribe() {
  const input   = document.getElementById('newsletter-email');
  const row     = document.getElementById('newsletterRow');
  const success = document.getElementById('newsletterSuccess');
  if (!input) return;

  const email = input.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!valid) {
    row.style.borderColor = '#e05a5a';
    input.focus();
    setTimeout(() => row.style.borderColor = '', 1800);
    return;
  }

  row.style.display = 'none';
  success?.classList.add('show');
  // 👉 Hook your email API here (Mailchimp, ConvertKit, etc.)
}


// ── Stack tag styles (injected so script.js is self-contained) ─
(function injectStackStyles() {
  if (document.getElementById('dakul-stack-styles')) return;
  const style = document.createElement('style');
  style.id = 'dakul-stack-styles';
  style.textContent = `
    .project-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 1.2rem;
    }
    .stack-tag {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
      color: var(--ink-dim, #555550);
      background: var(--cream, #F2EDE4);
      border: 1px solid var(--border, #D8D2C8);
      padding: 3px 9px;
      border-radius: 20px;
      white-space: nowrap;
    }
    .stack-tag.muted {
      background: transparent;
      color: var(--accent, #C8B89A);
      border-color: var(--accent, #C8B89A);
    }
  `;
  document.head.appendChild(style);
})();


// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFooterDate();

  // Detect page by data-page attribute on <body>
  // Add  data-page="projects"  to <body> in projects.html
  // Add  data-page="home"      to <body> in index.html
  const page = document.body.dataset.page;

  if (page === 'projects') initProjectsPage();
  else                     initHomePage();       // default = home
});