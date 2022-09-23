import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 15)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshNormalMaterial({color: 0x0000ff})
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


// - addVectors

// const v1 = new THREE.Vector3(10,5,0)
// const v2 = new THREE.Vector3(2,6,4)
// const a = new THREE.Vector3(0,0,0).addVectors(v1, v2)
// console.log(a);
// // Vector3 {x: 12, y: 11, z: 4}

// - addScalar
// const v = new THREE.Vector3(10,5,0)
// const a = v.addScalar(5)
// console.log(a);

// - angleTo
// const v1 = new THREE.Vector3(0,5,0)
// const v2 = new THREE.Vector3(5,0,0)
// const a = v1.angleTo(v2)
// console.log(a);
// 1.5707963267948966
// = 0.5 π
    
// - clampLength
// const v = new THREE.Vector3(3,4,0)
// v.clampLength(10,12)
// console.log(v);
// Vector3 {x: 6.000000000000001, y: 8, z: 0}

// - distanceTo
// const v1 = new THREE.Vector3(7,24,0)
// const v2 = new THREE.Vector3(14,48,0)
// const a = v1.distanceTo(v2)
// console.log(a);

// - length
// const v1 = new THREE.Vector3(5,12,0)
// const a = v1.length()
// console.log(a);
// 13

// // - lerp
// const v1 = new THREE.Vector3(0,0,0)
// const v2 = new THREE.Vector3(10,10,10)
// const a = v1.lerp(v2,0.25)
// console.log(a);
// // Vector3 {x: 2.5, y: 2.5, z: 2.5}

// - multiplyScalar
// const v = new THREE.Vector3(9,40,0)
// const a = v.multiplyScalar(2)
// console.log(a);
// Vector3 {x: 18, y: 80, z: 0}

// - dot
const v1 = new THREE.Vector3(1,0,0)
const v2 = new THREE.Vector3(0.8,0.6,0)
const a = v1.dot(v2)
console.log(a);
// 0.8

// - cross
// const v1 = new THREE.Vector3(1,0,0)
// const v2 = new THREE.Vector3(0.8,0.6,0)
// const a = v1.cross(v2)
// console.log(a);
// Vector3 {x: 0, y: 0, z: 0.6}



function animate() {
	// cube.rotation.y += 0.1
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();