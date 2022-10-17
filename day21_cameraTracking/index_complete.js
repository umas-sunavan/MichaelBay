import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { Reflector } from 'https://unpkg.com/three@latest/examples/jsm/objects/Reflector';
import MeshReflectorMaterial from './MeshReflectorMaterial.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass';

// console.log(MeshReflectorMaterial);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.zoom = 0.4
camera.updateProjectionMatrix();
camera.position.set(7, 15, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true

const addCube = (w, h, d, color, side) => {
	const geo = new THREE.BoxGeometry(w, h, d)
	const mat = new THREE.MeshStandardMaterial({ color: color, side: side })
	const mesh = new THREE.Mesh(geo, mat)
	scene.add(mesh)
	return mesh
}

const column1 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide)
column1.position.set(-25, 0, -35)
const column2 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide)
column2.position.set(25, 0, -35)
const column3 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide)
column3.position.set(25, 0, 35)
const column4 = addCube(4, 50, 4, 0x22222f, THREE.FrontSide)
column4.position.set(-25, 0, 35)




let cabinet
let agv
let agvLight

const addCabinetRow = () => {
	return new Array(18).fill(0).map((o, i) => {
		const clone = cabinet.clone()
		const gap = Math.floor(i / 6)
		clone.position.set(0, 0, i * (4.2) + gap * 15 + 2)
		scene.add(clone)
		return clone
	})
}

const addCabinetColumn = (count) => {
	const row = addCabinetRow()
	row.forEach(cabinet => {
		const gap = Math.floor(count / 2) * 15
		cabinet.translateX(6 * count + gap - 45)
		cabinet.translateZ(-50)
		const lookPX = count%2 === 0
		if (lookPX) {
			cabinet.rotateY(Math.PI)
		}
	})
}

const addCabinetModels = async () => {
	const path = 'https://storage.googleapis.com/umas_public_assets/michaelBay/day20/cabinet_mapping.gltf'
	const gltf = await new GLTFLoader().loadAsync(path);
	cabinet = gltf.scene
	console.log(gltf.scene);
	gltf.scene.traverse( object => {
		if (object.isMesh) {
			object.material.map = null
			object.material.normalMap = null
			object.castShadow = true
			object.receiveShadow = true
		}
	} )
	cabinet.scale.set(0.35,0.35,0.35)
	new Array(8).fill(0).map((o, count) => {
		addCabinetColumn(count)
	})
}

const addAgvModels = async () => {
	const path = 'detailed_draft_xyz_homework/scene.gltf'
	const gltf = await new GLTFLoader().loadAsync(path);
	agv = gltf.scene
	const pointLight = addPointLight(0,10 / 0.04,4 / 0.04, 0xffff00)
	gltf.scene.traverse( object => {
		if (object.isMesh) {
			object.castShadow = true
		}
	} )
	agv.scale.set(0.04,0.04,0.04)
	scene.add(agv)
	agv.add(pointLight)
	agvLight = pointLight
}


(async () => {
	await addCabinetModels()
	await addAgvModels()
})()

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 0.1)
	scene.add(light)
}

// 新增點光
const addPointLight = (x,y,z,color = 0xffffff) => {
	const pointLight = new THREE.PointLight(color, 1)
	scene.add(pointLight);
	pointLight.position.set(x,y,z)
	pointLight.castShadow = true
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 3, 0xffff00)
	scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
	return pointLight
}

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0, 2, 3)
control.update()

addAmbientLight()
addPointLight(10, 18, -10)
addPointLight(10, 18, 10)


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
}

const addFadingMirror = (w, h) => {
	const geo = new THREE.PlaneGeometry(w, h, 1, 1)
	const mat = new THREE.MeshStandardMaterial()
	const mesh = new THREE.Mesh(geo, mat)
	mesh.material = new MeshReflectorMaterial(renderer, camera, scene, mesh, fadingReflectorOptions);
	scene.add(mesh);
	return mesh;
}

const addPlane = (w, h) => {
	const geo = new THREE.PlaneGeometry(w, h, 1, 1)
	const mat = new THREE.MeshStandardMaterial()
	const mesh = new THREE.Mesh(geo, mat)
	mesh.receiveShadow = true
	scene.add(mesh);
	return mesh;
}

const fadingGround = addFadingMirror(120,120)
// const fadingGround = addPlane(120,120)
fadingGround.rotateX(Math.PI * -0.5)

const fadingWallZN = addFadingMirror(120, 30)
fadingWallZN.translateY(15)
fadingWallZN.translateZ(-59)

const fadingWallZP = addFadingMirror(120, 30)
fadingWallZP.translateY(15)
fadingWallZP.translateZ(59)
fadingWallZP.rotateY(Math.PI)

const fadingWallXN = addFadingMirror(120, 30)
fadingWallXN.translateY(15)
fadingWallXN.rotateY(Math.PI * 0.5)
fadingWallXN.translateZ(-59)

const fadingWallXP = addFadingMirror(120, 30)
fadingWallXP.translateY(15)
fadingWallXP.translateX(59)
fadingWallXP.rotateY(Math.PI * -0.5)

const mouseOnDnc = new THREE.Vector3(0,0,0)
renderer.domElement.addEventListener( 'mousemove' ,event => {
	const mouseX = event.offsetX
	const w = renderer.domElement.width
	const mouseY = event.offsetY
	const h = renderer.domElement.height
	mouseOnDnc.setX(mouseX/w-0.5)
	mouseOnDnc.setY(-mouseY/h+0.5)
})

const cameraFollowAvg = () => {
	const length = agv.position.distanceTo(camera.position)
	if (length > 20) {
		const distance = new THREE.Vector3(0,0,0).subVectors(camera.position, agv.position)
		const distantNormal = distance.normalize()
		const followingPosition = distantNormal.multiplyScalar(20).add(new THREE.Vector3(2,0,2))
		const lerping = new THREE.Vector3(0,0,0).addVectors(agv.position, followingPosition)
		lerping.setY(15)
		camera.position.lerp(lerping, 0.01)
	}
}

const updateAvgPosition = (agv, time) => {
	const zRoute = Math.cos(time) * 30
	agv.position.set(0,0,zRoute)
}

const flickerLight = (time, light) => {
	if (time % 1 < 0.5) {
		light.visible = true
	}	else {
		light.visible = false
	}
}

let time = 0

let mouseOnFrustumTop = new THREE.Vector3(0,0,0)
const arrow = new THREE.ArrowHelper(mouseOnFrustumTop, new THREE.Vector3(0,0,0), 10, 0xffff00)
scene.add(arrow)
let primitiveTarget = new THREE.Vector3(0,0,0)
let idealTarget = new THREE.Vector3(0,0,0)
let lerpingTarget = new THREE.Vector3(0,0,0)

const updateMouseAffectTarget = () => {
	primitiveTarget.set(...agv.position.toArray())
	mouseOnFrustumTop = mouseOnDnc.clone().unproject(camera)
	const mouseOfNormalized = new THREE.Vector3().subVectors(
		mouseOnFrustumTop, 
		camera.position)
		.normalize();
	idealTarget.addVectors(mouseOfNormalized.multiplyScalar(20), primitiveTarget)
}

const updateMouseAffectLerping = () => lerpingTarget.lerp(idealTarget,0.1)
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (cabinet) {
		cabinet.rotation.y +=0.01
		fadingGround.material.update()
		fadingWallZN.material.update()
		fadingWallZP.material.update()
		fadingWallXN.material.update()
		fadingWallXP.material.update()
	}
	if (agv) {
		time+=0.01
		updateAvgPosition(agv, time)
		cameraFollowAvg()
		flickerLight(time, agvLight)
		updateMouseAffectTarget()
		updateMouseAffectLerping()
		control.target.set(...lerpingTarget.toArray())
		control.update()
	}
}
animate();