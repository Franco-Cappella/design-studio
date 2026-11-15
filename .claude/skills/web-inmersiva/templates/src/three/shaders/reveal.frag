uniform float uTime;
uniform float uReveal;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  // Borde de revelado con matemática, sin if/else. El tiempo solo agrega un temblor sutil:
  // con uReveal = 1 el plano se ve entero aunque el reloj esté quieto (reduced motion).
  float edge = vUv.y + sin(vUv.x * 12.0 + uTime) * 0.02;
  float r = mix(-0.1, 1.1, uReveal); // 0 = nada visible, 1 = todo visible (el borde ondulado no corta)
  float alpha = 1.0 - smoothstep(r - 0.05, r, edge);
  gl_FragColor = vec4(uColor, alpha);
}
