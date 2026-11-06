# design-studio

Hub de skills de diseño y frontend con un agente orquestador (`design-director`). Los proyectos se meten en `repository/` y se trabajan desde acá.

## Estructura

```
design-studio/
├── CLAUDE.md                     reglas del hub + tabla de ruteo de skills
├── .claude/
│   ├── agents/design-director.md agente orquestador
│   └── skills/                   22 skills (diseño, frontend, specs, docs)
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

## Skills incluidas

- **Dirección de arte:** `design-taste-frontend`, `frontend-design`
- **Sistema UI/UX y auditoría:** `ui-ux-pro-max`, `impeccable`, `emil-design-eng`
- **Inmersivo / 3D:** `web-inmersiva`, `frontend-lead`
- **Imagen → código:** `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `brandkit`
- **Ingeniería:** `vercel-react-best-practices`, `spec-driven-development`, `documentation-and-adrs`, `context-engineering`
- **Opt-in (solo por nombre):** `design-taste-frontend-v1`, `design-taste-frontend-v2-experimental`, `gpt-taste`, `stitch-design-taste`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`

Origen: `web-inmersiva` viene del perfil de claude.ai y el resto de `SmartLot/.claude/skills`. Son copias: si se actualizan en el origen, hay que volver a copiarlas.
