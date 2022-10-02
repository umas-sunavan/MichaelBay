import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
import { SVGLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/SVGLoader.js';
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100000);

camera.position.set(0, 0, 40)


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 在camera, renderer宣後之後加上這行
const control = new OrbitControls(camera, renderer.domElement);

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.6)
	scene.add(light)
}

// 新增點光
const addPointLight = () => {
	const pointLight = new THREE.PointLight(0xffffff, 0.2)
	scene.add(pointLight);
	pointLight.position.set(3, 3, 3)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 20, 0xffff00)
	// scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
}

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
// addPointLight()

const arrayBufferToBase64 = (buffer) => {
	let binary = '';
	const bytes = new Uint8ClampedArray(buffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return 'data:image/jpg;base64,' + window.btoa(binary);
}

const getTextureByTextureLoader = async (base64) => {
	const textureLoader = new THREE.TextureLoader()
	return await textureLoader.loadAsync(base64);
}

const addTile = async () => {
	let tileResponse
	try {
		tileResponse = await fetch('https://tile.openstreetmap.org/4/9/9.png')
	} catch (error) {
		console.warn('Something went wrong.', error);
	}
	const buffer = await tileResponse.arrayBuffer()
	const base64 = arrayBufferToBase64(buffer)
	const texture = await getTextureByTextureLoader(base64)
	const geo = new THREE.PlaneGeometry(10, 10, 1, 1)
	const mat = new THREE.MeshStandardMaterial({ map: texture })
	const tile = new THREE.Mesh(geo, mat)
	scene.add(tile)
}

addTile()

// instantiate a loader
const loader = new SVGLoader();

const loadPathsFromSvg = async () => {
	const svgData = await loader.loadAsync('taiwan.svg')
	console.log(svgData);
	const paths = svgData.paths;
	return paths
}

const extrudeFromPath = (group, path, name, depth) => {
	const material = new THREE.MeshStandardMaterial({
		color: path.color,
		side: THREE.DoubleSide,
	});
	const shapes = SVGLoader.createShapes(path);
	for (let j = 0; j < shapes.length; j++) {
		const shape = shapes[j];
		shape
		const geometry = new THREE.ExtrudeGeometry(shape, {
			depth: -depth,
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

const addExtrde = async () => {
	camera.position.set(0, -500, 900)
	control.target.set(250,-250,0)
	control.update()
	const paths = await loadPathsFromSvg()
	const group = new THREE.Group();
	for (let i = 0; i < paths.length; i++) {
		const path = paths[i];
		const parentName = path.userData.node.parentNode.id;
		const name = path.userData.node.id || parentName
		const dataRaw = data.find(row => row.name === name)
		extrudeFromPath(group, path, name, dataRaw.rate)
	}
	group.rotateX(Math.PI)
	scene.add(group);
}

// addExtrde()


scene.background = new THREE.Color(0xf2f2f2)
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();