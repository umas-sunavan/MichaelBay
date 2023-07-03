import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader";
import { RectAreaLightHelper } from "https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { Reflector } from "https://unpkg.com/three@latest/examples/jsm/objects/Reflector";
import MeshReflectorMaterial from "./MeshReflectorMaterial.js";
import { UnrealBloomPass } from "https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass";

// console.log(MeshReflectorMaterial);
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

// const sphereGeometry = new THREE.SphereGeometry(50, 30, 30)
// const hdriPath = 'https://storage.googleapis.com/umas_public_assets/michaelBay/day19/model/Warehouse-with-lights.jpg'
// const texutre = await new THREE.TextureLoader().loadAsync(hdriPath)
// const sphereMaterial = new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0xcceeff , map: texutre})
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
// sphere.position.set(0, 0, 0)
// scene.add(sphere);

const addCube = (w, h, d, color, side) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color: color, side: side });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  return mesh;
};

const room = addCube(60, 20, 60, 0x111111, THREE.BackSide);
room.translateY(9.9);

const column1 = addCube(4, 50, 4, 0x222222, THREE.FrontSide);
column1.position.set(-10, 0, -20);
const column2 = addCube(4, 50, 4, 0x222222, THREE.FrontSide);
column2.position.set(10, 0, -20);
const column3 = addCube(4, 50, 4, 0x222222, THREE.FrontSide);
column3.position.set(10, 0, 20);
const column4 = addCube(4, 50, 4, 0x222222, THREE.FrontSide);
column4.position.set(-10, 0, 20);

let cabinet;
const addCabinetRow = () => {
  return new Array(12).fill(0).map((o, i) => {
    const clone = cabinet.clone();
    const gap = Math.floor(i / 4);
    clone.position.set(0, 0, i * 4 + gap * 5 + 2);
    scene.add(clone);
    return clone;
  });
};

const addCabinetColumn = (count) => {
  const row = addCabinetRow();
  row.forEach((cabinet) => {
    const gap = Math.floor(count / 2) * 10;
    cabinet.translateX(6 * count + gap - 25);
    cabinet.translateZ(-30);
    const lookPX = count % 2 === 0;
    if (lookPX) {
      cabinet.rotateY(Math.PI);
    }
  });
};

(async () => {
  const path =
    "https://storage.googleapis.com/umas_public_assets/michaelBay/day20/cabinet_mapping.gltf";
  const gltf = await new GLTFLoader().loadAsync(path);
  cabinet = gltf.scene;
  console.log(gltf.scene);
  gltf.scene.traverse((object) => {
    if (object.isMesh) {
      object.material.map = null;
      object.material.normalMap = null;
    }
  });
  cabinet.scale.set(0.35, 0.35, 0.35);
  // scene.add(cabinet)
  new Array(6).fill(0).map((o, count) => {
    addCabinetColumn(count);
  });
})();

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(light);
};

// 新增點光
const addPointLight = (x, y, z) => {
  const pointLight = new THREE.PointLight(0xffffff, 1);
  scene.add(pointLight);
  pointLight.position.set(x, y, z);
  pointLight.castShadow = true;
  // 新增Helper
  const lightHelper = new THREE.PointLightHelper(pointLight, 10, 0xffff00);
  // scene.add(lightHelper);
  // 更新Helper
  lightHelper.update();
};

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3);
control.update();

addAmbientLight();
addPointLight(10, 18, -10);
addPointLight(10, 18, 10);

let fadingReflectorOptions = {
  mixBlur: 2,
  mixStrength: 1.5,
  resolution: 2048,
  blur: [0, 0],
  minDepthThreshold: 0.7,
  maxDepthThreshold: 2,
  depthScale: 2,
  depthToBlurRatioBias: 2,
  mirror: 0,
  distortion: 2,
  mixContrast: 2,
  reflectorOffset: 0,
  bufferSamples: 8,
};

const addFadingMirror = () => {
  const geo = new THREE.PlaneGeometry(60, 60, 1, 1);
  const mat = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.material = new MeshReflectorMaterial(
    renderer,
    camera,
    scene,
    mesh,
    fadingReflectorOptions
  );
  scene.add(mesh);
  return mesh;
};

const fadingGround = addFadingMirror();
fadingGround.rotateX(Math.PI * -0.5);

const fadingWallZN = addFadingMirror();
fadingWallZN.translateX(0);
fadingWallZN.translateZ(-29);

const fadingWallZP = addFadingMirror();
fadingWallZP.translateZ(29);
fadingWallZP.rotateY(Math.PI);

const fadingWallXN = addFadingMirror();
fadingWallXN.rotateY(Math.PI * 0.5);
fadingWallXN.translateZ(-29);

const fadingWallXP = addFadingMirror();
fadingWallXP.translateX(29);
fadingWallXP.rotateY(Math.PI * -0.5);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (cabinet) {
    cabinet.rotation.y += 0.01;
    fadingGround.material.update();
    fadingWallZN.material.update();
    fadingWallZP.material.update();
    fadingWallXN.material.update();
    fadingWallXP.material.update();
  }
}
animate();
