'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const BoxHearth = () => {
  const mountRef = useRef(null);
  const dimensionsRef = useRef(null);
  const mainBoxRef = useRef(null);
  const threeRef = useRef({ scene: null, camera: null, renderer: null, controls: null });
  const initializedRef = useRef(false);

  const itemsRef = useRef([]); // All items parsed from the dimensions input
  const currentIndexRef = useRef(0); // Index of the next item to animate
  const animationStackRef = useRef([]); // Items currently animating (if not complete)
  const boxStackRef = useRef([]); // Boxes in the order they were added to the scene
  const removedStackRef = useRef([]); // Boxes that were removed via backward run

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const mount = mountRef.current;
    let { scene, camera, renderer, controls } = threeRef.current;

   
    scene = new THREE.Scene();

    
    camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    
    controls = new OrbitControls(camera, renderer.domElement);

    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    threeRef.current = { scene, camera, renderer, controls };

   
    const animate = () => {
     
      const now = performance.now();

      for (let i = animationStackRef.current.length - 1; i >= 0; i--) {
        const animObj = animationStackRef.current[i];
        const elapsed = now - animObj.startTime;
        let t = elapsed / animObj.duration;
        if (t > 1) t = 1;
    
        animObj.box.position.lerpVectors(animObj.initialPosition, animObj.targetPosition, t);
    
        animObj.box.quaternion.copy(animObj.initialQuaternion).slerp(animObj.targetQuaternion, t);

       
        if (t === 1) {
          animationStackRef.current.splice(i, 1);
        }
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  const handleRenderItems = () => {
    const input = dimensionsRef.current.value;
    const items = input.split(";");
  
    itemsRef.current = [];
    currentIndexRef.current = 0;
    animationStackRef.current = [];
  
    const { scene } = threeRef.current;
    scene.traverse((child) => {
      if (child.userData && child.userData.isStackItem) {
        scene.remove(child);
      }
    });
    boxStackRef.current = [];
    removedStackRef.current = [];

    items.forEach((str) => {
      const dims = str.trim().split(",");
      if (dims.length >= 15) {
        const [w, h, d, x, y, z, x1, y1, z1, xe, ye, ze, xe1, ye1, ze1] = dims.map(parseFloat);
      
        if (!isNaN(w) && !isNaN(h) && !isNaN(d)) {
          itemsRef.current.push({ w, h, d, x, y, z, x1, y1, z1, xe, ye, ze, xe1, ye1, ze1 });
        }
      }
    });
  };

  
  const startAnimationForItem = (item) => {
    const { scene } = threeRef.current;
    
    const geometry = new THREE.BoxGeometry(item.w, item.h, item.d);
   
    geometry.translate(item.w / 2, item.h / 2, item.d / 2);
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    });
    const box = new THREE.Mesh(geometry, material);
    box.userData.isStackItem = true;
  
    box.position.set(item.x, item.y, item.z);
   
    const initialEuler = new THREE.Euler(
      THREE.MathUtils.degToRad(item.xe || 0),
      THREE.MathUtils.degToRad(item.ye || 0),
      THREE.MathUtils.degToRad(item.ze || 0)
    );
    box.quaternion.setFromEuler(initialEuler);
    scene.add(box);

  
    const animObj = {
      box,
      initialPosition: new THREE.Vector3(item.x, item.y, item.z),
      targetPosition: new THREE.Vector3(item.x1, item.y1, item.z1),
      initialQuaternion: new THREE.Quaternion().setFromEuler(initialEuler),
      targetQuaternion: new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          THREE.MathUtils.degToRad(item.xe1 || 0),
          THREE.MathUtils.degToRad(item.ye1 || 0),
          THREE.MathUtils.degToRad(item.ze1 || 0)
        )
      ),
      startTime: performance.now(),
      duration: 1000 
    };

    
    if (
      !animObj.initialPosition.equals(animObj.targetPosition) ||
      !animObj.initialQuaternion.equals(animObj.targetQuaternion)
    ) {
      animationStackRef.current.push(animObj);
    }
   
    boxStackRef.current.push(animObj);
  };

  
  const handleForwardRun = () => {
   
    if (removedStackRef.current.length > 0) {
      const animObj = removedStackRef.current.pop();
    
      animObj.box.position.copy(animObj.initialPosition);
      animObj.box.quaternion.copy(animObj.initialQuaternion);
      threeRef.current.scene.add(animObj.box);
      
      if (
        !animObj.initialPosition.equals(animObj.targetPosition) ||
        !animObj.initialQuaternion.equals(animObj.targetQuaternion)
      ) {
        animObj.startTime = performance.now();
        animationStackRef.current.push(animObj);
      }
      boxStackRef.current.push(animObj);
    } else if (currentIndexRef.current < itemsRef.current.length) {
      const item = itemsRef.current[currentIndexRef.current];
      currentIndexRef.current += 1;
      startAnimationForItem(item);
    } else {
      console.log("No more items to animate.");
    }
  };

 
  const handleBackwardRun = () => {
    if (boxStackRef.current.length > 0) {
  
      const animObj = boxStackRef.current.pop();
      threeRef.current.scene.remove(animObj.box);
     
      const index = animationStackRef.current.indexOf(animObj);
      if (index !== -1) {
        animationStackRef.current.splice(index, 1);
      }
     
      removedStackRef.current.push(animObj);
    } else {
      console.log("No boxes to remove.");
    }
  };

  const handleRenderBox = () => {
    const size = mainBoxRef.current.value;
    const dims = size.trim().split(",");
    let w, h, d;
    if (dims.length === 3) {
      w = parseFloat(dims[0]);
      h = parseFloat(dims[1]);
      d = parseFloat(dims[2]);
    }
    if (w === undefined || h === undefined || d === undefined) {
      console.error("Invalid dimensions provided.");
      return;
    }
    const max = Math.max(w, h, d);
    const { camera, controls, scene } = threeRef.current;
    camera.position.set(max, max, max);
    const targetY = (h + 1) / 2;
    camera.lookAt(new THREE.Vector3(0, targetY, 0));
    controls.target.set(0, targetY, 0);
    controls.update();
  
    const oldContainer = scene.getObjectByName("containerBox");
    if (oldContainer) scene.remove(oldContainer);
    
    const containerGeometry = new THREE.BoxGeometry(w, h, d);
    containerGeometry.translate(w / 2, h / 2, d / 2);
    const wireframe = new THREE.WireframeGeometry(containerGeometry);
    const containerBox = new THREE.LineSegments(wireframe);
    containerBox.material.depthTest = false;
    containerBox.material.opacity = 0.25;
    containerBox.material.transparent = true;
    containerBox.name = "containerBox";
    scene.add(containerBox);
  };

  return (
    <div style={{ position: 'relative' }}>
     
      <div ref={mountRef} style={{ width: '100%', height: '100vh', background: '#000' }} />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0)',
          padding: '10px',
          borderRadius: '4px'
        }}
      >
        <input
          ref={dimensionsRef}
          type="text"
          placeholder="Enter items e.g., w,d,h,x,y,z,x1,y1,z1,xe,ye,ze,xe1,ye1,ze1; ..."
          style={{ width: '300px' }}
        />
        <br /><br />
        <input
          ref={mainBoxRef}
          type="text"
          placeholder="Enter Container size e.g., w,d,h"
          style={{ width: '300px' }}
        />
        <br /><br />
        <button onClick={handleRenderItems}>Render Items</button>
        <button onClick={handleRenderBox} style={{ marginLeft: '10px' }}>
          Render Box
        </button>
        <br /><br />
        <button onClick={handleForwardRun}>Forward Run</button>
        <button onClick={handleBackwardRun} style={{ marginLeft: '10px' }}>
          Backward Run
        </button>
      </div>
    </div>
  );
};

export default BoxHearth;