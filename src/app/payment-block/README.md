# Bloqueo por falta de pago

El aviso ocupa toda la pantalla y no incluye un botón para cerrarlo.

Para volver a mostrar el sitio después de recibir el pago, cambia esta línea en
`payment-block.config.ts`:

```ts
export const PAYMENT_BLOCK_ENABLED = false;
```
