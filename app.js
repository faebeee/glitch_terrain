import * as THREE from 'https://unpkg.com/three@0.119.1/build/three.module.js';

const COLORS = { BG: 0xffffff, MATERIAL:  0xffffff};
var width = window.innerWidth;
var height = window.innerHeight;

// Setup the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
var cameraTarget = { x: 0, y: 0, z: 0 };
camera.position.y = 170;
camera.position.z = 1000;
camera.rotation.x = -15 * Math.PI / 180;
camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(COLORS.BG, 1.3);
light.position.set(camera.position.x, camera.position.y + 500, camera.position.z + 500).normalize();
scene.add(light);

// Setup the terrain
var geometry = new THREE.PlaneBufferGeometry(2000, 2000, 256, 256);
var material = new THREE.MeshLambertMaterial({ color: COLORS.MATERIAL, wireframe: true });
var terrain = new THREE.Mesh(geometry, material);
terrain.rotation.x = -Math.PI / 2;
scene.add(terrain);

var perlin = new Perlin();
var peak = 60;
var smoothing = 300;

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

var clock = new THREE.Clock();
var movementSpeed = 60;

function update() {
    var delta = clock.getDelta();
    terrain.position.z += movementSpeed * delta;
    camera.position.z += movementSpeed * delta;
    refreshVertices();
}

function render() {
    renderer.render(scene, camera);
}


update();
render();
