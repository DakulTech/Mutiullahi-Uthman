/* ================================================================
   DakulTech Portfolio — script.js
   Handles: Projects rendering (home + projects page), tabs,
            case study modal, mobile menu, footer date, newsletter
   ================================================================ */

// ── Project Data ───────────────────────────────────────────────
const ALL_PROJECTS = [
  {
    title:         "Know Your Tenant",
    tagline:       "Distributed backend for trusted rental verification and tenant onboarding.",
    desc:          "A proptech platform that brings together landlords, agents, and tenants through a secure verification flow backed by a distributed Go backend, PostgreSQL for durable data storage, Redis for caching and session control, and event-driven messaging for onboarding, rent reminders, and identity checks.",
    stack:         ["ReactJS","Go", "PostgreSQL", "Redis", "NATS", "Docker", "Twilio", "JWT", "REST API"],
    category:      "webapp",
    categoryLabel: "SaaS / PropTech",
    year:          "2026",
    github:        "https://github.com/DakulTech/kyt-backend",
    live:          "https://know-your-tenant.vercel.app",
    image:         "assets/projects/kyt-og-image.png",
    featured:      true,
    caseStudy: {
      problem:  "The rental market lacked a reliable way to verify identities, protect landlords from fraud, and give genuine tenants a portable record of trust. Every onboarding flow was manual, fragmented, and difficult to scale across landlords, agents, and tenants.",
      solution: "Know Your Tenant (KYT) uses a distributed backend written in Go with separate services for API handling, verification, notifications, and rent scheduling. PostgreSQL stores the core records, Redis accelerates sessions and idempotency, and NATS coordinates asynchronous events such as rent alerts and verification workflows. The system is designed for secure onboarding, auditability, and production-ready deployment.",
      outcome:  "The platform creates a verifiable trust layer for rentals, reduces friction in tenant screening, and provides a strong foundation for future growth with queue-based processing, scaling-friendly services, and resilient background jobs."
    }
  },
  {
    title:         "Kago Wallet",
    tagline:       "A delivery app connecting users, vendors, and riders in real time.",
    desc:          "A full-stack delivery platform with three distinct roles — customers browse and order from vendors, riders get assigned deliveries and track routes, and vendors manage menus and incoming orders. Built with React Native on the frontend and a Golang + PostgreSQL backend, with Firebase for real-time tracking and AWS for cloud infrastructure.",
    stack:         ["React Native", "TypeScript", "Golang", "PostgreSQL", "Firebase", "AWS"],
    category:      "mobile",
    categoryLabel: "Mobile App",
    year:          "2025",
    github:        "https://github.com/DakulTech/kagoWallet",
    live:          "https://kago-wallet.vercel.app/",
    image:         "assets/projects/kago.jpg",
    featured:      true,
    caseStudy: {
      problem:  "Local delivery operations in Nigeria are chaotic — vendors receive orders on WhatsApp, riders are dispatched by phone calls, and customers have zero visibility into where their package is. No single platform connected all three parties with real-time awareness.",
      solution: "Kago Wallet is a three-sided marketplace with separate role-based apps for customers, vendors, and riders. Customers browse, order, and pay. Vendors get instant order notifications and manage their own menus. Riders receive optimised delivery assignments and live route tracking — all synced in real time through Firebase. The Golang backend handles the business logic at scale, and PostgreSQL keeps financial records clean.",
      outcome:  "Eliminates the coordination overhead between vendors and riders, gives customers live ETAs, and creates an auditable transaction record for every delivery — replacing fragmented WhatsApp threads with one reliable platform."
    }
  },
  {
    title:         "PorSaaS",
    tagline:       "All-in-one school management platform trusted by 500+ schools.",
    desc:          "A comprehensive SaaS platform streamlining academic operations — from student enrolment to grading and attendance. Built with React-Vite, Node.js, PostgreSQL and Prisma, deployed on cloud infrastructure.",
    stack:         ["React Vite", "Node.js", "PostgreSQL", "Prisma", "Express", "Supabase", "Firebase"],
    category:      "webapp",
    categoryLabel: "Web App / SaaS",
    year:          "2024",
    github:        "https://github.com/DakulTech",
    live:          "https://www.porsaas.space/",
    image:         "assets/projects/porsaas_enhanced.png",
    featured:      true,
    caseStudy: {
      problem:  "Schools in Nigeria operate across a patchwork of disconnected tools — WhatsApp for announcements, Excel sheets for attendance, paper ledgers for fees, and email for report cards. Administrators spend more time chasing data than running the school. Teachers lose track of grades. Parents are always the last to know.",
      solution: "PorSaaS centralises every academic operation in one role-based dashboard. Admins manage enrolments, fees, and staff. Teachers record attendance and publish results. Students access timetables and download result slips. Parents get real-time notifications. Built with React-Vite for a fast frontend, Node.js + Prisma + PostgreSQL for a reliable data layer, and Supabase for auth and storage.",
      outcome:  "Over 500 schools onboarded. Administrators report cutting weekly admin time by more than half. Result publication dropped from days to minutes. A single source of truth — for every stakeholder."
    }
  },
  {
    title:         "SereneSuites",
    tagline:       "Luxury hotel booking experience for Nigerian travellers.",
    desc:          "A full-stack hotel discovery and booking platform with destination search, check-in/out scheduling, and user authentication. Features a cinematic hero UI and clean booking flow built with React-Vite and MongoDB.",
    stack:         ["React Vite", "Node.js", "MongoDB", "Clerk Auth", "Express"],
    category:      "webapp",
    categoryLabel: "Web App",
    year:          "2024",
    github:        "https://github.com/DakulTech",
    live:          "https://serene-suites.vercel.app/",
    image:         "assets/projects/serenesuites_enhanced.png",
    featured:      true,
    caseStudy: {
      problem:  "Nigeria's hotel booking market is fragmented. Most independent properties rely on phone calls, Instagram DMs, and informal agreements. Guests have no digital paper trail, no cancellation policy, and no way to compare properties. Smaller hotels lose out to platforms that take steep commissions while doing little for local discovery.",
      solution: "SereneSuites is a full-stack booking platform tailored to the Nigerian market. Guests search by destination, browse curated listings with cinematic photography, select check-in and check-out dates, and complete a secure booking — all within minutes. Clerk Auth handles identity, MongoDB powers flexible property data, and the Node.js/Express API keeps bookings and availability in sync.",
      outcome:  "Brings the luxury booking experience global platforms offer to independent Nigerian hospitality businesses. Hotels get a clean digital storefront. Guests get trust, transparency, and a seamless mobile-first experience."
    }
  },
  {
    title:         "Dakul Delights",
    tagline:       "Food ordering app with web and mobile experience.",
    desc:          "An end-to-end food ordering platform with a React web dashboard and React Native mobile app. Users browse restaurants, track orders in real time, and pay securely — all backed by a Node.js/MongoDB MERN stack.",
    stack:         ["React", "React Native", "Node.js", "MongoDB", "Express"],
    category:      "mobile",
    categoryLabel: "Mobile App",
    year:          "2023",
    github:        "https://github.com/DakulTech",
    live:          "https://dakul-delights.com.ng/",
    apk:           "https://docs.google.com/uc?export=download&id=1HPgSQnwCJf9WsQtzuDX4cFzytvZ585UF",
    image:         "assets/projects/dakul-delights.png",
    featured:      false,
    caseStudy: {
      problem:  "Local food vendors and restaurants in Nigeria handle orders through WhatsApp messages and phone calls — a system that loses context, misses orders, offers no tracking, and makes scaling impossible. Customers have no way to browse menus, estimate delivery times, or pay digitally.",
      solution: "Dakul Delights is a dual-platform food ordering solution: a React web app and a React Native mobile app that share the same MERN backend. Customers browse restaurant menus, add items to cart, and track their order in real time. Vendors get an operations dashboard. The Express/MongoDB backend manages order state, while Firebase handles live delivery updates.",
      outcome:  "Transforms informal food ordering into a structured, trackable, and scalable operation — giving vendors a digital presence and customers a seamless delivery experience on both web and mobile."
    }
  },
  {
    title:         "School Portal",
    tagline:       "Student & teacher management portal for modern schools.",
    desc:          "A role-based school portal enabling teachers to manage classes, upload resources and track student performance, while students access results and timetables. Image uploads handled via Cloudinary.",
    stack:         ["React.js", "Node.js", "Express.js", "MongoDB", "Cloudinary"],
    category:      "webapp",
    categoryLabel: "Web App",
    year:          "2023",
    github:        "https://github.com/DakulTech",
    live:          "https://raodotulirfaan.vercel.app/",
    image:         "assets/projects/project3.png",
    featured:      false,
    caseStudy: {
      problem:  "Schools manage student data across registers, spreadsheets, physical notice boards, and teachers' personal files. Attendance records drift, results are published late, assignments are distributed on paper, and neither students nor parents have a reliable way to check progress between report card terms.",
      solution: "A role-based MERN stack portal that digitises the full academic workflow. Teachers log in to mark attendance, grade assignments, and upload course materials via Cloudinary. Students access their results, download resources, and view their timetable from any device. Administrators get a bird's-eye view of academic performance across classes.",
      outcome:  "Replaces paper-based school administration with a single digital system. Faster result publication, fewer lost records, and clear accountability for every stakeholder in the school ecosystem."
    }
  },
  {
    title:         "CodeWithMe",
    tagline:       "A launchpad to teach real-world software engineering.",
    desc:          "A structured learning platform with curated frontend, backend, and fullstack tracks. Built to bring practical, mentorship-driven engineering education to African developers — with React, Firebase, and SCSS.",
    stack:         ["React", "Firebase", "SCSS", "HTML5", "JavaScript"],
    category:      "webapp",
    categoryLabel: "Web App / EdTech",
    year:          "2023",
    github:        "https://github.com/DakulTech/codeWithMe",
    live:          "https://code-with-me-nine.vercel.app/",
    image:         "assets/projects/project8.png",
    featured:      false,
    caseStudy: {
      problem:  "Aspiring developers in Nigeria and across Africa face a gap between generic YouTube tutorials and the structured, mentorship-driven paths that produce job-ready engineers. Most online platforms are expensive, built for Western learners, and don't reflect the real-world stacks and workflows used in African tech companies.",
      solution: "CodeWithMe is a structured learning launchpad with dedicated tracks for frontend, backend, and fullstack development. The curriculum is practical and project-driven, guiding learners from fundamentals to deployable projects. Built with React for the UI, Firebase for real-time database and auth, and SCSS for a clean design system that itself models good front-end craft.",
      outcome:  "A dedicated resource that meets African developers where they are — teaching modern engineering skills in context, with a roadmap that leads to real employment readiness."
    }
  },
  {
    title:         "TaCoin",
    tagline:       "Web3 crypto dashboard built with Vue.js.",
    desc:          "A lightweight cryptocurrency tracking and portfolio dashboard built with Vue.js. Connects to live price feeds and presents clean data visualisations for Web3 enthusiasts.",
    stack:         ["Vue.js", "Node.js", "CSS"],
    category:      "webapp",
    categoryLabel: "Web3 App",
    year:          "2023",
    github:        "https://github.com/DakulTech",
    live:          "https://vue-playground-dakul.netlify.app",
    image:         "assets/projects/project9.png",
    featured:      false,
    caseStudy: {
      problem:  "Crypto beginners struggle to monitor multiple assets and understand market trends across fragmented exchanges. Existing dashboards are data-heavy, intimidating, and built for traders — not for someone who just wants to understand where their portfolio stands today.",
      solution: "TaCoin is a clean, distraction-free crypto tracking dashboard that connects to live price feeds and visualises portfolio performance in real time. Vue.js powers the reactive UI, with smooth transitions that make data feel approachable rather than overwhelming. The minimal design prioritises clarity over feature overload.",
      outcome:  "A gateway into Web3 portfolio awareness — built to make crypto data readable and trustworthy for beginners, without the noise that pushes them away from existing tools."
    }
  },
  {
    title:         "Waste2Wealth",
    tagline:       "Platform connecting recyclers with waste collection agents.",
    desc:          "A sustainability-focused SaaS that connects households and businesses with certified recyclers. Users schedule pickups, track collection history and earn credits — built with Next.js, Tailwind and MongoDB.",
    stack:         ["Next.js", "Tailwind CSS", "MongoDB"],
    category:      "webapp",
    categoryLabel: "Web App / GreenTech",
    year:          "2023",
    github:        "https://github.com/DakulTech",
    live:          "https://next-dakul-project.vercel.app",
    image:         "assets/projects/project7.png",
    featured:      false,
    caseStudy: {
      problem:  "Waste management in Nigerian cities is informal and uncoordinated. Households have no easy way to schedule pickup. Recyclers can't find reliable supply chains. Waste collectors operate without accountability or records. The result: mountains of recyclable material end up in landfills because there's no digital infrastructure to connect the parties who could redirect it.",
      solution: "Waste2Wealth is a three-sided sustainability platform. Households register, schedule pickup for recyclable waste, and earn credit rewards per collection. Waste collectors get optimised routes and a digitised work record. Certified recyclers access a steady, traceable supply stream. Built with Next.js for SSR speed, Tailwind for fast iteration on UI, and MongoDB for flexible data across three user types.",
      outcome:  "Creates the missing digital infrastructure for Nigeria's recycling economy — turning informal waste collection into a coordinated, incentivised, and auditable supply chain."
    }
  },
  {
    title:         "Pelz Secret",
    tagline:       "Full-stack e-commerce store with admin dashboard.",
    desc:          "A custom e-commerce storefront with product management, cart, checkout, and an admin dashboard for inventory control. Media assets managed through Cloudinary, backend powered by Node.js and MongoDB.",
    stack:         ["HTML5", "JavaScript", "CSS", "Node.js", "Express", "MongoDB", "Cloudinary"],
    category:      "website",
    categoryLabel: "Website",
    year:          "2022",
    github:        "https://github.com/DakulTech",
    live:          "https://pelzsecret.com.ng/",
    image:         "assets/projects/project4.png",
    featured:      false,
    caseStudy: {
      problem:  "A beauty and skincare brand was operating without a proper digital storefront — taking orders through Instagram DMs and losing customers to competitors with better-presented online presences. There was no way for customers to browse the full catalogue, check out securely, or for the brand to manage inventory without a spreadsheet.",
      solution: "A custom full-stack e-commerce storefront tailored to the Pelz Secret brand identity. The frontend gives customers a clean product catalogue, cart management, and a frictionless checkout. The backend admin dashboard lets the brand manage products, update inventory, and process orders. Cloudinary handles rich product media; Node.js and MongoDB power the data layer.",
      outcome:  "Transformed a social-media-only brand into a legitimate e-commerce business with a professional digital home — reducing DM overhead and giving the brand full control over its sales channel."
    }
  },
  {
    title:         "De-embeez",
    tagline:       "Stylish jewellery brand website with smooth animations.",
    desc:          "A beautifully crafted jewellery brand website with smooth scroll animations, product showcases and a fully responsive layout — built with vanilla HTML, JavaScript and SASS.",
    stack:         ["HTML5", "JavaScript", "SASS"],
    category:      "website",
    categoryLabel: "Website",
    year:          "2022",
    github:        "https://github.com/DakulTech",
    live:          "https://de-embeez.netlify.app/index.html#",
    image:         "assets/projects/project5.png",
    featured:      false,
    caseStudy: {
      problem:  "A jewellery brand had no online presence beyond Instagram posts. Without a dedicated website, they couldn't showcase collections properly, lost credibility with potential wholesale buyers, and had no stable platform for discovery outside the algorithm.",
      solution: "A fully hand-crafted brand website built with semantic HTML5, vanilla JavaScript for scroll animations and interactivity, and SASS for a modular, maintainable styling architecture. The design reflects the jewellery's premium quality — elegant typography, generous white space, and smooth entrance animations that give every product the attention it deserves. Fully responsive across all devices.",
      outcome:  "Gave the brand a permanent, algorithm-independent digital home. Elevated perceived value through intentional design, and opened a credible channel for wholesale enquiries and press coverage."
    }
  },
  {
    title:         "TeeHub",
    tagline:       "Modern clothing brand landing page.",
    desc:          "A clean, conversion-focused landing page for a streetwear brand. Designed with a bold typographic style, product grid and responsive layout — crafted with HTML5 and SASS.",
    stack:         ["HTML5", "SASS"],
    category:      "website",
    categoryLabel: "Website",
    year:          "2022",
    github:        "https://github.com/DakulTech",
    live:          "https://dakultech.github.io/TeeHub-Home/",
    image:         "assets/projects/project6.png",
    featured:      false,
    caseStudy: {
      problem:  "A streetwear brand had strong product photography and a loyal social following, but nowhere to direct traffic that they owned. Every sale happened through third-party marketplaces that took commissions and gave the brand no control over the customer experience.",
      solution: "A bold, conversion-focused landing page built with HTML5 and SASS. The design leads with oversized product photography and editorial typography that matches the brand's streetwear identity. A curated product grid, social proof section, and clear call-to-action guide visitors toward a purchase decision without distraction.",
      outcome:  "Gave the brand a fast-loading, brand-owned page to anchor all social traffic — reducing dependency on marketplace algorithms and establishing a digital identity the brand controls entirely."
    }
  }
];


// ── Case Study Modal ───────────────────────────────────────────

function injectModal() {
  if (document.getElementById('case-study-modal')) return;

  const styles = document.createElement('style');
  styles.id = 'case-study-styles';
  styles.textContent = `
    /* ── Case Study Modal ── */
    #cs-backdrop {
      position: fixed; inset: 0; z-index: 3000;
      background: rgba(17,17,17,0.72);
      backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
      display: none; align-items: center; justify-content: center;
      padding: clamp(1rem, 4vw, 3rem);
      animation: csFadeIn 0.22s ease;
    }
    #cs-backdrop.open { display: flex; }
    @keyframes csFadeIn { from { opacity:0; } to { opacity:1; } }

    #case-study-modal {
      background: var(--white, #FDFAF6);
      border: 1px solid var(--border, #D8D2C8);
      border-radius: 12px;
      width: 100%; max-width: 720px;
      max-height: 88vh;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--border) transparent;
      box-shadow: 0 40px 100px rgba(17,17,17,0.25);
      animation: csSlideUp 0.38s cubic-bezier(0.16,1,0.3,1);
      position: relative;
    }
    @keyframes csSlideUp {
      from { opacity:0; transform: translateY(30px) scale(0.97); }
      to   { opacity:1; transform: translateY(0) scale(1); }
    }

    .cs-hero {
      width: 100%; aspect-ratio: 16/7;
      object-fit: cover; display: block;
      background: var(--border);
      border-radius: 12px 12px 0 0;
    }
    .cs-hero-placeholder {
      width: 100%; aspect-ratio: 16/7;
      background: linear-gradient(135deg, #2a2a2a, #4a4540);
      border-radius: 12px 12px 0 0;
      display: flex; align-items: center; justify-content: center;
    }
    .cs-hero-placeholder span {
      font-family: var(--font-display, 'Cormorant Garamond', serif);
      font-size: 6rem; font-weight: 700; color: rgba(255,255,255,0.08);
    }

    .cs-close {
      position: sticky; top: 0.8rem;
      float: right; margin: -2.5rem 1rem 0;
      width: 36px; height: 36px;
      background: var(--ink, #111); color: var(--cream, #F2EDE4);
      border: none; border-radius: 50%; font-size: 1.1rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      z-index: 10; transition: background 0.2s, transform 0.2s;
    }
    .cs-close:hover { background: #333; transform: rotate(90deg); }

    .cs-body { padding: clamp(1.5rem, 4vw, 2.5rem); padding-top: 1rem; }

    .cs-tag {
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.14em;
      text-transform: uppercase; color: var(--accent, #C8B89A);
      display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem;
    }
    .cs-tag::before { content: ''; width: 20px; height: 1px; background: var(--accent, #C8B89A); }

    .cs-title {
      font-family: var(--font-display, 'Cormorant Garamond', serif);
      font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 700;
      letter-spacing: -0.02em; line-height: 1.05;
      color: var(--ink, #111); margin-bottom: 0.5rem;
    }
    .cs-tagline {
      font-size: 0.88rem; color: var(--ink-dim, #555550);
      line-height: 1.65; margin-bottom: 1.6rem;
    }

    .cs-stack {
      display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 1.8rem;
      padding-bottom: 1.6rem; border-bottom: 1px solid var(--border, #D8D2C8);
    }

    .cs-section { margin-bottom: 1.6rem; }
    .cs-section-label {
      font-size: 0.62rem; font-weight: 700; letter-spacing: 0.16em;
      text-transform: uppercase; color: var(--accent, #C8B89A);
      margin-bottom: 0.55rem; display: flex; align-items: center; gap: 0.6rem;
    }
    .cs-section-label::after {
      content: ''; flex: 1; height: 1px;
      background: var(--border, #D8D2C8);
    }
    .cs-section-text {
      font-size: 0.92rem; color: var(--ink-dim, #555550);
      line-height: 1.8;
    }
    .cs-section-text strong { color: var(--ink, #111); font-weight: 600; }

    .cs-links {
      display: flex; gap: 0.75rem; flex-wrap: wrap;
      padding-top: 1.4rem; border-top: 1px solid var(--border, #D8D2C8);
      margin-top: 0.2rem;
    }
    .cs-link {
      display: inline-flex; align-items: center; gap: 0.45rem;
      padding: 0.65rem 1.3rem; font-family: var(--font-body, 'Syne', sans-serif);
      font-size: 0.75rem; font-weight: 700; letter-spacing: 0.07em;
      text-transform: uppercase; text-decoration: none;
      border-radius: 4px; transition: background 0.2s, transform 0.2s, color 0.2s;
    }
    .cs-link.primary {
      background: var(--ink, #111); color: var(--cream, #F2EDE4);
    }
    .cs-link.primary:hover { background: #333; transform: translateY(-2px); }
    .cs-link.ghost {
      border: 1px solid var(--border, #D8D2C8); color: var(--ink-dim, #555550);
    }
    .cs-link.ghost:hover {
      border-color: var(--ink, #111); color: var(--ink, #111);
      transform: translateY(-2px);
    }
    .cs-link i { font-size: 0.7rem; }

    @media (max-width: 480px) {
      #case-study-modal { border-radius: 10px; }
      .cs-hero, .cs-hero-placeholder { border-radius: 10px 10px 0 0; }
      .cs-body { padding: 1.2rem; padding-top: 0.8rem; }
      .cs-links { flex-direction: column; }
      .cs-link { justify-content: center; }
    }
  `;
  document.head.appendChild(styles);

  const modal = document.createElement('div');
  modal.id = 'cs-backdrop';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Project case study');
  modal.innerHTML = `
    <div id="case-study-modal">
      <div id="cs-img-slot"></div>
      <button class="cs-close" id="cs-close-btn" aria-label="Close case study">&times;</button>
      <div class="cs-body">
        <p class="cs-tag" id="cs-cat"></p>
        <h2 class="cs-title" id="cs-title"></h2>
        <p class="cs-tagline" id="cs-tagline"></p>
        <div class="cs-stack" id="cs-stack"></div>
        <div class="cs-section">
          <p class="cs-section-label">The Problem</p>
          <p class="cs-section-text" id="cs-problem"></p>
        </div>
        <div class="cs-section">
          <p class="cs-section-label">The Solution</p>
          <p class="cs-section-text" id="cs-solution"></p>
        </div>
        <div class="cs-section">
          <p class="cs-section-label">The Outcome</p>
          <p class="cs-section-text" id="cs-outcome"></p>
        </div>
        <div class="cs-links" id="cs-links"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close handlers
  document.getElementById('cs-close-btn').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(project) {
  injectModal();
  const backdrop = document.getElementById('cs-backdrop');

  // Image slot
  const imgSlot = document.getElementById('cs-img-slot');
  if (project.image) {
    imgSlot.innerHTML = `<img class="cs-hero" src="${project.image}" alt="${project.title}" loading="lazy" />`;
  } else {
    imgSlot.innerHTML = `<div class="cs-hero-placeholder"><span>${project.title.charAt(0)}</span></div>`;
  }

  // Metadata
  document.getElementById('cs-cat').textContent     = project.categoryLabel;
  document.getElementById('cs-title').textContent   = project.title;
  document.getElementById('cs-tagline').textContent = project.tagline;

  // Stack
  document.getElementById('cs-stack').innerHTML = project.stack
    .map(s => `<span class="stack-tag">${s}</span>`).join('');

  // Case study text
  const cs = project.caseStudy || {};
  document.getElementById('cs-problem').textContent  = cs.problem  || '—';
  document.getElementById('cs-solution').textContent = cs.solution || '—';
  document.getElementById('cs-outcome').textContent  = cs.outcome  || '—';

  // Links
  let linksHtml = '';
  if (project.live)   linksHtml += `<a href="${project.live}" target="_blank" rel="noopener" class="cs-link primary">View Live <i class="fas fa-arrow-right"></i></a>`;
  if (project.github) linksHtml += `<a href="${project.github}" target="_blank" rel="noopener" class="cs-link ghost">GitHub <i class="fab fa-github"></i></a>`;
  if (project.apk)    linksHtml += `<a href="${project.apk}" target="_blank" rel="noopener" class="cs-link ghost">Download APK <i class="fas fa-download"></i></a>`;
  document.getElementById('cs-links').innerHTML = linksHtml;

  // Open
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('case-study-modal').scrollTop = 0;
}

function closeModal() {
  const backdrop = document.getElementById('cs-backdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}


// ── Helpers ────────────────────────────────────────────────────

function stackTags(stack) {
  return stack.map(s => `<span class="stack-tag">${s}</span>`).join('');
}

function projectLinks(project, context) {
  let html = '';
  if (project.live) {
    html += `<a href="${project.live}" target="_blank" rel="noopener" class="project-link">
               View Live <i class="fas fa-arrow-right"></i>
             </a>`;
  }
  if (project.caseStudy) {
    html += `<button class="project-link secondary cs-trigger" data-title="${project.title}" aria-label="Read case study for ${project.title}">
               Case Study <i class="fas fa-book-open"></i>
             </button>`;
  }
  if (project.github) {
    html += `<a href="${project.github}" target="_blank" rel="noopener" class="project-link secondary">
               GitHub <i class="fab fa-github"></i>
             </a>`;
  }
  if (project.apk) {
    html += `<a href="${project.apk}" target="_blank" rel="noopener" class="project-link secondary">
               APK <i class="fas fa-download"></i>
             </a>`;
  }
  return html;
}

function createCard(project, context = 'home') {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.dataset.category = project.category;
  card.dataset.title = project.title;

  const imgHtml = project.image
    ? `<img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />`
    : `<div class="project-img-placeholder"><span>${project.title.charAt(0)}</span></div>`;

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

  // Wire case study triggers after DOM insertion
  card.querySelectorAll('.cs-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openModal(project);
    });
  });

  return card;
}


// ── Home Page ──────────────────────────────────────────────────
function initHomePage() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const homeProjects = ALL_PROJECTS.slice(0, 6);
  grid.innerHTML = '';
  homeProjects.forEach(p => grid.appendChild(createCard(p, 'home')));
  initTabs(grid, ALL_PROJECTS.slice(0, 6));
}


// ── Projects Page ──────────────────────────────────────────────
function initProjectsPage() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = '';
  ALL_PROJECTS.forEach(p => grid.appendChild(createCard(p, 'projects')));
  initTabs(grid, ALL_PROJECTS);

  const footer = document.querySelector('.projects-footer');
  if (footer) footer.style.display = 'none';
}


// ── Tabs ───────────────────────────────────────────────────────
function buildTabs(tabsContainer, projects) {
  if (!tabsContainer) return;
  const seen = new Set();
  const categories = [{ key: 'all', label: 'All' }];
  projects.forEach(p => {
    if (!seen.has(p.category)) {
      seen.add(p.category);
      categories.push({ key: p.category, label: p.categoryLabel });
    }
  });
  tabsContainer.innerHTML = categories.map((cat, i) => {
    const count = cat.key === 'all'
      ? projects.length
      : projects.filter(p => p.category === cat.key).length;
    return `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-filter="${cat.key}" role="tab" aria-selected="${i === 0}">
      ${cat.label}<span class="tab-count">${count}</span>
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
      visible.forEach((c, i) => setTimeout(() => c.classList.remove('fade-enter'), 20 + i * 55));
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
function toggleMobile() { document.getElementById('mobileMenu')?.classList.toggle('open'); }
function closeMobile()  { document.getElementById('mobileMenu')?.classList.remove('open'); }


// ── Profile Modal ──────────────────────────────────────────────
function toggleProfileModal() {
  const modal    = document.getElementById('profileModal');
  const backdrop = document.getElementById('profileBackdrop');
  const btn      = document.getElementById('avatarBtn');
  if (!modal) return;
  const isOpen = modal.classList.contains('open');
  if (isOpen) { closeProfileModal(); }
  else {
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
  if (e.key === 'Escape') { closeProfileModal(); closeModal(); }
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

  fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'newsletter', email })
  }).catch(() => {});
}


// ── Stack tag styles ───────────────────────────────────────────
(function injectStackStyles() {
  if (document.getElementById('dakul-stack-styles')) return;
  const style = document.createElement('style');
  style.id = 'dakul-stack-styles';
  style.textContent = `
    .project-stack { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:1.2rem; }
    .stack-tag { font-size:0.65rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
      color:var(--ink-dim,#555550); background:var(--cream,#F2EDE4);
      border:1px solid var(--border,#D8D2C8); padding:3px 9px; border-radius:20px; white-space:nowrap; }
    .stack-tag.muted { background:transparent; color:var(--accent,#C8B89A); border-color:var(--accent,#C8B89A); }
    .project-link.secondary button, button.project-link.secondary {
      background:none; cursor:pointer; font-family:var(--font-body,'Syne',sans-serif);
    }
  `;
  document.head.appendChild(style);
})();


// ── Boot ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initFooterDate();
  injectModal();
  const page = document.body.dataset.page;
  if (page === 'projects') initProjectsPage();
  else initHomePage();
});