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

// 錯誤：依序形變，這樣順序相反會有差別
cube.geometry.translate(5,0,0)
cube.geometry.scale(2,1,1)

// 給定單位矩陣（不會有變化）
// const matrixArray = [
// 	1, 0, 0, 0,
// 	0, 1, 0, 0,
// 	0, 0, 1, 0,
// 	0, 0, 0, 1
// ]
// const matrix = new THREE.Matrix4().set(...matrixArray)
// cube.applyMatrix4(matrix)

// 給定12個參數來行變
// const tx = 5
// const ty = 0
// const tz = 0

// const sx = 2
// const sy = 1
// const sz = 1
// const matrixArray = [
// 	sx, 0, 0, tx,
// 	0, sy, 0, ty,
// 	0, 0, sz, tz,
// 	0, 0, 0, 1
// ]
// const matrix = new THREE.Matrix4().set(...matrixArray)
// cube.applyMatrix4(matrix)

// 矩陣相乘
// const translationMatrix = new THREE.Matrix4().makeTranslation(5,0,0)
// const scaleMatrix = new THREE.Matrix4().makeScale(2,1,1)
// const combineMatrix = translationMatrix.multiply(scaleMatrix)
// cube.applyMatrix4(combineMatrix)

// 錯誤：這樣順序仍然會有差異
// const translationMatrix = new THREE.Matrix4().makeTranslation(5,0,0)
// const rotateMatrix = new THREE.Matrix4().makeScale(2,1,1)
// cube.applyMatrix4(translationMatrix)
// cube.applyMatrix4(rotateMatrix)

// 錯誤：這樣Translation就被Rotation蓋掉了
// const wrongMatrix2 = new THREE.Matrix4().makeTranslation(5,0,0).makeScale(2,1,1)
// cube.applyMatrix4(wrongMatrix2)

function animate() {
	// cube.rotation.y += 0.1
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();