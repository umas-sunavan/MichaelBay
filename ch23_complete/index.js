import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.set(0, 30, 30);
// 在camera, renderer宣後之後加上這行
const control = new OrbitControls(camera, renderer.domElement);

control.target.set(0, 0, 0);
control.update();

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(light);
};

// 新增平行光
const addDirectionalLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(20, 20, 20);
  scene.add(directionalLight);
  directionalLight.castShadow = true;
  const d = 10;

  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
};

addAmbientLight();
addDirectionalLight();

const addSphere = () => {
  // 實例化球的形狀
  const geo = new THREE.SphereGeometry(5, 50, 50);
  // 實例化材質物件
  const vertex = document.getElementById("vertexShader").innerHTML;
  const fragment = document.getElementById("fragmentShader").innerHTML;
  const mat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  // Mesh得透過上面兩個組成
  const mesh = new THREE.Mesh(geo, mat);
  // 將球加入到場景
  scene.add(mesh);
};

addSphere();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
