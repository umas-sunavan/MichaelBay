import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshNormalMaterial({color: 0x0000ff})
// const matrix = new THREE.Matrix4().makeTranslation(0, 0, 0).makeRotationZ(Math.PI/4);
// geometry.applyMatrix4(matrix)
// geometry.translate(5,0,0)
// geometry.scale(2,1,1)
geometry.rotateX(Math.PI / 4)
// let rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2.0);
// let transformation = new THREE.Matrix4().makeTranslation(0, 5, 0);

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
const matrixArray = [
	2, 0, 0, 5,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1
]

const matrix = new THREE.Matrix4().set(...matrixArray)
cube.applyMatrix4(matrix)
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();