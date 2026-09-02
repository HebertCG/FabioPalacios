/**
 * DATOS ESTRUCTURADOS (JSON-LD / Schema.org)
 * ------------------------------------------
 * Traduce el contenido de `doctor.data.ts` al vocabulario que Google,
 * Bing y los asistentes de IA leen para entender *qué* es esta página,
 * no solo qué palabras contiene.
 *
 * Se emite un único bloque `@graph` en lugar de varios `<script>`
 * sueltos. La diferencia importa: dentro de un grafo, los nodos se
 * referencian entre sí por `@id`, así que Google entiende que el
 * médico, el consultorio, la página y los videos son piezas de una
 * misma entidad. Con bloques sueltos tiene que adivinarlo.
 *
 * QUÉ SE DECLARA Y PARA QUÉ
 *  · Person + Physician  → panel de conocimiento y paquete local
 *  · ProfilePage         → presenta a Fabio como persona pública
 *  · BreadcrumbList      → migas de pan bajo el resultado
 *
 * REGLA DE ORO DE ESTE ARCHIVO: nada que no esté verificado. Un dato
 * estructurado falso es una penalización potencial por spam, y en
 * contenido médico el listón de Google es más alto. Por eso los nodos
 * incompletos se omiten en lugar de rellenarse con supuestos.
 */

import { CONTACT, CREDENTIALS, DOCTOR, SPECIALTIES } from '../data/doctor.data';
import {
  absoluteUrl,
  CONTENT_LAST_REVIEWED,
  SEO_DESCRIPTION,
  SEO_PRIMARY_IMAGE,
  SEO_SOCIAL_IMAGE,
  SEO_TITLE,
  SITE_ADDRESS,
  SITE_AREA_SERVED,
  SITE_GEO,
  SITE_LOCALE,
  SITE_OPENING_HOURS,
  SITE_ORIGIN,
  SITE_SAME_AS,
} from './site.config';

/** Un nodo cualquiera del grafo. Schema.org es demasiado abierto para tiparlo. */
type JsonLdNode = Record<string, unknown>;

/* ============================================================
   IDENTIFICADORES
   ------------------------------------------------------------
   URIs estables con las que los nodos se apuntan entre sí. Deben
   permanecer iguales entre despliegues: si cambian, Google trata la
   entidad como nueva y se pierde el historial acumulado.
   ============================================================ */

const ID = {
  person: `${SITE_ORIGIN}/#medico`,
  practice: `${SITE_ORIGIN}/#consultorio`,
  website: `${SITE_ORIGIN}/#sitio`,
  webpage: `${SITE_ORIGIN}/#pagina`,
  breadcrumb: `${SITE_ORIGIN}/#migas`,
  primaryImage: `${SITE_ORIGIN}/#imagen-principal`,
} as const;

/* ============================================================
   NODOS
   ============================================================ */

/** La imagen principal, como entidad propia para poder referenciarla. */
function imageNode(): JsonLdNode {
  return {
    '@type': 'ImageObject',
    '@id': ID.primaryImage,
    url: absoluteUrl(SEO_PRIMARY_IMAGE.path),
    contentUrl: absoluteUrl(SEO_PRIMARY_IMAGE.path),
    width: SEO_PRIMARY_IMAGE.width,
    height: SEO_PRIMARY_IMAGE.height,
    caption: SEO_PRIMARY_IMAGE.alt,
  };
}

/**
 * El doctor como persona.
 *
 * Se separa del consultorio a propósito. Son dos entidades distintas:
 * una persona con formación y credenciales, y un negocio local con
 * dirección y horarios. Google las trata distinto —la persona alimenta
 * el panel de conocimiento, el negocio alimenta el mapa— y unirlas en
 * un solo nodo hace que ninguna de las dos quede bien descrita.
 */
function personNode(): JsonLdNode {
  const [university, ...institutes] = CREDENTIALS.filter((c) =>
    ['upch', 'inen', 'ircad'].includes(c.id),
  );

  return {
    '@type': 'Person',
    '@id': ID.person,
    name: DOCTOR.displayName,
    givenName: DOCTOR.firstName,
    familyName: DOCTOR.lastName,
    honorificPrefix: 'Dr.',
    jobTitle: DOCTOR.specialty,
    description:
      'Médico, conferencista y ciudadano de Piura. Comparte conocimiento y vive su profesión desde la cercanía, el servicio y la familia.',
    image: { '@id': ID.primaryImage },
    url: `${SITE_ORIGIN}/`,
    telephone: CONTACT.whatsapp,
    worksFor: { '@id': ID.practice },
    sameAs: [...SITE_SAME_AS],

    /** Temas sobre los que el doctor tiene autoridad demostrable. */
    knowsAbout: [
      ...SPECIALTIES.map((s) => s.title),
      'Cirugía mínimamente invasiva',
      'Cirugía laparoscópica avanzada',
      'Segunda opinión oncológica',
    ],
    knowsLanguage: [{ '@type': 'Language', name: 'Español', alternateName: 'es' }],

    alumniOf: [
      university && {
        '@type': 'CollegeOrUniversity',
        name: 'Universidad Peruana Cayetano Heredia',
        sameAs: 'https://www.cayetano.edu.pe/',
      },
      ...institutes.map((c) => ({
        '@type': 'MedicalOrganization',
        name: c.detail,
      })),
    ].filter(Boolean),

    memberOf: [
      { '@type': 'MedicalOrganization', name: 'Sociedad Peruana de Cancerología' },
      { '@type': 'MedicalOrganization', name: 'Colegio Médico del Perú' },
    ],

    /**
     * Las colegiaturas como credenciales formales, no como texto suelto.
     * Es la prueba verificable de que ejerce legalmente, y en oncología
     * es exactamente el tipo de señal que Google busca en YMYL.
     */
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Colegiatura profesional',
        name: `Colegio Médico del Perú — CMP ${DOCTOR.cmp}`,
        recognizedBy: { '@type': 'Organization', name: 'Colegio Médico del Perú' },
        identifier: DOCTOR.cmp,
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Registro Nacional de Especialista',
        name: `Registro Nacional de Especialista — RNE ${DOCTOR.rne}`,
        recognizedBy: { '@type': 'Organization', name: 'Colegio Médico del Perú' },
        identifier: DOCTOR.rne,
      },
    ],
  };
}

/**
 * El consultorio como negocio local.
 *
 * `Physician` desciende de `MedicalBusiness` y este de `LocalBusiness`,
 * así que un solo tipo ya activa el paquete local. Declarar los tres en
 * un arreglo sería redundante.
 */
function practiceNode(): JsonLdNode {
  return {
    '@type': 'Physician',
    '@id': ID.practice,
    name: DOCTOR.displayName,
    legalName: DOCTOR.legalName || undefined,
    description: SEO_DESCRIPTION,
    url: `${SITE_ORIGIN}/`,
    image: { '@id': ID.primaryImage },
    logo: absoluteUrl(SEO_SOCIAL_IMAGE.path),
    telephone: CONTACT.whatsapp,
    priceRange: '$$',
    currenciesAccepted: 'PEN',
    isAcceptingNewPatients: true,
    medicalSpecialty: ['Oncologic', 'Surgical'],
    founder: { '@id': ID.person },
    employee: { '@id': ID.person },
    sameAs: [...SITE_SAME_AS],
    hasMap: CONTACT.mapsUrl,

    address: {
      '@type': 'PostalAddress',
      ...SITE_ADDRESS,
    },

    /**
     * `geo` y `openingHoursSpecification` solo aparecen cuando están
     * confirmados. Ver la explicación en `site.config.ts`: un dato
     * inventado aquí manda al paciente al lugar o a la hora equivocada.
     */
    ...(SITE_GEO ? { geo: { '@type': 'GeoCoordinates', ...SITE_GEO } } : {}),
    ...(SITE_OPENING_HOURS
      ? {
          openingHoursSpecification: SITE_OPENING_HOURS.map((slot) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [...slot.days],
            opens: slot.opens,
            closes: slot.closes,
          })),
        }
      : {}),

    areaServed: SITE_AREA_SERVED.map((area) => ({
      '@type': area.type,
      name: area.name,
    })),

    /**
     * Cada área quirúrgica como procedimiento, con los órganos que
     * cubre. Es lo que permite que Google asocie esta página a
     * "cirugía de cáncer de estómago en Piura" y no solo a "oncólogo".
     */
    availableService: SPECIALTIES.map((specialty) => ({
      '@type': 'MedicalProcedure',
      name: `Cirugía oncológica: ${specialty.title.toLowerCase()}`,
      procedureType: 'https://schema.org/SurgicalProcedure',
      bodyLocation: [...specialty.organs],
      howPerformed:
        'Cirugía oncológica especializada, con abordaje mínimamente invasivo ' +
        'cuando el caso lo permite.',
    })),

    /** Canales por los que un paciente puede iniciar contacto. */
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Agendar consulta',
        telephone: CONTACT.whatsapp,
        availableLanguage: ['Spanish'],
        areaServed: 'PE',
      },
    ],
  };
}

/** El sitio como obra publicada. Ancla el idioma y al editor. */
function websiteNode(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': ID.website,
    url: `${SITE_ORIGIN}/`,
    name: SEO_TITLE,
    description: SEO_DESCRIPTION,
    inLanguage: SITE_LOCALE,
    publisher: { '@id': ID.practice },
  };
}

/**
 * La página concreta.
 *
 * Se declara como `ProfilePage` porque el foco principal es la persona,
 * su comunidad y su propósito. El consultorio conserva su propio nodo
 * `Physician` para que la información médica siga siendo entendible.
 */
function webPageNode(): JsonLdNode {
  return {
    '@type': 'ProfilePage',
    '@id': ID.webpage,
    url: `${SITE_ORIGIN}/`,
    name: SEO_TITLE,
    description: SEO_DESCRIPTION,
    inLanguage: SITE_LOCALE,
    isPartOf: { '@id': ID.website },
    about: { '@id': ID.person },
    primaryImageOfPage: { '@id': ID.primaryImage },
    breadcrumb: { '@id': ID.breadcrumb },
    author: { '@id': ID.person },
    dateModified: CONTENT_LAST_REVIEWED,

    /**
     * Las secciones principales, para que los buscadores puedan enlazar
     * directamente a cada faceta de la historia.
     */
    significantLink: [
      `${SITE_ORIGIN}/#proposito`,
      `${SITE_ORIGIN}/#charlas`,
      `${SITE_ORIGIN}/#familia`,
      `${SITE_ORIGIN}/#medicina`,
      `${SITE_ORIGIN}/#contacto`,
    ],
  };
}

/**
 * Migas de pan. Con una sola página el rastro es corto, pero declararlo
 * hace que Google muestre el dominio con formato de ruta en lugar de la
 * URL cruda bajo el título.
 */
function breadcrumbNode(): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: `${SITE_ORIGIN}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Fabio Palacios',
        item: `${SITE_ORIGIN}/#proposito`,
      },
    ],
  };
}

/* ============================================================
   GRAFO COMPLETO
   ============================================================ */

/**
 * Arma el grafo entero. Es lo que acaba dentro del
 * `<script type="application/ld+json">` de la página.
 */
export function buildStructuredData(): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      imageNode(),
      personNode(),
      practiceNode(),
      websiteNode(),
      webPageNode(),
      breadcrumbNode(),
    ],
  };
}

/**
 * Serializa el grafo listo para inyectar.
 *
 * `undefined` desaparece solo al serializar, así que los campos
 * opcionales sin confirmar no llegan al HTML. Se escapa `<` para que un
 * texto del doctor que contenga `</script>` no pueda cerrar la etiqueta
 * antes de tiempo.
 */
export function serializeStructuredData(): string {
  return JSON.stringify(buildStructuredData()).replace(/</g, '\\u003c');
}
