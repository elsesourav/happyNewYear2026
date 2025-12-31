import { initFireworks } from "./js/fireworks.js";
import {
  createMagicParticles,
  createTextParticles,
  updateMagic,
} from "./js/particles.js";
import { initScene } from "./js/scene.js";
import { createForest } from "./js/tree.js";

// --- Initialization ---
const { scene, camera, renderer, controls } = initScene();

// --- Create Objects ---
createForest(scene);
const fireworks = initFireworks(scene);
const { magicSystem, magicVelocities, magicCount } =
  createMagicParticles(scene);
createTextParticles(scene);

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  // Animate fireworks
  fireworks.forEach((fw) => fw.update());

  // Animate magic particles
  updateMagic(magicSystem, magicVelocities, magicCount);

  renderer.render(scene, camera);
}

animate();
