import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 0, 30)
const control = new OrbitControls(camera, renderer.domElement);

control.target.set(0,0,0)
control.update()

const addSphere = () => {
	const vertex = document.getElementById('vertexShader').innerHTML
	const fragment = document.getElementById('fragmentShader').innerHTML
    const geo = new THREE.SphereGeometry(5,50,50)
    const mat = new THREE.ShaderMaterial({
		vertexShader: vertex,
		fragmentShader: fragment,
	})
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    return mesh
}

addSphere()

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();