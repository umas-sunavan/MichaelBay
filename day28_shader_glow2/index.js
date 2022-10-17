import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'https://unpkg.com/three@latest/examples/jsm/helpers/VertexNormalsHelper.js';
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 0, 30)
new OrbitControls(camera, renderer.domElement);

const addSphere = async () => {
	const vertex = document.getElementById('vertexShader').innerHTML
	const fragment = document.getElementById('fragmentShader').innerHTML
    const geo = new THREE.SphereGeometry(5,50,50)
    const mat = new THREE.ShaderMaterial({
		fragmentShader: fragment,
		vertexShader: vertex
	  })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
	const helper = new VertexNormalsHelper( mesh, 1, 0xff0000 );
	scene.add( helper );
    return mesh
}

(async () => addSphere())()

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();