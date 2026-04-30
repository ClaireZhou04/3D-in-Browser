import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, controls, sphere;

init();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // FOV 设为 95，获得更广阔的视野
    camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 0, 0.1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.rotateSpeed = -0.5;
    controls.enableDamping = true;

    const btn = document.querySelector('.upload-btn');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    btn.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const texture = new THREE.Texture(img);
                    texture.colorSpace = THREE.SRGBColorSpace;
                    texture.needsUpdate = true;
                    setupSphere(texture);
                    document.getElementById('ui-layer').style.display = 'none';
                    scene.background = new THREE.Color(0x000000);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    window.addEventListener('resize', onWindowResize);
    animate();
}

function setupSphere(tex) {
    if (sphere) scene.remove(sphere);

    const geometry = new THREE.SphereGeometry(800, 64, 64);
    // 压扁 Y 轴到 0.65，会让长图在视野中横向铺得更满，显得空间更大
    geometry.scale(-1, 0.65, 1);

    const material = new THREE.MeshBasicMaterial({ map: tex });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}