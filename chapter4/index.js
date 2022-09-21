import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 15)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(100,50,50)
console.log(geometry);
// 匯入材質
const texture = new THREE.TextureLoader().load('/chapter3/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w.jpg')
// 帶入材質，設定內外面
const material = new THREE.MeshStandardMaterial( { map: texture, side: THREE.DoubleSide})
// 新增環境光
const light = new THREE.AmbientLight(0xffffff,1)
scene.add(light)

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// 帶入鏡頭跟renderer.domElement實例化它即可
new OrbitControls( camera, renderer.domElement );

// axesHelper
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// arrowHelper
const dir = new THREE.Vector3(-2.49, 4.74, -3.01).normalize();
const origin = new THREE.Vector3( 0, 0, 0 );
const length = 10;
const hex = 0xffff00;
const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );

// 建立四元數
let quaternion = new THREE.Quaternion()
// 即將旋轉的弧度
let rotation = 0
// 由dir為軸心，rotation為旋轉弧度
quaternion.setFromAxisAngle( dir, rotation );
function animate() {
	// 不斷增加弧度
	rotation += 0.001
	// 更新四元數
	quaternion.setFromAxisAngle(dir, rotation)
	// 增加的弧度，要更新在天球上
	sphere.rotation.setFromQuaternion(quaternion)
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}
animate();