import type { Dict } from './en';

/** CATALÀ — typed as Dict: a missing key is a compile error. */
export const ca: Dict = {
  htmlLang: 'ca',

  documentTitle: 'Adil Chainakh — Desenvolupador backend i motion designer',

  a11y: {
    skipToContent: 'Salta al contingut principal',
    openMenu: 'Obre el menú',
    closeMenu: 'Tanca el menú',
    mainNav: 'Navegació principal',
    language: 'Idioma',
    close: 'Tanca',
    newTab: '(s’obre en una pestanya nova)',
    portrait: 'Retrat d’Adil Chainakh. En moure el punter per sobre es revela una capa de codi.',
    loading: 'Carregant el portfoli',
    demo: 'Il·lustració animada del flux de ScoutWand: s’escriu una cerca, apareixen ofertes de feina i un formulari s’omple sol amb les dades d’un CV.',
    drag: 'Arrossega cap als costats per veure’n més',
  },

  nav: {
    work: 'Feina',
    scoutwand: 'ScoutWand',
    showreel: 'Showreel',
    stack: 'Stack',
    journey: 'Trajectòria',
    contact: 'Contacte',
    cv: 'CV',
  },

  availability: {
    short: 'Disponible per a pràctiques (FCT)',
    long: 'Disponible per a pràctiques (FCT) i oportunitats com a desenvolupador júnior.',
  },

  hero: {
    role: 'Desenvolupador backend i motion designer',
    place: 'Reus, Espanya',
    intro: 'Construeixo la lògica darrere de les aplicacions web i el moviment que les fa sentir vives. Estudio DAW a Reus i publico la meva pròpia aplicació d’escriptori.',
    ctaWork: 'Mira la meva feina',
    ctaContact: 'Digues hola',
    hint: 'Mou-te per sobre meu. Fes clic.',
    scroll: 'Scroll',
    loading: 'Carregant',
  },

  manifesto: {
    statement: 'Escric la lògica que sosté una aplicació, i m’importa igual com es mou, com es llegeix i què se sent la primera vegada que algú l’obre.',
    facts: [
      'idiomes de treball',
      'peces de motion al showreel',
      'repositoris públics',
      'aplicació d’escriptori publicada',
    ],
  },

  scout: {
    title: 'ScoutWand',
    lede: 'Una aplicació d’escriptori que rastreja portals de feina per tu. He creat la web amb Laravel i Tailwind, i l’aplicació amb Python.',
    steps: [
      {
        title: 'Tu escrius.',
        text: 'Descriu la feina que busques i on. ScoutWand la cerca a LinkedIn, Indeed i InfoJobs.',
      },
      {
        title: 'Rastreja per tu.',
        text: 'Les ofertes que encaixen arriben en una sola llista, cadascuna amb un enllaç directe a l’anunci original.',
      },
      {
        title: 'Tu sol·licites.',
        text: 'L’autoompliment completa nom, localitat i telèfon des del teu CV al navegador integrat de l’aplicació. Tu ho revises tot i prems sol·licitar.',
      },
    ],
    facts: [
      'Windows i macOS',
      'Pla gratuït disponible',
      'El CV i les sessions es queden al teu ordinador',
      'Les llicències de pagament es comproven al teu ordinador i continuen funcionant sense connexió entre renovacions',
    ],
    built: {
      site: 'Web',
      siteTech: 'PHP, Laravel, Tailwind CSS',
      app: 'Aplicació',
      appTech: 'Python',
    },
    cta: 'Visita scoutwand.com',
    caption: 'Il·lustració del flux. Les ofertes mostrades són exemples, no dades reals.',
    mock: {
      query: 'Desenvolupador web júnior, PHP o Laravel',
      where: 'Tarragona, Reus, Barcelona',
      search: 'Rastreja',
      matches: 'coincidències',
      apply: 'Sol·licita',
      fromCv: 'Omplert des del teu CV',
      name: 'Nom',
      city: 'Localitat',
      phone: 'Telèfon',
      review: 'Tu revises. Tu prems sol·licita.',
      titles: [
        'Desenvolupador backend júnior',
        'Desenvolupador Laravel, júnior',
        'Desenvolupador web PHP',
        'Desenvolupador web en pràctiques',
      ],
    },
  },

  stack: {
    title: 'El stack, amb proves.',
    intro: 'Les paraules plenes són tecnologies que he fet servir en un projecte públic. Les de contorn són al meu CV. Les puntejades les estic aprenent ara.',
    legend: { used: 'Feta servir en un projecte públic', listed: 'Al meu CV, sense repo públic encara', learning: 'Ho estic aprenent' },
    groups: { backend: 'Backend i dades', frontend: 'Frontend', tools: 'Eines i producció visual' },
    detailPrompt: 'Passa el cursor o enfoca una paraula per veure on l’he feta servir.',
    statusLabel: { used: 'Verificada en un projecte públic', listed: 'Al meu CV', learning: 'Aprenent' },
    items: {
      php: 'El llenguatge dels tres projectes backend: Supplier Manager, Gym Routine App i l’API de videojocs.',
      laravel: 'Gym Routine App (Laravel 13, autenticació amb Breeze, middleware per rols) i l’API de videojocs.',
      symfony: 'Supplier Manager amb Symfony 8: controladors, plantilles Twig, tipus de formulari i restriccions de validació.',
      sql: 'MySQL 8 darrere de Gym App i Supplier Manager (tots dos en Docker), més migracions als projectes Laravel.',
      eloquent:
        'Relacions a Gym App: una categoria té molts exercicis; una rutina pertany a molts exercicis amb sèries i repeticions desades al pivot.',
      doctrine: 'Supplier Manager: entitat Proveedor mapejada amb atributs, classe repositori i callback PreUpdate.',
      rest: 'API de videojocs: llistat, detall, filtre de disponibles, creació amb validació i esborrat, tot en JSON.',
      docker: 'docker-compose per a Gym App (PHP, Nginx, MySQL) i Supplier Manager (app i MySQL amb health check).',
      mvc: 'Models, controladors i vistes separats als tres projectes backend.',
      java: 'Part del cicle DAW. Encara sense projecte públic.',
      html: 'La pàgina de bàners (carrusel Bootstrap i vídeo) i aquest portfolio.',
      css: 'Dissenys responsive, mode fosc i adaptació taula-targetes a Supplier Manager, i el sistema de disseny d’aquesta web.',
      js: 'L’interruptor de mode fosc de Supplier Manager i totes les interaccions d’aquesta web.',
      bootstrap: 'Bootstrap 5 a Gym App, la pàgina de bàners i Supplier Manager.',
      react: 'Aquest portfolio és una aplicació React 19.',
      typescript: 'Aquest portfolio està escrit en TypeScript amb una capa de contingut tipada.',
      git: 'Cada projecte viu en un repositori públic de GitHub amb el seu historial de commits.',
      linux: 'Eina de treball indicada al meu perfil. Encara no demostrada en un repositori públic.',
      postman: 'Eina de treball indicada al meu perfil. Encara no demostrada en un repositori públic.',
      figma: 'Indicada al meu CV.',
      photoshop: 'Tres dissenys de bàner al projecte de bàners; Photoshop també consta al meu CV.',
      aftereffects: 'Animació del bàner i les peces de motion del showreel.',
      premiere: 'Indicada al meu CV.',
      motion: 'Set clips al showreel, d’animació estil producte a gràfics de mapa.',
    },
  },

  projects: {
    title: 'Feina seleccionada',
    intro: 'Quatre projectes de repositoris públics. Cada descripció surt del codi i del README.',
    labels: {
      objective: 'Objectiu',
      role: 'Què vaig construir',
      decisions: 'Decisions tècniques',
      stack: 'Stack verificat',
      source: 'Codi font',
      live: 'Demo en directe',
      openCase: 'Obre el cas d’estudi',
      gallery: 'Captures',
      endpoints: 'Endpoints a routes/api.php',
      fields: 'Camps que accepta POST /api/videojocs',
      noUpdate: 'Aquesta API no té ruta d’actualització, segons l’enunciat.',
      status: 'Estat',
      watch: 'Mira el bàner animat',
      view: 'Mira',
      drag: 'Llisca cap al costat',
      reveal: 'Com està fet',
      showBuilt: 'Mostra com està fet',
      hideBuilt: 'Mostra la captura',
      hint: 'Passa el cursor per veure-hi per sota',
    },
    statuses: { project: 'Repositori públic', exercise: 'Exercici de curs', prototype: 'Prototip — només captures' },
    index: {
      title: 'Tota la feina',
      open: 'Obre el cas d’estudi',
    },
    items: {
      supplier: {
        name: 'Supplier Manager',
        kicker: 'Symfony · CRUD',
        tagline: 'Un directori de proveïdors que converteix la taula en targetes al mòbil.',
        summary:
          'Aplicació CRUD de gestió de proveïdors amb Symfony, interfície responsive, adaptació de taula a targetes, mode fosc i entorn de desenvolupament en contenidors.',
        objective:
          'Gestionar els proveïdors d’una agència de viatges (hotels, creuers, parcs temàtics, estacions d’esquí): llistar, crear, editar i eliminar des d’una sola pantalla.',
        role: 'Controlador, entitat Doctrine amb validació, tipus de formulari, plantilles Twig i configuració Docker. El CRUD està escrit a mà, sense generadors.',
        decisions: [
          'Una plantilla, dos dissenys: taula Bootstrap des del breakpoint md i quadrícula de targetes per sota, en lloc d’una taula amb scroll lateral.',
          'Les restriccions de validació són a l’entitat (NotBlank, Length, Email, Choice), així cada regla es declara una sola vegada.',
          'Un callback de cicle de vida PreUpdate manté updated_at al dia sense codi extra al controlador.',
          'docker-compose aixeca l’app i una base MySQL 8 amb health check; el bolcat SQL es carrega a la primera arrencada.',
          'El mode fosc és una classe al body, amb les variables de taula de Bootstrap sobreescrites.',
        ],
        images: [
          'Supplier Manager en mode fosc en pantalla estreta: proveïdors com a targetes amb botons Modificar i Borrar.',
          'Supplier Manager a l’escriptori: taula de proveïdors amb accions Modificar i Borrar, al costat de l’arbre del projecte Symfony.',
        ],
        annotations: ['Disseny targetes · < 768 px', 'Disseny taula · ≥ 768 px'],
      },
      gym: {
        name: 'Gym Routine App',
        kicker: 'Laravel · Eloquent · MVC',
        tagline: 'Rutines creades amb categories i exercicis, amb sèries i repeticions desades a la relació.',
        summary:
          'Aplicació de gestió de rutines de gimnàs que demostra CRUD, relacions entre models de dades i organització MVC.',
        objective:
          'Permetre que els clients muntin les seves rutines a partir d’un catàleg de categories i exercicis, mentre un administrador manté aquest catàleg.',
        role: 'Models i migracions, controladors, vistes Blade, middleware per rols, pujada d’imatges del catàleg i entorn Docker.',
        decisions: [
          'Rutina ↔ exercici és molts a molts. El pivot desa sèries i repeticions, amb rutes pròpies per afegir, actualitzar i treure un exercici.',
          'Dos middleware separen els rols: l’admin manté el catàleg i pot veure totes les rutines; els clients gestionen només les seves.',
          'Laravel Breeze gestiona l’autenticació; els clients es registren amb dades de perfil extra en un model Client a part.',
          'docker-compose executa PHP, Nginx i MySQL 8; la base de dades es carrega d’un fitxer SQL inclòs.',
        ],
        images: [
          'Pàgina d’inici de Gym Routine App en mode clar, amb targetes de rutines i exercicis.',
          'Tauler d’administració amb comptadors de categories, rutines i exercicis, i vista prèvia de categories.',
          'Llista de categories de l’admin amb il·lustracions d’anatomia i botons Editar i Eliminar.',
          'Més categories a la llista de l’admin, amb una targeta per crear-ne una de nova.',
          'Formulari d’edició de categoria amb la imatge actual i camp de pujada.',
          'Catàleg d’exercicis amb imatges i paginació.',
          'Pantalla d’inici de sessió en mode fosc.',
        ],
        annotations: ['Inici', 'Tauler admin', 'Categories', 'Crear categoria', 'Editar categoria', 'Exercicis', 'Mode fosc'],
      },
      banners: {
        name: 'Bàners animats',
        kicker: 'Bootstrap · Photoshop · After Effects',
        tagline: 'Tres conceptes de bàner, un d’ells animat: un exercici de disseny en un carrusel Bootstrap.',
        summary: 'Projecte visual que mostra variacions de bàners animats i habilitats de disseny audiovisual.',
        objective: 'Una activitat del curs: dissenyar tres bàners, presentar-los en un carrusel Bootstrap i animar-ne un.',
        role: 'Direcció d’art i maquetació dels tres bàners a Photoshop, animació del bàner 1 a After Effects i la pàgina del carrusel.',
        decisions: [
          'Un mateix sistema visual als tres bàners (pòdium de marbre, focus, tipografia de neó) amb una paleta diferent per a cada producte.',
          'Bàners dissenyats a 1920 × 600 i mostrats com a imatges de carrusel a ample complet perquè escalin amb la finestra.',
          'L’animació es lliura en MP4 amb controls natius, perquè el visitant decideixi quan reproduir-la.',
          'Les marques (Adil’s Beats, Adil’s Motors, Adil’s Games) són marques fictícies d’exercici.',
          'Els bàners 2 i 3 inclouen imatges de tercers (cotxes i la portada d’un videojoc) usades com a material de l’exercici; no són obra original.',
        ],
        images: [
          'Bàner 1: auriculars verds sobre un pòdium de marbre entre núvols, amb preu i botó de crida a l’acció.',
          'Bàner 2: tres cotxes esportius blaus i platejats sobre un pòdium sota focus, amb preu mensual.',
          'Bàner 3: coberta d’un joc i art del personatge entre un panell verd i un de vermell, amb preu i botó d’unir-s’hi.',
        ],
        annotations: ['Bàner 01 · 1920 × 600', 'Bàner 02 · 1920 × 600', 'Bàner 03 · 1920 × 600'],
      },
      api: {
        name: 'API de gestió de videojocs',
        kicker: 'Laravel · REST · JSON',
        tagline: 'Una API JSON petita per a un catàleg de videojocs: cinc endpoints, entrada validada i codis d’estat explícits.',
        summary:
          'API Laravel de gestió de videojocs amb filtratge personalitzat, respostes JSON i CRUD sense operació d’actualització.',
        objective:
          'Una activitat del curs: exposar un catàleg de videojocs com a API amb un filtre de disponibilitat propi i, segons l’enunciat, sense operació d’actualització.',
        role: 'Disseny de rutes, controlador de l’API, model Eloquent, migració, factory i seeder.',
        decisions: [
          'La ruta fixa /videojocs/disponibles es declara abans que /videojocs/{id}; si no, el comodí la captura. Un comentari al codi documenta aquest error.',
          'L’entrada es valida abans d’inserir (títol fins a 100 caràcters, any 1950–2027, valoració 0–9,9, preu fins a 99,99); l’èxit retorna 201 Created.',
          'Un id desconegut retorna un 404 en JSON; un filtre de disponibles buit també retorna 404 amb un missatge.',
          'Una factory de model sembra deu registres, així l’API té dades des de la primera execució.',
        ],
        images: [] as string[],
        annotations: [] as string[],
        endpointNotes: {
          list: 'Tots els videojocs en JSON.',
          available: 'Només jocs amb disponibilitat = 1; 404 amb missatge si no n’hi ha cap.',
          show: 'Un joc per id; 404 amb missatge si no existeix.',
          create: 'Inserció validada; respon 201 Created.',
          remove: 'Elimina per id; 404 si no existeix.',
        },
      },
      venuepulse: {
        name: 'VenuePulse',
        kicker: 'Prototip d’interfície',
        tagline: 'Un concepte mòbil per trobar locals actius a prop.',
        summary:
          'Captures d’interfície d’un concepte mobile-first: llista de locals amb distància i aforament, vista de mapa, xat i una pantalla de pagament marcada com a demo.',
        objective: 'Explorar la interfície d’una app social en temps real al voltant de locals.',
        role: 'Disseny d’interfície i prototip front-end.',
        decisions: [
          'Només captures: el codi font encara no és públic, així que aquesta pàgina no afirma res sobre la implementació.',
          'La pantalla de pagament de les captures està marcada com a «demo — sense càrrec real».',
        ],
        images: [
          'Llista de locals amb distància i nombre de persones dins de cada un.',
          'Vista de mapa fosc de persones a prop d’un local.',
          'Quadrícula de persones amb botons de match i acció.',
          'Pantalla de conversa de xat.',
          'Pantalla d’opcions de compra.',
          'Pantalla de dades de targeta marcada com a demo sense càrrec real.',
        ],
        annotations: [] as string[],
      },
      botradar: {
        name: 'Sulake Habbo Radar',
        kicker: 'Prototip d’interfície',
        tagline: 'Un concepte de tauler de moderació: comptes marcats, senyals i sales en risc.',
        summary:
          'Captures d’interfície d’un concepte de tauler amb comptes marcats i la seva puntuació de risc, senyals de detecció i sales en risc.',
        objective: 'Explorar com un tauler de moderació podria presentar activitat sospitosa.',
        role: 'Disseny de la interfície del tauler.',
        decisions: [
          'Només captures: encara no hi ha repositori ni demo públic, així que la lògica de detecció no es presenta com a verificada.',
        ],
        images: ['Tauler amb comptadors i un gràfic de barres d’activitat recent.', 'Llista de comptes marcats amb puntuacions de risc, senyals de detecció i sales en risc.'],
        annotations: [] as string[],
      },
    },
  },

  showreel: {
    title: 'El moviment no és decoració. És comunicació.',
    intro:
      'Set peces del meu treball audiovisual, d’animació estil producte a gràfics de mapa i tutorials de pantalla editats. No es reprodueix res fins que premis play.',
    play: 'Reprodueix',
    pause: 'Pausa',
    playClip: 'Reprodueix «{title}»',
    chapters: 'Clips',
    nowShowing: 'En pantalla',
    duration: 'Durada',
    soundNote: 'Els clips es reprodueixen sense so. Fes servir el botó de l’altaveu del reproductor per activar-lo.',
    loading: 'Carregant clip…',
    error: 'No s’ha pogut carregar aquest clip. Revisa la connexió o obre el fitxer directament:',
    openFile: 'Obre l’MP4',
    timecode: 'TC',
    clips: {
      'beats-banner': {
        title: 'Bàner d’auriculars, animat',
        description:
          'La versió animada del bàner «Adil’s Beats»: auriculars flotant sobre un pòdium de marbre, una etiqueta de preu i un botó de crida a l’acció on es fa clic. Format original 1920 × 600.',
      },
      'croissant-ad': {
        title: 'Promo de croissants',
        description: 'Animació promocional de menjar: croissants orbitant un plat, una esquitxada de xocolata i retolació animada.',
      },
      'calamari-ad': {
        title: 'Animació de carta: calamars',
        description: 'Presentació d’un plat amb retolació animada i elements d’ingredients.',
      },
      'map-route': {
        title: 'Animació de ruta en mapa',
        description: 'Zoom sobre un mapa satèl·lit amb una línia de ruta animada i retolació a nivell de carrer, que acaba en un edifici ressaltat.',
      },
      'presenter-3d': {
        title: 'Presentador en un escriptori 3D',
        description: 'Imatge d’un presentador integrada en un escriptori 3D amb monitors; en una de les pantalles apareix un mapa.',
      },
      'ae-lighting': {
        title: 'After Effects: sessió d’il·luminació 3D',
        description: 'Gravació de pantalla de la configuració de llums i càmera 3D al voltant d’un pòdium a After Effects, que acaba amb l’escena il·luminada en vermell.',
      },
      'truenas-tutorial': {
        title: 'Tutorial de TrueNAS, editat',
        description: 'Un recorregut d’un minut pels pools d’emmagatzematge, recursos compartits i usuaris de TrueNAS, amb efectes d’atenuat i ressaltat afegits a l’edició.',
      },
    },
  },

  experience: {
    title: 'Un camí que va començar a l’altre costat de la pantalla.',
    intro:
      'Diversos anys en vendes i hostaleria m’han ensenyat a escoltar, negociar i mantenir la calma quan un servei se complica. Això és el que aporto al programari.',
    items: {
      daw: {
        role: 'Cicle Formatiu de Grau Superior en Desenvolupament d’Aplicacions Web (DAW)',
        org: 'Institut Baix Camp — Reus',
        period: '2025 – Actualitat',
        text: 'Desenvolupament d’aplicacions web amb PHP, Laravel, JavaScript, Java, SQL, bases de dades relacionals i eines de desenvolupament.',
      },
      beach: {
        role: 'Encarregat de restaurant',
        org: 'Beach House La Mora',
        period: 'Ago 2023 – Set 2025',
        text: 'Coordinació d’equip, operativa del restaurant, control d’estoc, atenció al client i resolució de problemes en entorns exigents.',
      },
      quattros: {
        role: 'Cambrer',
        org: 'Quattros',
        period: 'Ago 2022 – Jul 2023',
        text: 'Atenció al client i treball en equip en un entorn d’hostaleria de ritme ràpid.',
      },
      navarro: {
        role: 'Assessor comercial d’automoció',
        org: 'Navarro Automoción',
        period: 'Gen 2018 – Jul 2021',
        text: 'Venda de vehicles, negociació, comunicació amb el client, documentació, contractes i seguiment.',
      },
      school: {
        role: 'Batxillerat de Ciències de la Naturalesa',
        org: 'Institut Comte de Rius · Cambra de Comerç',
        period: '2015 – 2016',
        text: '',
      },
    },
    present: 'Actualitat',
    languages: {
      title: 'Idiomes',
      main: 'Idiomes de treball',
      extra: 'A més',
      levels: { native: 'Natiu', advanced: 'Avançat', intermediate: 'Intermedi', basic: 'Bàsic' },
      names: { ar: 'Àrab', es: 'Castellà', en: 'Anglès', fr: 'Francès', ca: 'Català' },
      catalanNote: 'Bàsic — comprensió',
    },
  },

  contact: {
    title: 'La bona enginyeria comença amb una conversa.',
    text: 'Disponible per a pràctiques (FCT), oportunitats com a desenvolupador júnior i col·laboracions de desenvolupament web a la zona Tarragona–Reus.',
    email: 'Envia un correu',
    copy: 'Copia l’adreça de correu',
    copied: 'Adreça copiada',
    copyFailed: 'No s’ha pogut copiar. Selecciona l’adreça i copia-la a mà.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Descarrega el CV',
    cvLanguage: 'Idioma del CV',
    phone: 'Telèfon',
    emailLabel: 'Correu',
    localTime: 'Hora local a Tarragona',
    cvNames: {
      ca: 'Català',
      es: 'Español',
      en: 'English',
    },
  },

  footer: {
    rights: '© {year} Adil Chainakh',
    built: 'Dissenyat i programat a mà. React, TypeScript, GSAP i WebGL.',
    top: 'Torna amunt',
  },
};
