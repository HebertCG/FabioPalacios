# Material fuente

Fotografías y vídeos originales del doctor, **fuera de `public/`** a propósito:
esta carpeta no entra en el build ni se publica en internet.

De aquí salen las imágenes que sí usa la página. El flujo es:

1. Elegir la foto y copiarla a `public/fabio/` con un nombre descriptivo.
2. Declararla en `src/app/core/media/image-variants.ts` con los anchos que
   pide su hueco en la maquetación.
3. Ejecutar `npm run media:images` para generar las variantes AVIF y WebP.

`dr-fabio-palacios-cirujano-oncologo-piura-perfil.jpg` se conserva como
respaldo documental: es la fuente de las credenciales (CMP, RNE y las seis
áreas quirúrgicas) que cita `core/data/doctor.data.ts`.
