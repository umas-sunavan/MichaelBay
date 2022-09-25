import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { UnrealBloomPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/RenderPass';
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

// 新增點光
const addPointLight = () => {
	const pointLight = new THREE.PointLight(0xffffff, 0.4)
	scene.add(pointLight);
	pointLight.position.set(3, 3, 0)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 20, 0xffff00)
	scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
}

// 新增平行光
const addDirectionalLight = () => {
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
	directionalLight.position.set(20, 20, 0)
	scene.add(directionalLight);
	directionalLight.castShadow = true
	const d = 10;

	directionalLight.shadow.camera.left = - d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = - d;

	// 新增Helper
	const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 20, 0xffff00)
	// scene.add(lightHelper);
	// 更新位置
	directionalLight.target.position.set(0, 0, 0);
	directionalLight.target.updateMatrixWorld();
	// 更新Helper
	lightHelper.update();
}

// 聚光燈
const addSpotLight = () => {
	const spotLight = new THREE.SpotLight(0xffffff, 1);
	spotLight.position.set(3, 3, 0);
	spotLight.castShadow = true;
	scene.add(spotLight);
}

// 區域光
const addRectAreaLight = () => {
	const width = 10;
	const height = 10;
	const intensity = 1;
	const rectLight = new THREE.RectAreaLight(0xffffff, 1, width, height);
	rectLight.position.set(5, 5, 0);
	rectLight.lookAt(0, 0, 0);
	scene.add(rectLight)

	const rectLightHelper = new RectAreaLightHelper(rectLight);
	rectLight.add(rectLightHelper);
}

// 半球光
const addHemisphereLight = () => {
	const hemisphereLight = new THREE.HemisphereLight(0xffff99, 0x9999ff, 0.2); scene.add(hemisphereLight);
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
addRectAreaLight()

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();