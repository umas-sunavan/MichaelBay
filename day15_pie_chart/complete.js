import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const windowRatio = window.innerWidth / window.innerHeight
const camera = new THREE.OrthographicCamera(-windowRatio * 10, windowRatio * 10, 10, -10, 0.1,1000)
camera.position.set(0, 3, 15)



// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(light)
}

// 新增點光
const addPointLight = () => {
	const pointLight = new THREE.PointLight(0xffffff, 1)
	scene.add(pointLight);
	pointLight.position.set(3, 3, 0)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 20, 0xffff00)
	scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
}

// 新增平行光
const addDirectionalLight = () => {
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
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

addAmbientLight()
addDirectionalLight()
addPointLight()

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshNormalMaterial({color: 0x0000ff})
const parent = new THREE.Mesh(geometry, material);
const child = new THREE.Mesh(geometry, material);
scene.add(parent);
parent.add(child);
parent.position.x = 10
child.position.x = 5

new OrbitControls(camera, renderer.domElement);

const π = Math.PI

const data = [
	{rate: 14.2, name: '動力控制IC'},
	{rate: 32.5, name: '電源管理IC'},
	{rate: 9.6, name: '智慧型功率IC'},
	{rate: 18.7, name: '二極體Diode'},
	{rate: 21.6, name: '功率電晶體Power Transistor'},
	{rate: 3.4, name: '閘流體Thyristor'},
]

const colorSet = [
	0x729ECB,
	0xA9ECD5,
	0xA881CB,
	0xF3A39E,
	0xFFD2A1,
	0xBBB5AE,
	0xE659AB,
	0x88D9E2,
	0xA77968,
]

const createPie = (startAngle, endAngle, color) => {
	const curve = new THREE.EllipseCurve(
		0,0,
		5,5,
		startAngle, endAngle,
		false,
		0
	)
	console.log(startAngle, endAngle);
	const curvePoints = curve.getPoints(50)
	const shape = new THREE.Shape(curvePoints)
	shape.lineTo(0,0)
	shape.closePath()
	const shapeGeometry = new THREE.ShapeGeometry(shape)
	const shapeMaterial = new THREE.MeshBasicMaterial({color: color})
	const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
	scene.add(mesh)
	return mesh
}

const dataToPie = (data) => {
	let sum = 0
	data.forEach( (datium,i) => {
		const radian = datium.rate/100 * (π * 2)
		createPie(sum, radian+sum, colorSet[i])
		sum+=radian
	})
}

dataToPie(data)



function animate() {
    parent.rotation.y += 0.01;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();