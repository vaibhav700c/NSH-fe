import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const Landing = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(0, -3, 5);
    scene.add(directionalLight);

    let strokeGroup;
    const loader = new FontLoader();
    loader.load(
      '/fonts/Decofun_Regular.json',
      (font) => {
        const geometry = new TextGeometry('TOAST', {
          font: font,
          size: 3,
          height: 0.5,
          depth: 1,
        });
        geometry.computeBoundingBox();
        let center = new THREE.Vector3();
        if (geometry.boundingBox) {
          center.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
          center.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
          center.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
          geometry.translate(-center.x, -center.y, -center.z);
        }

        const material = new THREE.MeshPhysicalMaterial({
          roughness: 0.5,
          transmission: 1.0,
          transparent: true,
          thickness: 1.0,
        });
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.set(0, 0, 0);
        scene.add(textMesh);

        strokeGroup = new THREE.Group();
        strokeGroup.userData.update = (t) => {
          strokeGroup.children.forEach((child) => {
            child.userData.update?.(t);
          });
        };
        strokeGroup.position.z = 0.6;

        const lineMat = new LineMaterial({
          color: 0xffffff,
          linewidth: 2.5,
          dashed: true,
          dashSize: 0.6,
          gapSize: 0.1,
          dashOffset: 0.0,
        });

        const shapes = font.generateShapes("TOAST", 3);
        shapes.forEach((shape) => {
          const points = shape.getPoints();
          let points3d = [];
          points.forEach((p) => {
            points3d.push(p.x - center.x, p.y - center.y, 0);
          });
          const lineGeo = new LineGeometry();
          lineGeo.setPositions(points3d);
          const strokeMesh = new Line2(lineGeo, lineMat);
          strokeMesh.computeLineDistances();
          let totalDist = shape.getLength();
          lineMat.dashSize = totalDist * 1.7;
          lineMat.gapSize = totalDist * 1.7;
          lineMat.dashOffset = 0.0;
          strokeMesh.userData.update = (t) => {
            lineMat.dashOffset = t * 1.4;
          };

          strokeGroup.add(strokeMesh);

          if (shape.holes?.length > 0) {
            shape.holes.forEach((h) => {
              const points = h.getPoints();
              let points3d = [];
              points.forEach((p) => {
                points3d.push(p.x - center.x, p.y - center.y, 0);
              });
              const lineGeo = new LineGeometry();
              lineGeo.setPositions(points3d);
              const strokeMesh = new Line2(lineGeo, lineMat);
              strokeMesh.computeLineDistances();
              strokeGroup.add(strokeMesh);
            });
          }
        });
        scene.add(strokeGroup);
        animate();
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the font:', error);
      }
    );


    const starCount = 10000;
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * 1500 - 600;
      const y = Math.random() * 1500 - 600;
      const z = Math.random() * 1500 - 600;
      starVertices.push(x, y, z);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    const starMaterial = new THREE.PointsMaterial({ color: 0xaaaaaa, size: 0.7 });
    const stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);

    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, -3, 700);
    camera.lookAt(0, 0, 0);

    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight),
      0.5,   // str
      0.2,   // r
      0.35   // thresh
    );
    composer.addPass(bloomPass);

    let animationFrameId;
    const starSpeed = 0.5; 
    const zMax = 900;      
    const zMin = -600;     

    const animate = (t = 0) => {
      animationFrameId = requestAnimationFrame(animate);

      
      const positions = starGeo.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += starSpeed;
        if (positions[i + 2] > zMax) {
          positions[i + 2] = zMin;
        }
      }
      starGeo.attributes.position.needsUpdate = true;
      stars.rotation.y += 0.001;

     
      strokeGroup?.userData.update(t * 0.002);

     
      composer.render();
    };

    gsap.to(camera.position, {
      duration: 5,
      z: 10,
      ease: 'power2.out',
      onUpdate: () => {
        camera.lookAt(0, -3, 0);
      },
    });

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Landing;