import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2f2f2)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 30, 30)
const control = new OrbitControls(camera, renderer.domElement);

control.target.set(0, 0, 0)
control.update()

const addSquare = () => {
	const vertex = document.getElementById('vertexShader').innerHTML
	const fragment = document.getElementById('fragmentShader').innerHTML
	// 將螢幕座標的左下角、左上角、右上角、右下角轉成世界座標
	const lb = new THREE.Vector3(-1, -1, 0.8).unproject(camera)
	const lt = new THREE.Vector3(-1, 1, 0.8).unproject(camera)
	const rt = new THREE.Vector3(1, 1, 0.8).unproject(camera)
	const rb = new THREE.Vector3(1, -1, 0.8).unproject(camera)
	// 在世界座標建立一個平面
	const vertices = new Float32Array([
		// 一個矩形平面至少要有兩個三角面，以下是第一個三角面的三個頂點
		...lb.toArray(),
		...rb.toArray(),
		...rt.toArray(),
		// 以下是第二個三角面的三個頂點
		...rt.toArray(),
		...lt.toArray(),
		...lb.toArray()
	]);
	// 將世界座標組成一個平面
	const geo = new THREE.BufferGeometry()
	// 將三角面組合成形狀
	geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
	const mat = new THREE.ShaderMaterial({
		vertexShader: vertex,
		fragmentShader: fragment,
		uniforms: {
			u_resolution: {
				value: [window.innerHeight,window.innerWidth]
			}
		}
	})
	const mesh = new THREE.Mesh(geo, mat)
	scene.add(mesh)
	return mesh
}


const mesh = addSquare()

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();