import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";
import { SVGLoader } from "https://unpkg.com/three@latest/examples/jsm/loaders/SVGLoader.js";

const loadPathsFromSvg = async () =>
  await new SVGLoader().loadAsync(
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day17/taiwan.svg"
  );

loadPathsFromSvg();

// 假設GIS來源資料如下
const data = [
  { rate: 14.2, name: "雲嘉" },
  { rate: 32.5, name: "中彰投" },
  { rate: 9.6, name: "南高屏" },
  { rate: 9.7, name: "宜花東" },
  { rate: 21.6, name: "北北基" },
  { rate: 3.4, name: "桃竹苗" },
  { rate: 9.0, name: "澎湖" },
];

(async () => {
  const svgData = await loadPathsFromSvg();
  const paths = svgData.paths;
  const group = new THREE.Group();
  // 遞迴paths
  paths.forEach((path) => {
    const shapes = SVGLoader.createShapes(path);
    const color = path.color;
    const material = new THREE.MeshStandardMaterial({ color });
    shapes.forEach((shape) => {
      const color = path.color;
      // 除了顏色以外，我們還可以抓到id值
      const parentName = path.userData.node.parentNode.id;
      const name = path.userData.node.id || parentName;
      // 抓到ID值之後，對照數據資料
      const dataRaw = data.find((raw) => raw.name === name);
      // 取消bevel、steps設成1
      console.log(dataRaw.rate);
      if (!dataRaw) return;
      console.log(dataRaw);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: -dataRaw.rate,
        steps: 1,
        bevelEnabled: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      // 旋轉3D物件即可
      group.rotateX(Math.PI);
      // 將所有可渲染的Mesh加入成群組物件group
      group.add(mesh);
    });
  });
  // 顯示群組物件，就可以顯示群組底下的物件
  scene.add(group);
})();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(250, -250, 300);
// 在camera, renderer宣告後之後加上這行
const control = new OrbitControls(camera, renderer.domElement);
control.target.set(250, -250, 0);
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

addAmbientLight();
addDirectionalLight();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
