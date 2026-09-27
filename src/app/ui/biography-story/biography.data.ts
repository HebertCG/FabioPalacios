/**
 * BIOGRAFÍA
 * ---------
 * Texto de «Biografia_Dr_Fabio_Palacios_Lizarbe.pdf», entregado por el
 * doctor el 26/09/2026. Se reparte en capítulos cortos para leerlo como un
 * relato, pero no se reescribe: cada frase es suya.
 *
 * Las negritas del PDF se marcan con **dobles asteriscos** y se convierten
 * en <strong> al construir la página, nunca con innerHTML.
 */

export type BioBlock =
  | { readonly kind: 'p'; readonly text: string }
  | { readonly kind: 'quote'; readonly lines: readonly string[] }
  | { readonly kind: 'list'; readonly items: readonly string[] };

export interface BioChapter {
  readonly id: string;
  readonly title: string;
  readonly blocks: readonly BioBlock[];
}

const p = (text: string): BioBlock => ({ kind: 'p', text });
const quote = (...lines: string[]): BioBlock => ({ kind: 'quote', lines });
const list = (...items: string[]): BioBlock => ({ kind: 'list', items });

export const BIOGRAPHY: readonly BioChapter[] = [
  {
    id: 'origen',
    title: 'Una historia que comenzó lejos de un quirófano',
    blocks: [
      p(
        'Hay historias profesionales que comienzan con un título universitario. La mía comenzó mucho antes.',
      ),
      p(
        'Comenzó en **Huanarpapucru**, un pequeño pueblo del caserío de Yananaco, en el distrito de Independencia, provincia de Vilcas Huamán, Ayacucho.',
      ),
      p('Allí pasé los primeros quince años de mi vida.'),
    ],
  },
  {
    id: 'infancia',
    title: 'Mi primera escuela',
    blocks: [
      p(
        'Era un lugar sin electricidad y sin carreteras. El agua se recogía de un manantial y cada mañana había que caminar para llevarla a casa. La leña formaba parte de la vida cotidiana.',
      ),
      p('Fue una infancia sencilla, pero profundamente formativa.'),
      p(
        'Allí aprendí que las cosas que realmente valen requieren esfuerzo. Aprendí a caminar aunque el camino fuera largo, a trabajar aunque fuera difícil y a valorar cada oportunidad.',
      ),
      p('Quizás sin saberlo, aquellos años fueron mi primera escuela.'),
    ],
  },
  {
    id: 'camino',
    title: 'El camino hacia la medicina',
    blocks: [
      p(
        'A los quince años dejé mi pueblo para comenzar una nueva etapa e ingresé a Ingeniería Civil.',
      ),
      p(
        'Durante casi dos años estudié mientras trabajaba en diferentes oficios. Fui cobrador, chofer de combi, mesero y desempeñé muchas otras actividades que me permitieron salir adelante.',
      ),
      p(
        'Cada trabajo dejó una huella. Aprendí a conocer a las personas, a escuchar, a resolver problemas y a mantenerme de pie incluso en los momentos difíciles.',
      ),
    ],
  },
  {
    id: 'sueno',
    title: 'Un sueño intacto',
    blocks: [
      p('Pero había un sueño que permanecía intacto desde mi infancia: **quería ser médico.**'),
      p(
        'Decidí entonces cambiar de rumbo y comenzar nuevamente. Ingresé a un programa de MERCOSUR y estudié Medicina Humana en la **Universidad del Valle, Bolivia**.',
      ),
      p(
        'Mientras estudiaba, trabajaba como mesero y también enseñaba a estudiantes de años inferiores para poder sostener mi formación.',
      ),
      p('No tenía un camino fácil. Tenía un propósito. Y eso fue suficiente para seguir avanzando.'),
    ],
  },
  {
    id: 'regreso',
    title: 'El regreso al Perú',
    blocks: [
      p(
        'Al terminar Medicina tuve la oportunidad de viajar a Estados Unidos y participar en un programa de la **Universidad Johns Hopkins**.',
      ),
      p('Posteriormente regresé al Perú por circunstancias familiares.'),
      p('Realicé mi SERUM en Ayacucho y durante dos años trabajé como médico legista.'),
      p('Hasta que una experiencia familiar cambió definitivamente mi perspectiva.'),
    ],
  },
  {
    id: 'encuentro',
    title: 'El encuentro con la cirugía oncológica',
    blocks: [
      p(
        'Una prima fue diagnosticada con cáncer gástrico y fue sometida a una cirugía realizada por el Dr. Calmet, quien posteriormente llegaría a dirigir el INEN.',
      ),
      p('Aquella experiencia me permitió comprender algo que cambiaría mi vida:'),
      quote(
        'La cirugía oncológica no solamente trata una enfermedad; puede cambiar el destino de una persona y de toda una familia.',
      ),
      p('Desde ese momento supe cuál sería mi camino.'),
    ],
  },
  {
    id: 'inen',
    title: 'La formación que definió mi vocación',
    blocks: [
      p(
        'Ingresé al **Instituto Nacional de Enfermedades Neoplásicas — INEN**, donde recibí formación especializada en cirugía oncológica.',
      ),
      p(
        'Allí comprendí que ser cirujano no consiste únicamente en aprender una técnica. Implica conocer profundamente la enfermedad, tomar decisiones complejas, trabajar en equipo y asumir la responsabilidad de intervenir en uno de los momentos más importantes de la vida de un paciente.',
      ),
    ],
  },
  {
    id: 'perfeccionamiento',
    title: 'Formación sin pausa',
    blocks: [
      p('Pero también comprendí que la medicina nunca se detiene.'),
      p(
        'Por eso continué mi formación y perfeccionamiento en **cirugía mínimamente invasiva, cirugía oncoplástica y técnicas quirúrgicas avanzadas**, realizando capacitaciones y experiencias académicas en **Brasil, Argentina y Estados Unidos**.',
      ),
      p(
        'La tecnología cambió la manera de operar. La evidencia científica cambió la manera de tratar. Pero algo permaneció igual: **el paciente siempre está en el centro.**',
      ),
    ],
  },
  {
    id: 'filosofia',
    title: 'Experiencia, precisión y humanidad',
    blocks: [
      p(
        'Actualmente desarrollo mi práctica como **Cirujano Oncólogo**, con especial interés en la cirugía oncológica avanzada y mínimamente invasiva. Mi filosofía profesional se basa en integrar tres elementos:',
      ),
      quote('Experiencia.', 'Tecnología.', 'Humanidad.'),
      p(
        'Porque una cirugía técnicamente perfecta pierde parte de su sentido si olvidamos a la persona que está detrás del diagnóstico.',
      ),
    ],
  },
  {
    id: 'despues',
    title: 'Una vida que continúa después del quirófano',
    blocks: [
      p(
        'Cada paciente llega con una historia diferente. Una familia. Un miedo. Una esperanza. Y una vida que continúa después del quirófano.',
      ),
      p(
        'Por eso considero que la medicina no termina cuando finaliza una operación. Comienza mucho antes y continúa mucho después.',
      ),
    ],
  },
  {
    id: 'mirada',
    title: 'Cuando miro hacia atrás',
    blocks: [
      p(
        'Hoy, después de tantos años, puedo mirar hacia atrás y reconocer que muchos momentos que parecían aislados formaban parte de una misma historia.',
      ),
      list(
        'El niño de Ayacucho que caminaba hasta el manantial.',
        'El adolescente que recogía leña.',
        'El joven que trabajaba como cobrador, chofer y mesero.',
        'El estudiante que decidió abandonar Ingeniería Civil para perseguir su verdadero sueño.',
      ),
    ],
  },
  {
    id: 'puntos',
    title: 'Todos esos puntos se unen',
    blocks: [
      list(
        'El médico que regresó al Perú.',
        'El médico legista.',
        'La enfermedad de mi prima.',
        'El primer acercamiento a la cirugía oncológica.',
      ),
      p(
        'El INEN. Los viajes. Las horas de estudio. Los quirófanos. Los pacientes. Los momentos difíciles. Y todas las personas que, de una u otra manera, fueron parte de este camino.',
      ),
      quote('Hoy entiendo que todos esos puntos se unen.'),
    ],
  },
  {
    id: 'privilegio',
    title: 'Lo que soñé desde niño',
    blocks: [
      p(
        'Mi historia comenzó en un pequeño pueblo de Ayacucho. Y desde entonces aprendí que no importa cuán lejos esté el lugar donde comienzas. Lo importante es cuánto estás dispuesto a caminar para llegar a donde quieres estar.',
      ),
      p(
        'Hoy tengo el privilegio de dedicar mi vida a aquello que soñé desde niño: ayudar a las personas a enfrentar el cáncer y ofrecerles, cuando la ciencia y las condiciones lo permiten, una oportunidad de tratamiento quirúrgico moderno, seguro y especializado.',
      ),
    ],
  },
  {
    id: 'esperanza',
    title: 'Mientras existe vida, existe esperanza',
    blocks: [
      p(
        'Porque detrás de cada tumor hay una persona. Detrás de cada persona hay una familia. Y detrás de cada familia existe una historia que merece ser cuidada.',
      ),
      quote('Mientras existe vida, existe esperanza.'),
    ],
  },
];

/** Un trozo de párrafo: texto normal o destacado. */
export interface BioPart {
  readonly text: string;
  readonly strong: boolean;
}

/** `'a **b** c'` → `[a, b (strong), c]`. Sin HTML de por medio. */
export function parseEmphasis(text: string): readonly BioPart[] {
  return text
    .split('**')
    .map((chunk, index) => ({ text: chunk, strong: index % 2 === 1 }))
    .filter((part) => part.text.length > 0);
}
