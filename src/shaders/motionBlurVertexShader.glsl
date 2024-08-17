// Vertex Shader (motionBlurVertexShader.glsl)
uniform float time;
attribute vec3 velocity;
varying vec2 vUv;

void main() {
  vUv = uv;

  // Calculate the stretched position
  vec3 dancedPosition = position + velocity * sin(time) * 10.0;
  vec3 stretchedPosition = dancedPosition + velocity * time;

  // Set the final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(stretchedPosition, 1.0);
}
