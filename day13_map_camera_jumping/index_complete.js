import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 匯入材質
// image source: https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328
const skydomeTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg')
// 帶入材質，設定內外面
const skydomeMaterial = new THREE.MeshBasicMaterial({ map: skydomeTexture, side: THREE.DoubleSide })
const skydomeGeometry = new THREE.SphereGeometry(100, 50, 50)
const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
scene.add(skydome);

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
	const lightHelper = new THREE.PointLightHelper(pointLight, 5, 0xffff00)
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
	const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xffff00)
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
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const cloudGeometry = new THREE.SphereGeometry(5.4, 60, 60)
// 匯入材質
// texture source: http://planetpixelemporium.com/earth8081.html
const cloudTransparency = new THREE.TextureLoader().load('8081_earthhiresclouds4K.jpg')
// 帶入材質，設定內外面
const cloudMaterial = new THREE.MeshStandardMaterial({
	transparent: true,
	opacity: 1,
	alphaMap: cloudTransparency
})
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
scene.add(cloud);


// 帶入鏡頭跟renderer.domElement實例化它即可
const control = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const cities = [
	{ name: "--- select city ---", id: 0, lat: 0, lon: 0, country: "None" },
	{ name: "Mumbai", id: 1356226629, lat: 19.0758, lon: 72.8775, country: "India" },
	{ name: "Moscow", id: 1643318494, lat: 55.7558, lon: 37.6178, country: "Russia" },
	{ name: "Xiamen", id: 1156212809, lat: 24.4797, lon: 118.0819, country: "China" },
	{ name: "Phnom Penh", id: 1116260534, lat: 11.5696, lon: 104.9210, country: "Cambodia" },
	{ name: "Chicago", id: 1840000494, lat: 41.8373, lon: -87.6862, country: "United States" },
	{ name: "Bridgeport", id: 1840004836, lat: 41.1918, lon: -73.1953, country: "United States" },
	{ name: "Mexico City", id: 1484247881, lat:19.4333, lon: -99.1333 , country: "Mexico" },
	{ name: "Karachi", id: 1586129469, lat:24.8600, lon: 67.0100 , country: "Pakistan" },
	{ name: "London", id: 1826645935, lat:51.5072, lon: -0.1275 , country: "United Kingdom" },
	{ name: "Boston", id: 1840000455, lat:42.3188, lon: -71.0846 , country: "United States" },
	{ name: "Taichung", id: 1158689622, lat:24.1500, lon: 120.6667 , country: "Taiwan" },
]


const geo = new THREE.RingGeometry( 0.1, 0.13, 32 );
const mat = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
const ring = new THREE.Mesh( geo, mat );
scene.add( ring );

let lerpTarget

const citySelect = document.getElementsByClassName('citySelect')[0]
citySelect.innerHTML = cities.map( city => `<option class="city-option" value="${city.id}">${city.name}</option>`)
citySelect.addEventListener( 'change', (event) => {
	const cityId = event.target.value
	const seletedCity = cities.find(city => city.id+'' === cityId)
	const worldPosition = lonLauToWorkd(seletedCity.lon, seletedCity.lat, 4.4)
	ring.position.set(worldPosition.x, -worldPosition.z, -worldPosition.y)
	const center = new THREE.Vector3(0,0,0)
	ring.lookAt(center)
	// lerpTarget = new THREE.Vector3(0,0,0).set(...ring.position.toArray()).multiplyScalar(3)
	camera.position.set(...ring.position.toArray()).multiplyScalar(3)
	control.update()
})

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	// earth.rotation.y += 0.005
	cloud.rotation.y += 0.0005
	skydome.rotation.y += 0.001
	if (lerpTarget) {
		// camera.position.lerp(lerpTarget, 0.05).normalize().multiplyScalar(20)
		control.update()
	}
}
animate();

const lonLauToWorkd = (lon, lat, rad = 50) => {
	const pi = Math.PI
	return llarToWorld(pi * (0 - lat) / 180, pi * (lon / 180), 1, rad)
}

const llarToWorld = (lat, lon, alt, rad) => {

	const atan = Math.atan
	const tan = Math.tan
	const cos = Math.cos
	const sin = Math.sin
	let x
	let y
	let z
	let f = 0
	let ls = atan((1 - f) ** 2 * tan(lat))

	x = rad * cos(ls) * cos(lon) + alt * cos(lat) * cos(lon)
	y = rad * cos(ls) * sin(lon) + alt * cos(lat) * sin(lon)
	z = rad * sin(ls) + alt * sin(lat)
	return new THREE.Vector3(x, y, z)
}


