import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
const loader = new FontLoader();
loader.load( 'https://storage.googleapis.com/umas_public_assets/michaelBay/day13/jf-openhuninn-1.1_Regular_cities.json', function ( font ) {

const scene = new THREE.Scene();

const addText = (text, color) => {
	const textGeometry = new TextGeometry( text, {
		font: font,
		size: 0.5,
		height: 0,
		curveSegments: 2,
		bevelEnabled: false,
	} );
	const textMaterial = new THREE.MeshBasicMaterial({color: color})
	const textMesh = new THREE.Mesh(textGeometry, textMaterial)
	scene.add(textMesh)
	return textMesh
}

const windowRatio = window.innerWidth / window.innerHeight
const camera = new THREE.OrthographicCamera(-windowRatio * 10, windowRatio * 10, 10, -10, 0.1,1000)
camera.position.set(0, 3, 15)

// 假設圖表拿到這筆資料
const data = [
	{rate: 14.2, name: 'Advanced Digital Camera'},
	{rate: 32.5, name: 'Full Frame Digital Camera'},
	{rate: 9.6, name: 'Lens Adapter'},
	{rate: 18.7, name: 'Slim Digital Camera'},
	{rate: 21.6, name: 'Slr Digita Camera'},
	{rate: 3.4, name: 'Macro Zoom Lens'},
]

// 我準備了簡單的色票，作為圓餅圖顯示用的顏色
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

const createPie = (startAngle, endAngle, color, depth, legend, rate) => {
	const curve = new THREE.EllipseCurve(
		0,0,
		5,5,
		startAngle, endAngle,
		false,
		0
	)
	const text = addText(`${legend}: ${rate}%`, color)
	const curvePoints = curve.getPoints(50)
	const shape = new THREE.Shape(curvePoints)
	shape.lineTo(0,0)
	shape.closePath()
	const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
		depth: depth*2,
		steps: 1,
		bevelEnabled: true,
		bevelThickness: 0.2,
		bevelSize: 0.2,
		bevelOffset: 0,
		bevelSegments: 6
	  })
	const middleAngle = (startAngle + endAngle) / 2
	const x = Math.cos(middleAngle)
	const y = Math.sin(middleAngle)
	const textDistance = 8
	text.geometry.translate(x*textDistance,y*textDistance,0)
	text.geometry.translate(x-([...`legend: ${rate}%`].length)*0.3,y,0)
	shapeGeometry.translate(x*0.2, y*0.2, 0)
	const shapeMaterial = new THREE.MeshStandardMaterial({color: color, wireframe:false})
	const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
	scene.add(mesh)
	return {pieMesh: mesh, pieText: text}
}


const dataToPie = (data) => {
	let sum = 0
	data = data.sort((a,b) => b.rate - a.rate)
	const pieTexts = []
	let pieMeshes = []
	data.forEach( (datium,i) => {
		const radian = datium.rate/100 * (Math.PI * 2)
		const {pieMesh, pieText} = createPie(sum, radian+sum, colorSet[i], radian, datium.name, datium.rate)
		pieTexts.push(pieText)
		pieMeshes.push(pieMesh)
		sum+=radian
	})
	return {pieMeshes, pieTexts}
}

const {pieMeshes, pieTexts} = dataToPie(data)

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


const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

// 在camera, renderer宣後之後加上這行
new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color(0xf9f9f9)
function animate() {
	pieTexts.forEach( text => {
		text.lookAt(...new THREE.Vector3(0,0,1).lerp(camera.position, 0.05).toArray())
	})
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();
})