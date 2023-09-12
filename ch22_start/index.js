import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader";
import { RectAreaLightHelper } from "https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { Reflector } from "https://unpkg.com/three@latest/examples/jsm/objects/Reflector";
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

const addCube = (w, h, d, color, side) => {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color: color, side: side });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  return mesh;
};

const column1 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide);
column1.position.set(-25, 0, -35);
const column2 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide);
column2.position.set(25, 0, -35);
const column3 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide);
column3.position.set(25, 0, 35);
const column4 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide);
column4.position.set(-25, 0, 35);

let cabinet;
let agv;
let agvLight;

const addCabinetRow = () => {
  return new Array(18).fill(0).map((o, i) => {
    const clone = cabinet.clone();
    const gap = Math.floor(i / 6);
    clone.position.set(0, 0, i * 4.2 + gap * 15 + 2);
    scene.add(clone);
    return clone;
  });
};

const addCabinetColumn = (count) => {
  const row = addCabinetRow();
  row.forEach((cabinet) => {
    const gap = Math.floor(count / 2) * 15;
    cabinet.translateX(6 * count + gap - 45);
    cabinet.translateZ(-50);
    const lookPX = count % 2 === 0;
    if (lookPX) {
      cabinet.rotateY(Math.PI);
    }
  });
};

const addCabinetModels = async () => {
  const path =
    "https://storage.googleapis.com/umas_public_assets/michaelBay/ch21/rack3.glb";
  const gltf = await new GLTFLoader().loadAsync(path);
  cabinet = gltf.scene;
  gltf.scene.traverse((object) => {
    if (object.isMesh) {
      object.material.map = null;
      object.material.color = new THREE.Color(0xffffff);
      object.material.normalMap = null;
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  cabinet.scale.set(0.35, 0.35, 0.35);
  new Array(8).fill(0).map((o, count) => {
    addCabinetColumn(count);
  });
};

const addAgvModels = async () => {
  const path =
    "https://storage.googleapis.com/umas_public_assets/michaelBay/ch22/agv_example.glb";
  const gltf = await new GLTFLoader().loadAsync(path);
  agv = gltf.scene;
  const lightMesh = gltf.scene.getObjectByName("AGV_MM_ForkLift_Light_0");
  const pointLight = addPointLight(19, 28, 60, 0x4444ff);
  gltf.scene.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  agv.scale.set(0.04, 0.04, 0.04);
  scene.add(agv);
  lightMesh.add(pointLight);
  agvLight = pointLight;
};

(async () => {
  await addCabinetModels();
  await addAgvModels();
})();

// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(light);
};

// 新增點光
const addPointLight = (x, y, z, color = 0xffffff) => {
  const pointLight = new THREE.PointLight(color, 1000);
  scene.add(pointLight);
  pointLight.position.set(x, y, z);
  pointLight.castShadow = true;
  pointLight.shadow.bias = -0.001;
  // 新增Helper
  const lightHelper = new THREE.PointLightHelper(pointLight, 30, 0xffff00);
  // scene.add(lightHelper);
  // 更新Helper
  lightHelper.update();
  return pointLight;
};

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3);
control.update();

addAmbientLight();
addPointLight(16, 18, -10);
addPointLight(4, 18, 10);

let fadingReflectorOptions = {
  mixBlur: 2,
  mixStrength: 1.5,
  resolution: 512,
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

const addPlane = (w, h) => {
  const geo = new THREE.PlaneGeometry(w, h, 1, 1);
  const mat = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
};

const fadingGround = addPlane(120, 120);
fadingGround.rotateX(Math.PI * -0.5);

const fadingWallZN = addPlane(120, 30);
fadingWallZN.translateY(15);
fadingWallZN.translateZ(-59);

const fadingWallZP = addPlane(120, 30);
fadingWallZP.translateY(15);
fadingWallZP.translateZ(59);
fadingWallZP.rotateY(Math.PI);

const fadingWallXN = addPlane(120, 30);
fadingWallXN.translateY(15);
fadingWallXN.rotateY(Math.PI * 0.5);
fadingWallXN.translateZ(-59);

const fadingWallXP = addPlane(120, 30);
fadingWallXP.translateY(15);
fadingWallXP.translateX(59);
fadingWallXP.rotateY(Math.PI * -0.5);

const updateAvgPosition = (agv, time) => {
  const zRoute = Math.cos(time) * 30;
  agv.position.set(0, 0, zRoute);
};

const flickerLight = (time, light) => {
  if (time % 1 < 0.5) {
    light.visible = true;
  } else {
    light.visible = false;
  }
};
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  if (agv) {
    time += 0.01;
    updateAvgPosition(agv, time);
    flickerLight(time, agvLight);
  }
}
animate();
