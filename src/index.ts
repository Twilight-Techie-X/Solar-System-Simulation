import * as THREE from 'three';

// Import shaders
import vertexShader from './shaders/motionBlurVertexShader.glsl';
import fragmentShader from './shaders/motionBlurFragmentShader.glsl';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a shader material for motion blur
const motionBlurMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    time: { value: 1.0 },
  },
});

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create stars
function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });

  const starVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

createStars();

// Function to create a planet
function createPlanet(size: number, color: number, distance: number) {
  const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
  const planetMaterial = new THREE.MeshBasicMaterial({ color });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  // Set the planet's initial position
  planet.position.x = distance;

  // Create an Object3D to hold the planet and its orbit
  const planetOrbit = new THREE.Object3D();
  planetOrbit.add(planet);
  scene.add(planetOrbit);

  return planetOrbit;
}

// Create planets
const mercury = createPlanet(0.5, 0xaaaaaa, 10);
const venus = createPlanet(0.9, 0xffaa00, 15);
const earth = createPlanet(1, 0x0000ff, 20);
const mars = createPlanet(0.7, 0xff0000, 25);
const jupiter = createPlanet(2, 0xaa5500, 35);
const saturn = createPlanet(1.7, 0xaa8800, 45);
const uranus = createPlanet(1.2, 0x00aaff, 55);
const neptune = createPlanet(1.1, 0x0000aa, 65);

// Create asteroid belt
function createAsteroidBelt() {
  const asteroidBelt = new THREE.Object3D();
  const asteroidGeometry = new THREE.SphereGeometry(0.2, 12, 12);
  const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

  for (let i = 0; i < 500; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

    // Randomize position in the belt
    const distance = THREE.MathUtils.randFloat(28, 34);
    const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
    asteroid.position.set(
      distance * Math.cos(angle),
      THREE.MathUtils.randFloat(-1, 1), // Slight vertical variation
      distance * Math.sin(angle)
    );

    asteroid.rotation.set(
      THREE.MathUtils.randFloat(0, Math.PI * 2),
      THREE.MathUtils.randFloat(0, Math.PI * 2),
      THREE.MathUtils.randFloat(0, Math.PI * 2)
    );

    asteroidBelt.add(asteroid);
  }

  scene.add(asteroidBelt);
}

createAsteroidBelt();

// Create a comet
function createComet() {
  const cometGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const cometMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const comet = new THREE.Mesh(cometGeometry, cometMaterial);

  const cometOrbit = new THREE.Object3D();
  comet.position.x = 80;
  cometOrbit.add(comet);
  scene.add(cometOrbit);

  const cometTailGeometry = new THREE.CylinderGeometry(0.05, 0.3, 3, 12, 1, true);
  const cometTailMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
  const cometTail = new THREE.Mesh(cometTailGeometry, cometTailMaterial);
  cometTail.rotation.x = Math.PI / 2;
  cometTail.position.set(-1.5, 0, 0);
  comet.add(cometTail);

  return cometOrbit;
}

const comet = createComet();

// Set the camera position and orientation
camera.position.set(60, 40, 60); // Diagonal position above the plane
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the scene

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the orbits around the sun, keeping all orbits in the same plane
  mercury.rotation.y += 0.04;
  venus.rotation.y += 0.03;
  earth.rotation.y += 0.02;
  mars.rotation.y += 0.01;
  jupiter.rotation.y += 0.005;
  saturn.rotation.y += 0.004;
  uranus.rotation.y += 0.003;
  neptune.rotation.y += 0.002;

  // Move the comet in an elliptical orbit
  comet.rotation.y += 0.002;
  
  renderer.render(scene, camera);
}

animate();
