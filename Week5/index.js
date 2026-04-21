import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

let scene, camera, renderer, raycaster;
let mouse = new THREE.Vector2();
let shyMesh;
let theground;

function init() {
  scene = new THREE.Scene();

  // 1. Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  // 2. Lights setup - Softened for less glare
  // Lowered ambient light from 0.5 to 0.3
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); 
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  dirLight.shadow.camera.left = -20;
  dirLight.shadow.camera.right = 20;
  dirLight.shadow.camera.top = 20;
  dirLight.shadow.camera.bottom = -20;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  scene.add(dirLight);

  new HDRLoader().load('cedar_bridge_sunset_1_1k.hdr', function (envMap) {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envMap;
  });

  // 3. Camera
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(0, 10, 15);
  camera.lookAt(0, 0, 0);

  // 4. Ground - Changed to a softer mid-grey (#b0b0b0)
  theground = new THREE.Mesh(
    new THREE.BoxGeometry(100, 0.01, 100), 
    new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.8 }) 
  );
  theground.receiveShadow = true;
  scene.add(theground);

  // 5. Shy Sphere
  let geometry = new THREE.SphereGeometry(1, 32, 32);
  let material = new THREE.MeshStandardMaterial({ 
    color: "yellow", 
    metalness: 0.4, 
    roughness: 0.2 
  });
  shyMesh = new THREE.Mesh(geometry, material);
  shyMesh.position.y = 1; 
  shyMesh.castShadow = true;
  scene.add(shyMesh);

  // 6. Interaction
  raycaster = new THREE.Raycaster();

  document.addEventListener("mousemove", (ev) => {
    mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObject(shyMesh);

    if (intersects.length > 0) {
      moveShyMesh();
    }
  });

  new OrbitControls(camera, renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);

  loop();
}

function moveShyMesh() {
  const range = 15;
  let newX = (Math.random() - 0.5) * range * 2;
  let newZ = (Math.random() - 0.5) * range * 2;
  
  shyMesh.position.set(newX, 1, newZ);
  shyMesh.material.color.set(Math.random() * 0xffffff);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function loop() {
  if (shyMesh) {
    shyMesh.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.1);
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}

init();