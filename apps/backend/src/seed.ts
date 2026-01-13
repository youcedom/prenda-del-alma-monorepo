import configPromise from '../payload.config'
import { getPayload } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const artists = [
    {
        name: 'Gabriel Orozco',
        country: 'México',
        birthYear: 1962,
        image: 'https://picsum.photos/id/1011/300/300',
        bio: 'Gabriel Orozco es uno de los artistas contemporáneos más influyentes. Su práctica vaga entre el dibujo, la fotografía, la escultura y la instalación. Utiliza materiales cotidianos y situaciones encontradas para explorar la relación entre los objetos y el espacio humano.',
        disciplines: [{ name: 'Escultura' }, { name: 'Fotografía' }, { name: 'Instalación' }],
        movements: ['Arte Conceptual', 'Posminimalismo'],
        type: 'Individual'
    },
    {
        name: 'Beatriz Milhazes',
        country: 'Brasil',
        birthYear: 1960,
        image: 'https://picsum.photos/id/1027/300/300',
        bio: 'Beatriz Milhazes es conocida por su trabajo colorido y patrones geométricos que fusionan el modernismo con el barroco brasileño. Su técnica única de transferencia de pintura le permite crear superficies vibrantes y complejas.',
        disciplines: [{ name: 'Pintura' }, { name: 'Collage' }, { name: 'Grabado' }],
        movements: ['Modernismo', 'Abstracción Geométrica'],
        type: 'Individual'
    },
    {
        name: 'Doris Salcedo',
        country: 'Colombia',
        birthYear: 1958,
        image: 'https://picsum.photos/id/1005/300/300',
        bio: 'Escultora que aborda el dolor, el trauma y la pérdida en el contexto del conflicto político colombiano. Sus obras transforman objetos domésticos en monumentos silenciosos al sufrimiento humano.',
        disciplines: [{ name: 'Escultura' }, { name: 'Instalación' }],
        movements: ['Arte Político', 'Minimalismo'],
        type: 'Individual'
    },
    {
        name: 'Tania Bruguera',
        country: 'Cuba',
        birthYear: 1968,
        image: 'https://picsum.photos/id/338/300/300',
        bio: 'Artista de performance e instalación política que explora el papel del arte en la vida social y política. Acuñó el término "Arte de Conducta" para describir su práctica.',
        disciplines: [{ name: 'Performance' }, { name: 'Instalación' }, { name: 'Video' }],
        movements: ['Arte de Conducta', 'Activismo'],
        type: 'Individual'
    },
    {
        name: 'Alfredo Jaar',
        country: 'Chile',
        birthYear: 1956,
        image: 'https://picsum.photos/id/433/300/300',
        bio: 'Arquitecto, cineasta y artista visual conocido por sus instalaciones que abordan crisis humanitarias y la desensibilización de los medios.',
        disciplines: [{ name: 'Instalación' }, { name: 'Fotografía' }, { name: 'Video' }],
        movements: ['Arte Conceptual', 'Crítica Institucional'],
        type: 'Individual'
    },
    {
        name: 'Teresa Margolles',
        country: 'México',
        birthYear: 1963,
        image: 'https://picsum.photos/id/534/300/300',
        bio: 'Examina las causas sociales de la muerte y la violencia en México. Su trabajo es visceral y a menudo utiliza materiales forenses para confrontar al espectador.',
        disciplines: [{ name: 'Instalación' }, { name: 'Fotografía' }, { name: 'Performance' }],
        movements: ['Realismo', 'Arte Forense'],
        type: 'Individual'
    },
    {
        name: 'Los Carpinteros',
        country: 'Cuba',
        birthYear: 1992,
        image: 'https://picsum.photos/id/870/300/300',
        bio: 'Colectivo artístico fundado en La Habana. Su obra fusiona arquitectura, escultura y diseño, explorando con humor e ironía la funcionalidad de los objetos y las ideologías políticas.',
        disciplines: [{ name: 'Escultura' }, { name: 'Acuarela' }, { name: 'Instalación' }],
        movements: ['Arte Conceptual', 'Arte Cubano Contemporáneo'],
        type: 'Collective'
    },
    {
        name: 'Mondongo',
        country: 'Argentina',
        birthYear: 1999,
        image: 'https://picsum.photos/id/900/300/300',
        bio: 'Grupo de arte argentino conocido por sus retratos y paisajes complejos hechos con materiales no convencionales como plastilina, hilos, galletas y carne.',
        disciplines: [{ name: 'Pintura' }, { name: 'Assemblage' }],
        movements: ['Arte Contemporáneo Argentino', 'Realismo Matérico'],
        type: 'Collective'
    },
    {
        name: 'TRES',
        country: 'México',
        birthYear: 2009,
        image: 'https://picsum.photos/id/950/300/300',
        bio: 'Colectivo de investigación artística enfocado en las implicaciones ecológicas y políticas de la basura y los desechos en el espacio público.',
        disciplines: [{ name: 'Fotografía' }, { name: 'Investigación' }, { name: 'Publicación' }],
        movements: ['Ecología Política', 'Arte de Investigación'],
        type: 'Collective'
    }
];

const galleries = [
    { type: 'Gallery', name: 'Kurimanzutto', location: 'Ciudad de México, México', image: 'https://picsum.photos/id/1/600/400', description: 'Fundada en 1999, Kurimanzutto representa a artistas contemporáneos de renombre mundial.' },
    { type: 'Gallery', name: 'Fortes D\'Aloia & Gabriel', location: 'São Paulo, Brasil', image: 'https://picsum.photos/id/2/600/400', description: 'Una de las galerías líderes en Brasil, con un programa dinámico de artistas brasileños e internacionales.' },
    { type: 'Gallery', name: 'Galería OMR', location: 'Ciudad de México, México', image: 'https://picsum.photos/id/3/600/400', description: 'Espacio de referencia para el arte de vanguardia desde los años 80.' },
    { type: 'Gallery', name: 'Mor Charpentier', location: 'Bogotá, Colombia', image: 'https://picsum.photos/id/4/600/400', description: 'Centrada en artistas que exploran la historia, la política y la identidad en América Latina.' },
    { type: 'Gallery', name: 'Mendes Wood DM', location: 'São Paulo, Brasil', image: 'https://picsum.photos/id/5/600/400', description: 'Conocida por su enfoque en el diálogo entre el arte brasileño histórico y contemporáneo.' },
    { type: 'Museum', institutionType: 'Museo', name: 'MALBA', location: 'Buenos Aires, Argentina', image: 'https://picsum.photos/id/401/600/400', description: 'Museo de Arte Latinoamericano de Buenos Aires. Alberga una de las colecciones más importantes de arte latinoamericano del siglo XX y XXI.' },
    { type: 'Museum', institutionType: 'Fundación', name: 'Museo Jumex', location: 'Ciudad de México, México', image: 'https://picsum.photos/id/402/600/400', description: 'La fundación privada de arte contemporáneo más importante de Latinoamérica, diseñada por David Chipperfield.' },
    { type: 'Museum', institutionType: 'Museo', name: 'MASP', location: 'São Paulo, Brasil', image: 'https://picsum.photos/id/403/600/400', description: 'Museu de Arte de São Paulo Assis Chateaubriand. Un icono de la arquitectura moderna con la colección más importante de arte latinoamericano.' },
    { type: 'Museum', institutionType: 'Museo', name: 'MAC Lima', location: 'Lima, Perú', image: 'https://picsum.photos/id/404/600/400', description: 'Museo de Arte Contemporáneo de Lima, dedicado exclusivamente a la promoción, investigación y difusión de las prácticas artísticas contemporáneas.' },
    { type: 'Museum', institutionType: 'Museo', name: 'MAMBO', location: 'Bogotá, Colombia', image: 'https://picsum.photos/id/405/600/400', description: 'Museo de Arte Moderno de Bogotá. Una institución multicultural y dinámica que investiga, comunica y expone el patrimonio cultural.' },

];

const artworks = [
    {
        title: 'Ecos del Desierto',
        artistName: 'Gabriel Orozco',
        galleryName: 'Kurimanzutto',
        year: 2023,
        image: 'https://picsum.photos/id/28/600/700',
        medium: 'Óleo sobre lino',
        dimensions: '120 x 100 cm',
        category: 'pintura',
        description: 'Esta pieza monumental, "Ecos del Desierto", marca un retorno de Orozco a la pintura figurativa tras años de experimentación conceptual. La obra no solo retrata la aridez geográfica, sino que funciona como una meditación sobre el aislamiento contemporáneo.',
        likes: 124
    },
    { title: 'Geometría Tropical', artistName: 'Beatriz Milhazes', galleryName: 'Fortes D\'Aloia & Gabriel', year: 2022, image: 'https://picsum.photos/id/48/600/600', medium: 'Acrílico sobre lienzo', dimensions: '200 x 200 cm', category: 'pintura', likes: 89 },
    { title: 'Silencio Tácito', artistName: 'Doris Salcedo', galleryName: 'White Cube', year: 2024, image: 'https://picsum.photos/id/58/500/700', medium: 'Madera y concreto', dimensions: 'Variables', category: 'escultura', likes: 215 },
    { title: 'Estudio de Luz', artistName: 'Alfredo Jaar', galleryName: 'Galería Lelong', year: 2021, image: 'https://picsum.photos/id/76/800/600', medium: 'Fotografía digital', dimensions: '80 x 120 cm', category: 'fotografia', likes: 45 },
    { title: 'Memoria Rota', artistName: 'Teresa Margolles', galleryName: 'Galería Peter Kilchmann', year: 2023, image: 'https://picsum.photos/id/88/600/800', medium: 'Instalación mixta', dimensions: 'Variables', category: 'escultura', likes: 132 },
    { title: 'Sin Título (Serie Azul)', artistName: 'Gabriel Orozco', galleryName: 'Kurimanzutto', year: 2019, image: 'https://picsum.photos/id/106/500/500', medium: 'Gouache sobre papel', dimensions: '50 x 50 cm', category: 'pintura', likes: 67 },
    { title: 'Carnaval en Río', artistName: 'Beatriz Milhazes', galleryName: 'Fortes D\'Aloia & Gabriel', year: 2020, image: 'https://picsum.photos/id/116/700/500', medium: 'Collage', dimensions: '150 x 100 cm', category: 'pintura', likes: 98 },
    { title: 'Retrato Urbano', artistName: 'Alfredo Jaar', galleryName: 'Galería Lelong', year: 2018, image: 'https://picsum.photos/id/200/800/600', medium: 'Fotografía', dimensions: '60 x 90 cm', category: 'fotografia', likes: 34 },
    { title: 'Fragmentos', artistName: 'Doris Salcedo', galleryName: 'White Cube', year: 2021, image: 'https://picsum.photos/id/210/500/600', medium: 'Muebles ensamblados', dimensions: 'Variables', category: 'escultura', likes: 156 },
    { title: 'Faro Tumbado', artistName: 'Los Carpinteros', galleryName: 'Galería Habana', year: 2006, image: 'https://picsum.photos/id/220/600/600', medium: 'Acuarela sobre papel', dimensions: '150 x 200 cm', category: 'pintura', likes: 210 },
    { title: 'Calavera', artistName: 'Mondongo', galleryName: 'Barro Arte', year: 2015, image: 'https://picsum.photos/id/230/600/600', medium: 'Plastilina sobre madera', dimensions: '100 x 100 cm', category: 'escultura', likes: 112 },
    { title: 'Abaporu (Estudio)', artistName: 'Tarsila do Amaral', galleryName: 'MALBA', year: 1928, image: 'https://picsum.photos/id/1001/600/700', medium: 'Óleo sobre lienzo', dimensions: '85 x 73 cm', category: 'pintura', likes: 543 },
    { title: 'Manifestación', artistName: 'Antonio Berni', galleryName: 'MALBA', year: 1934, image: 'https://picsum.photos/id/1002/800/600', medium: 'Temple sobre arpillera', dimensions: '180 x 249 cm', category: 'pintura', likes: 321 },
    { title: 'Maman', artistName: 'Louise Bourgeois', galleryName: 'Museo Jumex', year: 1999, image: 'https://picsum.photos/id/1003/600/600', medium: 'Bronce, acero inoxidable y mármol', dimensions: '927 x 891 x 1024 cm', category: 'escultura', likes: 890 }
];

const events = [
    {
        name: 'Zona Maco 2025',
        location: 'Centro Citibanamex, CDMX',
        startDate: '2025-02-05T00:00:00.000Z',
        endDate: '2025-02-09T00:00:00.000Z',
        image: 'https://picsum.photos/id/60/800/400',
        type: 'Feria de Arte',
        rawDate: '2025-02-05',
        description: 'ZONA MACO es la plataforma de ferias de arte más grande de América Latina.',
        comments: [
            { id: 'c3', userId: 'u5', userName: 'Pedro J.', userAvatar: 'https://picsum.photos/id/67/100/100', date: 'Hace 3 días', text: '¿Saben si habrá transporte gratuito desde Polanco este año?' }
        ]
    },
    {
        name: 'Bienal de La Habana',
        location: 'La Habana, Cuba',
        startDate: '2024-11-15T00:00:00.000Z',
        endDate: '2025-02-28T00:00:00.000Z',
        image: 'https://picsum.photos/id/70/800/400',
        type: 'Bienal',
        rawDate: '2024-11-15',
        description: 'La Bienal de La Habana es un evento de arte contemporáneo.'
    },
    {
        name: 'ArtBo Fin de Semana',
        location: 'Bogotá, Colombia',
        startDate: '2025-04-12T00:00:00.000Z',
        endDate: '2025-04-14T00:00:00.000Z',
        image: 'https://picsum.photos/id/80/800/400',
        type: 'Evento Local',
        rawDate: '2025-04-12',
        description: 'ARTBO | Fin de Semana es un evento que busca promover la circulación de las artes plásticas.'
    },
    {
        name: 'SP-Arte',
        location: 'Pavilhão da Bienal, São Paulo',
        startDate: '2025-04-03T00:00:00.000Z',
        endDate: '2025-04-07T00:00:00.000Z',
        image: 'https://picsum.photos/id/90/800/400',
        type: 'Feria de Arte',
        rawDate: '2025-04-03',
        description: 'Fundada en 2005, SP-Arte es uno de los eventos más importantes del mercado mundial.'
    },
    {
        name: 'ArteBa',
        location: 'Centro Costa Salguero, Buenos Aires',
        startDate: '2025-08-28T00:00:00.000Z',
        endDate: '2025-09-01T00:00:00.000Z',
        image: 'https://picsum.photos/id/95/800/400',
        type: 'Feria de Arte',
        rawDate: '2025-08-28',
        description: 'arteba es una de las ferias de arte contemporáneo más dinámicas de la región.'
    },
    {
        name: 'Siembra: Nuevos Campos',
        location: 'Kurimanzutto, CDMX',
        startDate: '2025-02-10T00:00:00.000Z',
        endDate: '2025-03-20T00:00:00.000Z',
        image: 'https://picsum.photos/id/110/800/500',
        type: 'Exposición',
        rawDate: '2025-02-10',
        description: 'Una exposición colectiva que reúne a artistas emergentes.',
        galleryName: 'Kurimanzutto'
    },
    {
        name: 'Tarsila Popular',
        location: 'MALBA, Buenos Aires',
        startDate: '2025-03-01T00:00:00.000Z',
        endDate: '2025-05-30T00:00:00.000Z',
        image: 'https://picsum.photos/id/111/800/500',
        type: 'Exposición',
        rawDate: '2025-03-01',
        description: 'La retrospectiva más completa de Tarsila do Amaral.',
        galleryName: 'MALBA'
    },
    {
        name: 'Urs Fischer: Lovers',
        location: 'Museo Jumex, CDMX',
        startDate: '2025-04-02T00:00:00.000Z',
        endDate: '2025-08-15T00:00:00.000Z',
        image: 'https://picsum.photos/id/112/800/500',
        type: 'Exposición',
        rawDate: '2025-04-02',
        description: 'Primera gran exposición individual del artista suizo Urs Fischer en América Latina.',
        galleryName: 'Museo Jumex'
    }
];

const articles = [
    {
        title: 'Por qué los coleccionistas están mirando hacia el Sur Global',
        category: 'Mercado del Arte',
        author: 'Ana María Sáenz',
        date: '2025-01-12T00:00:00.000Z',
        image: 'https://picsum.photos/id/201/800/600',
        featured: true,
        summary: 'Un análisis profundo sobre el cambio de paradigma en las subastas internacionales.',
        content: [
            'En la última década, el mercado del arte ha experimentado una transformación sísmica. Lo que antes era un escenario dominado casi exclusivamente por artistas europeos y norteamericanos, hoy se abre paso a una pluralidad de voces provenientes del Sur Global.',
            'Esta reorientación no es casualidad. Responde a una fatiga visual de las narrativas hegemónicas y a un interés genuino de las nuevas generaciones de coleccionistas por historias que aborden la identidad, el colonialismo y la ecología desde perspectivas no occidentales.',
            'Las casas de subastas como Sotheby\'s y Christie\'s han reportado un incremento del 40% en las ventas de arte latinoamericano en los últimos cinco años. Artistas como Tarsila do Amaral y Frida Kahlo rompieron techos de cristal hace tiempo, pero ahora son figuras contemporáneas como Gabriel Orozco y Doris Salcedo quienes lideran las pujas.',
            'El coleccionismo en Latinoamérica también ha madurado. Ya no se trata solo de acumular objetos bellos, sino de construir un legado cultural. Fundaciones privadas en México, Brasil y Colombia están jugando un papel crucial en la preservación y difusión de este patrimonio.'
        ]
    },
    {
        title: 'La Bienal de São Paulo redefine la narrativa post-colonial',
        category: 'Crítica',
        author: 'Carlos Fuentes',
        date: '2025-01-10T00:00:00.000Z',
        image: 'https://picsum.photos/id/202/800/600',
        featured: true,
        summary: 'Las obras presentadas este año desafían las estructuras tradicionales del poder museístico.',
        content: [
            'La Bienal de São Paulo siempre ha sido un termómetro de la salud cultural del continente, pero este año ha ido más allá. Bajo la curaduría de un equipo multidisciplinario, la exposición se plantea no como una vitrina, sino como un campo de batalla de ideas.',
            'La "narrativa post-colonial" deja de ser un término académico para convertirse en una experiencia visceral. Instalaciones que ocupan salas enteras obligan al espectador a confrontar la historia de la esclavitud y la explotación de recursos naturales en la Amazonía.',
            'Destaca la participación de colectivos indígenas que, por primera vez, tienen el control total sobre cómo se representa su cultura. No son objetos de estudio, son sujetos políticos con una voz potente que resuena en los pasillos del pabellón diseñado por Oscar Niemeyer.',
            'Esta edición marcará un antes y un después en cómo las grandes instituciones de arte del mundo se relacionan con las comunidades locales. El museo ya no es un templo sagrado, es un foro público.'
        ]
    },
    {
        title: 'El legado onírico de Leonora Carrington más allá del museo',
        category: 'Ensayo',
        author: 'Sofía G. Rubio',
        date: '2025-01-05T00:00:00.000Z',
        image: 'https://picsum.photos/id/400/800/600',
        featured: true,
        summary: 'Cómo la artista surrealista transformó la percepción de la magia y el feminismo en el arte mexicano del siglo XX y XXI.',
        content: [
            'Leonora Carrington no solo pintaba sueños; construía realidades alternas donde la mujer no era musa, sino alquimista. Su llegada a México en 1942 marcó el inicio de una etapa prolífica que redefinió el surrealismo, alejándolo de los dogmas europeos y nutriéndolo del misticismo local.',
            'En sus obras tardías, vemos una preocupación creciente por la ecología y el feminismo, temas que hoy resuenan con una urgencia renovada. Sus criaturas híbridas no son monstruos, sino guardianes de un conocimiento ancestral que la modernidad intentó borrar.',
            'La reciente apertura de su casa-estudio en la Colonia Roma ha permitido a una nueva generación acercarse a su proceso creativo. No como quien visita un mausoleo, sino como quien entra a un laboratorio de ideas vivas. Carrington nos enseñó que la imaginación es una herramienta de resistencia política.'
        ]
    },
    {
        title: 'Arquitectura como resistencia: Los nuevos centros culturales de Bogotá',
        category: 'Arquitectura',
        author: 'Mateo R. Botero',
        date: '2025-01-02T00:00:00.000Z',
        image: 'https://picsum.photos/id/401/800/600',
        featured: false,
        summary: 'Un recorrido por los espacios que están democratizando el acceso al arte en la capital colombiana, fusionando ladrillo y memoria.',
        content: [
            'Bogotá está viviendo un renacimiento arquitectónico silencioso pero potente. Lejos de los "starchitects" y los rascacielos de cristal, una nueva ola de arquitectos está recuperando espacios industriales y casas patrimoniales para convertirlos en nodos de cultura comunitaria.',
            'El caso de "Fragmentos", el contra-monumento de Doris Salcedo, abrió la puerta a pensar el espacio expositivo no como un cubo blanco neutro, sino como un lugar cargado de historia y dolor. Siguiendo esa línea, galerías como NC-arte y el nuevo Espacio El Dorado han apostado por intervenciones mínimas que respetan la cicatriz del edificio.',
            'Estos lugares no solo exhiben arte; tejen ciudad. Sus programas públicos desbordan las salas y toman las calles, borrando las fronteras invisibles que durante décadas fragmentaron la capital. La arquitectura aquí no es solo contenedor, es contenido y declaración de principios.'
        ]
    },
    {
        title: 'El renacer de la pintura figurativa en el Caribe',
        category: 'Pintura',
        author: 'Roberto M.',
        date: '2024-12-28T00:00:00.000Z',
        image: 'https://picsum.photos/id/402/800/600',
        featured: false,
        summary: 'Una nueva ola de artistas jóvenes en República Dominicana y Puerto Rico está recuperando el retrato para hablar de identidad racial.',
        content: [
            'Durante años, la abstracción dominó el discurso académico en el Caribe insular. Sin embargo, algo está cambiando. Una generación nacida en los 90 ha vuelto a tomar los pinceles para retratar sus realidades cotidianas con un realismo que roza lo onírico.',
            'Estos artistas no buscan la mímesis perfecta, sino la captura de una atmósfera psicológica. Sus sujetos, a menudo amigos y familiares, son representados en espacios domésticos cargados de simbolismo local.',
            'El mercado internacional ha comenzado a prestar atención, pero lo más importante es el diálogo interno que se está generando: una revalorización de la piel morena y las historias locales en el lienzo.'
        ]
    },
    {
        title: 'Reporte de Mercado 2024: Tendencias y Predicciones',
        category: 'Mercado del Arte',
        author: 'Elena S.',
        date: '2024-12-15T00:00:00.000Z',
        image: 'https://picsum.photos/id/403/800/600',
        featured: false,
        summary: 'Analizamos los datos de las principales ferias del año para entender hacia dónde se mueve el capital cultural en 2025.',
        content: [
            'El 2024 cerró con una nota de cautela pero optimismo. Si bien las ventas millonarias se desaceleraron ligeramente, el mercado medio (obras entre 10k y 50k USD) mostró una robustez sorprendente, impulsado por nuevos coleccionistas millennials.',
            'El arte textil y la cerámica continúan su ascenso imparable, dejando de ser considerados "artesanía" para ocupar los stands principales de Art Basel y Frieze. América Latina está particularmente bien posicionada en este nicho, con una tradición rica que ahora se reinterpreta contemporáneamente.',
            'Para 2025, predecimos un auge en el arte digital con certificación blockchain, pero con un enfoque más ecológico y curatorial que la fiebre inicial de los NFTs.'
        ]
    },
    {
        title: 'Conversación con Adrián Villar Rojas sobre la impermanencia',
        category: 'Entrevista',
        author: 'Javier P.',
        date: '2024-11-30T00:00:00.000Z',
        image: 'https://picsum.photos/id/404/800/600',
        featured: false,
        summary: 'El artista argentino nos recibe en su taller de Rosario para hablar sobre sus esculturas que se deshacen con el tiempo.',
        content: [
            'Adrián Villar Rojas no crea para la eternidad. Sus monumentales instalaciones de arcilla cruda están destinadas a agrietarse, brotar plantas y eventualmente volver a ser polvo. "Es un ejercicio de humildad", nos dice mientras toma un mate.',
            '"La obsesión del museo por conservar es antinatural. Todo muere, todo cambia. Mi obra intenta acelerar ese proceso para hacerlo visible". Esta filosofía lo ha llevado a crear proyectos en los lugares más remotos, desde el desierto de Atacama hasta glaciares en la Patagonia.',
            'En esta entrevista exclusiva, discutimos su próximo proyecto para la Bienal de Venecia y cómo ve el rol del artista en tiempos de crisis climática.'
        ]
    },
    {
        title: 'La lente política de Paz Errázuriz',
        category: 'Fotografía',
        author: 'Laura C.',
        date: '2024-11-15T00:00:00.000Z',
        image: 'https://picsum.photos/id/405/800/600',
        featured: false,
        summary: 'Una retrospectiva sobre la fotógrafa chilena que capturó la marginalidad durante la dictadura.',
        content: [
            'Paz Errázuriz (Santiago de Chile, 1944) nunca buscó la belleza convencional. Su cámara siempre apuntó hacia donde la sociedad prefería no mirar: hospitales psiquiátricos, prostíbulos, circos pobres y asilos de ancianos.',
            'Durante los años más oscuros de la dictadura de Pinochet, Errázuriz fundó la Asociación de Fotógrafos Independientes (AFI) para documentar la represión, pero su trabajo más potente fue el que hizo en la intimidad de los márgenes. Su serie "La Manzana de Adán", que retrata a travestis y prostitutas en los años 80, es un documento histórico de resistencia y dignidad.',
            'Hoy, a sus 80 años, su obra es celebrada en museos internacionales, pero su mirada sigue siendo la misma: compasiva, directa y profundamente política.'
        ]
    },
    {
        title: 'Cuerpos en resistencia: Performance en Centroamérica',
        category: 'Performance',
        author: 'David R.',
        date: '2024-11-02T00:00:00.000Z',
        image: 'https://picsum.photos/id/406/800/600',
        featured: false,
        summary: 'Cómo el cuerpo se convierte en territorio político en la obra de artistas de Guatemala y El Salvador.',
        content: [
            'En una región marcada por la violencia histórica y los conflictos armados, el cuerpo ha sido siempre el primer campo de batalla. Para artistas como Regina José Galindo (Guatemala) o Crack Rodríguez (El Salvador), la performance no es un acto teatral, sino una forma de denuncia urgente.',
            'Galindo, ganadora del León de Oro en Venecia, utiliza su propia sangre y dolor para hablar de los feminicidios y el racismo estructural. Sus acciones son viscerales, difíciles de mirar, pero imposibles de ignorar.',
            'Por otro lado, Rodríguez utiliza el humor absurdo y la intervención en el espacio público para criticar las políticas migratorias y la corrupción. Juntos, representan una generación que ha decidido poner el cuerpo para sanar la memoria colectiva.'
        ]
    },
    {
        title: 'El desafío de la descolonización en los museos de Lima',
        category: 'Instituciones',
        author: 'Patricia V.',
        date: '2024-10-28T00:00:00.000Z',
        image: 'https://picsum.photos/id/407/800/600',
        featured: false,
        summary: 'Curadores peruanos debaten sobre cómo reescribir los guiones museográficos heredados.',
        content: [
            'Lima alberga algunos de los museos arqueológicos más importantes del mundo, pero durante décadas, sus narrativas han estado marcadas por una visión eurocéntrica que privilegia la estética sobre el contexto cultural.',
            'Una nueva ola de directores y curadores está intentando cambiar esto. El MALI (Museo de Arte de Lima) ha iniciado un proceso de revisión de sus colecciones permanentes, invitando a comunidades indígenas a participar en la interpretación de los objetos.',
            'No se trata solo de devolver piezas, sino de devolver significados. ¿Quién tiene la autoridad para contar la historia? Esa es la pregunta que resuena hoy en las salas de exhibición de la capital peruana.'
        ]
    }
];

async function uploadImage(payload: any, url: string, name: string) {
    if (!url || !url.startsWith('http')) return undefined;
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const media = await payload.create({
            collection: 'media',
            data: { alt: name },
            file: {
                data: buffer,
                name: `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`,
                mimetype: 'image/jpeg',
                size: buffer.byteLength,
            },
        });
        return media.id;
    } catch (e) {
        console.error(`Failed to upload image from ${url}:`, e);
        return undefined;
    }
}

async function seed() {
    const payload = await getPayload({ config: configPromise })

    console.log('Clearing existing data...')
    try {
        await payload.delete({ collection: 'artworks', where: { id: { exists: true } } })
        await payload.delete({ collection: 'events', where: { id: { exists: true } } })
        await payload.delete({ collection: 'artists', where: { id: { exists: true } } })
        await payload.delete({ collection: 'galleries', where: { id: { exists: true } } })
        await payload.delete({ collection: 'media', where: { id: { exists: true } } })
        await payload.delete({ collection: 'articles', where: { id: { exists: true } } })
    } catch (e) {
        console.warn('Error clearing data, continuing...', e);
    }

    console.log('Seeding Artists...')
    const artistMap = new Map()
    for (const artist of artists) {
        const imageId = await uploadImage(payload, artist.image, artist.name);
        const artistData: any = {
            ...artist,
            movements: artist.movements.map(m => ({ name: m }))
        };

        if (imageId) {
            artistData.image = imageId;
        } else {
            delete artistData.image;
        }

        try {
            const createdArtist = await payload.create({
                collection: 'artists',
                data: artistData,
            })
            artistMap.set(artist.name, createdArtist.id)
        } catch (e) {
            console.error(`Failed to seed artist ${artist.name}:`, e)
        }
    }

    console.log('Seeding Galleries...')
    const galleryMap = new Map()
    for (const gallery of galleries) {
        const imageId = await uploadImage(payload, gallery.image, gallery.name);
        const galleryData: any = { ...gallery };

        if (imageId) {
            galleryData.image = imageId;
        } else {
            delete galleryData.image;
        }

        try {
            const createdGallery = await payload.create({
                collection: 'galleries',
                data: galleryData,
            })
            galleryMap.set(gallery.name, createdGallery.id)
        } catch (e) {
            console.error(`Failed to seed gallery ${gallery.name}:`, e)
        }
    }

    // Seed Artworks
    console.log('Seeding Artworks...')
    for (const artwork of artworks) {
        const artistId = artistMap.get(artwork.artistName);
        const galleryId = galleryMap.get(artwork.galleryName);
        const imageId = await uploadImage(payload, artwork.image, artwork.title);

        const artworkData: any = { ...artwork };

        if (imageId) artworkData.image = imageId;
        else delete artworkData.image;

        if (artistId) artworkData.artist = artistId;
        if (galleryId) artworkData.gallery = galleryId;

        delete artworkData.artistName;
        delete artworkData.galleryName;

        try {
            await payload.create({
                collection: 'artworks',
                data: artworkData,
            })
        } catch (e) {
            console.error(`Failed to seed artwork ${artwork.title}:`, e)
        }
    }

    // Seed Events
    console.log('Seeding Events...')
    for (const event of events) {
        const imageId = await uploadImage(payload, event.image, event.name);
        const eventData: any = { ...event };

        if (imageId) eventData.image = imageId;
        else delete eventData.image;

        if (event.galleryName) {
            const galleryId = galleryMap.get(event.galleryName);
            if (galleryId) {
                eventData.gallery = galleryId;
            }
            delete eventData.galleryName;
        }

        try {
            await payload.create({
                collection: 'events',
                data: eventData,
            })
        } catch (e) {
            console.error(`Failed to seed event ${event.name}:`, e)
        }
    }

    // Seed Articles
    console.log('Seeding Articles...')
    for (const article of articles) {
        const imageId = await uploadImage(payload, article.image, article.title);
        const contentNodes = article.content.map(text => ({
            type: 'paragraph',
            children: [{ text }],
        }));

        const articleData: any = { ...article };

        if (imageId) articleData.image = imageId;
        else delete articleData.image;

        articleData.content = {
            root: {
                type: 'root',
                children: contentNodes,
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1
            }
        };

        try {
            await payload.create({
                collection: 'articles',
                data: articleData,
            })
        } catch (e) {
            console.error(`Failed to seed article ${article.title}:`, e)
        }
    }

    console.log('Seed Complete!')
    process.exit(0)
}

seed()
