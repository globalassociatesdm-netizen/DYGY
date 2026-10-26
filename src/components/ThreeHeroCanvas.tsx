import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      console.warn('WebGL not supported, falling back gracefully.', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 7;

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x45243F, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xF18A55, 3.5);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC8B9E8, 4.0);
    rimLight.position.set(-6, -3, 2);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xF18A55, 2, 20);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central Complex 3D Node (Torusknot with metallic/iridescent finish)
    const geom = new THREE.TorusKnotGeometry(1.5, 0.45, 128, 32, 2, 3);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x45243F,
      roughness: 0.25,
      metalness: 0.85,
      wireframe: false,
    });
    const mainMesh = new THREE.Mesh(geom, mat);
    mainMesh.position.set(2.4, 0.2, 0);
    group.add(mainMesh);

    // 2. Wireframe Overlay Mesh for dynamic tech flair
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xF18A55,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const wireMesh = new THREE.Mesh(geom, wireMat);
    wireMesh.scale.set(1.02, 1.02, 1.02);
    wireMesh.position.set(2.4, 0.2, 0);
    group.add(wireMesh);

    // 3. Floating Orb satellites
    const sphereGeom = new THREE.IcosahedronGeometry(0.35, 2);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xC8B9E8,
      roughness: 0.2,
      metalness: 0.9,
    });

    const satellites: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const sat = new THREE.Mesh(sphereGeom, sphereMat);
      const angle = (i / 5) * Math.PI * 2;
      const radius = 2.8 + (i % 2) * 0.5;
      sat.position.set(
        2.4 + Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.7,
        (Math.sin(i) - 0.5) * 1.5
      );
      group.add(sat);
      satellites.push(sat);
    }

    // 4. Ambient Constellation Particles
    const particleCount = 700;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xF18A55);
    const c2 = new THREE.Color(0xC8B9E8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const mixed = Math.random() > 0.5 ? c1 : c2;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse coordinates tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Adjust mesh position for smaller screens
      if (width < 800) {
        mainMesh.position.set(0, -0.6, -1);
        wireMesh.position.set(0, -0.6, -1);
        mainMesh.scale.set(0.65, 0.65, 0.65);
        wireMesh.scale.set(0.66, 0.66, 0.66);
      } else {
        mainMesh.position.set(2.4, 0.2, 0);
        wireMesh.position.set(2.4, 0.2, 0);
        mainMesh.scale.set(1, 1, 1);
        wireMesh.scale.set(1.02, 1.02, 1.02);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotate central node
      mainMesh.rotation.x = elapsed * 0.25 + mouseY * 0.5;
      mainMesh.rotation.y = elapsed * 0.35 + mouseX * 0.8;
      wireMesh.rotation.x = mainMesh.rotation.x;
      wireMesh.rotation.y = mainMesh.rotation.y;

      // Orbit satellites
      satellites.forEach((sat, idx) => {
        const offset = (idx / satellites.length) * Math.PI * 2;
        const currentAngle = elapsed * 0.5 + offset;
        const radius = 2.7 + (idx % 2) * 0.4;
        sat.position.x = mainMesh.position.x + Math.cos(currentAngle) * radius;
        sat.position.y = mainMesh.position.y + Math.sin(currentAngle) * (radius * 0.6);
        sat.position.z = mainMesh.position.z + Math.sin(currentAngle * 1.5) * 0.9;
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.03;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsed * 0.04;
      particles.rotation.x = elapsed * 0.02;

      // Group slight parallax
      group.position.x = mouseX * 0.5;
      group.position.y = mouseY * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geom.dispose();
      mat.dispose();
      wireMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
    };
  }, []);

  return <div ref={containerRef} className="hero-canvas-container" />;
};
