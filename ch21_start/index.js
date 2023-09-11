import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader";
import { RectAreaLightHelper } from "https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  10000
);
camera.zoom = 0.4;
camera.updateProjectionMatrix();
camera.position.set(7, 15, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.outputColorSpace = THREE.SRGBColorSpace; // optional with post-processing

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;

const sphereGeometry = new THREE.SphereGeometry(50, 30, 30);
const hdriPath =
  "https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/Warehouse-with-lights.jpg";
const texutre = await new THREE.TextureLoader().loadAsync(hdriPath);
const sphereMaterial = new THREE.MeshStandardMaterial({
  side: THREE.BackSide,
  color: 0xcceeff,
  map: texutre,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 3);
  scene.add(light);
};

// 新增平行光
const addDirectionalLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
  directionalLight.position.set(20, 20, 20);
  scene.add(directionalLight);
  directionalLight.castShadow = true;
  const d = 10;

  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  // 新增Helper
  const lightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    20,
    0xffff00
  );
  // scene.add(lightHelper);
  // 更新位置
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.target.updateMatrixWorld();
  // 更新Helper
  lightHelper.update();
};

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3);
control.update();

addAmbientLight();
addDirectionalLight();

// device作為閉包外存取模型的變數
let device;
let cabinet;
(async () => {
  const path =
    "https://storage.googleapis.com/umas_public_assets/michaelBay/ch21/rack.glb";
  const gltf = await new GLTFLoader().loadAsync(path);
  cabinet = gltf.scene;
  cabinet.scale.set(0.5, 0.5, 0.5);
  scene.add(cabinet);
  cabinet.traverse((obj) => {
    if (obj.isMesh) {
      obj.material.roughness = 0;
      obj.material.metalness = 0;
    }
  });
})();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // 幫機櫃加上旋轉
  if (cabinet) {
    cabinet.rotation.y += 0.01;
  }
}
animate();
