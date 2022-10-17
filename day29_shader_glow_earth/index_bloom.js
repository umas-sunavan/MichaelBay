import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/VertexNormalsHelper.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/RenderPass';

let composer;
const initComposer = () => {
	const renderScene = new RenderPass(scene, camera);
	const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.5, 0.5);

	const params = {
		exposure: 1,
		bloomStrength: 0.8,
		bloomThreshold: 0,
		bloomRadius: 0.7
	};

	bloomPass.threshold = params.bloomThreshold;
	bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;
	bloomPass.exposure = params.exposure;

	composer = new EffectComposer(renderer);
	composer.addPass(renderScene);
	composer.addPass(bloomPass);
}
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping
const exp = 0.65
renderer.toneMappingExposure = Math.pow( exp, 1.0 );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(14, 30, 20);

// 新增點光
const addPointLight = (x, y, z, color = 0xffffff) => {
	const pointLight = new THREE.PointLight(0xffffff, 1)
	scene.add(pointLight);
	pointLight.position.set(x, y, z)
	pointLight.castShadow = true
	pointLight.shadow.bias = -0.001
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 3, 0xffff00)
	// scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
	return pointLight
}

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.2)
	scene.add(light)
}


addAmbientLight()

addPointLight(10, 10, 10);

let earth;
let cloud;
let skydome;

(async () => {

	const control = new OrbitControls(camera, renderer.domElement);

	const addSphere = () => {
		const vertex = document.getElementById('vertexShader').innerHTML
		const fragment = document.getElementById('fragmentShader').innerHTML
		const geo = new THREE.SphereGeometry(5.39, 60, 60)
		const myPosition = control.object.position.clone().normalize()
		const mat = new THREE.ShaderMaterial({
			transparent: true,
			blending: THREE.AdditiveBlending,
			fragmentShader: fragment,
			vertexShader: vertex,
			uniforms: {
				orbitcontrolPosition: {
					value: myPosition
				}
			}
		})
		// mat.blending = THREE.AdditiveBlending
		const mesh = new THREE.Mesh(geo, mat)
		scene.add(mesh)
		return mesh
	}

	const mesh = addSphere()

	// 匯入材質
	// image source: https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328
	const skydomeTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg')
	// 帶入材質，設定內外面
	const skydomeMaterial = new THREE.MeshBasicMaterial({ map: skydomeTexture, side: THREE.DoubleSide })
	const skydomeGeometry = new THREE.SphereGeometry(100, 50, 50)
	skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
	scene.add(skydome);

	const earthGeometry = new THREE.SphereGeometry(5, 600, 600)
	const earthTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthmap2k.jpg')
	// 灰階高度貼圖
	const displacementTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/editedBump.jpg')
	const roughtnessTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2kReversedLighten.png')
	const speculatMapTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2k.jpg')
	const bumpTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthbump2k.jpg')


	const earthMaterial = new THREE.MeshStandardMaterial({
		map: earthTexture,
		side: THREE.DoubleSide,
		roughnessMap: roughtnessTexture,
		roughness: 0.9,
		// 將貼圖貼到材質參數中
		metalnessMap: speculatMapTexture,
		metalness: 1,
		displacementMap: displacementTexture,
		displacementScale: 0.5,
		bumpMap: bumpTexture,
		bumpScale: 0.1,
	})
	earth = new THREE.Mesh(earthGeometry, earthMaterial);
	scene.add(earth);

	const cloudGeometry = new THREE.SphereGeometry(5.4, 60, 60)
	// 匯入材質
	// texture source: http://planetpixelemporium.com/earth8081.html
	const cloudTransparency = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthhiresclouds2K.jpg')
	// 帶入材質，設定內外面
	const cloudMaterial = new THREE.MeshStandardMaterial({
		transparent: true,
		opacity: 1,
		alphaMap: cloudTransparency
	})
	cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
	scene.add(cloud);

	let cameraPosition = control.object.position.clone().normalize()
	const onCameraChange = (event) => {
		const control = event.target
		cameraPosition = control.object.position.clone().normalize()
		mesh.material.uniforms.orbitcontrolPosition.value = cameraPosition
	}
	control.addEventListener('change', onCameraChange)

})()

initComposer()
function animate() {
	requestAnimationFrame(animate);
	// renderer.render(scene, camera);
	earth.rotation.y += 0.005
	cloud.rotation.y += 0.004
	skydome.rotation.y += 0.001
		if (composer) {
	
			composer.render();
		}
}
animate();