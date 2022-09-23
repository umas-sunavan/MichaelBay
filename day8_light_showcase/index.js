import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@latest/examples/jsm/loaders/GLTFLoader';
import { UnrealBloomPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/UnrealBloomPass';
import { EffectComposer } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'https://unpkg.com/three@latest/examples/jsm/postprocessing/RenderPass';
import { RectAreaLightHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@latest/examples/jsm/lights/RectAreaLightUniformsLib.js';

let composer;
const initComposer = () => {



// const renderScene = new RenderPass( scene, camera );
// const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.5, 0.5, 0.5 );

// const params = {
// 	exposure: 0,
// 	bloomStrength: 0,
// 	bloomThreshold: 0,
// 	bloomRadius: 0
// };

// bloomPass.threshold = params.bloomThreshold;
// bloomPass.strength = params.bloomStrength;
// bloomPass.radius = params.bloomRadius;
// bloomPass.exposure = params.exposure;

// composer = new EffectComposer( renderer );
// composer.addPass( renderScene );
// composer.addPass( bloomPass );

}



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
// const camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 2000 );
// camera.zoom =40
camera.updateProjectionMatrix();
// 已經存在的鏡頭位置設定
camera.position.set(-5, 5, 5)

const renderer = new THREE.WebGLRenderer( );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true

const planeGeometry = new THREE.BoxGeometry(100,100,100,10,10)
const planeMaterial = new THREE.MeshStandardMaterial( { side: THREE.BackSide, color: 0xcccccc})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
plane.position.set(0,49.999,0)
scene.add(plane)
plane.receiveShadow = true
plane.castShadow = true

const geometry = new THREE.SphereGeometry(10,50,50)
console.log(geometry);
// 帶入材質，設定內外面
let mixer

// Parrot_Idle_A
// const gltf = new GLTFLoader().load('Parrot_Idle_A.gltf', gltf => {
// 	console.log(gltf.scene);
// 	gltf.scene.scale.set(5,5,5)
// 	// Create an AnimationMixer, and get the list of AnimationClip instances
// 	mixer = new THREE.AnimationMixer( gltf.scene );
// 	const clips = gltf.animations;
// 	console.log(clips);


// 	// Play a specific animation
// 	const clip = THREE.AnimationClip.findByName( clips, 'Animation' );
// 	const action = mixer.clipAction( clip );
// 	console.log(action);
// 	action.timeScale = 1/100
// 	action.play();

// 	// Play all animations
// 	clips.forEach( function ( clip ) {
// 		mixer.clipAction( clip ).play();
// 	} );

// 	gltf.scene.traverse( object => {
// 		if (object.isMesh) {
// 			object.material.roughness = 1
// 			object.material.metalness = 0
// 			object.material.transparent = false
// 			// object.receiveShadow = true
// 			object.castShadow = true
// 			// object.frustumCulled = false
// 			console.log(object.material);
// 		}
// 	})
// 	scene.add(gltf.scene)
// })
// world tow sides check2.gltf
const gltf = new GLTFLoader().load('world tow sides check2.gltf', gltf => {
	console.log(gltf.scene);

	gltf.scene.traverse( object => {
		if (object.isMesh) {
			object.material.roughness = 1
			object.material.metalness = 0
			object.material.transparent = false
			// object.receiveShadow = true
			object.castShadow = true
			// object.frustumCulled = false
			console.log(object.material);
		}
	})
	scene.add(gltf.scene)
})

console.log(gltf);
const material = new THREE.MeshStandardMaterial()
// 新增環境光
const light = new THREE.AmbientLight(0xffffff,1)
scene.add(light)

const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);



// 新增平行光
const directionalLight = new THREE.DirectionalLight(0xffffff,2)
directionalLight.position.set(20,20,0)
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
directionalLight.target.position.set(0,0,0);
directionalLight.target.updateMatrixWorld();
// 更新Helper
lightHelper.update();

// const width = 10;
// const height = 10;
// const intensity = 1;
// const rectLight = new THREE.RectAreaLight( 0xffffff, 40,  width, height );
// rectLight.position.set( 20, 20, 0 );
// rectLight.lookAt( 0, 0, 0 );
// scene.add( rectLight )

// const rectLightHelper = new RectAreaLightHelper( rectLight );
// rectLight.add( rectLightHelper );

// const hemisphereLight = new THREE.HemisphereLight( 0xffff00, 0xff00ff, 8 ); scene.add( hemisphereLight );


// // 新增點光
// const pointLight = new THREE.PointLight(0xffffff, 1)
// scene.add(pointLight);
// pointLight.position.set(20,20,0)
// pointLight.castShadow = true
// // 新增Helper
// const lightHelper = new THREE.PointLightHelper(pointLight, 20, 0xffff00)
// // scene.add(lightHelper);
// // 更新Helper
// lightHelper.update();


new OrbitControls( camera, renderer.domElement );

const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );
let deltaSeconds = 0

initComposer()
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	if (mixer) {
		deltaSeconds+=1
		mixer.update( 1 );

	}
	if(composer){

	// composer.render();
	}
}
animate();