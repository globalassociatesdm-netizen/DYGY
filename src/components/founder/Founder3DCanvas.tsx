import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Founder3DCanvasProps {
  activeChapter: number; // 0 to 5
  chapterProgress: number; // 0 to 1
  onChapterSelect?: (index: number) => void;
}

export const Founder3DCanvas: React.FC<Founder3DCanvasProps> = ({
  activeChapter,
  chapterProgress,
  onChapterSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const activeChapterRef = useRef(activeChapter);
  const chapterProgressRef = useRef(chapterProgress);

  useEffect(() => {
    activeChapterRef.current = activeChapter;
  }, [activeChapter]);

  useEffect(() => {
    chapterProgressRef.current = chapterProgress;
  }, [chapterProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL initialization failed, falling back', e);
      setWebGlSupported(false);
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF8F5EE, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0.2, 1.4, 3.6);

    // ==========================================
    // LIGHTING: Warm, feminine, editorial studio
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xFFF6EE, 1.8);
    scene.add(ambientLight);

    // Key Light: Warm golden morning sun
    const keyLight = new THREE.DirectionalLight(0xFFE8D6, 3.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Soft Rim Light: Dygytaly Tangerine & Lavender
    const rimLight = new THREE.DirectionalLight(0xF18A55, 2.0);
    rimLight.position.set(-4, 3, -2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xC8B9E8, 1.4);
    fillLight.position.set(0, -2, 3);
    scene.add(fillLight);

    // Point Light for dramatic chapter highlights
    const accentPoint = new THREE.PointLight(0xF18A55, 1.5, 10);
    accentPoint.position.set(0, 1.8, 1);
    scene.add(accentPoint);

    // ==========================================
    // FLOATING DUST / SUNBEAM PARTICLES
    // ==========================================
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = Math.random() * 4;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xF18A55,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // ==========================================
    // STAGE / STUDIO FLOOR
    // ==========================================
    const floorGeom = new THREE.CircleGeometry(6, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xF2ECE1,
      roughness: 0.6,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Concentric ring on floor
    const ringGeom = new THREE.RingGeometry(2.2, 2.24, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xE2D8C9, side: THREE.DoubleSide });
    const floorRing = new THREE.Mesh(ringGeom, ringMat);
    floorRing.rotation.x = -Math.PI / 2;
    floorRing.position.y = 0.002;
    scene.add(floorRing);

    // ==========================================
    // 3D FOUNDER CHARACTER: GOWRI JAGADHEESHWARAN
    // Stylized editorial silhouette:
    // Tailored black blazer, pastel pink top,
    // sculpted wavy dark hair, gold drop necklace
    // ==========================================
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // Shared Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xE4AF96,
      roughness: 0.55,
      metalness: 0.05
    });
    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x1F1A24, // Chic Charcoal Aubergine
      roughness: 0.7,
      metalness: 0.1
    });
    const pinkTopMat = new THREE.MeshStandardMaterial({
      color: 0xF6D6DE, // Pastel Rose Pink Top
      roughness: 0.6,
      metalness: 0.05
    });
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x151218, // Lustrous dark wavy hair
      roughness: 0.35,
      metalness: 0.2
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xE5B869, // Warm brushed gold jewelry
      roughness: 0.25,
      metalness: 0.85
    });
    const trouserMat = new THREE.MeshStandardMaterial({
      color: 0x27232B,
      roughness: 0.8
    });

    // --- Lower Body & Posture ---
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.82;
    characterGroup.add(pelvis);

    // Legs / Trousers
    const leftLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.065, 0.75, 16),
      trouserMat
    );
    leftLeg.position.set(-0.11, -0.4, 0);
    leftLeg.castShadow = true;
    pelvis.add(leftLeg);

    const rightLeg = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.065, 0.75, 16),
      trouserMat
    );
    rightLeg.position.set(0.11, -0.4, 0);
    rightLeg.castShadow = true;
    pelvis.add(rightLeg);

    // Pointed Shoes / Heels
    const shoeGeom = new THREE.BoxGeometry(0.1, 0.06, 0.18);
    const leftShoe = new THREE.Mesh(shoeGeom, blazerMat);
    leftShoe.position.set(-0.11, -0.78, 0.03);
    pelvis.add(leftShoe);

    const rightShoe = new THREE.Mesh(shoeGeom, blazerMat);
    rightShoe.position.set(0.11, -0.78, 0.03);
    pelvis.add(rightShoe);

    // --- Torso & Blazer ---
    const torso = new THREE.Group();
    pelvis.add(torso);

    // Main Blazer Torso
    const torsoMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.16, 0.52, 20),
      blazerMat
    );
    torsoMesh.position.y = 0.26;
    torsoMesh.castShadow = true;
    torso.add(torsoMesh);

    // Inner Pastel Pink Top V-neck
    const topMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.14, 0.44, 16),
      pinkTopMat
    );
    topMesh.position.set(0, 0.28, 0.04);
    torso.add(topMesh);

    // Blazer Lapels (Left & Right)
    const lapelGeom = new THREE.BoxGeometry(0.06, 0.32, 0.04);
    const leftLapel = new THREE.Mesh(lapelGeom, blazerMat);
    leftLapel.position.set(-0.09, 0.3, 0.12);
    leftLapel.rotation.z = -0.15;
    torso.add(leftLapel);

    const rightLapel = new THREE.Mesh(lapelGeom, blazerMat);
    rightLapel.position.set(0.09, 0.3, 0.12);
    rightLapel.rotation.z = 0.15;
    torso.add(rightLapel);

    // Gold Chain & Pendant
    const necklace = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.008, 12, 24, Math.PI),
      goldMat
    );
    necklace.position.set(0, 0.43, 0.09);
    necklace.rotation.x = Math.PI / 2.3;
    torso.add(necklace);

    const pendant = new THREE.Mesh(
      new THREE.SphereGeometry(0.016, 12, 12),
      goldMat
    );
    pendant.position.set(0, 0.35, 0.12);
    torso.add(pendant);

    // --- Neck & Head Group ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.56, 0.02);
    torso.add(headGroup);

    // Neck
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.075, 0.14, 16),
      skinMat
    );
    neck.position.y = 0.04;
    headGroup.add(neck);

    // Head Sculpt
    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.165, 28, 24),
      skinMat
    );
    headMesh.scale.set(0.95, 1.15, 1.0);
    headMesh.position.set(0, 0.2, 0);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Eyes Group
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.22, 0.14);
    headGroup.add(eyesGroup);

    const eyeGeom = new THREE.SphereGeometry(0.024, 16, 16);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const irisMat = new THREE.MeshBasicMaterial({ color: 0x221714 }); // Dark warm brown

    // Left Eye
    const leftEyeWhite = new THREE.Mesh(eyeGeom, eyeWhiteMat);
    leftEyeWhite.scale.set(1.1, 0.7, 0.5);
    leftEyeWhite.position.x = -0.055;
    eyesGroup.add(leftEyeWhite);

    const leftIris = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), irisMat);
    leftIris.position.set(-0.055, 0, 0.012);
    eyesGroup.add(leftIris);

    // Right Eye
    const rightEyeWhite = new THREE.Mesh(eyeGeom, eyeWhiteMat);
    rightEyeWhite.scale.set(1.1, 0.7, 0.5);
    rightEyeWhite.position.x = 0.055;
    eyesGroup.add(rightEyeWhite);

    const rightIris = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 12), irisMat);
    rightIris.position.set(0.055, 0, 0.012);
    eyesGroup.add(rightIris);

    // Eyelids for Blinking Animation
    const eyelidGeom = new THREE.BoxGeometry(0.04, 0.018, 0.02);
    const leftEyelid = new THREE.Mesh(eyelidGeom, skinMat);
    leftEyelid.position.set(-0.055, 0.02, 0.018);
    eyesGroup.add(leftEyelid);

    const rightEyelid = new THREE.Mesh(eyelidGeom, skinMat);
    rightEyelid.position.set(0.055, 0.02, 0.018);
    eyesGroup.add(rightEyelid);

    // Eyebrows
    const browGeom = new THREE.BoxGeometry(0.038, 0.007, 0.01);
    const browMat = new THREE.MeshBasicMaterial({ color: 0x1C171D });

    const leftBrow = new THREE.Mesh(browGeom, browMat);
    leftBrow.position.set(-0.055, 0.035, 0.018);
    leftBrow.rotation.z = -0.08;
    eyesGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeom, browMat);
    rightBrow.position.set(0.055, 0.035, 0.018);
    rightBrow.rotation.z = 0.08;
    eyesGroup.add(rightBrow);

    // Smile / Mouth Arc
    const mouthGeom = new THREE.TorusGeometry(0.03, 0.006, 8, 16, Math.PI * 0.75);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xA6524A });
    const mouth = new THREE.Mesh(mouthGeom, mouthMat);
    mouth.position.set(0, 0.12, 0.15);
    mouth.rotation.x = Math.PI * 0.95;
    mouth.rotation.z = Math.PI;
    headGroup.add(mouth);

    // Gold Hoop Earrings
    const hoopGeom = new THREE.TorusGeometry(0.025, 0.004, 10, 20);
    const leftEarring = new THREE.Mesh(hoopGeom, goldMat);
    leftEarring.position.set(-0.16, 0.18, 0);
    leftEarring.rotation.y = Math.PI / 2;
    headGroup.add(leftEarring);

    const rightEarring = new THREE.Mesh(hoopGeom, goldMat);
    rightEarring.position.set(0.16, 0.18, 0);
    rightEarring.rotation.y = Math.PI / 2;
    headGroup.add(rightEarring);

    // Hair Sculpt: Long cascading wavy dark hair framing face
    const hairCrown = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 24, 20, 0, Math.PI * 2, 0, Math.PI * 0.65),
      hairMat
    );
    hairCrown.position.set(0, 0.22, -0.02);
    headGroup.add(hairCrown);

    // Left & Right Hair Locks cascading down shoulders
    const hairLockGeom = new THREE.CylinderGeometry(0.065, 0.035, 0.52, 12);

    const leftHair = new THREE.Mesh(hairLockGeom, hairMat);
    leftHair.position.set(-0.13, 0.02, 0.04);
    leftHair.rotation.z = 0.15;
    leftHair.rotation.x = 0.05;
    headGroup.add(leftHair);

    const rightHair = new THREE.Mesh(hairLockGeom, hairMat);
    rightHair.position.set(0.13, 0.02, 0.04);
    rightHair.rotation.z = -0.15;
    rightHair.rotation.x = 0.05;
    headGroup.add(rightHair);

    const backHair = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.54, 0.12),
      hairMat
    );
    backHair.position.set(0, 0.02, -0.1);
    headGroup.add(backHair);

    // --- Arms & Hands (Articulated Rig) ---
    // Left Arm
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.24, 0.44, 0);
    torso.add(leftArmGroup);

    const leftUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.048, 0.26, 12),
      blazerMat
    );
    leftUpperArm.position.y = -0.12;
    leftArmGroup.add(leftUpperArm);

    const leftForearmGroup = new THREE.Group();
    leftForearmGroup.position.y = -0.24;
    leftArmGroup.add(leftForearmGroup);

    const leftForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.24, 12),
      blazerMat
    );
    leftForearm.position.y = -0.11;
    leftForearmGroup.add(leftForearm);

    const leftHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 12, 12),
      skinMat
    );
    leftHand.scale.set(0.9, 1.2, 0.6);
    leftHand.position.y = -0.23;
    leftForearmGroup.add(leftHand);

    // Right Arm
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.24, 0.44, 0);
    torso.add(rightArmGroup);

    const rightUpperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.048, 0.26, 12),
      blazerMat
    );
    rightUpperArm.position.y = -0.12;
    rightArmGroup.add(rightUpperArm);

    const rightForearmGroup = new THREE.Group();
    rightForearmGroup.position.y = -0.24;
    rightArmGroup.add(rightForearmGroup);

    const rightForearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.24, 12),
      blazerMat
    );
    rightForearm.position.y = -0.11;
    rightForearmGroup.add(rightForearm);

    const rightHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.038, 12, 12),
      skinMat
    );
    rightHand.scale.set(0.9, 1.2, 0.6);
    rightHand.position.y = -0.23;
    rightForearmGroup.add(rightHand);

    // ==========================================
    // THE 6 DYNAMIC CHAPTER ENVIRONMENTS
    // ==========================================

    // --- CHAPTER 1: The Dreamer (Desk, Notebook, Window Light) ---
    const envCh1 = new THREE.Group();
    scene.add(envCh1);

    // Wooden Writing Desk
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x6E4F3E, roughness: 0.6 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.7), deskMat);
    deskTop.position.set(0.1, 0.72, 0.45);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    envCh1.add(deskTop);

    // Desk Legs
    const deskLegGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.72);
    const leg1 = new THREE.Mesh(deskLegGeom, deskMat);
    leg1.position.set(-0.45, 0.36, 0.2);
    envCh1.add(leg1);
    const leg2 = new THREE.Mesh(deskLegGeom, deskMat);
    leg2.position.set(0.65, 0.36, 0.2);
    envCh1.add(leg2);

    // Open Notebook with golden ribbon
    const notebookCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.02, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x45243F, roughness: 0.4 })
    );
    notebookCover.position.set(0.1, 0.76, 0.45);
    notebookCover.rotation.y = -0.12;
    envCh1.add(notebookCover);

    const notebookPage = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.022, 0.22),
      new THREE.MeshStandardMaterial({ color: 0xFFFDF9, roughness: 0.9 })
    );
    notebookPage.position.set(0.1, 0.765, 0.45);
    notebookPage.rotation.y = -0.12;
    envCh1.add(notebookPage);

    // Coffee Mug with subtle steam
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.09, 16),
      new THREE.MeshStandardMaterial({ color: 0xF18A55, roughness: 0.3 })
    );
    mug.position.set(0.5, 0.79, 0.4);
    envCh1.add(mug);

    // Window Frame with Morning Light Beam
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 1.8, 1.4),
      new THREE.MeshStandardMaterial({ color: 0xDDD4C5 })
    );
    windowFrame.position.set(2.4, 1.6, 0.3);
    envCh1.add(windowFrame);

    // Morning Sunbeam Light Plane
    const sunbeamGeom = new THREE.PlaneGeometry(1.6, 2.6);
    const sunbeamMat = new THREE.MeshBasicMaterial({
      color: 0xFFE2B8,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const sunbeam = new THREE.Mesh(sunbeamGeom, sunbeamMat);
    sunbeam.position.set(1.4, 1.3, 0.4);
    sunbeam.rotation.y = Math.PI / 3;
    sunbeam.rotation.x = -Math.PI / 12;
    envCh1.add(sunbeam);

    // --- CHAPTER 2: The Vision (Mood Board & Idea Cards) ---
    const envCh2 = new THREE.Group();
    envCh2.position.set(0, 0, 0);
    scene.add(envCh2);

    // Architectural Mood Board Wall
    const boardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.4, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xEEE5D8, roughness: 0.8 })
    );
    boardFrame.position.set(0.8, 1.5, -0.6);
    envCh2.add(boardFrame);

    // Pinned cards with brand tones
    const cardColors = [0xF18A55, 0x45243F, 0xC8B9E8, 0xA8B59A, 0x242329];
    const cards: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.4, 0.015),
        new THREE.MeshStandardMaterial({ color: cardColors[i], roughness: 0.4 })
      );
      const angle = (i - 2) * 0.38;
      card.position.set(0.8 + angle, 1.5 + (i % 2 === 0 ? 0.1 : -0.1), -0.56);
      card.rotation.z = (Math.random() - 0.5) * 0.15;
      envCh2.add(card);
      cards.push(card);
    }

    // --- CHAPTER 3: The Build (50-Seater Modern Studio & Growth Tower) ---
    const envCh3 = new THREE.Group();
    scene.add(envCh3);

    // Modern Workspace Desks
    for (let row = 0; row < 3; row++) {
      const officeDesk = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.05, 0.45),
        new THREE.MeshStandardMaterial({ color: 0xDDD4C5, roughness: 0.4 })
      );
      officeDesk.position.set(0.5, 0.65, -0.8 - row * 0.7);
      envCh3.add(officeDesk);

      // Laptop on desk
      const laptopBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.01, 0.18),
        new THREE.MeshStandardMaterial({ color: 0xCCCCCC, metalness: 0.8, roughness: 0.2 })
      );
      laptopBase.position.set(0.5, 0.68, -0.8 - row * 0.7);
      envCh3.add(laptopBase);

      const laptopScreen = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.16, 0.008),
        new THREE.MeshStandardMaterial({ color: 0x222226, emissive: 0xF18A55, emissiveIntensity: 0.3 })
      );
      laptopScreen.position.set(0.5, 0.77, -0.8 - row * 0.7 - 0.08);
      laptopScreen.rotation.x = -0.3;
      envCh3.add(laptopScreen);
    }

    // 3D Rising Growth Bar Chart (from 1 to 50 scale)
    const growthBars: THREE.Mesh[] = [];
    for (let b = 0; b < 6; b++) {
      const height = 0.2 + b * 0.18;
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, height, 0.12),
        new THREE.MeshStandardMaterial({
          color: b === 5 ? 0xF18A55 : 0x45243F,
          roughness: 0.3,
          metalness: 0.5,
          emissive: b === 5 ? 0xF18A55 : 0x000000,
          emissiveIntensity: 0.35
        })
      );
      bar.position.set(-1.2 + b * 0.18, height / 2, -0.2);
      bar.castShadow = true;
      envCh3.add(bar);
      growthBars.push(bar);
    }

    // --- CHAPTER 4: The Explorer (Holographic Marketing Interfaces) ---
    const envCh4 = new THREE.Group();
    scene.add(envCh4);

    // Hologram Ring 1: Google Ads Target Ring
    const holoRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.016, 16, 64),
      new THREE.MeshStandardMaterial({
        color: 0xF18A55,
        emissive: 0xF18A55,
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.85
      })
    );
    holoRing1.position.set(0.7, 1.45, 0.4);
    holoRing1.rotation.x = Math.PI / 3;
    envCh4.add(holoRing1);

    // Hologram Ring 2: Meta Ads Node Ring
    const holoRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.012, 16, 64),
      new THREE.MeshStandardMaterial({
        color: 0xC8B9E8,
        emissive: 0xC8B9E8,
        emissiveIntensity: 0.9,
        transparent: true,
        opacity: 0.8
      })
    );
    holoRing2.position.set(0.7, 1.45, 0.4);
    holoRing2.rotation.y = Math.PI / 4;
    envCh4.add(holoRing2);

    // Floating Holographic Sparkle Nodes
    const nodeSpheres: THREE.Mesh[] = [];
    for (let n = 0; n < 8; n++) {
      const nodeSphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 12, 12),
        new THREE.MeshBasicMaterial({ color: n % 2 === 0 ? 0xF18A55 : 0xFFFFFF })
      );
      envCh4.add(nodeSphere);
      nodeSpheres.push(nodeSphere);
    }

    // --- CHAPTER 5: The Determined Founder (Executive Desk & Trust Shield) ---
    const envCh5 = new THREE.Group();
    scene.add(envCh5);

    // 3D Trust Crest / Shield Badge
    const shieldGeom = new THREE.CylinderGeometry(0.24, 0.2, 0.04, 6);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xE5B869, // Gold
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0xE5B869,
      emissiveIntensity: 0.4
    });
    const trustShield = new THREE.Mesh(shieldGeom, shieldMat);
    trustShield.position.set(0.75, 1.35, 0.2);
    trustShield.rotation.x = Math.PI / 2;
    envCh5.add(trustShield);

    // Inner Trust Emblem (Glowing Heart/Star)
    const starGeom = new THREE.OctahedronGeometry(0.09, 0);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const trustStar = new THREE.Mesh(starGeom, starMat);
    trustStar.position.set(0.75, 1.35, 0.24);
    envCh5.add(trustStar);

    // --- CHAPTER 6: The Next Chapter (Panoramic Horizon & 3D Dygytaly Emblem) ---
    const envCh6 = new THREE.Group();
    scene.add(envCh6);

    // 3D Dygytaly Ribbon Emblem
    const emblemGeom = new THREE.TorusKnotGeometry(0.38, 0.09, 96, 24, 2, 3);
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xF18A55,
      emissive: 0x45243F,
      emissiveIntensity: 0.6,
      metalness: 0.75,
      roughness: 0.25
    });
    const dygytalyEmblem = new THREE.Mesh(emblemGeom, emblemMat);
    dygytalyEmblem.position.set(0.85, 1.5, 0.1);
    envCh6.add(dygytalyEmblem);

    // Open Glass Balustrade for panoramic horizon vista
    const glassRailGeom = new THREE.BoxGeometry(4.0, 0.8, 0.03);
    const glassRailMat = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transmission: 0.9,
      opacity: 0.4,
      transparent: true,
      roughness: 0.1,
      ior: 1.5
    });
    const glassRail = new THREE.Mesh(glassRailGeom, glassRailMat);
    glassRail.position.set(0, 0.4, -1.8);
    envCh6.add(glassRail);

    // Horizon warm glow
    const horizonGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 3),
      new THREE.MeshBasicMaterial({
        color: 0xFDEED9,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      })
    );
    horizonGlow.position.set(0, 1.8, -3.5);
    envCh6.add(horizonGlow);

    // ==========================================
    // MOUSE PARALLAX & CURSOR TRACKING
    // ==========================================
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current.targetX = normX;
      mousePosRef.current.targetY = normY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ==========================================
    // ANIMATION & RENDER LOOP
    // ==========================================
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let blinkTimer = 0;

    // Camera Waypoints for the 6 Chapters
    const cameraWaypoints = [
      { pos: new THREE.Vector3(0.15, 1.35, 3.2), look: new THREE.Vector3(0.05, 0.95, 0) }, // Ch 1: Desk & notebook
      { pos: new THREE.Vector3(0.95, 1.45, 3.5), look: new THREE.Vector3(0.4, 1.25, 0) },  // Ch 2: Mood board & vision
      { pos: new THREE.Vector3(-0.8, 1.7, 4.2), look: new THREE.Vector3(0.1, 1.05, -0.4) }, // Ch 3: Office expansion
      { pos: new THREE.Vector3(0.65, 1.4, 3.3), look: new THREE.Vector3(0.3, 1.25, 0.2) },  // Ch 4: Holographic tech
      { pos: new THREE.Vector3(0.1, 1.3, 2.9), look: new THREE.Vector3(0.1, 1.15, 0.1) },   // Ch 5: Promise & heart
      { pos: new THREE.Vector3(0.0, 1.25, 3.6), look: new THREE.Vector3(0.0, 1.05, 0) }    // Ch 6: Forward looking vista
    ];

    const currentCamPos = new THREE.Vector3().copy(cameraWaypoints[0].pos);
    const currentCamLook = new THREE.Vector3().copy(cameraWaypoints[0].look);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse cursor interpolation
      const mp = mousePosRef.current;
      mp.x += (mp.targetX - mp.x) * 0.05;
      mp.y += (mp.targetY - mp.y) * 0.05;

      // Active chapter & progress
      const ch = Math.min(Math.max(activeChapterRef.current, 0), 5);
      const pr = chapterProgressRef.current;

      // Camera Target with mouse parallax
      const targetWaypoint = cameraWaypoints[ch];
      currentCamPos.lerp(targetWaypoint.pos, 0.04);
      currentCamLook.lerp(targetWaypoint.look, 0.04);

      camera.position.x = currentCamPos.x + mp.x * 0.25;
      camera.position.y = currentCamPos.y + mp.y * 0.18;
      camera.position.z = currentCamPos.z;
      camera.lookAt(currentCamLook.x + mp.x * 0.1, currentCamLook.y + mp.y * 0.08, currentCamLook.z);

      // --- Character Breathing & Eye Blinking ---
      torso.position.y = Math.sin(elapsedTime * 2.2) * 0.012;
      headGroup.rotation.y = mp.x * 0.22;
      headGroup.rotation.x = -mp.y * 0.14;

      // Natural blink cycle (every 3.8 seconds)
      blinkTimer += delta;
      if (blinkTimer > 3.8) {
        leftEyelid.scale.y = 3.5;
        rightEyelid.scale.y = 3.5;
        if (blinkTimer > 4.0) {
          leftEyelid.scale.y = 1;
          rightEyelid.scale.y = 1;
          blinkTimer = 0;
        }
      }

      // --- Environment Visibility / Cross-Fade ---
      const envs = [envCh1, envCh2, envCh3, envCh4, envCh5, envCh6];
      envs.forEach((env, idx) => {
        const isCurrent = idx === ch;
        const targetOpacity = isCurrent ? 1.0 : 0.0;
        env.visible = isCurrent || Math.abs(idx - ch) <= 1;

        // Animate elements inside environments
        if (idx === 1 && isCurrent) {
          // Mood board cards subtle float
          cards.forEach((c, ci) => {
            c.position.y += Math.sin(elapsedTime * 2 + ci) * 0.0006;
          });
        }

        if (idx === 2 && isCurrent) {
          // Growth bars animate up
          growthBars.forEach((gb, gi) => {
            const h = (0.2 + gi * 0.18) * Math.min(1, pr * 1.5 + gi * 0.1);
            gb.scale.y = Math.max(0.05, h);
          });
        }

        if (idx === 3 && isCurrent) {
          // Holographic rings rotate
          holoRing1.rotation.z += 0.012;
          holoRing2.rotation.x += 0.015;
          nodeSpheres.forEach((ns, ni) => {
            const a = elapsedTime * 1.5 + (ni * Math.PI) / 4;
            ns.position.set(
              0.7 + Math.cos(a) * 0.48,
              1.45 + Math.sin(a * 1.2) * 0.35,
              0.4 + Math.sin(a) * 0.48
            );
          });
        }

        if (idx === 4 && isCurrent) {
          // Trust shield gentle pulsation
          trustShield.rotation.z = Math.sin(elapsedTime * 1.5) * 0.05;
          trustStar.rotation.y += 0.02;
          trustStar.rotation.x += 0.01;
        }

        if (idx === 5 && isCurrent) {
          // Dygytaly ribbon continuous elegant rotation
          dygytalyEmblem.rotation.y += 0.01;
          dygytalyEmblem.rotation.x = Math.sin(elapsedTime * 0.8) * 0.2;
        }
      });

      // --- Dynamic Character Posing Per Chapter ---
      if (ch === 0) {
        // CHAPTER 1: The Dreamer
        // Seated at desk, right hand on notebook, looking at window, standing
        characterGroup.position.set(0.1, 0, 0);
        leftArmGroup.rotation.x = -0.55;
        leftArmGroup.rotation.z = 0.2;
        rightArmGroup.rotation.x = -0.7 + Math.sin(elapsedTime * 1.8) * 0.05;
        rightArmGroup.rotation.z = -0.15;
        leftBrow.position.y = 0.035;
        rightBrow.position.y = 0.035;
        mouth.scale.set(1.0, 1.0, 1.0);
      } else if (ch === 1) {
        // CHAPTER 2: The Vision
        // Standing at mood board, right arm pinning idea, step back & evaluate
        characterGroup.position.set(0.2, 0, 0.1);
        leftArmGroup.rotation.x = -0.15;
        leftArmGroup.rotation.z = 0.3;
        rightArmGroup.rotation.x = -1.2 + Math.sin(elapsedTime * 1.2) * 0.1;
        rightArmGroup.rotation.z = -0.4;
        mouth.scale.set(1.1, 1.1, 1.0);
      } else if (ch === 2) {
        // CHAPTER 3: The Build
        // Walking stride, holding laptop, reviewing growth
        characterGroup.position.set(-0.2, 0, -0.1);
        leftArmGroup.rotation.x = -0.85;
        leftArmGroup.rotation.z = 0.35;
        rightArmGroup.rotation.x = -0.85;
        rightArmGroup.rotation.z = -0.35;
        mouth.scale.set(1.15, 1.1, 1.0);
      } else if (ch === 3) {
        // CHAPTER 4: The Explorer
        // Interacting with floating holographic UI
        characterGroup.position.set(0.15, 0, 0.15);
        leftArmGroup.rotation.x = -0.9 + Math.sin(elapsedTime * 2) * 0.08;
        leftArmGroup.rotation.z = 0.4;
        rightArmGroup.rotation.x = -1.1 + Math.cos(elapsedTime * 2) * 0.08;
        rightArmGroup.rotation.z = -0.3;
      } else if (ch === 4) {
        // CHAPTER 5: The Determined Founder
        // Playful raised eyebrow ("a little greedy"), then hand placed sincerely over heart
        characterGroup.position.set(0.05, 0, 0.1);
        leftArmGroup.rotation.x = -0.2;
        leftArmGroup.rotation.z = 0.25;
        // Right hand placed over heart (chest V-neck area)
        rightArmGroup.rotation.x = -1.25;
        rightArmGroup.rotation.y = -0.65;
        rightArmGroup.rotation.z = -0.4;
        rightForearmGroup.rotation.x = -0.8;
        // Playful raised right eyebrow
        rightBrow.position.y = 0.044 + Math.sin(elapsedTime * 2) * 0.004;
        leftBrow.position.y = 0.035;
        mouth.scale.set(1.2, 1.2, 1.0);
      } else if (ch === 5) {
        // CHAPTER 6: The Founder Looking Forward
        // Facing camera, open welcoming posture, radiant warm smile
        characterGroup.position.set(0.0, 0, 0.2);
        leftArmGroup.rotation.x = -0.4 + Math.sin(elapsedTime * 1.5) * 0.04;
        leftArmGroup.rotation.z = 0.55;
        rightArmGroup.rotation.x = -0.4 + Math.sin(elapsedTime * 1.5) * 0.04;
        rightArmGroup.rotation.z = -0.55;
        rightBrow.position.y = 0.037;
        leftBrow.position.y = 0.037;
        mouth.scale.set(1.35, 1.35, 1.0);
      }

      // Float particles
      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      for (let p = 1; p < particleCount * 3; p += 3) {
        posAttr.array[p] += 0.003;
        if (posAttr.array[p] > 4) {
          posAttr.array[p] = 0;
        }
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const chapterNames = [
    'The Dreamer',
    'The Visionary',
    'The Builder',
    'The Explorer',
    'The Determined Founder',
    'Looking Forward'
  ];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, #FFFDF9 0%, #F5EFE6 60%, #EAE0D2 100%)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 50px rgba(69, 36, 63, 0.12)',
        border: '1px solid rgba(241, 138, 85, 0.2)'
      }}
    >
      {/* Fallback if WebGL fails */}
      {!webGlSupported && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center'
        }}>
          <img
            src="/uploads/founder-profile.jpg"
            alt="Gowri Jagadheeshwaran"
            style={{
              width: '180px',
              height: '210px',
              borderRadius: '50% / 54%',
              objectFit: 'cover',
              border: '4px solid var(--color-tangerine)',
              boxShadow: 'var(--shadow-lg)',
              marginBottom: '16px'
            }}
          />
          <h4 style={{ color: 'var(--color-charcoal)', marginBottom: '4px' }}>Gowri Jagadheeshwaran</h4>
          <p style={{ color: 'var(--color-tangerine)', fontSize: '0.88rem' }}>{chapterNames[activeChapter]}</p>
        </div>
      )}

      {/* Chapter HUD Indicator Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(69, 36, 63, 0.1)',
            padding: '7px 16px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-tangerine)',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--color-tangerine)'
            }}
          />
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-charcoal)'
            }}
          >
            Chapter 0{activeChapter + 1} — {chapterNames[activeChapter]}
          </span>
        </div>

        <div
          style={{
            background: 'rgba(41, 26, 45, 0.82)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            fontSize: '0.78rem',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}
        >
          Interactive 3D Scene
        </div>
      </div>

      {/* Floating Bottom Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(69, 36, 63, 0.1)',
          padding: '6px 14px',
          borderRadius: '9999px',
          fontSize: '0.76rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
        }}
      >
        <span>✦ Move cursor to shift gaze • Scroll story to advance journey</span>
      </div>
    </div>
  );
};
