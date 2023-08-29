import * as THREE from "three";
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
// 將LLA轉換成ECEF座標
const llaToEcef = (lat, lon, alt, rad) => {
	let f = 0
	let ls = Math.atan((1 - f) ** 2 * Math.tan(lat))
	let x = rad * Math.cos(ls) * Math.cos(lon) + alt * Math.cos(lat) * Math.cos(lon)
	let y = rad * Math.cos(ls) * Math.sin(lon) + alt * Math.cos(lat) * Math.sin(lon)
	let z = rad * Math.sin(ls) + alt * Math.sin(lat)
	return new THREE.Vector3(x, y, z)
}
const lonLauToRadian = (lon, lat, rad) => llaToEcef(Math.PI * (0 - lat) / 180, Math.PI * (lon / 180), 1, rad)
// 前面提到的城市資料清單
const cities = [
	// 我們加一個「請選擇」option避免誤導用戶
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
	{ name: "Taichung", id: 1158689622, lat:24.1500, lon: 120.6667 , country: "Taiwan" }
] 

const center = new THREE.Vector3()

const citySelect = document.getElementsByClassName('city-select')[0]
// 渲染option
citySelect.innerHTML = cities.map( city => `<option value="${city.id}">${city.name}</option>`)


citySelect.addEventListener( 'change', (event) => {
const cityId = event.target.value
	const seletedCity = cities.find(city => city.id+'' === cityId)
	// 用前面的函式所取得的座標
	const cityEciPosition = lonLauToRadian(seletedCity.lon, seletedCity.lat, 4.4)
	// 指定位置給圖釘
	ring.position.set(cityEciPosition.x, -cityEciPosition.z, -cityEciPosition.y)	
	// 圖釘永遠都看像世界中心，所以不會歪斜。
	ring.lookAt(center)
})

// {name: 'Phnom Penh', id: 1116260534, lat: 11.5696, lon: 104.921, country: 'Cambodia'}

const scene = new THREE.Scene();
// PerspectiveCamera 需設定四個參數，下面接著介紹
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 修改鏡頭位置
camera.position.set(0, 0, 15)
// 實例化渲染器
const renderer = new THREE.WebGLRenderer();
// 渲染器負責投影畫面在螢幕上，會需要寬高
renderer.setSize(window.innerWidth, window.innerHeight);
// 帶入鏡頭跟renderer.domElement實例化它即可
const control = new OrbitControls( camera, renderer.domElement );
// 渲染器會產生canvas物件，我們在html的body放置它
document.body.appendChild(renderer.domElement);


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
}
// 新增平行光
const addDirectionalLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4)
  directionalLight.position.set(0, 0, 10)
  scene.add(directionalLight);
  directionalLight.castShadow = true
  const d = 10;

  directionalLight.shadow.camera.left = - d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = - d;
  // 更新位置
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.target.updateMatrixWorld();
}

const addEarth = () => {
  const earthGeometry = new THREE.SphereGeometry(5,600,600)
  // 匯入材質 
  // Author/Origin: NASA Jet Propulsion Laboratory - Solar System Simulator 
  const earthTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/ch12/earthmap1k%20(3).jpg')
  earthTexture.encoding = THREE.sRGBEncoding
  
  // 新增灰階高度貼圖
  // Author/Origin: james hastings-trew 
  // https://planetpixelemporium.com/earth.html
const displacementTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/ch12/earthbump1k.jpg')
    // 新增金屬貼圖
    // Author/Origin: james hastings-trew 
    // https://planetpixelemporium.com/earth.html
  const speculatMapTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/ch12/earthspec1k.jpg')
    // 新增凹凸貼圖
    // Author/Origin: james hastings-trew 
    // https://planetpixelemporium.com/earth.html
  const bumpMapTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/ch12/editedBump.jpg')

    // 新增光滑貼圖
    // Author/Origin: james hastings-trew 
    // https://planetpixelemporium.com/earth.html
  const roughnessMapTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/ch12/8081_earthspec2kReversedLighten.png.png')

const earthMaterial = new THREE.MeshStandardMaterial( { 
	map: earthTexture, 
	side: THREE.DoubleSide,
  displacementScale: 0.2,
	// 將貼圖貼到材質參數中
	displacementMap:displacementTexture,
  metalnessMap: speculatMapTexture,
  metalness:1,
  bumpMap: bumpMapTexture,
  bumpScale: 0.35,
  roughnessMap: roughnessMapTexture,
  roughness: 1
})

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);
  earth.position.set(0,0,0) 
 
    // 新增光滑貼圖
    // Author/Origin: james hastings-trew 
    // https://planetpixelemporium.com/earth.html
  const cloudTransparency = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/ch12/8081_earthhiresclouds4K%20(1).jpg')
  // 雲的球比地球大一點
  const cloudGeometry = new THREE.SphereGeometry(5.15,60,60)
  const cloudMaterial = new THREE.MeshStandardMaterial( { 
  // 開啟透明功能
    transparent: true, 
    opacity: 1,
    alphaMap: cloudTransparency
  })
  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloud);
  return {cloud, earth}
}

const addSkydome = () => {
  // 改名成skydome
  // Author/Origin: kirriaa on https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328 
    const skydomeTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/ch12/star_sky_hdri_spherical_map_with_galaxy2%20(1).jpg')
  skydomeTexture.encoding = THREE.sRGBEncoding
  const skydomeMaterial = new THREE.MeshBasicMaterial( { map: skydomeTexture, side: THREE.DoubleSide})
  const skydomeGeometry = new THREE.SphereGeometry(100,50,50)
  const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
  scene.add(skydome);
  return {skydome}
}

const addRing = () => {
  const geo = new THREE.RingGeometry( 0.1, 0.13, 32 );
  const mat = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
  const ring = new THREE.Mesh( geo, mat );
  scene.add( ring );
  return {ring}
}

addPointLight()
addAmbientLight()
addDirectionalLight()
const {cloud, earth } = addEarth()
const {skydome } = addSkydome()
const {ring } = addRing()


function animate() {	
	cloud.rotation.y +=0.004
	skydome.rotation.y += 0.001
  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
