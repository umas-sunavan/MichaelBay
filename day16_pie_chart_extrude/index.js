import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@latest/examples/jsm/geometries/TextGeometry.js';
const loader = new FontLoader();
loader.load( 'jf-openhuninn-1.1_Regular_cities.json', function ( font ) {

const scene = new THREE.Scene();
const windowRatio = window.innerWidth / window.innerHeight
const camera = new THREE.OrthographicCamera(-windowRatio * 10, windowRatio * 10, 10, -10, 0.1,1000)
camera.position.set(0, 3, 15)

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

const createPie = (startAngle, endAngle, color, depth, rate, name) => {
	const curve = new THREE.EllipseCurve(
		0,0,
		5,5,
		startAngle, endAngle,
		false,
		0
	)
	console.log(rate);
	const text = addText(rate + '', color)
	
	const curvePoints = curve.getPoints(50)
	const shape = new THREE.Shape(curvePoints)
	shape.lineTo(0,0)
	shape.closePath()
	const shapeGeometry = new THREE.ExtrudeGeometry(shape, {
		steps: 1,
		depth: depth*2,
		bevelEnabled: true,
		bevelThickness: 0.2,
		bevelSize: 0.2,
		bevelOffset: 0,
		bevelSegments: 6
	  })
	  const middleAngle = (startAngle + endAngle) / 2
      const theta = middleAngle
      const x = Math.cos(theta)
      const y = Math.sin(theta)
	  text.geometry.translate(x*8.5,y*8.5,0)
	  text.geometry.translate(x-3,y-1,0)
      shapeGeometry.translate(x*0.2, y*0.2, 0)
	const shapeMaterial = new THREE.MeshStandardMaterial({color: color})
	const mesh = new THREE.Mesh(shapeGeometry, shapeMaterial)
	return {pie: mesh, text}
}

const createChart = (data) => {
	let sum = 0
	const group = new THREE.Group()
	const texts = []
	data = data.sort((a,b) => b.rate - a.rate)
	data.forEach( (datium,i) => {
		const radian = datium.rate/100 * (π * 2)
		const {pie, text} = createPie(sum, radian+sum, colorSet[i], radian, datium.rate, datium.name)
		console.log(pie);
		group.add(pie)
		texts.push(text)
		sum+=radian
	})
	console.log(texts);
	return {chart: group, texts}
}

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.9)
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
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
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

const addText = (text, color) => {
	const textGeometry = new TextGeometry( text, {
		font: font,
		size: 2,
		height: 0.01,
		curveSegments: 6,
		bevelEnabled: false,
		bevelThickness: 10,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	} );
	const textMaterial = new THREE.MeshBasicMaterial({color: color})
	const textMesh = new THREE.Mesh(textGeometry, textMaterial)
	scene.add(textMesh)
	return textMesh
}

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
new OrbitControls(camera, renderer.domElement);

const π = Math.PI


const {chart, texts} = createChart(data)
console.log(texts);

// chart.rotateX(π/2 * -0.6)
// chart.rotateY(π/2 * 0.2)

scene.add(chart)


scene.background = new THREE.Color(0xf9f9ef)
function animate() {
	texts.forEach( text => {
		text.lookAt(...new THREE.Vector3(0,0,1).lerp(camera.position, 0.05).toArray())
	})
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();

})