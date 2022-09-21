import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 15)

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

function animate() {
    parent.rotation.y += 0.01;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();