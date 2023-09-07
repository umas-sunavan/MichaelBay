import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js";

const loader = new FontLoader();
loader.load(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/day13/jf-openhuninn-1.1_Regular_cities.json",
  function (font) {
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

    // 新增平行光
    const addDirectionalLight = () => {
      const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
      directionalLight.position.set(20, 70, 20);
      scene.add(directionalLight);
    };

    addAmbientLight();
    addDirectionalLight();

    // 假設圖表拿到這筆資料
    const data = [
      { rate: 14.2, name: "Advanced Digital Camera" },
      { rate: 32.5, name: "Full Frame Digital Camera" },
      { rate: 9.6, name: "Lens Adapter" },
      { rate: 18.7, name: "Slim Digital Camera" },
      { rate: 21.6, name: "Slr Digita Camera" },
      { rate: 3.4, name: "Macro Zoom Lens" },
    ];

    // 我準備了簡單的色票，作為圓餅圖顯示用的顏色
    const colorSet = [
      0x729ecb, 0xa9ecd5, 0xa881cb, 0xf3a39e, 0xffd2a1, 0xbbb5ae, 0xe659ab,
      0x88d9e2, 0xa77968,
    ];

    const createPie = (startAngle, endAngle, color, rate, legend) => {
      // 該函式新增文字Mesh
      const addText = (text, color) => {
        // 文字geometry
        const textGeometry = new TextGeometry(text, {
          font: font, //字體
          size: 0.8, //大小
          height: 0.01, //文字厚度
          curveSegments: 2, // 文字中曲線解析度
          bevelEnabled: false, // 是否用bevel
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: color });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);
        return textMesh;
      };
      // 執行函式測試一下
      const text = addText(legend, color);
      // 防止文字被圓餅圖擋住
      text.position.z = 8;

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

      const curvePoints = curve.getPoints(100);
      const shape = new THREE.Shape(curvePoints);
      shape.lineTo(0, 0);
      // 將整個線段的頭尾相連
      shape.closePath();
      const depth = 0.5;
      const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: rate * 0.1, // 隆起高度
        steps: 1, // 在隆起的3D物件中間要切幾刀線
        bevelEnabled: true, // 倒角（隆起向外擴展）
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 6,
      });
      const middleAngle = (startAngle + endAngle) / 2;
      const x = Math.cos(middleAngle);
      const y = Math.sin(middleAngle);
      // 由於圓餅圖半徑為5，所以我設比它高一點，8.5
      const textDistance = 8.5;
      text.geometry.translate(x * textDistance, y * textDistance, -8);
      // 修正文字置左時的偏移
      text.geometry.translate(x - [...legend].length * 0.2, y, 0);

      const shapeMaterial = new THREE.MeshStandardMaterial({ color: color });
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
        createPie(sum, radian + sum, colorSet[i], datium.rate, datium.name);
        sum += radian;
      });
    };

    const descData = data.sort((a, b) => b.rate - a.rate);
    dataToPie(descData);

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
  }
);
