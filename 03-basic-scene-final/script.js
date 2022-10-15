
// Scene
const scene = new THREE.Scene();

// Red cube
const geometry = new THREE.BoxGeometry(1, 1, 1); 
const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const sizes= {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); // fov: 75
camera.position.z = 2;
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl'); 
const renderer = new THREE.WebGLRenderer({ // default transparent background
    canvas
})
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);

const fovRangeInput = document.querySelector(".fov-range-input")
console.log("Initial FOV: ", camera.fov);
fovRangeInput.value = camera.fov;

fovRangeInput.addEventListener('change', (e) => {
    console.log("FOV: ", e.target.value);
    camera.fov = e.target.value;
    camera.updateProjectionMatrix(); // Not work.
});





