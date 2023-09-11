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
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;

const sphereGeometry = new THREE.SphereGeometry(50, 30, 30);
const texutre = await new THREE.TextureLoader().loadAsync(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/Warehouse-with-lights.jpg"
);
// 將紋理貼到材質圖中
const sphereMaterial = new THREE.MeshStandardMaterial({
  side: THREE.BackSide,
  color: 0xcceeff,
  map: texutre,
});

const planeMaterial = new THREE.MeshStandardMaterial({
  side: THREE.BackSide,
  color: 0xcceeff,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 0, 0);
scene.add(sphere);

// 新增平行光
const addDirectionalLight = () => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 5.8);
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
  scene.add(lightHelper);
  // 更新位置
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.target.updateMatrixWorld();
  // 更新Helper
  lightHelper.update();
};

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
};

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3);
control.update();

addDirectionalLight();
addAmbientLight();
// 宣告照相機
let cubeCamera;
(async () => {
  const path =
    "https://storage.googleapis.com/umas_public_assets/michaelBay/ch20/HDD.glb";
  const gltf = await new GLTFLoader().loadAsync(path);
  // 用traverse巢狀遞迴子元件
  gltf.scene.traverse((object) => {
    // 撇除非Mesh的物件
    if (!object.name !== "pCube2") return;
    // 材質圖（嚴格來說是渲染對象）
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      // 渲染對象縮放設定
      generateMipmaps: true,
      // 渲染對象縮放設定
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    // 實例化照相機，給定near, far，以及材質圖
    cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
    // 把camera裝在物體裡面即可
    // 設定粗糙度為0
    object.material.roughness = 0;
    // 順手加的，非金屬反射效果比較好
    object.material.metalness = 0;

    object.material.envMap = cubeRenderTarget.texture;
    object.add(cubeCamera);
  });
  scene.add(gltf.scene);
})();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (cubeCamera) {
    cubeCamera.update(renderer, scene);
  }
}
animate();
