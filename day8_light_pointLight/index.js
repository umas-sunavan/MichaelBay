import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
// 已經存在的鏡頭位置設定
camera.position.set(0, 0, 90)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(100,50,50)
console.log(geometry);
// 匯入材質
// image source: https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328
const texture = new THREE.TextureLoader().load('free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w.jpg')
// 帶入材質，設定內外面
const material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, side: THREE.DoubleSide})
// 新增環境光
const light = new THREE.AmbientLight(0xffffff,0.1)
scene.add(light)

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const earthGeometry = new THREE.SphereGeometry(5,50,50)
// 匯入材質
const earthTexture = new THREE.TextureLoader().load('2k_earth_daymap.jpeg')
// 帶入材質，設定內外面
const earthMaterial = new THREE.MeshStandardMaterial( { map: earthTexture, side: THREE.DoubleSide})
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(40,0,-40)
scene.add(earth);

const sunGeometry = new THREE.SphereGeometry(5,50,50)
// 匯入材質
const sunTexture = new THREE.TextureLoader().load('2k_sun.jpeg')
// 帶入材質，設定內外面
const sunMaterial = new THREE.MeshBasicMaterial( { map: sunTexture, side: THREE.DoubleSide})
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// 新增平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
scene.add(directionalLight);
// 新增Helper
const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 20, 0xffff00)
scene.add(lightHelper);
// 更新位置
directionalLight.target.position.set(40, 0, -40);
directionalLight.target.updateMatrixWorld();
// 更新Helper
lightHelper.update();

// 帶入鏡頭跟renderer.domElement實例化它即可
new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// 建立一個向量，以儲存鏡頭方向
// const cameraLookAt = new THREE.Vector3(0,0,0)
// 宣告旋轉變數
// let rotation = 0

function animate() {
	// 每幀更新旋轉變數
	// rotation += 0.05
	// 變化該向量
	// cameraLookAt.set(0,0 + Math.cos(rotation),0)
	// 看向該向量
	// camera.lookAt(cameraLookAt)
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}
animate();