import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

export function createMagicParticles(scene) {
  const magicGeometry = new THREE.BufferGeometry();
  const magicCount = 2000;
  const magicPositions = new Float32Array(magicCount * 3);
  const magicVelocities = [];

  for (let i = 0; i < magicCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 5;

    magicPositions[i * 3] = Math.cos(angle) * radius; // x
    magicPositions[i * 3 + 1] = Math.random() * 15; // y
    magicPositions[i * 3 + 2] = Math.sin(angle) * radius; // z

    magicVelocities.push({
      y: 0.02 + Math.random() * 0.05,
      angle: angle,
      radius: radius,
      speed: 0.01 + Math.random() * 0.02,
    });
  }

  magicGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(magicPositions, 3)
  );
  const magicMaterial = new THREE.PointsMaterial({
    color: 0xffd700, // Gold
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  const magicSystem = new THREE.Points(magicGeometry, magicMaterial);
  scene.add(magicSystem);

  return { magicSystem, magicVelocities, magicCount };
}

export function updateMagic(magicSystem, magicVelocities, magicCount) {
  const positions = magicSystem.geometry.attributes.position.array;

  for (let i = 0; i < magicCount; i++) {
    const v = magicVelocities[i];

    // Update angle for spiral
    v.angle += v.speed;

    // Update position
    positions[i * 3] = Math.cos(v.angle) * v.radius; // x
    positions[i * 3 + 1] += v.y; // y
    positions[i * 3 + 2] = Math.sin(v.angle) * v.radius; // z

    // Reset if too high
    if (positions[i * 3 + 1] > 15) {
      positions[i * 3 + 1] = 0;
      v.radius = 2 + Math.random() * 5; // Reset radius
    }
  }
  magicSystem.geometry.attributes.position.needsUpdate = true;
}

export function createTextParticles(scene) {
  const loader = new FontLoader();
  loader.load(
    "https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeometry = new TextGeometry("Happy New Year\n       2026", {
        font: font,
        size: 3,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: false,
      });

      textGeometry.center();

      const textMaterial = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 0.1,
        sizeAttenuation: true,
      });

      const textPoints = new THREE.Points(textGeometry, textMaterial);
      textPoints.position.set(0, 15, -10); // Position above and behind the center tree
      textPoints.rotation.x = 0.1;
      scene.add(textPoints);

      // Animate text color
      function animateText() {
        requestAnimationFrame(animateText);
        const time = Date.now() * 0.001;
        textPoints.material.color.setHSL((time * 0.1) % 1, 1, 0.5);
        textPoints.rotation.y = Math.sin(time * 0.5) * 0.1;
      }
      animateText();
    }
  );
}
