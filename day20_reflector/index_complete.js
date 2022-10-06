import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { Reflector } from 'https://unpkg.com/three@latest/examples/jsm/objects/Reflector';
import MeshReflectorMaterial from './MeshReflectorMaterial.js';import { UnrealBloomPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/RenderPass';

// console.log(MeshReflectorMaterial);
const scene = new THREE.Scene();

let composer;
const initComposer = () => {
	const renderScene = new RenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.5, 0.5);

	const params = {
		exposure: 1,
		bloomStrength: 0.56,
		bloomThreshold: 0.18,
		bloomRadius: 0.6
	};

	bloomPass.threshold = params.bloomThreshold;
	bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;
	bloomPass.exposure = params.exposure;

	composer = new EffectComposer(renderer);
	composer.addPass(renderScene);
	composer.addPass(bloomPass);
}
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.zoom = 0.4
camera.updateProjectionMatrix();
camera.position.set(7, 15, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.toneMappingExposure = 0.4

const addCube = (w, h, d, color, side) => {
	const geo = new THREE.BoxGeometry(w, h, d)
	const mat = new THREE.MeshStandardMaterial({ color: color, side: side })
	const mesh = new THREE.Mesh(geo, mat)
	scene.add(mesh)
	return mesh
}

const room = addCube(60, 20, 60, 0x111111, THREE.BackSide)
room.translateY(9.9)

const column1 = addCube(4, 50, 4, 0x222222, THREE.FrontSide)
column1.position.set(-20, 0, -20)
const column2 = addCube(4, 50, 4, 0x222222, THREE.FrontSide)
column2.position.set(10, 0, -20)
const column3 = addCube(4, 50, 4, 0x222222, THREE.FrontSide)
column3.position.set(10, 0, 20)
const column4 = addCube(4, 50, 4, 0x222222, THREE.FrontSide)
column4.position.set(-20, 0, 20)

let cubeCamera;
let device

const addDeviceGroup = () => {
	return new Array(12).fill(0).map((o, i) => {
		const clone = device.clone()
		const gap = Math.floor(i / 4)
		clone.position.set(0, 0, i * (4) + gap * 5 + 2)
		scene.add(clone)
		return clone
	})
}

(async () => {
	const path = '/day20_reflector/cabinet_mapping/cabinet_mapping.gltf'
	const gltf = await new GLTFLoader().loadAsync(path);
	gltf.scene.traverse(object => {
		if (!object.isMesh) return
		const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(64, {
			generateMipmaps: true,
			minFilter: THREE.LinearMipmapLinearFilter,
		})

		// object.material.roughness = 0
		// object.material.metalness = 0
		// object.material.aoMap = null
		object.material.normalMap = null
		// object.material.roughnessMap = null
		// object.material.metalnessMap = null
		object.material.map = null
		// object.material.color = new THREE.Color(0xffffff)

		// object.material.envMapIntensity = 0.2

		cubeCamera = new THREE.CubeCamera(0.1, 10000, cubeRenderTarget)
		object.add(cubeCamera)
		object.material.envMap = cubeRenderTarget.texture
	})
	device = gltf.scene
	device.scale.set(0.3, 0.30, 0.30);
	new Array(6).fill(0).map((o, i) => {
		const deviceGroup = addDeviceGroup()
		deviceGroup.forEach(device => {
			const gap = Math.floor(i / 2) * 10
			device.translateX(6 * i + gap - 30)
			device.translateZ(-30)
		})
	})

})()

let mesh
document.getElementById('minRange').addEventListener( 'input', event => {
	console.log(

		document.getElementById('minRange').value
	);
	fadingReflectorOptions.minDepthThreshold = document.getElementById('minRange').value
	mesh.material = new MeshReflectorMaterial(renderer, camera, scene, mesh, fadingReflectorOptions);
})
document.getElementById('maxRange').addEventListener( 'input', event => {
	console.log(

		document.getElementById('maxRange').value
	);
	fadingReflectorOptions.maxDepthThreshold = document.getElementById('maxRange').value
	mesh.material = new MeshReflectorMaterial(renderer, camera, scene, mesh, fadingReflectorOptions);
})

let fadingReflectorOptions = {
	mixBlur: 2,
	mixStrength: 1.5,
	resolution: 2048,
	blur: [0, 0],
	minDepthThreshold: 0.7,
	maxDepthThreshold: 2,
	depthScale: 2,
	depthToBlurRatioBias: 2,
	mirror: 0,
	distortion: 2,
	mixContrast: 2,
	reflectorOffset: 0,
	bufferSamples: 8,
}

const addMirror = () => {
	let options = {
		clipBias: 0.03,
		textureWidth: 1024,
		textureHeight: 1024,
		color: 0x889999,
		recursion: 0
	};
	const geo = new THREE.PlaneGeometry(200, 200, 1, 1)
	let mirror = new Reflector(geo, options)
	mirror.position.set(0, 0, -10)
	mirror.rotation.x = Math.PI * -0.5
	scene.add(mirror);
	return mirror;
}
// const plane = addMirror()

const addFadingMirror = () => {
	const geo = new THREE.PlaneGeometry(60, 60, 1, 1)
	const mat = new THREE.MeshBasicMaterial()
	mesh = new THREE.Mesh(geo, mat)
	mesh.material = new MeshReflectorMaterial(renderer, camera, scene, mesh, fadingReflectorOptions);
	scene.add(mesh);
	
	return mesh;
}
const fadingGround = addFadingMirror()
fadingGround.rotateX(Math.PI * -0.5)

const fadingWallZN = addFadingMirror()
fadingWallZN.translateX(0)
fadingWallZN.translateZ(-29)

const fadingWallZP = addFadingMirror()
fadingWallZP.translateZ(29)
fadingWallZP.rotateY(Math.PI)

const fadingWallXN = addFadingMirror()
fadingWallXN.rotateY(Math.PI * 0.5)
fadingWallXN.translateZ(-29)

const fadingWallXP = addFadingMirror()
fadingWallXP.translateX(29)
fadingWallXP.rotateY(Math.PI * -0.5)

// const fadingWall = addFadingMirror()
// fadingWall.translateX(0)



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
	const light = new THREE.AmbientLight(0xffffff, 0.1)
	scene.add(light)
}

// 新增點光
const addPointLight = (x,y,z) => {
	const pointLight = new THREE.PointLight(0xffffff, 1)
	scene.add(pointLight);
	pointLight.position.set(x,y,z)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 10, 0xffff00)
	// scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
}

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3)
control.update()

// addDirectionalLight()
addAmbientLight()
addPointLight(10, 18, -10)
addPointLight(10, 18, 10)
// addPointLight(-10, 18, -10)
// addPointLight(-10, 18, 10)

initComposer()
function animate() {
	requestAnimationFrame(animate);
	// renderer.render(scene, camera);
	if (cubeCamera) {
		fadingGround.material.update()
		fadingWallZN.material.update()
		fadingWallZP.material.update()
		fadingWallXN.material.update()
		// fadingWallXP.material.update()
		// sphere.visible = true
		// device.rotation.y +=0.01
		// cubeCamera.update( renderer, scene );
		// sphere.visible = false
		if (composer) {
	
			composer.render();
		}
	}

}
animate();