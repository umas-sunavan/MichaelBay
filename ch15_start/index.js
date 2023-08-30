import * as THREE from "three";
const scene = new THREE.Scene();
// PerspectiveCamera 需設定四個參數，下面接著介紹
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// Camera 身為鏡頭，有位置屬性，設定在Z軸即可。
camera.position.set(0, 0, 15);

// 實例化渲染器
const renderer = new THREE.WebGLRenderer();
// 渲染器負責投影畫面在螢幕上，會需要寬高
renderer.setSize(window.innerWidth, window.innerHeight);
// 渲染器會產生canvas物件，我們在html的body放置它
document.body.appendChild(renderer.domElement);
// 建立一個形狀，用來定義物體的形狀為長寬高為1的正方體
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 建立一個材質，可想像成一個物體所穿的衣服，設定材質為藍色
const material = new THREE.MeshNormalMaterial({ color: 0x0000ff });
// 換成兩個物件
const parent = new THREE.Mesh(geometry, material);
const child = new THREE.Mesh(geometry, material);
// 接著，把parent加到世界裡，把child加到parent裡
scene.add(parent);
parent.add(child);
// 依據前面的說明，把parent位置改成10，child位置改成5
parent.position.x = 10;
child.position.x = 5;
// 很像setInterval的函式。每一幀都會執行這個函式
function animate() {
  parent.rotation.y += 0.01;
  // 它每一幀執行animate()
  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
