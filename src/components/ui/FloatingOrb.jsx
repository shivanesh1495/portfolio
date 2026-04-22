import { memo, useEffect, useRef } from "react";
import * as THREE from "three";

function FloatingOrb() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return undefined;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    host.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const orbGeometry = new THREE.IcosahedronGeometry(1.16, 12);
    const orbMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dfe6ff"),
      emissive: new THREE.Color("#0b0f18"),
      emissiveIntensity: 0.22,
      roughness: 0.08,
      metalness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      transmission: 0.9,
      thickness: 1.6,
      reflectivity: 1,
      ior: 1.24,
    });

    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    rootGroup.add(orb);

    const ringGeometry = new THREE.TorusGeometry(1.7, 0.02, 26, 180);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#f1f5ff"),
      transparent: true,
      opacity: 0.38,
    });

    const ringPrimary = new THREE.Mesh(ringGeometry, ringMaterial);
    ringPrimary.rotation.set(Math.PI * 0.36, Math.PI * 0.08, 0);

    const ringSecondary = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ringSecondary.material.opacity = 0.24;
    ringSecondary.rotation.set(Math.PI * 0.64, Math.PI * -0.24, 0);

    rootGroup.add(ringPrimary);
    rootGroup.add(ringSecondary);

    const ambient = new THREE.AmbientLight("#aeb7ff", 0.5);
    const key = new THREE.PointLight("#ffffff", 2.2, 18, 1.8);
    key.position.set(2.6, 2.2, 3.8);

    const fill = new THREE.PointLight("#9fb2ff", 1.4, 16, 1.8);
    fill.position.set(-2.5, -1.6, 2.4);

    scene.add(ambient, key, fill);

    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / Math.max(1, rect.width);
      const relY = (event.clientY - rect.top) / Math.max(1, rect.height);

      pointerTarget.x = (relX - 0.5) * 0.42;
      pointerTarget.y = (0.5 - relY) * 0.28;
    };

    const onPointerLeave = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(host);
    } else {
      window.addEventListener("resize", resize);
    }

    const clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      const t = clock.getElapsedTime();

      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.08;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.08;

      rootGroup.rotation.y = t * 0.36 + pointerCurrent.x;
      rootGroup.rotation.x = Math.sin(t * 0.28) * 0.12 + pointerCurrent.y;
      rootGroup.position.y = Math.sin(t * 0.9) * 0.08;

      orb.rotation.x = t * 0.18;
      orb.rotation.z = t * 0.14;

      ringPrimary.rotation.z = t * 0.46;
      ringSecondary.rotation.z = -t * 0.34;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.cancelAnimationFrame(frameId);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", resize);
      }

      orbGeometry.dispose();
      orbMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ringSecondary.material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="about-orb-canvas" ref={hostRef} aria-hidden="true" />;
}

export default memo(FloatingOrb);
