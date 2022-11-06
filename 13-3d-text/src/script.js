import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
 
/**
 * Directly import
 */
// import typefaceFont from '/static/fonts/helvetiker_regular.typeface.json'
// console.log(typefaceFont);


/**
 * Use Font Loader
 */

const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
     
	const textGeometry = new TextGeometry('Door', {
		font,
		size: 0.5,
		height: 0.2,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.04,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 5
    });

    // textGeometry.computeBoundingBox(); // text의 사이즈를 나타내는 box를 계산해냄. 이걸 이용해 text를 적절한 위치로 이동시킬 수 있음.
    // textGeometry.translate(
    //     -textGeometry.boundingBox.max.x * 0.5,
    //     -textGeometry.boundingBox.max.y * 0.5,
    //     -textGeometry.boundingBox.max.z * 0.5)
    
    // textGeometry.computeBoundingBox();
    // console.log(textGeometry.boundingBox); // have tiny diff from center, because of bevel size

    // textGeometry.translate(
    //     -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //     -(textGeometry.boundingBox.max.z - 0.03) * 0.5)

    textGeometry.center();
    
    const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture}) 
    // textMaterial.wireframe = true;
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);

    console.time("Door")

    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0;
    material.roughness = 1;
    material.map = doorColorTexture;
    material.aoMap = doorAmbientOcclusionTexture;
    material.aoMapIntensity = 1;
    material.displacementMap = doorHeightTexture;
    material.displacementScale = 0.05;
    material.metalnessMap = doorMetalnessTexture;
    material.roughnessMap = doorRoughnessTexture;
    material.normalMap = doorNormalTexture;
    material.normalScale.set(0.5,0.5);
    material.alphaMap = doorAlphaTexture;
    material.transparent = true;
    material.side = THREE.DoubleSide;

    const doorGeometry = new THREE.PlaneGeometry(1, 1, 20, 45);
    
    for (let i = 0; i < 1000; i++) { 
        const plane = new THREE.Mesh(
            doorGeometry,
            material
        )
        
        plane.geometry.setAttribute(
            'uv2',
            new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
        )
        
        plane.position.x = (Math.random() - 0.5) * 10;
        plane.position.y = (Math.random() - 0.5) * 10;
        plane.position.z = (Math.random() - 0.5) * 10;

        plane.rotation.x = Math.random() * Math.PI;
        plane.rotation.y = Math.random() * Math.PI;
        // plane.rotation.z = Math.random() * Math.PI;

        const scale = Math.random();
        plane.scale.set(scale,scale,scale)
 
        scene.add(plane); 
    }
    console.timeEnd("Door")

})


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
 
/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
// const matcapTexture = textureLoader.load('/textures/matcaps/1.png');

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const matcapTexture = textureLoader.load("/textures/matcaps/1.png"); 
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
 * Lights
 */

 const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
 scene.add(ambientLight);
 
 const pointLight = new THREE.PointLight(0xffffff, 0.5);
 pointLight.position.x = 2;
 pointLight.position.y = 3;
 pointLight.position.z = 4;
 scene.add(pointLight);

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()