import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050510); // Dark night sky
  scene.fog = new THREE.FogExp2(0x050510, 0.02);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 30);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent going below ground

  // --- Lighting ---
  const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight(0xffffff, 1.5);
  moonLight.position.set(-20, 50, -20);
  moonLight.castShadow = true;
  moonLight.shadow.mapSize.width = 2048;
  moonLight.shadow.mapSize.height = 2048;
  scene.add(moonLight);

  // --- Environment ---

  // Ground (Snow)
  const groundGeometry = new THREE.PlaneGeometry(200, 200);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    metalness: 0,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 5000;
  const posArray = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 200; // Spread stars
    if (i % 3 === 1) posArray[i] = Math.abs(posArray[i]) + 10; // Keep above ground
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(posArray, 3)
  );
  const starsMaterial = new THREE.PointsMaterial({
    size: 0.2,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Moon
  const moonGeometry = new THREE.SphereGeometry(3, 32, 32);
  const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.position.copy(moonLight.position);
  scene.add(moon);

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, controls };
}
