import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';

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

// 新增地球
const earthGeometry = new THREE.SphereGeometry(5,50,50)
const earthTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Solarsystemscope_texture_8k_earth_daymap.jpg/800px-Solarsystemscope_texture_8k_earth_daymap.jpg')
const earthMaterial = new THREE.MeshStandardMaterial( { map: earthTexture, side: THREE.DoubleSide})
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(20,0,0)
scene.add(earth);

// 新增太陽
const sunGeometry = new THREE.SphereGeometry(5,50,50)
const sunTexture = new THREE.TextureLoader().load('https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Map_of_the_full_sun.jpg/800px-Map_of_the_full_sun.jpg')
const sunMaterial = new THREE.MeshBasicMaterial( { map: sunTexture, side: THREE.DoubleSide})
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const width = 10;
const height = 10;
const intensity = 1;
const rectLight = new THREE.RectAreaLight( 0xffffff, 20,  width, height );
rectLight.position.set( 10, 5, 0 );
rectLight.lookAt(20,5,0)
scene.add( rectLight )

const rectLightHelper = new RectAreaLightHelper( rectLight );
rectLight.add( rectLightHelper );

// 帶入鏡頭跟renderer.domElement實例化它即可
new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}
animate();