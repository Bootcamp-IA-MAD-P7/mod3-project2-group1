# Tasks

## 1. Modelo de navegación

- [x] 1.1 Revisar y ampliar el modelo de `nav-items.ts` para representar entradas principales, grupos y el badge `[DEV]` sin añadir rutas falsas.
- [x] 1.2 Sustituir la marca visual Moder AI por CIVIKA exclusivamente en Sidebar.
- [x] 1.3 Mantener el perfil inferior actual y no modificar Header, Dashboard central, backend, ML ni APIs.

## 2. Sidebar compartida

- [x] 2.1 Implementar Dashboard como entrada principal y las cabeceras ANÁLISIS y RESULTADOS con estructura semántica.
- [x] 2.2 Mostrar Analizar comentario, Analizar conversación y Analizar contenido como tres entradas independientes, sin routing ni páginas nuevas.
- [x] 2.3 Mostrar Historial, Laboratorio `[DEV]` como entrada única y Configuración en el orden especificado, sin Logging ni submenús de Laboratorio.
- [x] 2.4 Conservar Sidebar fija en desktop y panel lateral con overlay en móvil, con teclado, foco visible y contraste suficiente.
- [x] 2.5 Mantener `ACTIVE_SECTION` como mecanismo visual transitorio y documentar que deberá sustituirse por estado derivado de navegación cuando exista routing aprobado.

## 3. Verificación

- [x] 3.1 Ejecutar `npm run build` desde `frontend/`.
- [x] 3.2 Revisar manualmente desktop light/dark, 320 CSS px, 200 % de zoom, teclado, foco visible y apertura/cierre del panel móvil.
- [x] 3.3 Verificar que no se crean rutas, enlaces rotos, páginas ni promesas de navegación inexistente.
- [x] 3.4 Ejecutar `git diff --check`.
- [ ] 3.5 Ejecutar `openspec validate global-civika-sidebar --strict` y `/opsx:verify` solo si están disponibles; no instalar herramientas.

## Evidencia de validación manual

- Desktop modo claro: PASS.
- Desktop modo oscuro: PASS.
- 320 CSS px / móvil: PASS.
- Zoom al 200 %: PASS.
- Navegación por teclado: PASS.
- Foco visible: PASS.
- Apertura del panel móvil: PASS.
- Cierre mediante X: PASS.
- Cierre mediante overlay: PASS.
- Branding CIVIKA y jerarquía visual: PASS.
- Laboratory con badge DEV: PASS.
- Perfil inferior: PASS.
- Sin overflow propio de la Sidebar: PASS.

Los elementos decorativos secundarios —frase de marca y ondas cuando corresponde— pueden ocultarse en viewports reducidos para priorizar la navegación funcional.

La Sidebar queda validada manualmente en funcionalidad, responsive, accesibilidad, modo claro/oscuro y Look & Feel CIVIKA. La validación `openspec validate --strict` y `/opsx:verify` permanece pendiente porque la CLI OpenSpec no está disponible; no se instalarán herramientas para esta validación.

## Fuera de alcance

- React Router, rutas, páginas, callbacks de navegación funcionales, Header, perfil, Login, History, Settings, Logging, Laboratorio funcional, backend, ML, APIs, Dashboard central y el responsive global de Header a 320 CSS px.
