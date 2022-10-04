import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 100);
camera.zoom = 0.4
camera.updateProjectionMatrix();
camera.position.set(5, 5, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true

const sphereGeometry = new THREE.SphereGeometry(50, 30, 30)
const planeMaterial = new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0xcceeff })
const sphere = new THREE.Mesh(sphereGeometry, planeMaterial)
sphere.position.set(0, 0, 0)
scene.add(sphere)

new GLTFLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/file.gltf', gltf => {
	gltf.scene.traverse(object => {
		if (object.isMesh) {
			object.material.roughness = 1
			object.material.metalness = 0
			object.material.transparent = false
			object.castShadow = true
			object.receiveShadow = true
		}
	})
	scene.add(gltf.scene)
})


// 聚光燈
const addSpotLight = () => {
	const spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.position.set(3, 3, 0);
	spotLight.castShadow = true;
	scene.add(spotLight);
}

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 1)
	scene.add(light)
}

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3)
control.update()

addSpotLight()
addAmbientLight()

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();