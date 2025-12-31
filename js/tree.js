import * as THREE from "three";

export function createTree(scene, x, z) {
  const treeGroup = new THREE.Group();
  treeGroup.position.set(x, 0, z);

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.5, 0.8, 2, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d2926 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 1;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  // Leaves (3 layers of cones)
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x0f5f13,
    roughness: 0.8,
  });

  const layer1 = new THREE.Mesh(new THREE.ConeGeometry(3, 4, 8), leafMat);
  layer1.position.y = 3;
  layer1.castShadow = true;
  treeGroup.add(layer1);

  const layer2 = new THREE.Mesh(new THREE.ConeGeometry(2.2, 3, 8), leafMat);
  layer2.position.y = 5;
  layer2.castShadow = true;
  treeGroup.add(layer2);

  const layer3 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 8), leafMat);
  layer3.position.y = 6.5;
  layer3.castShadow = true;
  treeGroup.add(layer3);

  // Star on top
  const starGeo = new THREE.OctahedronGeometry(0.3);
  const starMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const star = new THREE.Mesh(starGeo, starMat);
  star.position.y = 7.8;
  treeGroup.add(star);

  // Ornaments
  const ornamentColors = [0xff0000, 0x0000ff, 0xffff00, 0xff00ff];
  const ornamentGeo = new THREE.SphereGeometry(0.15, 8, 8);

  for (let i = 0; i < 15; i++) {
    const color =
      ornamentColors[Math.floor(Math.random() * ornamentColors.length)];
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.5,
      roughness: 0.2,
    });
    const ornament = new THREE.Mesh(ornamentGeo, mat);

    // Random position on the tree cone approximation
    const angle = Math.random() * Math.PI * 2;
    const height = 2 + Math.random() * 5; // Height between 2 and 7
    const radius = (7.5 - height) * 0.4; // Approximate radius at height

    ornament.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
    treeGroup.add(ornament);
  }

  scene.add(treeGroup);
}

export function createForest(scene) {
  // Place some trees
  createTree(scene, 0, 0); // Center tree

  // Random forest
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 40; // Keep away from center
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    createTree(scene, x, z);
  }
}
