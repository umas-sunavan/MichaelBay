

import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { UnrealBloomPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/RenderPass';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
// 已經存在的鏡頭位置設定
camera.position.set(0, 10, 15)

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// 匯入材質
// image source: https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328
const texture = new THREE.TextureLoader().load('star_sky_hdri_spherical_map_with_galaxy2 (3).jpg')
// 帶入材質，設定內外面
const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide})
const geometry = new THREE.SphereGeometry(100,50,50)
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(light)
}

// 新增點光
const addPointLight = () => {
	const pointLight = new THREE.PointLight(0xffffff, 1)
	scene.add(pointLight);
	pointLight.position.set(10, 10, -10)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 20, 0xffff00)
	// scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
}

// 新增平行光
const addDirectionalLight = () => {
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
	directionalLight.position.set(0, 0, 10)
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

addPointLight()
addAmbientLight()
addDirectionalLight()

const earthGeometry = new THREE.SphereGeometry(5,600,600)
// 匯入材質
// texture source: http://planetpixelemporium.com/earth8081.html
const earthTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthmap2k.jpg')
const displacementTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/editedBump.jpg')
const speculatMapTextureReversed = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2kReversedLighten.png')
const bumpTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthbump2k.jpg')
const speculatMapTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/day10/8081_earthspec2k.jpg')
// 帶入材質，設定內外面
const earthMaterial = new THREE.MeshStandardMaterial( { 
	map: earthTexture, 
	side: THREE.DoubleSide, 
	roughnessMap:speculatMapTextureReversed,
	roughness:0.9,
	metalnessMap: speculatMapTexture,
	metalness:1,
	displacementMap:displacementTexture,
	displacementScale:0.5,
	bumpMap: bumpTexture,
	bumpScale: 0.1	,
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const cloudGeometry = new THREE.SphereGeometry(5.4,60,60)
// 匯入材質
// texture source: http://planetpixelemporium.com/earth8081.html
const cloudTransparency = new THREE.TextureLoader().load('8081_earthhiresclouds4K.jpg')
// 帶入材質，設定內外面
const cloudMaterial = new THREE.MeshStandardMaterial( { 
	transparent: true, 
	opacity: 1,
	alphaMap: cloudTransparency
})
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloud);

// 將OrbitControls存於一個變數
const control = new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
control.update()
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	// earth.rotation.y +=0.005
	// cloud.rotation.y +=0.004
	// sphere.rotation.y += 0.001

}
animate();
