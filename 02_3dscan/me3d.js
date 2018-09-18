/* me 3d */

// global threejs variables
let container, renderer, camera, scene;
let controls, obj_loader;

window.addEventListener('load', init);

function init(){
	container = document.querySelector('#sketch');
	let wid = window.innerWidth;
	let hei = window.innerHeight;

	// THREE INITIALIZATION
	renderer = new THREE.WebGLRenderer({ });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(wid, hei);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x000 );

	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	camera.position.set( -10, 0, 0 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();

	obj_loader = new THREE.OBJLoader();

	window.addEventListener('resize', onWindowResize, true );

	createEnvironment();
	animate();
}



// EVENTS
function onWindowResize(){
  let wid = window.innerWidth;
  let hei = window.innerHeight;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wid, hei);
	camera.aspect = wid/hei;
  camera.updateProjectionMatrix();
}



// ANIMATION
function animate() {
  renderer.setAnimationLoop( render );
}
function render(){
	controls.update();

  renderer.render( scene, camera );
}



// ENVIRONMENT
function createEnvironment(){
	// REFERENCE PLANE
	let plane_geo = new THREE.PlaneGeometry(200, 200, 20, 20);
	let plane_mat = new THREE.MeshBasicMaterial({
		color: 0x555555,
		side: THREE.DoubleSide,
		wireframe: true
	});
	let ref_plane = new THREE.Mesh(plane_geo, plane_mat);
	ref_plane.rotation.x = Math.PI/2;
	ref_plane.position.set(0, -20, 0);
	scene.add(ref_plane);

	// LIGHTS!
	let d_light = new THREE.DirectionalLight(0xffffff, 1);
	scene.add(d_light);

	let p_light = new THREE.PointLight(0xffffff, 1.5, 1000, 2);
	p_light.position.set(0, 0, -500);
	scene.add(p_light);

  // 3d MODEL

}
