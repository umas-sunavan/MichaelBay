import * as THREE from "three";
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

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

addPointLight()
addAmbientLight()
addDirectionalLight()
const {cloud, earth } = addEarth()
const {skydome } = addSkydome()
console.log(skydome)

function animate() {	
	cloud.rotation.y +=0.004
  earth.rotation.y +=0.004
	skydome.rotation.y += 0.001
  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
