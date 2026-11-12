# design-studio

Hub de skills de diseño y frontend con un agente orquestador (`design-director`). Los proyectos se meten en `repository/` y se trabajan desde acá.

## Estructura

```
design-studio/
├── CLAUDE.md                     reglas del hub + tabla de ruteo de skills
├── .claude/
│   ├── agents/design-director.md agente orquestador
│   └── skills/                   11 skills (diseño, frontend, specs, docs)
└── repository/                   acá van los proyectos (ignorado por el git del hub)
```

## Meter un proyecto en `repository/`

Opción recomendada, un clon independiente (funciona igual en local y en la nube):

```bash
git clone <url> repository/SmartLot
cd repository/SmartLot && git checkout -b diseno/<tema>
```

Si dos proyectos se referencian entre sí (por ejemplo, un juego y su landing que comparten documentación), se clonan los dos en `repository/`, uno al lado del otro.

Otras opciones:

- Worktree del repo real, si ya lo tenés clonado y querés compartir historia: `git worktree add ../design-studio/repository/SmartLot -b diseno/<tema>` desde `../SmartLot`. Para sacarlo: `git worktree remove repository/SmartLot`, desde el repo original.
- Sin copiar nada: abrir Claude en el hub con `claude --add-dir ../SmartLot` (en ese caso el proyecto no queda dentro de `repository/`).

Los cambios de diseño grandes van en una rama `diseno/<tema>` del proyecto, nunca en `main`. El agente avisa antes de tocar archivos y solo commitea o pushea si se le pide.

## Uso

- Abrir Claude Code en la raíz de `design-studio`.
- Para tareas generales: "usá design-director para rediseñar el hero de SmartLot".
- Para una skill puntual: llamarla por nombre (`/impeccable`, `/web-inmersiva`, `/ui-ux-pro-max`…).

## Skills incluidas

- **Dirección de arte:** `design-taste-frontend`
- **Sistema UI/UX y auditoría:** `ui-ux-pro-max`, `impeccable`, `emil-design-eng`
- **Inmersivo / 3D:** `web-inmersiva`
- **Imagen e identidad:** `imagegen-frontend-web`, `brandkit`
- **Ingeniería:** `vercel-react-best-practices`, `spec-driven-development`, `documentation-and-adrs`, `context-engineering`
Origen: `web-inmersiva` viene del perfil de claude.ai y el resto de `SmartLot/.claude/skills`. Son copias: si se actualizan en el origen, hay que volver a copiarlas.
