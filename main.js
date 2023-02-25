import "./style.css";

// main.js

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

document.querySelector("#app").appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#D2FFE5");

const CRATIO = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, CRATIO, 0.1, 1000);
camera.position.set(18, 12, 20);

const orbit = new OrbitControls(camera, renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xd2ffe5,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333, 2.5);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xd2ffe5, 1);
scene.add(spotLight);
spotLight.position.set(70, 100, 100);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const pathFox = new URL("./fox.glb", import.meta.url);

const loader = new GLTFLoader();
loader.load(pathFox.href, loadGLTF, null, (e) => console.log(e));
let mixer, clips;

function loadGLTF(gltf) {
  const model = gltf.scene;
  clips = gltf.animations;
  mixer = new THREE.AnimationMixer(model);
  scene.add(model);
  model.position.set(0, 4, 0);
  model.traverse((node) => (node.castShadow = true));

  clips.forEach((clip) => mixer.clipAction(clip).play());
  renderer.setAnimationLoop(animete);
}

function animete() {
  orbit.update();
  renderer.render(scene, camera);
  mixer.update(0.03);
}
