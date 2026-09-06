/**
 * MEDICIÓN DE VISITAS
 * -------------------
 * Un único sitio donde encender o apagar la analítica, y donde vive el
 * identificador.
 *
 * Mientras `measurementId` esté vacío no se carga ningún script de terceros:
 * ni una petición, ni una cookie, ni una línea en la política de privacidad
 * describiendo algo que no ocurre. Encenderlo es pegar el identificador aquí.
 *
 * TODO: pegar el ID de medición de Google Analytics 4 (formato `G-XXXXXXXXXX`).
 * Se obtiene en analytics.google.com → Administrar → Flujos de datos → Web.
 */
export const ANALYTICS = {
  measurementId: '',

  /**
   * Verdadero solo cuando hay un identificador real. Lo consultan el
   * inicializador que carga el script y la política de privacidad, para que
   * ambos digan lo mismo sin poder desincronizarse.
   */
  get enabled(): boolean {
    return this.measurementId.startsWith('G-');
  },
} as const;

/** Nombre del evento que marca una consulta iniciada por WhatsApp. */
export const CONTACT_EVENT = 'contacto_whatsapp';
