import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@latest/examples/jsm/controls/OrbitControls.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000a20);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
// camera.position.set(0, 0, 30);
camera.position.set(14, 30, 20); 
const control = new OrbitControls(camera, renderer.domElement);


control.target.set(0, 0, 0);
control.update();

const addSphere = () => {
  const vertex = document.getElementById("vertexShader").innerHTML;
  const fragment = document.getElementById("fragmentShader").innerHTML;
  const geo = new THREE.SphereGeometry(5, 50, 50);
  const myPosition = control.object.position.clone().normalize()
  const mat = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
		uniforms: {
		orbitcontrolPosition: {
			value: myPosition
		}
	}
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  return mesh;
};

const mesh = addSphere();

let cameraPosition = control.object.position.clone().normalize()
const onCameraChange = (event) => {
  const control = event.target
  cameraPosition = control.object.position.clone().normalize()
  mesh.material.uniforms.orbitcontrolPosition.value = cameraPosition
}
control.addEventListener('change', onCameraChange)


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
