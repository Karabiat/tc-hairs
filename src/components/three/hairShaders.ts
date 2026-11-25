/** Shader source for the procedural hair cards. */

export const hairVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uMotion;
  uniform float uSway;

  attribute vec3 aTangent;
  attribute float aPhase;
  attribute float aTint;
  attribute float aSway;

  varying vec2 vUv;
  varying float vTint;
  varying vec3 vTangent;
  varying vec3 vWorld;
  varying float vPhase;

  void main() {
    vUv = uv;
    vTint = aTint;
    vPhase = aPhase;

    vec3 pos = position;
    float t = uv.y;
    float w = pow(t, 1.65);
    float m = uMotion;

    // Two-frequency breeze with a per-strand phase offset. Roots (t=0) stay put.
    float swayX = sin(uTime * 1.05 + aPhase * 6.2831 + t * 3.4) * 0.05;
    swayX += sin(uTime * 0.47 + aPhase * 3.1 + t * 1.6) * 0.038;
    float swayZ = cos(uTime * 0.88 + aPhase * 4.4 + t * 2.7) * 0.045;

    pos.x += (swayX + uPointer.x * 0.2) * w * aSway * uSway * m;
    pos.z += (swayZ + uPointer.y * 0.13) * w * aSway * uSway * m;
    pos.y += sin(uScroll * 6.2831 + aPhase * 2.0) * 0.035 * w * m;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vWorld = world.xyz;
    vTangent = normalize(mat3(modelMatrix) * aTangent);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

export const hairFragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uKeyDir;
  uniform vec3 uKeyColor;
  uniform vec3 uRimDir;
  uniform vec3 uRimColor;
  uniform vec3 uGlowColor;
  uniform float uExposure;

  varying vec2 vUv;
  varying float vTint;
  varying vec3 vTangent;
  varying vec3 vWorld;
  varying float vPhase;

  vec3 aces(vec3 x) {
    return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  }

  vec3 linearToSRGB(vec3 c) {
    return mix(c * 12.92, 1.055 * pow(max(c, 0.0), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
  }

  // Kajiya-Kay anisotropic lobe. Shifting the tangent produces the secondary
  // highlight that makes healthy hair look glassy rather than plastic.
  float hairSpec(vec3 T, vec3 N, vec3 V, vec3 L, float shift, float power) {
    vec3 H = normalize(L + V);
    vec3 Ts = normalize(T + N * shift);
    float dotTH = clamp(dot(Ts, H), -1.0, 1.0);
    float sinTH = sqrt(max(0.0, 1.0 - dotTH * dotTH));
    return pow(sinTH, power);
  }

  void main() {
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 T = normalize(vTangent);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 N = normalize(cross(T, cross(T, up) + vec3(0.0001, 0.0, 0.0001)));
    N = normalize(N) * (N.y < 0.0 ? -1.0 : 1.0);

    float u = vUv.x;
    float v = vUv.y;
    float cyl = sqrt(max(0.0, 1.0 - pow(u * 2.0 - 1.0, 2.0)));

    vec3 base = mix(uColorA, uColorB, vTint);

    // Micro-striation along the card, subtle enough to just add richness.
    float striation = 0.5 + 0.5 * sin(v * 260.0 + vPhase * 40.0);
    base *= 0.92 + 0.08 * striation;

    vec3 L1 = normalize(uKeyDir);
    vec3 L2 = normalize(uRimDir);

    float wrap = clamp(dot(N, L1) * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = base * (0.18 + 0.55 * wrap) * uKeyColor;
    col *= 0.55 + 0.45 * cyl;

    // Two shifted anisotropic lobes: a tight white-warm glint and a broader
    // amber sheen. Kept restrained so jet hair stays black, not blonde.
    float s1 = hairSpec(T, N, V, L1, 0.055, 120.0);
    float s2 = hairSpec(T, N, V, L1, -0.095, 28.0);
    col += mix(uKeyColor, uGlowColor, 0.45) * s1 * 0.62 * (0.25 + 0.75 * cyl);
    col += mix(base, uKeyColor, 0.22) * s2 * 0.16;

    float rim = hairSpec(T, N, V, L2, 0.04, 80.0);
    col += uRimColor * rim * 1.25;
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    col += uRimColor * fres * 0.16;

    // A broad, conditioned sheen across the mid-lengths.
    float sheen = smoothstep(0.3, 0.9, v) * 0.03;
    col += uGlowColor * sheen * (0.25 + 0.75 * cyl);

    col *= uExposure;
    col = aces(col);
    col = linearToSRGB(col);

    gl_FragColor = vec4(col, 1.0);
  }
`;
