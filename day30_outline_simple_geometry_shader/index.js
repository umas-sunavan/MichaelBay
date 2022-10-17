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

(async () => {

	const control = new OrbitControls(camera, renderer.domElement);

	const addSphere = (side = THREE.FrontSide, color, size = 3) => {
		const vertex = document.getElementById('vertexShader').innerHTML
		const fragment = document.getElementById('fragmentShader').innerHTML
		const geo = new THREE.TorusKnotGeometry(10, size, 100, 16)
		const myPosition = control.object.position.clone().normalize()
		const mat = new THREE.ShaderMaterial({
			side: side,
			fragmentShader: fragment,
			vertexShader: vertex,
			uniforms: {
				orbitcontrolPosition: {
					value: myPosition
				}
			},
		})
		const mesh = new THREE.Mesh(geo, mat)
		return mesh
	}

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

	const mesh = await addSphere()
	scene.add(mesh)
	const outline = await addSphere()
	const vertex = document.getElementById('vertexShader').innerHTML
	const fragment = document.getElementById('fragmentShader').innerHTML
	const myPosition = control.object.position.clone().normalize()
	const outlineMaterial = new THREE.ShaderMaterial({
		side: THREE.BackSide,
		fragmentShader: fragment,
		vertexShader: vertex,
		uniforms: {
			orbitcontrolPosition: {
				value: myPosition
			}
		},
	})
	outline.traverse( mesh => {
		if (mesh.isMesh) {
			mesh.material = outlineMaterial
			mesh.material.onBeforeCompile = shader => {
				const vertexToken = `gl_Position=projectionMatrix*modelViewMatrix*vec4(position, 1.0);`
				const vertexUpdate = `gl_Position=projectionMatrix*modelViewMatrix*vec4(position+normal*0.5, 1.0);`
				shader.vertexShader = shader.vertexShader.replace(vertexToken, vertexUpdate)
				const fragmentToken = `gl_FragColor=vec4(atmosphere,0.) + vec4(0.,0.,0.01,1.);`
				const fragmentUpdate = `gl_FragColor=vec4(1.,1.,1.,1.);`
				shader.fragmentShader = shader.fragmentShader.replace(fragmentToken, fragmentUpdate)
			}

		}
	})
	scene.add(outline)
	// const onCameraChange = (event) => {
	// 	const control = event.target
	// 	const cameraPosition = control.object.position.clone().normalize()
	// 	mesh.material.uniforms.orbitcontrolPosition.value = cameraPosition
	// }
	// control.addEventListener('change', onCameraChange)


})()



function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);

}
animate();