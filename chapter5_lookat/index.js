import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
// 已經存在的鏡頭位置設定
camera.position.set(0, 10, 15)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry(100,50,50)
console.log(geometry);
// 匯入材質
// image source: https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328
const texture = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/3dbe3745-0eb8-4e98-aac3-197221ef117e/dbw8p0w-b6b3b7c7-681a-4cf7-8ccd-9c34d4f5ae37.jpg/v1/fill/w_900,h_450,q_75,strp/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDUwIiwicGF0aCI6IlwvZlwvM2RiZTM3NDUtMGViOC00ZTk4LWFhYzMtMTk3MjIxZWYxMTdlXC9kYnc4cDB3LWI2YjNiN2M3LTY4MWEtNGNmNy04Y2NkLTljMzRkNGY1YWUzNy5qcGciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.I7-yqUj4lQzNZm9UyXxx5VVIlwzL-jN8FTifpTbRvos')
// 帶入材質，設定內外面
const material = new THREE.MeshStandardMaterial( { map: texture, side: THREE.DoubleSide})
// 新增環境光
const light = new THREE.AmbientLight(0xffffff,1)
scene.add(light)

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const earthGeometry = new THREE.SphereGeometry(5,50,50)
// 匯入材質
const earthTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg/800px-Solarsystemscope_texture_8k_earth_daymap.jpg')
// 帶入材質，設定內外面
const earthMaterial = new THREE.MeshStandardMaterial( { map: earthTexture, side: THREE.DoubleSide})
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 帶入鏡頭跟renderer.domElement實例化它即可
new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// 建立一個向量，以儲存鏡頭方向
const cameraLookAt = new THREE.Vector3(0,0,0)
// 移動到animate()之外
cameraLookAt.set(10,0,0)
// 移動到animate()之外
camera.lookAt(cameraLookAt)

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}
animate();
