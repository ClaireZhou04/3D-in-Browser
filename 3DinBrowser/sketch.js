import * as THREE from "three";


let scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfdfff); 


let ambLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambLight);

let dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);


let textureLoader = new THREE.TextureLoader();
let snowTex = textureLoader.load("./snow.jpg"); 
snowTex.wrapS = THREE.RepeatWrapping;
snowTex.wrapT = THREE.RepeatWrapping;
snowTex.repeat.set(10, 10);

let groundGeo = new THREE.PlaneGeometry(20, 20);
let groundMat = new THREE.MeshStandardMaterial({ map: snowTex });
let ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);


let videoEl = document.getElementById("bgVideo"); // HTML <video id="bgVideo" src="bg.mp4" autoplay loop muted></video>
videoEl.play();
let videoTex = new THREE.VideoTexture(videoEl);
videoTex.minFilter = THREE.LinearFilter;
videoTex.magFilter = THREE.LinearFilter;
videoTex.format = THREE.RGBAFormat;

let bgGeo = new THREE.PlaneGeometry(50, 25);
let bgMat = new THREE.MeshBasicMaterial({ map: videoTex, side: THREE.DoubleSide });
let bgPlane = new THREE.Mesh(bgGeo, bgMat);
bgPlane.position.set(8, 10, -7); 
scene.add(bgPlane);


let snowMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.8,
  metalness: 0.1
});


let bodyGeo = new THREE.SphereGeometry(0.8, 32, 32);
let body = new THREE.Mesh(bodyGeo, snowMat);
body.position.set(0, 0.8, 0);
scene.add(body);


let headGeo = new THREE.SphereGeometry(0.5, 32, 32);
let head = new THREE.Mesh(headGeo, snowMat);
head.position.set(0, 1.8, 0);
scene.add(head);


let eyeMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
let eyeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2);
let eye1 = new THREE.Mesh(eyeGeo, eyeMat);
eye1.rotation.z = Math.PI / 2;
eye1.position.set(-0.15, 1.9, 0.45);
scene.add(eye1);
let eye2 = eye1.clone();
eye2.position.x = 0.15;
scene.add(eye2);


let branchMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21 });
let armGeo = new THREE.CylinderGeometry(0.03, 0.03, 1);
let armLeft = new THREE.Mesh(armGeo, branchMat);
armLeft.rotation.z = Math.PI / 3;
armLeft.position.set(-0.9, 1.3, 0);
scene.add(armLeft);
let armRight = armLeft.clone();
armRight.rotation.z = -Math.PI / 3;
armRight.position.set(0.9, 1.3, 0);
scene.add(armRight);


let leafStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.2);
let leafStem = new THREE.Mesh(leafStemGeo, branchMat);
leafStem.rotation.z = -Math.PI / 4;
leafStem.position.set(0, 2.3, 0);
scene.add(leafStem);


let needleMat = new THREE.MeshStandardMaterial({ color: 0x2f6b2f });
for (let i = 0; i < 10; i++) {
  let needleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.6);
  let needle = new THREE.Mesh(needleGeo, needleMat);
  needle.position.set(0.4, 2.6, 0.2 * Math.sin(i));
  needle.rotation.x = -3;
  needle.rotation.z = Math.sin(i);
  scene.add(needle);
}


let bigBranchGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.2);
let bigBranch = new THREE.Mesh(bigBranchGeo, branchMat);
bigBranch.rotation.z = -Math.PI / 6;
bigBranch.position.set(0, 2.5, -1.5);
scene.add(bigBranch);

let subBranch1 = new THREE.Mesh(
  new THREE.CylinderGeometry(0.03, 0.03, 2),
  branchMat
);
subBranch1.rotation.z = -Math.PI / 3;
subBranch1.position.set(1.7, 4, -0.8);
scene.add(subBranch1);

let subBranch2 = subBranch1.clone();
subBranch2.rotation.z = Math.PI / 4;
subBranch2.position.set(-0.7, 4.1, -2.7);
scene.add(subBranch2);


let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
cam.position.set(4, 4, 7);
cam.lookAt(1, 2, 0);


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, cam);
}

animate();










