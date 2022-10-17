import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 30, 30)
new OrbitControls(camera, renderer.domElement);

const addSphere = () => {
	const vertex = document.getElementById('vertexShader').innerHTML
	const fragment = document.getElementById('fragmentShader').innerHTML
	const geo = new THREE.SphereGeometry(5, 15, 15)
	const mat = new THREE.ShaderMaterial({
		vertexShader: vertex,
		fragmentShader: fragment,
		uniforms: {
			uIntensity: {
				value: 0.5
			}
		}
	})
	const mesh = new THREE.Mesh(geo, mat)
	scene.add(mesh)
	return mesh
}

document.getElementById('intensity').addEventListener('input', event => {
	sphere.material.uniforms.uIntensity.value = +event.target.value
})

const sphere = addSphere()

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();