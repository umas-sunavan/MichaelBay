import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/SVGLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 3, 15)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// 在camera, renderer宣後之後加上這行
const control = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, -500, 900)
control.target.set(250,-250,0)
control.update()

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.6)
	scene.add(light)
}

// 新增平行光
const addDirectionalLight = () => {
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
	directionalLight.position.set(20, 20, 20)
	scene.add(directionalLight);
	directionalLight.castShadow = true
	const d = 10;

	directionalLight.shadow.camera.left = - d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = - d;

	// 新增Helper
	const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 20, 0xffff00)
	// scene.add(lightHelper);
	// 更新位置
	directionalLight.target.position.set(0, 0, 0);
	directionalLight.target.updateMatrixWorld();
	// 更新Helper
	lightHelper.update();
}

addAmbientLight()
addDirectionalLight()

// 假設圖表拿到這筆資料
const data = [
	{ rate: 14.2, name: '雲嘉' },
	{ rate: 32.5, name: '中彰投' },
	{ rate: 9.6, name: '南高屏' },
	{ rate: 9.7, name: '宜花東' },
	{ rate: 21.6, name: '北北基' },
	{ rate: 3.4, name: '桃竹苗' },
	{ rate: 9.0, name: '澎湖' },
]

const loadPathsFromSvg = async () => {
	const loader = new SVGLoader();
	const svgData = await loader.loadAsync('taiwan.svg')
	const paths = svgData.paths;
	return paths
}

const extrudeFromPath = (path, name, group, rate) => {
	const material = new THREE.MeshStandardMaterial({
		color: path.color,
		side: THREE.DoubleSide,
	});	
	const shapes = SVGLoader.createShapes(path);
	for (let j = 0; j < shapes.length; j++) {
		const shape = shapes[j];
		const geometry = new THREE.ExtrudeGeometry(shape, {
			depth: -rate,
			steps: 1,
			bevelEnabled: false,
			bevelThickness: 0.2,
			bevelSize: 0.2,
			bevelOffset: 0,
			bevelSegments: 6
		});
		const mesh = new THREE.Mesh(geometry, material);
		group.add(mesh);
		mesh.name = name
	}
}

(async () => {
	const paths = await loadPathsFromSvg()
	const group = new THREE.Group();
	paths.forEach( path => {
		const parentName = path.userData.node.parentNode.id;
		const name = path.userData.node.id || parentName
		console.log(path, name);
		const dataRaw = data.find(row => row.name === name)
		const rate = dataRaw.rate
		extrudeFromPath(path, name, group, rate)
	})
	group.rotateX(Math.PI)
	scene.add(group);

})()

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();