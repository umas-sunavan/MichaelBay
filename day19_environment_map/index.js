import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.zoom = 0.4
camera.updateProjectionMatrix();
camera.position.set(7, 15, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true

const sphereGeometry = new THREE.SphereGeometry(50, 30, 30)
const hdriPath = 'https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/Warehouse-with-lights.jpg'
const texutre = await new THREE.TextureLoader().loadAsync(hdriPath)
const sphereMaterial = new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0xcceeff , map: texutre})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(0, 0, 0)
scene.add(sphere);

let cubeCamera;
let device
(async ()=>{
	const path = 'https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/hard_disk_iron.gltf'
	const gltf = await new GLTFLoader().loadAsync(path);
	gltf.scene.traverse(object => {
		if (!object.isMesh) return
		const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
			generateMipmaps: true,
			minFilter: THREE.LinearMipmapLinearFilter,
		})
		cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)
		object.add(cubeCamera)
		object.material.envMap = cubeRenderTarget.texture
		object.material.roughness = 0
		object.material.metalness = 0
	})
	device = gltf.scene
	scene.add(gltf.scene)
})()


// 新增平行光
const addDirectionalLight = () => {
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
	directionalLight.position.set(20, 20, 20)
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

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 1)
	scene.add(light)
}

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3)
control.update()

addDirectionalLight()
addAmbientLight()

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (cubeCamera) {
		sphere.visible = true
		device.rotation.y +=0.01
		cubeCamera.update( renderer, scene );
		sphere.visible = false
	}

}
animate();