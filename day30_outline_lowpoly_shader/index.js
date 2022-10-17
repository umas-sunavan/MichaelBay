import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/VertexNormalsHelper.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { OutlinePass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/OutlinePass';
import { EffectComposer } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/RenderPass';


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x4f4f4f)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(14, 30, 20);

// 新增點光
const addPointLight = (x, y, z, color = 0xffffff) => {
	const pointLight = new THREE.PointLight(0xffffff, 1)
	scene.add(pointLight);
	pointLight.position.set(x, y, z)
	pointLight.castShadow = true
	pointLight.shadow.bias = -0.001
	// 新增Helper
	const lightHelper = new THREE.PointLightHelper(pointLight, 3, 0xffff00)
	// scene.add(lightHelper);
	// 更新Helper
	lightHelper.update();
	return pointLight
}

// 新增環境光
const addAmbientLight = () => {
	const light = new THREE.AmbientLight(0xffffff, 1)
	scene.add(light)
}


addAmbientLight()

addPointLight(10, 10, 10);
let composer;
let book
let outlinePass;
(async () => {

	const control = new OrbitControls(camera, renderer.domElement);

	const addBook = async () => {
		const path = 'https://storage.googleapis.com/umas_public_assets/michaelBay/day30/book06%20outline.gltf'
		const gltf = await new GLTFLoader().loadAsync(path);
		const mesh = gltf.scene
		gltf.scene.traverse(object => {
			if (object.isMesh) {
				object.castShadow = true
				object.receiveShadow = true
			}
		})
		return mesh
	}

	book = await addBook()
	scene.add(book);

	const initComposer = () => {
        composer = new EffectComposer(renderer);
        var renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);
        outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        composer.addPass(outlinePass);
		outlinePass.selectedObjects = [book];
	}
	initComposer()


})()

function animate() {
	requestAnimationFrame(animate);
	if (composer) {
		composer.render();
		outlinePass.edgeStrength = 80
		outlinePass.edgeThickness = 4
		console.log(outlinePass.edgeStrength);
	}

}
animate();