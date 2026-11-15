# Verificación y entrega

## Verificación (antes de decir "listo")

1. **Build:** `npm run build` sin errores de tipos y con los chunks dentro del presupuesto. Si `index-*.js` supera los 150 KB gzip, algo de la capa DOM importa three.
2. **Recorrido en el navegador** (Playwright, el navegador integrado o el MCP `chrome-devtools`, el que esté disponible):
   - Viewports de 390×844 (táctil), 768, 1440×900 y reduced motion.
   - Scroll hacia adelante, **hacia atrás** y con un tirón rápido: cada sección restaura su estado.
   - Consola limpia (solo el warning conocido de `THREE.Clock`).
   - Chromium headless con WebGL: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
   - Para Lenis se usa `page.mouse.wheel`; en táctil, `scrollTo` nativo.
   - Se revisan las capturas a ojo: encuadre, contraste y que el panel no tape el objeto.
3. **Versiones del sitio:** sin 3D (`?sin3d`), sin WebGL, reduced motion y presentación (si existe).
4. **Core Web Vitals en perfil móvil:** LCP < 2.5 s, CLS < 0.1, INP < 200 ms. Con Lighthouse, o con la skill `debug-optimize-lcp` si el MCP `chrome-devtools` está conectado (traza de rendimiento y desglose del LCP).
5. **Integridad:** cada dato coincide con la fuente que dio el usuario y la CTA funciona.
6. **Accesibilidad:** recorrido con teclado, contraste y lector de pantalla en al menos una sección. Con el MCP `chrome-devtools`, la skill `a11y-debugging` revisa el árbol de accesibilidad real.
7. **Motion:** si está instalada `review-animations`, una pasada sobre la tabla B (interfaz) y los revelados de contenido.
8. **Segunda mirada:** otra pasada con otro agente u otro día, contra las secciones de accesibilidad y de landing pages.

## Entrega

- [ ] Build estático. `base` en `vite.config.ts` según dónde se publique (`"./"` para servirlo desde una carpeta cualquiera).
- [ ] Hosting estático (Vercel, Netlify, GitHub Pages, Cloudflare Pages) o el que ya use el proyecto. `file://` no sirve para módulos ES.
- [ ] Todo autoalojado (fuentes, modelos, pósters, decodificador de Draco, HDRI). Se prueba una vez con la red apagada si se va a mostrar en vivo.
- [ ] Meta, Open Graph, favicon y página 404 si el hosting lo necesita.
- [ ] Si se va a presentar en vivo: un ensayo en la máquina y la pantalla reales, la versión sin 3D como respaldo y un video del recorrido.
