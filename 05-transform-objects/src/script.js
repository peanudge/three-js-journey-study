import './style.css'
import * as THREE from 'three'

console.log("Hello Three.js")

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

const group = new THREE.Group();
group.position.y = 1
group.scale.y = 2
group.rotation.y = 1
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
)
cube2.position.x = -2;
group.add(cube2)


const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 0x0000ff})
)
cube3.position.x = 2;
group.add(cube3)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

// Scale
mesh.scale.set(2, 0.5, 0.5);

// 오일러 회전
mesh.rotation.set( Math.PI / 2, Math.PI / 2,  Math.PI / 2);
// mesh.rotation.set(0, Math.PI / 2, 0);

// Problem: Gimbal Lock
// https://homoefficio.github.io/2015/07/17/Gimbal-Lock/
//김벌락은 3차원 공간에서 오일러 각 회전을 적용할 때, 특정 회전 상황에서 세 축 중 두 축이 겹치는 현상이다.

// Axes Helper
const axesHelper = new THREE.AxesHelper( 10 );
scene.add(axesHelper);

// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;
mesh.position.set(0.7, -0.6, 1)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.position.set(0,0,3)

scene.add(camera)  


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)