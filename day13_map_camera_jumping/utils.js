import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';

export const addSkydome = (scene) => {
	// 匯入材質
	// image source: https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328
	const skydomeTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg')
	// 帶入材質，設定內外面
	const skydomeMaterial = new THREE.MeshBasicMaterial({ map: skydomeTexture, side: THREE.DoubleSide })
	const skydomeGeometry = new THREE.SphereGeometry(100, 50, 50)
	const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
	scene.add(skydome);
	return skydome
}

// 新增環境光
export const addAmbientLight = (scene) => {
	const light = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(light)
}

// 新增點光
export const addPointLight = (scene) => {
	const pointLight = new THREE.PointLight(0xffffff, 1)
	scene.add(pointLight);
	pointLight.position.set(10, 10, -10)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 5, 0xffff00)
	// 更新Helper
	lightHelper.update();
}

// 新增平行光
export const addDirectionalLight = (scene) => {
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

export const addEarth = (scene) => {
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
	return earth
}

export const addCloud = (scene) => {
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
	return cloud
}

export const addRing = (scene) => {
	const geo = new THREE.RingGeometry( 0.1, 0.13, 32 );
	const mat = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
	const ring = new THREE.Mesh( geo, mat );
	scene.add( ring );
	return ring
}

export const cities = [
	{ name: "--- 選擇城市 ---", id: 0, lat: 0, lon: 0, country: "無" },
	{ name: "孟買", id: 1356226629, lat: 19.0758, lon: 72.8775, country: "印度" },
	{ name: "莫斯科", id: 1643318494, lat: 55.7558, lon: 37.6178, country: "俄羅斯" },
	{ name: "廈門", id: 1156212809, lat: 24.4797, lon: 118.0819, country: "中國" },
	{ name: "金邊", id: 1116260534, lat: 11.5696, lon: 104.9210, country: "柬埔寨" },
	{ name: "芝加哥", id: 1840000494, lat: 41.8373, lon: -87.6862, country: "美國" },
	{ name: "布里奇波特", id: 1840004836, lat: 41.1918, lon: -73.1953, country: "美國" },
	{ name: "墨西哥市", id: 1484247881, lat:19.4333, lon: -99.1333 , country: "墨西哥" },
	{ name: "卡拉奇", id: 1586129469, lat:24.8600, lon: 67.0100 , country: "巴基斯坦" },
	{ name: "倫敦", id: 1826645935, lat:51.5072, lon: -0.1275 , country: "英國" },
	{ name: "波士頓", id: 1840000455, lat:42.3188, lon: -71.0846 , country: "美國" },
	{ name: "台中", id: 1158689622, lat:24.1500, lon: 120.6667 , country: "台灣" },
]

export const addText = text => {
	const textGeometry = new TextGeometry( text, {
		font: font,
		size: 0.2,
		height: 0.01,
		curveSegments: 2,
		bevelEnabled: false,
		bevelThickness: 10,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	} );
	const textMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
	const textMesh = new THREE.Mesh(textGeometry, textMaterial)
	console.log(text.length);
	textMesh.geometry.translate(text.length*-0.15,0.2,0)
	scene.add(textMesh)
	
	return textMesh
}

export const getPixelPosition = (ndcPosition) => {
	const ndcX = ndcPosition.x
	const ndcY = ndcPosition.y
	const width = window.innerWidth
	const height = window.innerHeight
	const windowX = (ndcX * 0.5 + 0.5) * width
	const windowY = (ndcY * -0.5 + 0.5) * height
	return new THREE.Vector2(windowX, windowY)
}

// 經緯度轉換成弧度
export const lonLauToRadian = (lon, lat, rad) => llaToEcef(Math.PI * (0 - lat) / 180, Math.PI * (lon / 180), 1, rad)
// 城市弧度轉換成世界座標
export const llaToEcef = (lat, lon, alt, rad) => {
	let f = 0
	let ls = Math.atan((1 - f) ** 2 * Math.tan(lat))
	let x = rad * Math.cos(ls) * Math.cos(lon) + alt * Math.cos(lat) * Math.cos(lon)
	let y = rad * Math.cos(ls) * Math.sin(lon) + alt * Math.cos(lat) * Math.sin(lon)
	let z = rad * Math.sin(ls) + alt * Math.sin(lat)
	return new THREE.Vector3(x, -z, -y)
}