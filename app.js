import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

const COLORS = { BG: 0xffffff, MATERIAL: 0xffffff };
const width = window.innerWidth;
const height = window.innerHeight;

// Setup the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
const cameraTarget = { x: 0, y: 0, z: 0 };
camera.position.y = Math.random() * 300;
camera.position.z = Math.random() * 1000;
camera.rotation.x = -15 * Math.PI / 180;
camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(COLORS.BG, 1.3);
light.position.set(camera.position.x, camera.position.y + 500, camera.position.z + 500).normalize();
scene.add(light);

// Setup the terrain
const geometry = new THREE.PlaneBufferGeometry(2000, 2000, 256, 256);
const material = new THREE.MeshLambertMaterial({ color: COLORS.MATERIAL, wireframe: true });
const terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

const perlin = new Perlin();
const peak = Math.random() * 100 + 50;
const smoothing = Math.random() * 500 + 200;

function refreshVertices() {
    var vertices = terrain.geometry.attributes.position.array;
    for (var i = 0; i <= vertices.length; i += 3) {
        vertices[i + 2] = peak * perlin.noise(
            (terrain.position.x + vertices[i]) / smoothing,
            (terrain.position.z + vertices[i + 1]) / smoothing
        );
    }
    terrain.geometry.attributes.position.needsUpdate = true;
    terrain.geometry.computeVertexNormals();
}

refreshVertices();
renderer.render(scene, camera);
