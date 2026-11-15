# design-studio

Hub de skills de diseño y frontend con un agente orquestador (`design-director`). Los proyectos se meten en `repository/` y se trabajan desde acá.

## Estructura

```
design-studio/
├── CLAUDE.md                     reglas del hub, tabla de ruteo y dueños por responsabilidad
├── skills-lock.json              origen, commit y hash de cada skill
├── .mcp.json                     MCP chrome-devtools (medición en navegador)
├── .claude/
│   ├── settings.json             hook de impeccable (versionado)
│   ├── agents/design-director.md agente orquestador
│   ├── agents/impeccable-*.md    agentes de apoyo que usa impeccable
│   └── skills/                   14 skills (diseño, frontend, medición, specs, docs)
└── repository/                   acá van los proyectos (ignorado por el git del hub)
```

## Meter un proyecto en `repository/`

Opción recomendada, un worktree del repo real (comparte historia, ramas aparte):

```bash
cd ../SmartLot
git worktree add ../design-studio/repository/SmartLot -b diseno/<tema>
```

Otras opciones:

- Clon independiente: `git clone <url> repository/SmartLot`
- Sin copiar nada: abrir Claude en el hub con `claude --add-dir ../SmartLot` (en ese caso el proyecto no queda dentro de `repository/`).

Para sacar un worktree cuando terminás: `git worktree remove repository/SmartLot`, desde el repo original.

## Uso

- Abrir Claude Code en la raíz de `design-studio`.
- Para tareas generales: "usá design-director para rediseñar el hero de SmartLot".
- Para una skill puntual: llamarla por nombre (`/impeccable`, `/web-inmersiva`, `/ui-ux-pro-max`…).

## Requisitos

- **Python 3** para el buscador de `ui-ux-pro-max` (`python .claude/skills/ui-ux-pro-max/scripts/search.py`, sin dependencias).
- **Node / npx** para el MCP `chrome-devtools` (lo levanta `.mcp.json` la primera vez que se aprueba).
- **Motor de impeccable:** el binario de `scripts/bin/` no se versiona. El wrapper `scripts/impeccable` lo baja y lo verifica por checksum la primera vez que corre.

## Skills incluidas

- **Dirección de arte:** `design-taste-frontend`
- **Sistema UI/UX y auditoría:** `ui-ux-pro-max`, `impeccable`
- **Motion:** `web-inmersiva` (3D y scroll), `emil-design-eng` (micro-interacciones), `review-animations` (revisión)
- **Medición en navegador:** `a11y-debugging`, `debug-optimize-lcp` (necesitan el MCP `chrome-devtools`)
- **Imagen e identidad:** `imagegen-frontend-web`, `brandkit` (entregan prompts; Claude Code no genera imágenes solo)
- **Ingeniería:** `vercel-react-best-practices`, `spec-driven-development`, `documentation-and-adrs`, `context-engineering`

Quién manda en qué está en "Dueños por responsabilidad", dentro de `CLAUDE.md`.

### Opcionales por proyecto

- `shadcn` (`shadcn-ui/ui`, `skills/shadcn`): sumarla solo si el proyecto tiene `components.json`.
- `remotion-best-practices` (`remotion-dev/remotion`): solo para video programático.

## Actualizar skills

`web-inmersiva` es propia. El resto son copias: el repo y la ruta de origen de cada una están en `skills-lock.json`.

1. Clonar el repo de origen en una carpeta temporal (`git clone --depth 1 https://github.com/<source>.git`).
2. Copiar la carpeta de `skillPath` encima de `.claude/skills/<skill>/`.
3. Volver a aplicar los cambios locales que figuran en `notes` (por ejemplo, las rutas de `ui-ux-pro-max`).
4. Actualizar `commit`, `syncedAt` y `sha256` en `skills-lock.json`.
5. Revisar el diff antes de commitear.
