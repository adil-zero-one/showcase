/**
 * ENGLISH — the reference dictionary.
 * es.ts and ca.ts are typed as `Dict` (= typeof en), so TypeScript fails the
 * build if a key is missing in one of the languages.
 * Placeholders such as {n} are replaced by `fmt()` in src/i18n/index.tsx.
 */
export const en = {
  htmlLang: 'en',

  documentTitle: 'Adil Chainakh — Backend Developer and Motion Designer',

  a11y: {
    skipToContent: 'Skip to main content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main navigation',
    language: 'Language',
    close: 'Close',
    newTab: '(opens in a new tab)',
    portrait: 'Portrait of Adil Chainakh. Moving the pointer over it reveals a layer of code.',
    loading: 'Loading the portfolio',
    demo: 'Animated illustration of the ScoutWand flow: a search is typed, matching job offers appear, then a form fills itself from a CV.',
    drag: 'Drag sideways to see more',
  },

  nav: {
    work: 'Work',
    scoutwand: 'ScoutWand',
    showreel: 'Showreel',
    stack: 'Stack',
    journey: 'Journey',
    contact: 'Contact',
    cv: 'CV',
  },

  availability: {
    short: 'Available for FCT internships',
    long: 'Available for internships (FCT) and suitable junior developer opportunities.',
  },

  hero: {
    role: 'Backend developer and motion designer',
    place: 'Reus, Spain',
    intro: 'I build the logic behind web apps and the motion that makes them feel alive. Studying DAW in Reus, shipping my own desktop app.',
    ctaWork: 'See my work',
    ctaContact: 'Say hello',
    hint: 'Move over me. Click.',
    scroll: 'Scroll',
    loading: 'Loading',
  },

  manifesto: {
    statement: 'I write the logic that holds an application together, and I care just as much about how it moves, how it reads and how it feels the first time someone opens it.',
    facts: [
      'languages I work in',
      'motion pieces in the showreel',
      'public repositories',
      'desktop app, live',
    ],
  },

  scout: {
    title: 'ScoutWand',
    lede: 'A desktop app that scouts job sites for you. I built the website with Laravel and Tailwind, and the app with Python.',
    steps: [
      {
        title: 'You type.',
        text: 'Describe the job you want and where. ScoutWand searches LinkedIn, Indeed and InfoJobs with it.',
      },
      {
        title: 'It scouts.',
        text: 'Matching offers arrive in one list, each with a direct link to the original listing.',
      },
      {
        title: 'You apply.',
        text: 'Auto-fill completes name, location and phone from your CV in the app’s built-in browser. You review everything and press apply yourself.',
      },
    ],
    facts: [
      'Windows and macOS',
      'Free plan available',
      'CV and sessions stay on your computer',
      'Paid licences are checked on your computer and keep working offline between renewals',
    ],
    built: {
      site: 'Website',
      siteTech: 'PHP, Laravel, Tailwind CSS',
      app: 'App',
      appTech: 'Python',
    },
    cta: 'Visit scoutwand.com',
    caption: 'An illustration of the flow. The jobs shown are examples, not live data.',
    mock: {
      query: 'Junior web developer, PHP or Laravel',
      where: 'Tarragona, Reus, Barcelona',
      search: 'Scout',
      matches: 'matches',
      apply: 'Apply',
      fromCv: 'Filled from your CV',
      name: 'Name',
      city: 'City',
      phone: 'Phone',
      review: 'You review. You press apply.',
      titles: [
        'Junior backend developer',
        'Laravel developer, junior',
        'PHP web developer',
        'Web developer, trainee',
      ],
    },
  },

  stack: {
    title: 'The stack, with receipts.',
    intro: 'Filled words are technologies I have used in a public project. Outlined words are on my CV. Dashed ones I am learning now.',
    legend: { used: 'Used in a public project', listed: 'Listed on CV, no public repo yet', learning: 'Currently learning' },
    groups: { backend: 'Backend & data', frontend: 'Frontend', tools: 'Tools & visual production' },
    detailPrompt: 'Hover or focus a word to see where I used it.',
    statusLabel: { used: 'Verified in a public project', listed: 'Listed on my CV', learning: 'Learning' },
    items: {
      php: 'The language behind all three backend projects: Supplier Manager, Gym Routine App and the Video Game API.',
      laravel: 'Gym Routine App (Laravel 13, Breeze authentication, role middleware) and the Video Game API.',
      symfony: 'Supplier Manager on Symfony 8: controllers, Twig templates, Form types and validation constraints.',
      sql: 'MySQL 8 behind the Gym App and Supplier Manager (both run in Docker), plus migrations in the Laravel projects.',
      eloquent:
        'Relations in the Gym App: a category has many exercises; a routine belongs to many exercises with sets and repetitions stored on the pivot.',
      doctrine: 'Supplier Manager: an attribute-mapped Proveedor entity, a repository class and a PreUpdate lifecycle callback.',
      rest: 'Video Game API: list, show, availability filter, create with validation, and delete — all returning JSON.',
      docker: 'docker-compose setups for the Gym App (PHP, Nginx, MySQL) and Supplier Manager (app plus MySQL with a health check).',
      mvc: 'Models, controllers and views kept separate in all three backend projects.',
      java: 'Part of the DAW programme. No public project yet.',
      html: 'The banners page (Bootstrap carousel plus video) and this portfolio.',
      css: 'Responsive layouts, a dark mode and table-to-card adaptation in Supplier Manager, and the design system of this site.',
      js: 'The dark-mode toggle in Supplier Manager and every interaction on this site.',
      bootstrap: 'Bootstrap 5 in the Gym App, the banners page and Supplier Manager.',
      react: 'This portfolio is a React 19 application.',
      typescript: 'This portfolio is written in TypeScript with a typed content layer.',
      git: 'Every project lives in a public GitHub repository with its commit history.',
      linux: 'Listed as a working tool. Not yet demonstrated in a public repository.',
      postman: 'Listed as a working tool. Not yet demonstrated in a public repository.',
      figma: 'Listed on my CV.',
      photoshop: 'Three banner designs in the banners project; Photoshop is also listed on my CV.',
      aftereffects: 'Banner animation and the motion pieces in the showreel.',
      premiere: 'Listed on my CV.',
      motion: 'Seven clips in the showreel, from product-style animation to map graphics.',
    },
  },

  projects: {
    title: 'Selected work',
    intro: 'Four projects from public repositories. Every description comes from the code and the README.',
    labels: {
      objective: 'Objective',
      role: 'What I built',
      decisions: 'Technical decisions',
      stack: 'Verified stack',
      source: 'Source code',
      live: 'Live demo',
      openCase: 'Open case study',
      gallery: 'Screenshots',
      endpoints: 'Endpoints in routes/api.php',
      fields: 'Fields accepted by POST /api/videojocs',
      noUpdate: 'There is no update route in this API — by specification.',
      status: 'Status',
      watch: 'Watch the animated banner',
      view: 'View',
      drag: 'Scroll sideways',
      reveal: 'How it’s built',
      showBuilt: 'Show how it’s built',
      hideBuilt: 'Show the screenshot',
      hint: 'Hover to look under the surface',
    },
    statuses: { project: 'Public repository', exercise: 'Course exercise', prototype: 'Prototype — screenshots only' },
    index: {
      title: 'All work',
      open: 'Open case study',
    },
    items: {
      supplier: {
        name: 'Supplier Manager',
        kicker: 'Symfony · CRUD',
        tagline: 'A supplier directory that turns its table into cards on a phone.',
        summary:
          'A supplier management CRUD application built with Symfony, with a responsive interface, table-to-card adaptation, dark mode, and a containerized development environment.',
        objective:
          'Manage the suppliers of a travel agency (hotels, cruises, theme parks, ski resorts): list, create, edit and delete them from one screen.',
        role: 'Controller, Doctrine entity with validation, Form type, Twig templates and the Docker setup. The CRUD is written by hand rather than produced by a generator.',
        decisions: [
          'One template, two layouts: a Bootstrap table from the md breakpoint up and a card grid below it, instead of a table that scrolls sideways.',
          'Validation constraints sit on the entity (NotBlank, Length, Email, Choice), so each rule is declared once.',
          'A PreUpdate lifecycle callback keeps updated_at current without extra controller code.',
          'docker-compose starts the app and a MySQL 8 database with a health check; the SQL dump loads on first start.',
          'Dark mode is a class toggled on the body, with the Bootstrap table variables overridden for it.',
        ],
        images: [
          'Supplier Manager in dark mode on a narrow screen: suppliers shown as cards with Edit and Delete buttons.',
          'Supplier Manager on desktop: a table of suppliers with Edit and Delete actions, shown next to the Symfony project tree.',
        ],
        annotations: ['Card layout · < 768 px', 'Table layout · ≥ 768 px'],
      },
      gym: {
        name: 'Gym Routine App',
        kicker: 'Laravel · Eloquent · MVC',
        tagline: 'Routines built from categories and exercises, with sets and reps stored on the relationship.',
        summary:
          'A gym routine management application demonstrating CRUD functionality, relationships between data models, and MVC organization.',
        objective:
          'Let clients assemble their own workout routines from a catalogue of categories and exercises, while an administrator maintains that catalogue.',
        role: 'Models and migrations, controllers, Blade views, role-based middleware, image uploads for the catalogue and the Docker environment.',
        decisions: [
          'Routine ↔ exercise is many-to-many. The pivot stores sets and repetitions, with dedicated routes to attach, update and detach an exercise.',
          'Two middleware classes separate the roles: the admin maintains the catalogue and can read every routine; clients manage only their own.',
          'Laravel Breeze handles authentication; clients register with extra profile data kept in a separate Client model.',
          'docker-compose runs PHP, Nginx and MySQL 8; the database loads from an included SQL file.',
        ],
        images: [
          'Gym Routine App landing page in light mode, with cards for routines and exercises.',
          'Admin dashboard showing counters for categories, routines and exercises, and a preview of categories.',
          'Admin category list with anatomy illustrations, Edit and Delete buttons.',
          'More categories in the admin list, with a card to create a new category.',
          'Edit category form with the current image and an upload field.',
          'Exercise catalogue with images and pagination.',
          'Login screen in dark mode.',
        ],
        annotations: ['Landing', 'Admin dashboard', 'Categories', 'Create category', 'Edit category', 'Exercises', 'Dark mode'],
      },
      banners: {
        name: 'Animated Banners',
        kicker: 'Bootstrap · Photoshop · After Effects',
        tagline: 'Three banner concepts, one of them animated — a design exercise in a Bootstrap carousel.',
        summary: 'A visual project demonstrating animated banner variations and audiovisual design skills.',
        objective: 'A course assignment: design three banners, present them in a Bootstrap carousel and animate one of them.',
        role: 'Art direction and layout of the three banners in Photoshop, the animation of banner 1 in After Effects, and the carousel page.',
        decisions: [
          'One visual system across the three banners — marble podium, spotlights, neon script — with a different palette for each product.',
          'Banners designed at 1920 × 600 and shown as full-width carousel images so they scale with the viewport.',
          'The animation is delivered as MP4 and embedded with native controls, so the visitor decides when to play it.',
          'The brands (Adil’s Beats, Adil’s Motors, Adil’s Games) are fictional exercise brands.',
          'Banners 2 and 3 contain third-party imagery (cars and a game’s cover art) used as exercise material; it is not original artwork.',
        ],
        images: [
          'Banner 1: green headphones on a marble podium among clouds, with a price and a call-to-action button.',
          'Banner 2: three blue and silver sports cars on a podium under spotlights, with a monthly price.',
          'Banner 3: a game cover and character art between a green and a red panel, with a price and a join button.',
        ],
        annotations: ['Banner 01 · 1920 × 600', 'Banner 02 · 1920 × 600', 'Banner 03 · 1920 × 600'],
      },
      api: {
        name: 'Video Game Management API',
        kicker: 'Laravel · REST · JSON',
        tagline: 'A small JSON API for a video-game catalogue: five endpoints, validated input, explicit status codes.',
        summary:
          'A Laravel API for video-game management with customized filtering, JSON responses and CRUD functionality without an update operation.',
        objective:
          'A course activity: expose a video-game catalogue as an API with a custom availability filter and, as specified, without an update operation.',
        role: 'Route design, the API controller, the Eloquent model, migration, factory and seeder.',
        decisions: [
          'The fixed route /videojocs/disponibles is declared before /videojocs/{id}; otherwise the wildcard swallows it. A comment in the code records that bug.',
          'Input is validated before insertion (title up to 100 characters, release year 1950–2027, rating 0–9.9, price up to 99.99); success returns 201 Created.',
          'An unknown id returns a JSON 404; an empty availability filter also returns a 404 with a message.',
          'A model factory seeds ten records, so the API has data on the first run.',
        ],
        images: [] as string[],
        annotations: [] as string[],
        endpointNotes: {
          list: 'All video games as JSON.',
          available: 'Only games with disponibilitat = 1; 404 with a message if none.',
          show: 'One game by id; 404 with a message if it does not exist.',
          create: 'Validated insert; responds 201 Created.',
          remove: 'Deletes by id; 404 if it does not exist.',
        },
      },
      venuepulse: {
        name: 'VenuePulse',
        kicker: 'Interface prototype',
        tagline: 'A mobile concept for finding active venues nearby.',
        summary:
          'Interface screenshots of a mobile-first concept: a venue list with distance and check-in counts, a map view, a chat and a payment screen labelled as a demo.',
        objective: 'Explore the interface of a real-time social app around venues.',
        role: 'Interface design and front-end prototype.',
        decisions: [
          'Screenshots only: the source code is not public yet, so this page makes no claims about the implementation.',
          'The payment screen in the screenshots is labelled “demo — no real charge”.',
        ],
        images: [
          'Venue list with distance and the number of people inside each venue.',
          'Dark map view of nearby people around a venue.',
          'People grid with match and action buttons.',
          'Chat conversation screen.',
          'Purchase options screen.',
          'Card details screen labelled as a demo with no real charge.',
        ],
        annotations: [] as string[],
      },
      botradar: {
        name: 'Sulake Habbo Radar',
        kicker: 'Interface prototype',
        tagline: 'A moderation dashboard concept: flagged accounts, signals and rooms at risk.',
        summary:
          'Interface screenshots of a dashboard concept listing flagged accounts with risk scores, detection signals and rooms at risk.',
        objective: 'Explore how a moderation dashboard could present suspicious activity.',
        role: 'Dashboard interface design.',
        decisions: [
          'Screenshots only: no repository or demo is public yet, so the detection logic is not presented as verified.',
        ],
        images: ['Dashboard with counters and a bar chart of recent activity.', 'Flagged accounts list with risk scores, detection signals and rooms at risk.'],
        annotations: [] as string[],
      },
    },
  },

  showreel: {
    title: 'Motion is not decoration. It is communication.',
    intro:
      'Seven pieces from my audiovisual work, from product-style animation to map graphics and edited screen tutorials. Nothing plays until you press play.',
    play: 'Play',
    pause: 'Pause',
    playClip: 'Play “{title}”',
    chapters: 'Clips',
    nowShowing: 'Now showing',
    duration: 'Duration',
    soundNote: 'Clips play muted. Use the speaker button in the player to turn sound on.',
    loading: 'Loading clip…',
    error: 'This clip could not be loaded. Check your connection, or open the file directly:',
    openFile: 'Open the MP4',
    timecode: 'TC',
    clips: {
      'beats-banner': {
        title: 'Headphones banner, animated',
        description:
          'The animated version of the “Adil’s Beats” banner: headphones floating over a marble podium, a price tag and a call-to-action button that gets clicked. Source format 1920 × 600.',
      },
      'croissant-ad': {
        title: 'Croissant promo',
        description: 'A food promo animation: croissants orbiting a plate, a chocolate splash and animated lettering.',
      },
      'calamari-ad': {
        title: 'Calamari menu animation',
        description: 'A dish presentation with animated lettering and ingredient elements.',
      },
      'map-route': {
        title: 'Map route animation',
        description: 'A satellite map zoom with an animated route line and street-level lettering, ending on a highlighted building.',
      },
      'presenter-3d': {
        title: 'Presenter in a 3D workstation',
        description: 'Presenter footage composited into a 3D desk setup with monitors; a map appears on one of the screens.',
      },
      'ae-lighting': {
        title: 'After Effects: 3D lighting session',
        description: 'A screen recording of a 3D light and camera setup around a podium in After Effects, ending with the scene lit in red.',
      },
      'truenas-tutorial': {
        title: 'TrueNAS tutorial, edited',
        description: 'A one-minute walkthrough of TrueNAS storage pools, shares and users, with dimming and highlight effects added in editing.',
      },
    },
  },

  experience: {
    title: 'A path that started on the other side of the screen.',
    intro:
      'Several years in sales and hospitality taught me to listen, negotiate and stay calm when a service goes wrong. I bring that to software.',
    items: {
      daw: {
        role: 'Higher Vocational Education in Web Application Development (DAW)',
        org: 'Institut Baix Camp — Reus',
        period: '2025 – Present',
        text: 'Web application development with PHP, Laravel, JavaScript, Java, SQL, relational databases and related development tools.',
      },
      beach: {
        role: 'Restaurant Manager',
        org: 'Beach House La Mora',
        period: 'Aug 2023 – Sep 2025',
        text: 'Team coordination, restaurant operations, stock control, customer service and problem-solving in demanding environments.',
      },
      quattros: {
        role: 'Waiter',
        org: 'Quattros',
        period: 'Aug 2022 – Jul 2023',
        text: 'Customer service and teamwork in a fast-paced hospitality environment.',
      },
      navarro: {
        role: 'Automotive Sales Advisor',
        org: 'Navarro Automoción',
        period: 'Jan 2018 – Jul 2021',
        text: 'Vehicle sales, negotiation, customer communication, documentation, contracts and follow-up.',
      },
      school: {
        role: 'High School Diploma in Natural Sciences',
        org: 'Institut Comte de Rius · Cambra de Comerç',
        period: '2015 – 2016',
        text: '',
      },
    },
    present: 'Present',
    languages: {
      title: 'Languages',
      main: 'Working languages',
      extra: 'Also',
      levels: { native: 'Native', advanced: 'Advanced', intermediate: 'Intermediate', basic: 'Basic' },
      names: { ar: 'Arabic', es: 'Spanish', en: 'English', fr: 'French', ca: 'Catalan' },
      catalanNote: 'Basic — comprehension',
    },
  },

  contact: {
    title: 'Good engineering starts with a conversation.',
    text: 'Available for internships (FCT), suitable junior developer opportunities and relevant web development collaborations in the Tarragona–Reus area.',
    email: 'Send an email',
    copy: 'Copy email address',
    copied: 'Email address copied',
    copyFailed: 'Could not copy. Select the address and copy it manually.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Download CV',
    cvLanguage: 'CV language',
    phone: 'Phone',
    emailLabel: 'Email',
    localTime: 'Local time in Reus',
    cvNames: {
      ca: 'Català',
      es: 'Español',
      en: 'English',
    },
  },

  footer: {
    rights: '© {year} Adil Chainakh',
    built: 'Designed and coded by hand. React, TypeScript, GSAP and WebGL.',
    top: 'Back to top',
  },
};

export type Dict = typeof en;
