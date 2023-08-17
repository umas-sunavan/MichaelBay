import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
// PerspectiveCamera 需設定四個參數，下面接著介紹
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 修改鏡頭位置
camera.position.set(0, 0, 15);
// 實例化渲染器
const renderer = new THREE.WebGLRenderer();
// 渲染器負責投影畫面在螢幕上，會需要寬高
renderer.setSize(window.innerWidth, window.innerHeight);
// 帶入鏡頭跟renderer.domElement實例化它即可
const control = new OrbitControls(camera, renderer.domElement);
// 渲染器會產生canvas物件，我們在html的body放置它
document.body.appendChild(renderer.domElement);

// 改成球體
const geometry = new THREE.SphereGeometry(100, 50, 50); // 參數帶入半徑、水平面數、垂直面數
// 匯入材質
const texture = new THREE.TextureLoader().load(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/starmap_4k.jpeg"
);
const material = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
// 新增環境光
const light = new THREE.AmbientLight(0xffffff, 3);
scene.add(light);
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
const earthGeometry = new THREE.SphereGeometry(5, 50, 50);
// 匯入材質
// Author/Origin: NASA Jet Propulsion Laboratory - Solar System Simulator
const earthTexture = new THREE.TextureLoader().load(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/ch07/2k_earth_daymap.jpeg"
);
// 帶入材質，設定內外面
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  side: THREE.DoubleSide,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);
// 改用這個方法來控制鏡頭的方向
control.target.set(10, 0, 0);
control.update();
function animate() {
  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
