# Diseño: Sidebar global CIVIKA

## Contexto

`AppLayout` ya renderiza una única `Sidebar` compartida. En desktop es fija y el contenido reserva su ancho; en móvil se abre como panel lateral con overlay. El frontend no contiene router: `App.tsx` renderiza únicamente Dashboard y `ACTIVE_SECTION` fija visualmente Dashboard como activo.

Este change define la presentación global de navegación sin convertir ítems futuros en enlaces o destinos inexistentes.

## Arquitectura de navegación

La fuente de datos de navegación continuará separada de la presentación en `shared/navigation/nav-items.ts`. Deberá poder representar entradas principales, grupos con cabecera y una entrada técnica con badge, sin introducir rutas como requisito de esta fase.

La Sidebar presentará el siguiente orden:

1. Marca textual **CIVIKA**.
2. **Dashboard** como entrada principal.
3. Grupo **ANÁLISIS**: Analizar comentario, Analizar conversación, Analizar contenido.
4. Grupo **RESULTADOS**: Historial.
5. Separación visual.
6. **Laboratorio** con badge textual `[DEV]`, como entrada única.
7. **Configuración** como entrada final.
8. Perfil inferior actual, sin cambios funcionales.

Los grupos organizan destinos futuros; no son submenús desplegables. Laboratorio tampoco tendrá submenús.

## Estado activo y navegación futura

Mientras no exista routing, los ítems no deben tener `href`, rutas simuladas ni callbacks que aparenten navegar. `ACTIVE_SECTION` puede seguir sirviendo como estado visual temporal para Dashboard, pero se documentará como deuda técnica: al incorporar navegación real debe sustituirse por estado derivado de ruta o por el mecanismo de navegación aprobado.

El diseño debe evitar acoplar la Sidebar a Dashboard. La futura página deberá proporcionar el estado activo sin que la Sidebar conozca la implementación de la página.

## Responsive y accesibilidad

Se conservan los mecanismos existentes: posición fija en desktop; panel lateral y overlay en móvil; control de cierre accesible. La navegación usa `nav`, listas y controles con nombres comprensibles. Los ítems son alcanzables por teclado, su foco visible conserva contraste suficiente y el elemento activo se expone con `aria-current="page"` cuando aplique.

Los grupos se identifican mediante etiquetas textuales, no solo por espacio o color. El badge `[DEV]` debe ser textual y visible junto a Laboratorio.

No se modifica el follow-up conocido de Header compartido a 320 CSS px; no pertenece a esta Sidebar.

## Límites

- No se añade React Router ni otro mecanismo de routing.
- No se crean páginas para análisis, Historial, Configuración o Laboratorio.
- No se añade Logging como entrada independiente.
- No se modifica Header, AppLayout salvo necesidad estrictamente demostrada, AppearanceProvider, perfil inferior, estilos globales, backend, ML o API.
- No se alteran Dashboard/Home ni sus componentes centrales.

## Validación al aplicar

- `npm run build` desde `frontend/`.
- Revisión manual en desktop, modo claro/oscuro, 320 CSS px y 200 % de zoom.
- Revisión de teclado, foco visible, `aria-current`, agrupación semántica, apertura y cierre del panel móvil.
- Verificar que ningún ítem anuncia navegación ni apunta a una ruta inexistente.
- `git diff --check`.
- `openspec validate global-civika-sidebar --strict` y `/opsx:verify` solo si están disponibles; no instalar herramientas.
