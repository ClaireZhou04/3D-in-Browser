import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

// =====================
// SCENE & CAMERA
// =====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8899aa);
scene.fog = new THREE.Fog(0x8899aa, 5, 25);

const camera = new THREE.PerspectiveCamera(
  85,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.2, -0.2);

// =====================
// RENDERER
// =====================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// =====================
// CONTROLS
// =====================
const controls = new PointerLockControls(camera, document.body);

// =====================
// CURSOR
const cursor = document.createElement("div");
cursor.style.position = "absolute";
cursor.style.top = "50%";
cursor.style.left = "50%";
cursor.style.width = "12px";
cursor.style.height = "12px";
cursor.style.marginLeft = "-6px";
cursor.style.marginTop = "-6px";
cursor.style.border = "2px solid white";
cursor.style.borderRadius = "50%";
cursor.style.pointerEvents = "none";
cursor.style.transition = "0.1s";
document.body.appendChild(cursor);

// =====================
// INSTRUCTIONS
let instructionsVisible = true;
const instructions = document.createElement("div");
instructions.style.position = "absolute";
instructions.style.top = "40%";
instructions.style.width = "100%";
instructions.style.textAlign = "center";
instructions.style.color = "white";
instructions.style.fontFamily = "sans-serif";
instructions.style.fontSize = "20px";
instructions.innerHTML =
  "Click to enter memory<br>Move mouse to look around<br>Press Esc to exit ";
document.body.appendChild(instructions);

// =====================
// LIGHT
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
scene.add(dirLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// =====================
// GROUND
const groundGeo = new THREE.PlaneGeometry(50, 50);
groundGeo.rotateX(-Math.PI / 2);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x556655 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.receiveShadow = true;
scene.add(ground);

// =====================
// LEGS
const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd1c1 });
const leftLeg = new THREE.Mesh(
  new THREE.CylinderGeometry(0.14, 0.14, 1.8, 16),
  skinMat
);
leftLeg.rotation.x = -Math.PI / 2;
leftLeg.position.set(-0.2, 0, 0.5);

const wound = new THREE.Mesh(
  new THREE.CircleGeometry(0.07, 16),
  new THREE.MeshStandardMaterial({ color: 0xaa0000 })
);
wound.rotation.x = -Math.PI / 2;
wound.position.set(-0.18, 0.14, 0.5);

scene.add(leftLeg, wound);

const rightLeg = new THREE.Mesh(
  new THREE.CylinderGeometry(0.14, 0.14, 1.8, 16),
  skinMat
);
rightLeg.rotation.x = -Math.PI / 2.5;
rightLeg.position.set(0.2, 0.1, 0.5);
scene.add(rightLeg);

const bodyMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
const body = new THREE.Mesh(
  new THREE.CylinderGeometry(0.15, 0.15, 1, 18),
  bodyMat
);
body.position.set(0.035, 0.45, -0.35);
body.castShadow = true;
scene.add(body);

// =====================
// PHONE
const phoneGeo = new THREE.BoxGeometry(0.05, 0.3, 0.6);
const phoneMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const phone = new THREE.Mesh(phoneGeo, phoneMat);
phone.rotation.z = Math.PI / 2;
phone.position.set(-1, 0.025, 1);
phone.castShadow = true;
scene.add(phone);

// =====================
// GRASS
const grassGroup = new THREE.Group();
for (let i = 0; i < 100; i++) {
  const g = new THREE.Mesh(
    new THREE.ConeGeometry(0.05, 0.3, 4),
    new THREE.MeshStandardMaterial({ color: 0x77aa77 })
  );
  g.position.set(Math.random() * 20 - 10, 0.15, Math.random() * 20 - 10);
  g.castShadow = true;
  grassGroup.add(g);
}
scene.add(grassGroup);

// =====================
// RAIN
const rainCount = 800;
const rainGeo = new THREE.BufferGeometry();
const positions = [];
for (let i = 0; i < rainCount; i++) {
  positions.push(
    Math.random() * 40 - 20,
    Math.random() * 20,
    Math.random() * 40 - 20
  );
}
rainGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
const rainMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.05,
  transparent: true,
  opacity: 0.6,
});
const rain = new THREE.Points(rainGeo, rainMat);
scene.add(rain);

// =====================
// AUDIO
const listener = new THREE.AudioListener();
camera.add(listener);

// 手机音效
const phoneSound = new THREE.Audio(listener);
new THREE.AudioLoader().load("phone.mp3", (buffer) => {
  phoneSound.setBuffer(buffer);
  phoneSound.setLoop(false);
  phoneSound.setVolume(0.6);
});

// 背景音乐
const bgSound = new THREE.Audio(listener);
new THREE.AudioLoader().load("bg.mp3", (buffer) => {
  bgSound.setBuffer(buffer);
  bgSound.setLoop(true);
  bgSound.setVolume(0.6);
});

// =====================
// OVERLAY DIV
const overlay = document.createElement("div");
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
overlay.style.display = "none";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.pointerEvents = "none";
overlay.style.zIndex = "10";

const overlayImg = document.createElement("img");
overlayImg.src = "screen.png";
overlayImg.style.maxWidth = "300px";
overlayImg.style.maxHeight = "500px";
overlay.appendChild(overlayImg);
document.body.appendChild(overlay);

// =====================
// RAYCAST
const raycaster = new THREE.Raycaster();

// =====================
// CLICK LOGIC
window.addEventListener("click", () => {
  if (!controls.isLocked) {
    controls.lock();
    if (instructionsVisible) {
      instructions.style.display = "none";
      instructionsVisible = false;
      if (!bgSound.isPlaying) bgSound.play(); // 点击页面后播放背景音乐
    }
    return;
  }

  if (overlay.style.display === "flex") {
    // 已打开 → 关闭 overlay + 停止音频
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none";
    if (phoneSound.isPlaying) phoneSound.stop();
    return;
  }

  // 没打开 → 判断是否点击手机
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObject(phone);
  if (intersects.length > 0) {
    overlay.style.display = "flex";
    overlay.style.pointerEvents = "none";
    if (!phoneSound.isPlaying) phoneSound.play();
  }
});

// =====================
// ANIMATE
function animate() {
  requestAnimationFrame(animate);

  // RAIN
  const pos = rain.geometry.attributes.position;
  for (let i = 0; i < rainCount; i++) {
    let y = pos.getY(i) - 0.2;
    if (y < 0) y = 20;
    pos.setY(i, y);
  }
  pos.needsUpdate = true;

  // CURSOR HOVER
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObject(phone);
  if (intersects.length > 0) {
    cursor.style.borderColor = "red";
    cursor.style.transform = "scale(1.5)";
  } else {
    cursor.style.borderColor = "white";
    cursor.style.transform = "scale(1)";
  }

  renderer.render(scene, camera);
}
animate();

// =====================
// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
