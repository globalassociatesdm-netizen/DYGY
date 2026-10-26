import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCoffeeCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.9, 3.1);
    camera.lookAt(0, 0.35, 0);

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Warm Ambient and Spot Lights
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 2.0);
    scene.add(ambientLight);

    const warmSpot = new THREE.SpotLight(0xF18A55, 3.8, 15, Math.PI / 4, 0.5);
    warmSpot.position.set(2, 5, 3);
    scene.add(warmSpot);

    const rimLight = new THREE.DirectionalLight(0xC8B9E8, 2.2);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    const coffeeGroup = new THREE.Group();
    coffeeGroup.scale.set(1.35, 1.35, 1.35);
    scene.add(coffeeGroup);

    // Ceramic Saucer
    const saucerGeom = new THREE.CylinderGeometry(1.4, 0.9, 0.14, 48);
    const ceramicMat = new THREE.MeshStandardMaterial({
      color: 0xF7F4ED,
      roughness: 0.2,
      metalness: 0.1,
    });
    const saucer = new THREE.Mesh(saucerGeom, ceramicMat);
    saucer.position.y = -0.2;
    coffeeGroup.add(saucer);

    // Ceramic Cup Body
    const cupGeom = new THREE.CylinderGeometry(0.85, 0.65, 1.1, 48, 1, true);
    const cup = new THREE.Mesh(cupGeom, ceramicMat);
    cup.position.y = 0.45;
    coffeeGroup.add(cup);

    // Cup Base / Interior Bottom
    const cupBaseGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 48);
    const cupBase = new THREE.Mesh(cupBaseGeom, ceramicMat);
    cupBase.position.y = -0.06;
    coffeeGroup.add(cupBase);

    // Cup Handle (Torus)
    const handleGeom = new THREE.TorusGeometry(0.35, 0.08, 24, 32, Math.PI * 1.2);
    const handle = new THREE.Mesh(handleGeom, ceramicMat);
    handle.position.set(0.9, 0.45, 0);
    handle.rotation.z = -Math.PI / 2;
    coffeeGroup.add(handle);

    // Rich Dark Coffee Liquid Surface
    const liquidGeom = new THREE.CylinderGeometry(0.8, 0.8, 0.02, 48);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x2A150D, // rich espresso
      roughness: 0.1,
      metalness: 0.2,
    });
    const liquid = new THREE.Mesh(liquidGeom, liquidMat);
    liquid.position.y = 0.85;
    coffeeGroup.add(liquid);

    // Subtle Latte Art Foam (Inner circle)
    const foamGeom = new THREE.CircleGeometry(0.4, 32);
    const foamMat = new THREE.MeshStandardMaterial({
      color: 0xE8D5B7,
      roughness: 0.4,
    });
    const foam = new THREE.Mesh(foamGeom, foamMat);
    foam.rotation.x = -Math.PI / 2;
    foam.position.y = 0.87;
    coffeeGroup.add(foam);

    // Rising Steam Particles
    const steamCount = 80;
    const steamGeom = new THREE.BufferGeometry();
    const steamPos = new Float32Array(steamCount * 3);
    const steamSpeeds: { x: number; y: number; z: number; startY: number }[] = [];

    for (let i = 0; i < steamCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.4;
      const x = Math.cos(angle) * radius;
      const y = 0.9 + Math.random() * 1.5;
      const z = Math.sin(angle) * radius;

      steamPos[i * 3] = x;
      steamPos[i * 3 + 1] = y;
      steamPos[i * 3 + 2] = z;

      steamSpeeds.push({
        x: (Math.random() - 0.5) * 0.005,
        y: 0.008 + Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.005,
        startY: 0.9
      });
    }

    steamGeom.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));

    const steamMat = new THREE.PointsMaterial({
      color: 0xF7F4ED,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const steam = new THREE.Points(steamGeom, steamMat);
    coffeeGroup.add(steam);

    // Interactive subtle drag / mouse tracking
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0.4;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        targetRotationY = normX * 0.6 + 0.3;
      } else {
        const deltaX = e.clientX - prevMouseX;
        targetRotationY += deltaX * 0.01;
        prevMouseX = e.clientX;
      }
    };

    const onMouseUp = () => { isDragging = false; };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotate
      coffeeGroup.rotation.y += (targetRotationY - coffeeGroup.rotation.y) * 0.06;
      coffeeGroup.position.y = Math.sin(elapsed * 1.5) * 0.04;

      // Animate Steam
      const positions = steamGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < steamCount; i++) {
        positions[i * 3 + 1] += steamSpeeds[i].y;
        positions[i * 3] += Math.sin(elapsed * 2 + i) * 0.003;
        positions[i * 3 + 2] += Math.cos(elapsed * 2 + i) * 0.003;

        // Reset if reached height
        if (positions[i * 3 + 1] > 2.6) {
          positions[i * 3 + 1] = steamSpeeds[i].startY;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 0.35;
          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 2] = Math.sin(angle) * radius;
        }
      }
      steamGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      saucerGeom.dispose();
      cupGeom.dispose();
      cupBaseGeom.dispose();
      handleGeom.dispose();
      liquidGeom.dispose();
      foamGeom.dispose();
      steamGeom.dispose();
      ceramicMat.dispose();
      liquidMat.dispose();
      foamMat.dispose();
      steamMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="coffee-cup-visual" style={{ width: '100%', height: '420px', cursor: 'grab' }} />;
};
