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
new OrbitControls(camera, renderer.domElement);
// 渲染器會產生canvas物件，我們在html的body放置它
document.body.appendChild(renderer.domElement);

// arrowHelper
const dir = new THREE.Vector3(-2.49, 4.74, -3.01).normalize();
const origin = new THREE.Vector3(0, 0, 0);
const length = 10;
const hex = 0xffff00;
const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
scene.add(arrowHelper);
// 改成球體
const geometry = new THREE.SphereGeometry(100, 50, 50); // 參數帶入半徑、水平面數、垂直面數
// 匯入材質
const texture = new THREE.TextureLoader().load("./starmap_4k.jpeg");
const material = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
// 新增環境光
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
// 建立四元數
let quaternion = new THREE.Quaternion();
// 即將旋轉的弧度
let rotation = 0;
// 由dir為軸心，rotation為旋轉弧度
quaternion.setFromAxisAngle(dir, rotation);

function animate() {
  // 不斷增加弧度
  rotation += 0.001;
  // 更新四元數
  quaternion.setFromAxisAngle(dir, rotation);
  // 增加的弧度，要更新在天球上
  sphere.rotation.setFromQuaternion(quaternion);

  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
