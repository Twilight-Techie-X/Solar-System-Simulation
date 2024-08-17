// Fragment Shader (motionBlurFragmentShader.glsl)
varying vec2 vUv;

void main() {
  // Define the colors for the gradient
  vec3 color1 = vec3(0.5, 0.0, 0.5); // Purple
  vec3 color2 = vec3(0.0, 0.0, 1.0); // Blue
  vec3 color3 = vec3(1.0, 1.0, 1.0); // White

  // Interpolate between colors based on the UV coordinate
  vec3 color;
  if (vUv.x < 0.5) {
    color = mix(color1, color2, vUv.x * 2.0); // Blend purple to blue
  } else {
    color = mix(color2, color3, (vUv.x - 0.5) * 2.0); // Blend blue to white
  }

  // Set the color
  gl_FragColor = vec4(color, 1.0);
}
