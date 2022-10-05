import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { VertexNormalsHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/VertexTangentsHelper.js';

import { UnrealBloomPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/RenderPass';
const scene = new THREE.Scene();
let composer;
const initComposer = () => {
	const renderScene = new RenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.5, 0.5);

	const params = {
		exposure: 0,
		bloomStrength: 0.4,
		bloomThreshold: 0.3,
		bloomRadius: 0.8
	};

	bloomPass.threshold = params.bloomThreshold;
	bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;
	bloomPass.exposure = params.exposure;

	composer = new EffectComposer(renderer);
	composer.addPass(renderScene);
	composer.addPass(bloomPass);
}
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.zoom = 0.4
camera.updateProjectionMatrix();
camera.position.set(5, 5, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping
const exp = 0.85
renderer.toneMappingExposure = Math.pow( exp, 4.0 );
renderer.shadowMap.enabled = true


let cubeCamera
let sphere
(async () => {
	const sphereGeometry = new THREE.SphereGeometry(50, 30, 30)
	const texutre = await new THREE.TextureLoader().loadAsync('Warehouse-with-lights.jpg')
	const planeMaterial = new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0xcceeff, map: texutre})
	sphere = new THREE.Mesh(sphereGeometry, planeMaterial)
	sphere.position.set(0, 0, 0)
	scene.add(sphere)
	new GLTFLoader().load('hard_disk_iron.gltf', gltf => {
		gltf.scene.traverse(object => {
			if (object.isMesh) {
				object.material.roughness = 0
				object.material.metalness = 0
				object.material.transparent = false
				object.material.envMapIntensity = 0.45
				// new THREE.MeshStandardMaterial().envMapIntensity
				object.castShadow = true
				object.receiveShadow = true
				if (object.name === 'pCube3'){
					object.material.color = new THREE.Color(0xff0000)
				}
				if (object.name === 'pCube2'){
					console.log(object.material.metalnessMap);
					// object.material.metalnessMap = null
					// object.material.roughnessMap = null
					// object.material.
					// object.material.map = null
					console.log(object);
					const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
						generateMipmaps: true,
						minFilter: THREE.LinearMipmapLinearFilter,
					})
					cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)
					object.material.envMap = cubeRenderTarget.texture
					object.add(cubeCamera)
				}
	
			}
		})
		gltf.scene.name = 'hardDisk'
		gltf.scene.scale.set(0.5, 0.5, 0.5)
		scene.add(gltf.scene)
	
	})

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
	scene.add(lightHelper);
	// 更新位置
	directionalLight.target.position.set(0, 0, 0);
	directionalLight.target.updateMatrixWorld();
	// 更新Helper
	lightHelper.update();
}

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 2)
	scene.add(light)
}

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3)
control.update()

// addDirectionalLight()
addAmbientLight()

initComposer()
function animate() {
	const hardDisk = scene.getObjectByName('hardDisk')
	if (hardDisk) {
		hardDisk.rotation.y += 0.01
	}
	requestAnimationFrame(animate);
	// renderer.render(scene, camera);
	if (cubeCamera) {
		sphere.visible = true
		cubeCamera.update( renderer, scene );
		sphere.visible = false
	  }
	if (composer) {

		composer.render();
	}
}
animate();