# Logos institucionales — MARCAS PROVISIONALES

Los SVG de esta carpeta **no son los logos oficiales** de las
instituciones. Son marcas geométricas diseñadas para esta página, con
un lenguaje visual común, para que la sección de formación se vea
terminada sin usar material de terceros sin permiso.

## Por qué

Usar el logotipo oficial de una universidad, un instituto o una
sociedad científica requiere **autorización expresa** de esa
institución. Publicarlo sin permiso expone al doctor a un reclamo
por uso indebido de marca, y en el caso de instituciones públicas
(INEN, EsSalud) puede leerse como una afiliación o un respaldo que
no existe.

## Qué hacer

1. Preguntar al doctor si cuenta con autorización de uso para cada
   institución (está en la pregunta 19 del formulario de descubrimiento).
2. Por cada logo autorizado:
   - reemplazar el archivo `.svg` de esta carpeta manteniendo el
     mismo nombre y un lienzo cuadrado de 64×64,
   - en `src/app/core/data/doctor.data.ts`, cambiar `logoIsOfficial`
     a `true` en la credencial correspondiente.
3. Si una institución **no** autoriza el uso de su logo, se deja la
   marca provisional: el nombre en texto sí se puede mencionar, porque
   es un hecho verificable de la trayectoria del doctor.

## Archivos

| Archivo | Institución |
|---|---|
| `inen.svg` | Instituto Nacional de Enfermedades Neoplásicas |
| `ircad.svg` | IRCAD América Latina |
| `upch.svg` | Universidad Peruana Cayetano Heredia |
| `spc.svg` | Sociedad Peruana de Cancerología |
| `essalud.svg` | EsSalud — Red Asistencial Piura |
| `cmp.svg` | Colegio Médico del Perú |
