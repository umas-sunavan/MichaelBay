import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, -500, 900)
// 在camera, renderer宣後之後加上這行
const control = new OrbitControls(camera, renderer.domElement);

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
	scene.add(lightHelper);
	// 更新位置
	directionalLight.target.position.set(0, 0, 0);
	directionalLight.target.updateMatrixWorld();
	// 更新Helper
	lightHelper.update();
}

// 假設GIS來源資料如下
const data = [
	{ rate: 14.2, name: '雲嘉' },
	{ rate: 32.5, name: '中彰投' },
	{ rate: 9.6, name: '南高屏' },
	{ rate: 9.7, name: '宜花東' },
	{ rate: 21.6, name: '北北基' },
	{ rate: 3.4, name: '桃竹苗' },
	{ rate: 9.0, name: '澎湖' },
]

import { SVGLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/SVGLoader.js';

const loadPathsFromSvg = async () => await new SVGLoader().loadAsync('taiwan.svg');

(async () => {
	const svgData = await loadPathsFromSvg()
	const paths = svgData.paths
	const group = new THREE.Group();
	paths.forEach( path => {
		const parentName = path.userData.node.parentNode.id;
		const name = path.userData.node.id || parentName
		const dataRaw = data.find(row => row.name === name)
		console.log(path, name);
		const color = path.color
		const material = new THREE.MeshStandardMaterial({
			color,
			side: THREE.DoubleSide,});	
		const shapes = SVGLoader.createShapes(path);
		shapes.forEach( shape => {
			const geometry = new THREE.ExtrudeGeometry(shape, {
				depth: -dataRaw.rate,
				steps: 1,
				bevelEnabled: false
			});
			const mesh = new THREE.Mesh(geometry, material);
			group.add(mesh);
		})
	})
	group.rotateX(Math.PI)
	scene.add(group);

})()

addAmbientLight()
addDirectionalLight()


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();