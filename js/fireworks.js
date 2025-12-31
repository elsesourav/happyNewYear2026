import * as THREE from "three";

export class Firework {
  constructor(scene) {
    this.scene = scene;
    this.reset();
  }

  reset() {
    this.x = (Math.random() - 0.5) * 40;
    this.z = (Math.random() - 0.5) * 20 - 10; // Behind the trees mostly
    this.y = 0;
    this.targetY = 15 + Math.random() * 15;
    this.speed = 0.2 + Math.random() * 0.2;
    this.color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
    this.phase = "rise"; // rise, explode
    this.particles = [];

    // Rocket particle
    const geometry = new THREE.SphereGeometry(0.1, 4, 4);
    const material = new THREE.MeshBasicMaterial({ color: this.color });
    this.rocket = new THREE.Mesh(geometry, material);
    this.rocket.position.set(this.x, this.y, this.z);
    this.scene.add(this.rocket);
  }

  update() {
    if (this.phase === "rise") {
      this.y += this.speed;
      this.rocket.position.y = this.y;
      if (this.y >= this.targetY) {
        this.explode();
      }
    } else if (this.phase === "explode") {
      // Update particles
      let aliveParticles = false;
      this.particles.forEach((p) => {
        p.mesh.position.add(p.velocity);
        p.velocity.y -= 0.005; // Gravity
        p.life -= 0.01;
        p.mesh.material.opacity = p.life;
        if (p.life > 0) aliveParticles = true;
        else p.mesh.visible = false;
      });

      if (!aliveParticles) {
        this.cleanup();
        this.reset();
      }
    }
  }

  explode() {
    this.phase = "explode";
    this.scene.remove(this.rocket);

    const particleCount = 50;
    const geometry = new THREE.SphereGeometry(0.05, 4, 4);

    for (let i = 0; i < particleCount; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: this.color,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(this.x, this.y, this.z);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      );

      this.scene.add(mesh);
      this.particles.push({ mesh, velocity, life: 1.0 });
    }
  }

  cleanup() {
    this.particles.forEach((p) => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    });
    this.particles = [];
  }
}

export function initFireworks(scene) {
  const fireworks = [];
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      fireworks.push(new Firework(scene));
    }, i * 1000);
  }
  return fireworks;
}
