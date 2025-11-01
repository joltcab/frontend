# Release Notes

## v2.0.1 — AdminPanel Fixes

Fecha: 2025-11-01

Cambios principales:
- Corrige diagnósticos del linter en `AdminPanel.jsx`.
- Elimina imports no usados (`React`, componentes de `DropdownMenu`).
- Escapa apóstrofes en textos del dashboard para evitar warnings.
- Importa `appConfig` correctamente para usar el logo y evitar pantalla en blanco.

Impacto:
- El panel de administración vuelve a renderizar correctamente.
- Se reduce ruido de warnings/errores en el editor y build.

Deploy:
- Tag creado: `v2.0.1`.
- Rama: `main`.