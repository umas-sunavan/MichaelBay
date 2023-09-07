import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
// PerspectiveCamera 需設定四個參數，下面接著介紹
scene.background = new THREE.Color(0xffffff);
const windowRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(
  -windowRatio * 10,
  windowRatio * 10,
  10,
  -10,
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
// 新增環境光
const addAmbientLight = () => {
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
};

addAmbientLight();

// 假設圖表拿到這筆資料
const data = [
  { rate: 14.2, name: "動力控制IC" },
  { rate: 32.5, name: "電源管理IC" },
  { rate: 9.6, name: "智慧型功率IC" },
  { rate: 18.7, name: "二極體Diode" },
  { rate: 21.6, name: "功率電晶體Power Transistor" },
  { rate: 3.4, name: "閘流體Thyristor" },
];

// 我準備了簡單的色票，作為圓餅圖顯示用的顏色
const colorSet = [
  0x729ecb, 0xa9ecd5, 0xa881cb, 0xf3a39e, 0xffd2a1, 0xbbb5ae, 0xe659ab,
  0x88d9e2, 0xa77968,
];

const createPie = (startAngle, endAngle, color) => {
  const curve = new THREE.EllipseCurve(
    0,
    0, // 橢圓形的原點
    5,
    5, // X軸的邊長、Y軸的邊長
    startAngle,
    endAngle, // 起始的角度、結束的角度（Math.PI x 0.5代表90度）
    false, // 是否以順時鐘旋轉
    0 //旋轉橢圓
  );

  const curvePoints = curve.getPoints(50);
  const shape = new THREE.Shape(curvePoints);
  shape.lineTo(0, 0);
  // 將整個線段的頭尾相連
  shape.closePath();
  const shapeGeometry = new THREE.ShapeGeometry(shape);
  const shapeMaterial = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
  scene.add(mesh);
  return mesh;
};

const dataToPie = (data) => {
  // 我用sum來記憶上一個餅的結束位置，使得每個餅都從上一個結束位置開始繪製。
  let sum = 0;
  data.forEach((datium, i) => {
    // 將百分比轉換成0~2PI的弧度
    const radian = (datium.rate / 100) * (Math.PI * 2);
    createPie(sum, radian + sum, colorSet[i]);
    sum += radian;
  });
};

dataToPie(data);

// 在camera, renderer宣後之後加上這行
new OrbitControls(camera, renderer.domElement);

// 很像setInterval的函式。每一幀都會執行這個函式
function animate() {
  // 它每一幀執行animate()
  requestAnimationFrame(animate);
  // 每一幀，場景物件都會被鏡頭捕捉
  renderer.render(scene, camera);
}
// 函式起始點
animate();
