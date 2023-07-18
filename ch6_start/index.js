import * as THREE from "three";
const scene = new THREE.Scene();
// PerspectiveCamera 需設定四個參數，下面接著介紹
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 修改鏡頭位置
camera.position.set(0, 5, 15);
// 實例化渲染器
const renderer = new THREE.WebGLRenderer();
// 渲染器負責投影畫面在螢幕上，會需要寬高
renderer.setSize(window.innerWidth, window.innerHeight);
// 渲染器會產生canvas物件，我們在html的body放置它
document.body.appendChild(renderer.domElement);
// 建立一個形狀，用來定義物體的形狀為長寬高為1的正方體
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 換成MeshNormalMaterial
const material = new THREE.MeshNormalMaterial({ color: 0x0000ff });
// 刪掉parent跟child，換成cube
const cube = new THREE.Mesh(geometry, material);
// 刪掉parent跟child
scene.add(cube);
const matrix = new THREE.Matrix4();
const tx = 5;
const ty = 0;
const tz = 0;
const sx = 2;
const sy = 1;
const sz = 1;
const matrixArray = [sx, 0, 0, tx, 0, sy, 0, ty, 0, 0, sz, tz, 0, 0, 0, 1];
matrix.set(...matrixArray);
cube.applyMatrix4(matrix);
// 很像setInterval的函式。每一幀都會執行這個函式
function animate() {
  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
