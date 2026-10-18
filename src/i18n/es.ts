import type { Dict } from './en';

/** ESPAÑOL — typed as Dict: a missing key is a compile error. */
export const es: Dict = {
  htmlLang: 'es',

  documentTitle: 'Adil Chainakh — Desarrollador backend y motion designer',

  a11y: {
    skipToContent: 'Saltar al contenido principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    mainNav: 'Navegación principal',
    language: 'Idioma',
    close: 'Cerrar',
    newTab: '(se abre en una pestaña nueva)',
    portrait: 'Retrato de Adil Chainakh. Al mover el puntero por encima se revela una capa de código.',
    loading: 'Cargando el portfolio',
    demo: 'Ilustración animada del flujo de ScoutWand: se escribe una búsqueda, aparecen ofertas de empleo y un formulario se rellena solo con los datos de un CV.',
    drag: 'Arrastra hacia los lados para ver más',
  },

  nav: {
    work: 'Trabajo',
    scoutwand: 'ScoutWand',
    showreel: 'Showreel',
    stack: 'Stack',
    journey: 'Trayectoria',
    contact: 'Contacto',
    cv: 'CV',
  },

  availability: {
    short: 'Disponible para prácticas (FCT)',
    long: 'Disponible para prácticas (FCT) y oportunidades como desarrollador junior.',
  },

  hero: {
    role: 'Desarrollador backend y motion designer',
    place: 'Reus, España',
    intro: 'Construyo la lógica detrás de las aplicaciones web y el movimiento que las hace sentir vivas. Estudio DAW en Reus y publico mi propia aplicación de escritorio.',
    ctaWork: 'Ver mi trabajo',
    ctaContact: 'Saludar',
    hint: 'Muévete sobre mí. Haz clic.',
    scroll: 'Scroll',
    loading: 'Cargando',
  },

  manifesto: {
    statement: 'Escribo la lógica que sostiene una aplicación, y me importa igual cómo se mueve, cómo se lee y qué se siente la primera vez que alguien la abre.',
    facts: [
      'idiomas de trabajo',
      'piezas de motion en el showreel',
      'repositorios públicos',
      'aplicación de escritorio publicada',
    ],
  },

  scout: {
    title: 'ScoutWand',
    lede: 'Una aplicación de escritorio que rastrea portales de empleo por ti. Creé la web con Laravel y Tailwind, y la aplicación con Python.',
    steps: [
      {
        title: 'Tú escribes.',
        text: 'Describe el puesto que buscas y dónde. ScoutWand lo busca en LinkedIn, Indeed e InfoJobs.',
      },
      {
        title: 'Rastrea por ti.',
        text: 'Las ofertas que encajan llegan en una sola lista, cada una con un enlace directo al anuncio original.',
      },
      {
        title: 'Tú solicitas.',
        text: 'El autorrelleno completa nombre, localidad y teléfono desde tu CV en el navegador integrado de la aplicación. Tú revisas todo y pulsas solicitar.',
      },
    ],
    facts: [
      'Windows y macOS',
      'Plan gratuito disponible',
      'El CV y las sesiones se quedan en tu ordenador',
      'Las licencias de pago se comprueban en tu ordenador y siguen funcionando sin conexión entre renovaciones',
    ],
    built: {
      site: 'Web',
      siteTech: 'PHP, Laravel, Tailwind CSS',
      app: 'Aplicación',
      appTech: 'Python',
    },
    cta: 'Visitar scoutwand.com',
    caption: 'Ilustración del flujo. Las ofertas mostradas son ejemplos, no datos reales.',
    mock: {
      query: 'Desarrollador web junior, PHP o Laravel',
      where: 'Tarragona, Reus, Barcelona',
      search: 'Rastrear',
      matches: 'coincidencias',
      apply: 'Solicitar',
      fromCv: 'Rellenado desde tu CV',
      name: 'Nombre',
      city: 'Localidad',
      phone: 'Teléfono',
      review: 'Tú revisas. Tú pulsas solicitar.',
      titles: [
        'Desarrollador backend junior',
        'Desarrollador Laravel, junior',
        'Desarrollador web PHP',
        'Desarrollador web en prácticas',
      ],
    },
  },

  stack: {
    title: 'El stack, con pruebas.',
    intro: 'Las palabras rellenas son tecnologías que he usado en un proyecto público. Las de contorno están en mi CV. Las punteadas las estoy aprendiendo ahora.',
    legend: { used: 'Usada en un proyecto público', listed: 'En mi CV, sin repo público aún', learning: 'Aprendiendo ahora' },
    groups: { backend: 'Backend y datos', frontend: 'Frontend', tools: 'Herramientas y producción visual' },
    detailPrompt: 'Pasa el cursor o enfoca una palabra para ver dónde la he usado.',
    statusLabel: { used: 'Verificada en un proyecto público', listed: 'En mi CV', learning: 'Aprendiendo' },
    items: {
      php: 'El lenguaje de los tres proyectos backend: Supplier Manager, Gym Routine App y la API de videojuegos.',
      laravel: 'Gym Routine App (Laravel 13, autenticación con Breeze, middleware por roles) y la API de videojuegos.',
      symfony: 'Supplier Manager con Symfony 8: controladores, plantillas Twig, tipos de formulario y restricciones de validación.',
      sql: 'MySQL 8 detrás de Gym App y Supplier Manager (ambos en Docker), más migraciones en los proyectos Laravel.',
      eloquent:
        'Relaciones en Gym App: una categoría tiene muchos ejercicios; una rutina pertenece a muchos ejercicios con series y repeticiones guardadas en el pivote.',
      doctrine: 'Supplier Manager: entidad Proveedor mapeada con atributos, clase repositorio y callback PreUpdate.',
      rest: 'API de videojuegos: listado, detalle, filtro de disponibles, creación con validación y borrado, todo en JSON.',
      docker: 'docker-compose para Gym App (PHP, Nginx, MySQL) y Supplier Manager (app y MySQL con health check).',
      mvc: 'Modelos, controladores y vistas separados en los tres proyectos backend.',
      java: 'Parte del ciclo DAW. Aún sin proyecto público.',
      html: 'La página de banners (carrusel Bootstrap y vídeo) y este portfolio.',
      css: 'Diseños responsive, modo oscuro y adaptación tabla-tarjetas en Supplier Manager, y el sistema de diseño de esta web.',
      js: 'El interruptor de modo oscuro de Supplier Manager y todas las interacciones de esta web.',
      bootstrap: 'Bootstrap 5 en Gym App, la página de banners y Supplier Manager.',
      react: 'Este portfolio es una aplicación React 19.',
      typescript: 'Este portfolio está escrito en TypeScript con una capa de contenido tipada.',
      git: 'Cada proyecto vive en un repositorio público de GitHub con su historial de commits.',
      linux: 'Herramienta de trabajo indicada en mi perfil. Aún no demostrada en un repositorio público.',
      postman: 'Herramienta de trabajo indicada en mi perfil. Aún no demostrada en un repositorio público.',
      figma: 'Indicada en mi CV.',
      photoshop: 'Tres diseños de banner en el proyecto de banners; Photoshop también figura en mi CV.',
      aftereffects: 'Animación del banner y las piezas de motion del showreel.',
      premiere: 'Indicada en mi CV.',
      motion: 'Siete clips en el showreel, de animación estilo producto a gráficos de mapa.',
    },
  },

  projects: {
    title: 'Trabajo seleccionado',
    intro: 'Cuatro proyectos de repositorios públicos. Cada descripción sale del código y del README.',
    labels: {
      objective: 'Objetivo',
      role: 'Qué construí',
      decisions: 'Decisiones técnicas',
      stack: 'Stack verificado',
      source: 'Código fuente',
      live: 'Demo en vivo',
      openCase: 'Abrir caso de estudio',
      gallery: 'Capturas',
      endpoints: 'Endpoints en routes/api.php',
      fields: 'Campos que acepta POST /api/videojocs',
      noUpdate: 'Esta API no tiene ruta de actualización, según el enunciado.',
      status: 'Estado',
      watch: 'Ver el banner animado',
      view: 'Ver',
      drag: 'Desliza hacia el lado',
      reveal: 'Cómo está hecho',
      showBuilt: 'Ver cómo está hecho',
      hideBuilt: 'Ver la captura',
      hint: 'Pasa el cursor para ver por debajo',
    },
    statuses: { project: 'Repositorio público', exercise: 'Ejercicio de curso', prototype: 'Prototipo — solo capturas' },
    index: {
      title: 'Todo el trabajo',
      open: 'Abrir caso de estudio',
    },
    items: {
      supplier: {
        name: 'Supplier Manager',
        kicker: 'Symfony · CRUD',
        tagline: 'Un directorio de proveedores que convierte su tabla en tarjetas en el móvil.',
        summary:
          'Aplicación CRUD de gestión de proveedores con Symfony, interfaz responsive, adaptación de tabla a tarjetas, modo oscuro y entorno de desarrollo en contenedores.',
        objective:
          'Gestionar los proveedores de una agencia de viajes (hoteles, cruceros, parques temáticos, estaciones de esquí): listar, crear, editar y eliminar desde una sola pantalla.',
        role: 'Controlador, entidad Doctrine con validación, tipo de formulario, plantillas Twig y configuración Docker. El CRUD está escrito a mano, sin generadores.',
        decisions: [
          'Una plantilla, dos diseños: tabla Bootstrap desde el breakpoint md y rejilla de tarjetas por debajo, en lugar de una tabla con scroll lateral.',
          'Las restricciones de validación están en la entidad (NotBlank, Length, Email, Choice), así cada regla se declara una sola vez.',
          'Un callback de ciclo de vida PreUpdate mantiene updated_at al día sin código extra en el controlador.',
          'docker-compose levanta la app y una base MySQL 8 con health check; el volcado SQL se carga en el primer arranque.',
          'El modo oscuro es una clase en el body, con las variables de tabla de Bootstrap sobrescritas.',
        ],
        images: [
          'Supplier Manager en modo oscuro en pantalla estrecha: proveedores como tarjetas con botones Modificar y Borrar.',
          'Supplier Manager en escritorio: tabla de proveedores con acciones Modificar y Borrar, junto al árbol del proyecto Symfony.',
        ],
        annotations: ['Diseño tarjetas · < 768 px', 'Diseño tabla · ≥ 768 px'],
      },
      gym: {
        name: 'Gym Routine App',
        kicker: 'Laravel · Eloquent · MVC',
        tagline: 'Rutinas creadas con categorías y ejercicios, con series y repeticiones guardadas en la relación.',
        summary:
          'Aplicación de gestión de rutinas de gimnasio que demuestra CRUD, relaciones entre modelos de datos y organización MVC.',
        objective:
          'Permitir que los clientes armen sus rutinas a partir de un catálogo de categorías y ejercicios, mientras un administrador mantiene ese catálogo.',
        role: 'Modelos y migraciones, controladores, vistas Blade, middleware por roles, subida de imágenes del catálogo y entorno Docker.',
        decisions: [
          'Rutina ↔ ejercicio es muchos a muchos. El pivote guarda series y repeticiones, con rutas propias para añadir, actualizar y quitar un ejercicio.',
          'Dos middleware separan los roles: el admin mantiene el catálogo y puede ver todas las rutinas; los clientes gestionan solo las suyas.',
          'Laravel Breeze gestiona la autenticación; los clientes se registran con datos de perfil extra en un modelo Client aparte.',
          'docker-compose ejecuta PHP, Nginx y MySQL 8; la base de datos se carga desde un archivo SQL incluido.',
        ],
        images: [
          'Página de inicio de Gym Routine App en modo claro, con tarjetas de rutinas y ejercicios.',
          'Panel de administración con contadores de categorías, rutinas y ejercicios, y vista previa de categorías.',
          'Lista de categorías del admin con ilustraciones de anatomía y botones Editar y Eliminar.',
          'Más categorías en la lista del admin, con una tarjeta para crear una nueva.',
          'Formulario de edición de categoría con la imagen actual y campo de subida.',
          'Catálogo de ejercicios con imágenes y paginación.',
          'Pantalla de inicio de sesión en modo oscuro.',
        ],
        annotations: ['Inicio', 'Panel admin', 'Categorías', 'Crear categoría', 'Editar categoría', 'Ejercicios', 'Modo oscuro'],
      },
      banners: {
        name: 'Banners animados',
        kicker: 'Bootstrap · Photoshop · After Effects',
        tagline: 'Tres conceptos de banner, uno animado: un ejercicio de diseño en un carrusel Bootstrap.',
        summary: 'Proyecto visual que muestra variaciones de banners animados y habilidades de diseño audiovisual.',
        objective: 'Una actividad del curso: diseñar tres banners, presentarlos en un carrusel Bootstrap y animar uno.',
        role: 'Dirección de arte y maquetación de los tres banners en Photoshop, animación del banner 1 en After Effects y la página del carrusel.',
        decisions: [
          'Un mismo sistema visual en los tres banners (pódium de mármol, focos, tipografía de neón) con una paleta distinta para cada producto.',
          'Banners diseñados a 1920 × 600 y mostrados como imágenes de carrusel a ancho completo para que escalen con la ventana.',
          'La animación se entrega en MP4 con controles nativos, para que el visitante decida cuándo reproducirla.',
          'Las marcas (Adil’s Beats, Adil’s Motors, Adil’s Games) son marcas ficticias de ejercicio.',
          'Los banners 2 y 3 incluyen imágenes de terceros (coches y la portada de un videojuego) usadas como material del ejercicio; no son obra original.',
        ],
        images: [
          'Banner 1: auriculares verdes sobre un pódium de mármol entre nubes, con precio y botón de llamada a la acción.',
          'Banner 2: tres coches deportivos azules y plateados sobre un pódium bajo focos, con precio mensual.',
          'Banner 3: carátula de un juego y arte del personaje entre un panel verde y otro rojo, con precio y botón de unirse.',
        ],
        annotations: ['Banner 01 · 1920 × 600', 'Banner 02 · 1920 × 600', 'Banner 03 · 1920 × 600'],
      },
      api: {
        name: 'API de gestión de videojuegos',
        kicker: 'Laravel · REST · JSON',
        tagline: 'Una API JSON pequeña para un catálogo de videojuegos: cinco endpoints, entrada validada y códigos de estado explícitos.',
        summary:
          'API Laravel de gestión de videojuegos con filtrado personalizado, respuestas JSON y CRUD sin operación de actualización.',
        objective:
          'Una actividad del curso: exponer un catálogo de videojuegos como API con un filtro de disponibilidad propio y, según el enunciado, sin operación de actualización.',
        role: 'Diseño de rutas, controlador de la API, modelo Eloquent, migración, factory y seeder.',
        decisions: [
          'La ruta fija /videojocs/disponibles se declara antes que /videojocs/{id}; si no, el comodín la captura. Un comentario en el código documenta ese fallo.',
          'La entrada se valida antes de insertar (título hasta 100 caracteres, año 1950–2027, valoración 0–9,9, precio hasta 99,99); el éxito devuelve 201 Created.',
          'Un id desconocido devuelve un 404 en JSON; un filtro de disponibles vacío también devuelve 404 con un mensaje.',
          'Una factory de modelo siembra diez registros, así la API tiene datos desde la primera ejecución.',
        ],
        images: [] as string[],
        annotations: [] as string[],
        endpointNotes: {
          list: 'Todos los videojuegos en JSON.',
          available: 'Solo juegos con disponibilitat = 1; 404 con mensaje si no hay ninguno.',
          show: 'Un juego por id; 404 con mensaje si no existe.',
          create: 'Inserción validada; responde 201 Created.',
          remove: 'Elimina por id; 404 si no existe.',
        },
      },
      venuepulse: {
        name: 'VenuePulse',
        kicker: 'Prototipo de interfaz',
        tagline: 'Un concepto móvil para encontrar locales activos cerca.',
        summary:
          'Capturas de interfaz de un concepto mobile-first: lista de locales con distancia y aforo, vista de mapa, chat y una pantalla de pago marcada como demo.',
        objective: 'Explorar la interfaz de una app social en tiempo real alrededor de locales.',
        role: 'Diseño de interfaz y prototipo front-end.',
        decisions: [
          'Solo capturas: el código fuente aún no es público, así que esta página no afirma nada sobre la implementación.',
          'La pantalla de pago de las capturas está marcada como «demo — sin cargo real».',
        ],
        images: [
          'Lista de locales con distancia y número de personas dentro de cada uno.',
          'Vista de mapa oscuro de personas cerca de un local.',
          'Rejilla de personas con botones de match y acción.',
          'Pantalla de conversación de chat.',
          'Pantalla de opciones de compra.',
          'Pantalla de datos de tarjeta marcada como demo sin cargo real.',
        ],
        annotations: [] as string[],
      },
      botradar: {
        name: 'Sulake Habbo Radar',
        kicker: 'Prototipo de interfaz',
        tagline: 'Un concepto de panel de moderación: cuentas marcadas, señales y salas en riesgo.',
        summary:
          'Capturas de interfaz de un concepto de panel con cuentas marcadas y su puntuación de riesgo, señales de detección y salas en riesgo.',
        objective: 'Explorar cómo un panel de moderación podría presentar actividad sospechosa.',
        role: 'Diseño de la interfaz del panel.',
        decisions: [
          'Solo capturas: aún no hay repositorio ni demo público, así que la lógica de detección no se presenta como verificada.',
        ],
        images: ['Panel con contadores y un gráfico de barras de actividad reciente.', 'Lista de cuentas marcadas con puntuaciones de riesgo, señales de detección y salas en riesgo.'],
        annotations: [] as string[],
      },
    },
  },

  showreel: {
    title: 'El movimiento no es decoración. Es comunicación.',
    intro:
      'Siete piezas de mi trabajo audiovisual, de animación estilo producto a gráficos de mapa y tutoriales de pantalla editados. Nada se reproduce hasta que pulses play.',
    play: 'Reproducir',
    pause: 'Pausar',
    playClip: 'Reproducir «{title}»',
    chapters: 'Clips',
    nowShowing: 'En pantalla',
    duration: 'Duración',
    soundNote: 'Los clips se reproducen sin sonido. Usa el botón del altavoz del reproductor para activarlo.',
    loading: 'Cargando clip…',
    error: 'No se pudo cargar este clip. Revisa tu conexión o abre el archivo directamente:',
    openFile: 'Abrir el MP4',
    timecode: 'TC',
    clips: {
      'beats-banner': {
        title: 'Banner de auriculares, animado',
        description:
          'La versión animada del banner «Adil’s Beats»: auriculares flotando sobre un pódium de mármol, una etiqueta de precio y un botón de llamada a la acción en el que se hace clic. Formato original 1920 × 600.',
      },
      'croissant-ad': {
        title: 'Promo de croissants',
        description: 'Animación promocional de comida: croissants orbitando un plato, una salpicadura de chocolate y rotulación animada.',
      },
      'calamari-ad': {
        title: 'Animación de carta: calamares',
        description: 'Presentación de un plato con rotulación animada y elementos de ingredientes.',
      },
      'map-route': {
        title: 'Animación de ruta en mapa',
        description: 'Zoom sobre un mapa satélite con una línea de ruta animada y rotulación a nivel de calle, que termina en un edificio resaltado.',
      },
      'presenter-3d': {
        title: 'Presentador en un escritorio 3D',
        description: 'Imagen de un presentador integrada en un escritorio 3D con monitores; en una de las pantallas aparece un mapa.',
      },
      'ae-lighting': {
        title: 'After Effects: sesión de iluminación 3D',
        description: 'Grabación de pantalla de la configuración de luces y cámara 3D alrededor de un pódium en After Effects, que termina con la escena iluminada en rojo.',
      },
      'truenas-tutorial': {
        title: 'Tutorial de TrueNAS, editado',
        description: 'Un recorrido de un minuto por los pools de almacenamiento, recursos compartidos y usuarios de TrueNAS, con efectos de atenuado y resaltado añadidos en la edición.',
      },
    },
  },

  experience: {
    title: 'Un camino que empezó al otro lado de la pantalla.',
    intro:
      'Varios años en ventas y hostelería me enseñaron a escuchar, negociar y mantener la calma cuando un servicio se complica. Eso es lo que aporto al software.',
    items: {
      daw: {
        role: 'Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
        org: 'Institut Baix Camp — Reus',
        period: '2025 – Actualidad',
        text: 'Desarrollo de aplicaciones web con PHP, Laravel, JavaScript, Java, SQL, bases de datos relacionales y herramientas de desarrollo.',
      },
      beach: {
        role: 'Encargado de restaurante',
        org: 'Beach House La Mora',
        period: 'Ago 2023 – Sep 2025',
        text: 'Coordinación de equipo, operativa del restaurante, control de stock, atención al cliente y resolución de problemas en entornos exigentes.',
      },
      quattros: {
        role: 'Camarero',
        org: 'Quattros',
        period: 'Ago 2022 – Jul 2023',
        text: 'Atención al cliente y trabajo en equipo en un entorno de hostelería de ritmo rápido.',
      },
      navarro: {
        role: 'Asesor comercial de automoción',
        org: 'Navarro Automoción',
        period: 'Ene 2018 – Jul 2021',
        text: 'Venta de vehículos, negociación, comunicación con el cliente, documentación, contratos y seguimiento.',
      },
      school: {
        role: 'Bachillerato de Ciencias de la Naturaleza',
        org: 'Institut Comte de Rius · Cambra de Comerç',
        period: '2015 – 2016',
        text: '',
      },
    },
    present: 'Actualidad',
    languages: {
      title: 'Idiomas',
      main: 'Idiomas de trabajo',
      extra: 'Además',
      levels: { native: 'Nativo', advanced: 'Avanzado', intermediate: 'Intermedio', basic: 'Básico' },
      names: { ar: 'Árabe', es: 'Español', en: 'Inglés', fr: 'Francés', ca: 'Catalán' },
      catalanNote: 'Básico — comprensión',
    },
  },

  contact: {
    title: 'La buena ingeniería empieza con una conversación.',
    text: 'Disponible para prácticas (FCT), oportunidades como desarrollador junior y colaboraciones de desarrollo web en la zona Tarragona–Reus.',
    email: 'Enviar un correo',
    copy: 'Copiar dirección de correo',
    copied: 'Dirección copiada',
    copyFailed: 'No se pudo copiar. Selecciona la dirección y cópiala a mano.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'Descargar CV',
    cvLanguage: 'Idioma del CV',
    phone: 'Teléfono',
    emailLabel: 'Correo',
    localTime: 'Hora local en Tarragona',
    cvNames: {
      ca: 'Català',
      es: 'Español',
      en: 'English',
    },
  },

  footer: {
    rights: '© {year} Adil Chainakh',
    built: 'Diseñado y programado a mano. React, TypeScript, GSAP y WebGL.',
    top: 'Volver arriba',
  },
};
