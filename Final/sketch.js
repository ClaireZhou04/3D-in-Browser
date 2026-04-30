import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

let scene, camera, renderer, controls, loader;
let waterCanvas, waterCtx, waterTexture;
let objects = []; 
let fridgeParts = []; 
let isHoveringFridge = false;
let isTransitioning = false; 

const loadingEl = document.getElementById('loading');
const keys = {};
const moveSpeed = 0.015; 
const playerRadius = 0.6; 

const crosshair = document.createElement('div');
Object.assign(crosshair.style, {
    position: 'absolute', top: '50%', left: '50%',
    width: '12px', height: '12px', border: '2px solid white',
    borderRadius: '50%', transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', transition: 'all 0.15s ease', zIndex: '10'
});
document.body.appendChild(crosshair);

const hintText = document.createElement('div');
Object.assign(hintText.style, {
    position: 'absolute', top: '55%', left: '50%',
    transform: 'translateX(-50%)', color: 'white', fontSize: '14px',
    fontFamily: 'sans-serif', opacity: '0', transition: 'opacity 0.2s',
    pointerEvents: 'none', textShadow: '1px 1px 2px black'
});
hintText.innerText = 'Investigate';
document.body.appendChild(hintText);

let drops = Array.from({length: 25}, () => ({ 
    x: Math.random() * 512, y: Math.random() * 512, 
    s: 2.5 + Math.random() * 3, l: 15 + Math.random() * 25 
}));

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333); 
    scene.fog = new THREE.Fog(0x333333, 1, 20); 

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3, 1.2, 5); 

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    scene.add(new THREE.HemisphereLight(0xffffff, 0x888888, 1.2));

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const bgSound = new THREE.Audio(listener);
    new THREE.AudioLoader().load('bg.mp3', (buffer) => {
        bgSound.setBuffer(buffer);
        bgSound.setLoop(true);
        bgSound.setVolume(0.3);
        bgSound.play();
    });

    const dripSound = new THREE.PositionalAudio(listener);
    new THREE.AudioLoader().load('drip.mp3', (buf) => {
        dripSound.setBuffer(buf);
        dripSound.setVolume(0.9);
        dripSound.setRefDistance(1.0);
        dripSound.setLoop(true);
        dripSound.play();
    });

    waterCanvas = document.createElement('canvas');
    waterCanvas.width = 512;
    waterCanvas.height = 512;
    waterCtx = waterCanvas.getContext('2d');
    waterTexture = new THREE.CanvasTexture(waterCanvas);

    controls = new PointerLockControls(camera, document.body);
    
    document.addEventListener('click', () => {
        if (isTransitioning) return;
        if (!controls.isLocked) {
            controls.lock();
        } else if (isHoveringFridge) {
            startTransition();
        }
    });

    loader = new GLTFLoader();
    loader.load('scene1.glb', (gltf) => {
        const model = gltf.scene;
        model.traverse((child) => {
            if (child.isMesh) {
                objects.push(child);
                const isFridge = child.name === "Object_22" || child.name === "Object_40";
                if (isFridge) {
                    fridgeParts.push(child);
                    child.material = new THREE.MeshBasicMaterial({ map: waterTexture });
                    if (child.name === "Object_22") child.add(dripSound);
                } else {
                    child.material = new THREE.MeshLambertMaterial({
                        color: 0xeeeeee, transparent: true, opacity: 0.4, depthWrite: false   
                    });
                }
            }
        });
        scene.add(model);
        if(loadingEl) loadingEl.innerText = 'Use mouse to look around, WASD to move.';
    });

    document.addEventListener('keydown', (e) => keys[e.code] = true);
    document.addEventListener('keyup', (e) => keys[e.code] = false);
}

function startTransition() {
    isTransitioning = true;
    controls.unlock(); 
    const overlay = document.getElementById('fade-overlay');
    if (overlay) overlay.style.opacity = '1';
    
    setTimeout(() => {
        window.location.href = 'index2.html';
    }, 2500);
}

function updateWaterEffect() {
    if (!waterCtx) return;
    waterCanvas.width = 512; 
    waterCtx.fillStyle = '#cccccc'; 
    waterCtx.fillRect(0, 0, 512, 512);
    waterCtx.strokeStyle = 'rgba(120, 200, 255, 0.9)'; 
    waterCtx.lineWidth = 3;
    waterCtx.lineCap = 'round';
    drops.forEach(d => {
        d.y -= d.s; 
        if (d.y > 0 && d.y < 240) {
            waterCtx.beginPath();
            waterCtx.moveTo(d.x, d.y);
            waterCtx.lineTo(d.x, d.y + d.l); 
            waterCtx.stroke();
        }
        if (d.y < -50) { d.y = 512; d.x = Math.random() * 512; }
    });
    waterTexture.needsUpdate = true;
}

const collisionRay = new THREE.Raycaster();
const interactRay = new THREE.Raycaster();

function updateMovement() {
    if (!controls.isLocked || isTransitioning) return;

    let moveDir = new THREE.Vector3();
    camera.getWorldDirection(moveDir);
    moveDir.y = 0; moveDir.normalize();

    if (keys['KeyW'] || keys['KeyS'] || keys['KeyA'] || keys['KeyD']) {
        collisionRay.set(camera.position, moveDir);
        const hit = collisionRay.intersectObjects(objects, true);
        if (!(hit.length > 0 && hit[0].distance < playerRadius)) {
            if (keys['KeyW']) controls.moveForward(moveSpeed);
            if (keys['KeyS']) controls.moveForward(-moveSpeed);
            if (keys['KeyA']) controls.moveRight(-moveSpeed);
            if (keys['KeyD']) controls.moveRight(moveSpeed);
        }
    }

    interactRay.setFromCamera(new THREE.Vector2(0, 0), camera);
    const fridgeHit = interactRay.intersectObjects(fridgeParts);
    if (fridgeHit.length > 0 && fridgeHit[0].distance < 4) {
        isHoveringFridge = true;
        crosshair.style.width = '24px'; crosshair.style.height = '24px';
        crosshair.style.borderColor = '#44aaff'; hintText.style.opacity = '1';
    } else {
        isHoveringFridge = false;
        crosshair.style.width = '12px'; crosshair.style.height = '12px';
        crosshair.style.borderColor = 'white'; hintText.style.opacity = '0';
    }
}

function animate() {
    requestAnimationFrame(animate);
    updateWaterEffect();
    updateMovement();
    renderer.render(scene, camera);
}