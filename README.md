# Semilla

Plataforma para que emprendedoras compartan plantillas y documentos.

## Ejecutar
Usa módulos ES, así que necesita un servidor local (no abre con doble clic):
`npx serve .`  o la extensión Live Server de VS Code.

## Arquitectura (por features + capa de servicios)
- `index.html`: solo el marcado.
- `src/styles/`: tokens (colores/tema) → base → components → pantallas.
- `src/core/`: store (estado + suscripción) y utilidades DOM.
- `src/services/`: único lugar que habla con datos. Hoy son mocks en memoria; al conectar un backend se reemplaza solo esta carpeta.
- `src/features/<nombre>/`: cada función de producto (auth, documents, profile, shell) con su vista, acciones y selectores.
- `src/data/`: constantes y datos de ejemplo.

## Reglas
1. Las features comparten solo `documents/selectors` y `upload-modal`.
2. Solo `services/` hace fetch o accede a la base de datos.
3. Una feature nueva = una carpeta nueva + una línea en `main.js`.
