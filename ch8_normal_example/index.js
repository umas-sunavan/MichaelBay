import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "https://unpkg.com/three@latest/examples/jsm/helpers/VertexNormalsHelper.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
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

// 新增環境光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// 新增點光
const light = new THREE.PointLight(0xffffff, 100, 100);
// 設定點光位置
light.position.set(5, 5, 5);
scene.add(light);

// 設定球體
const geo = new THREE.SphereGeometry(1, 12, 6);
const mat = new THREE.MeshStandardMaterial({
  color: 0xf28500,
  flatShading: true,
});
const sphere = new THREE.Mesh(geo, mat);
scene.add(sphere);

// 顯示normal
const vnh = new VertexNormalsHelper(sphere, 0.15, 0);
scene.add(vnh);

function animate() {
  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
