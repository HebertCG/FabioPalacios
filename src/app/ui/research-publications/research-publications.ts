import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Reveal } from '../../core/directives/reveal';

interface ResearchPublication {
  readonly id: string;
  readonly source: string;
  readonly date: string;
  readonly badge: string;
  readonly title: string;
  readonly summary: string;
  readonly url: string;
  readonly action: string;
  readonly image?: string;
  readonly imageAlt?: string;
  readonly tone: 'lead' | 'clinical' | 'academic' | 'interview';
}

@Component({
  selector: 'app-research-publications',
  imports: [Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './research-publications.html',
  styleUrl: './research-publications.scss',
})
export class ResearchPublications {
  protected readonly publications: readonly ResearchPublication[] = [
    {
      id: 'hepatectomia',
      source: 'EsSalud · Nota de prensa',
      date: '17 JUL 2024',
      badge: '80% del hígado afectado',
      title: 'Una cirugía de alta complejidad que salvó una vida.',
      summary:
        'Fabio Palacios lideró una intervención de más de cuatro horas junto a un equipo de cerca de diez profesionales.',
      url: 'https://www.gob.pe/institucion/essalud/noticias/989831-medicos-de-essalud-extraen-a-madre-piurana-el-80-de-su-higado-afectado-con-tumor-maligno-y-le-salvan-la-vida',
      action: 'Leer publicación',
      image: '/research/essalud-higado.webp',
      imageAlt: 'Equipo médico durante una cirugía hepática de alta complejidad',
      tone: 'lead',
    },
    {
      id: 'tratamiento-integral',
      source: 'EsSalud Piura · Caso clínico',
      date: '26 MAY 2025',
      badge: 'Metástasis en 3 órganos',
      title: 'Un tratamiento integral frente a un diagnóstico complejo.',
      summary:
        'El caso documenta la coordinación de cirugía, quimioterapia y radioterapia para tratar un cáncer en etapa IV.',
      url: 'https://www.gob.pe/institucion/essalud/noticias/1175398-paciente-de-58-anos-supera-cancer-con-metastasis-en-tres-organos-gracias-a-tratamiento-integral-en-essalud-piura',
      action: 'Leer publicación',
      image: '/research/essalud-tratamiento-integral.webp',
      imageAlt: 'Paciente de EsSalud Piura acompañado por familiares y personal médico',
      tone: 'clinical',
    },
    {
      id: 'renati',
      source: 'SUNEDU · Registro nacional',
      date: 'PERFIL DE AUTOR',
      badge: 'Investigación académica',
      title: 'Conocimiento que se investiga y se documenta.',
      summary: 'Consulta la producción académica registrada a nombre de Fabio Palacios Lizarbe.',
      url: 'https://renati.sunedu.gob.pe/indice/autor/detalle?p=0&c=20&valor=palacios+lizarbe%2C+fabio',
      action: 'Ver perfil',
      tone: 'academic',
    },
    {
      id: 'walac-cancer-colon',
      source: 'Walac Noticias · Entrevista',
      date: 'VIDEO',
      badge: 'Entrevista',
      title: 'Cáncer de colon: una enfermedad silenciosa.',
      summary:
        'Una conversación sobre el cáncer de colon y su presencia cada vez más frecuente en pacientes jóvenes de Piura.',
      url: 'https://www.youtube.com/watch?v=JcUj_pWCwxE',
      action: 'Ver entrevista',
      image: '/research/walac-cancer-colon.webp',
      imageAlt: 'Entrevista de Walac Noticias al doctor Fabio Palacios sobre cáncer de colon',
      tone: 'interview',
    },
  ];
}
