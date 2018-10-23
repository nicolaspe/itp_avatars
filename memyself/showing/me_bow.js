/* me 3d */

// global threejs variables
let container, renderer, camera, scene;
let controls, obj_loader, tex_loader;
let me3d, loaded;
let p_light;
let timekeep = 0;
let voice;
let me_text = "I vaguely remember the first time seeing the image of David Bowie as Ziggy Stardust on television. it was mesmerizing. seeing that someone could dress, act and be like that. Since then and for a long time I looked at androgyny as something to strive for. I was a child, so I didn't know how to go there, nor did it concern me that much. but my genes drove me to another place. an ideal unfulfilled, at least on the physical space.";

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
	scene.background = new THREE.Color( 0x111111 );

	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	camera.position.set( 30, 50, 90 );
	camera.rotation.set( -0.3579, 0.313, 0.01146 );

  tex_loader = new THREE.TextureLoader();
	obj_loader = new THREE.OBJLoader();
	loaded = false;

	voice = new p5.Speech();
	voice.onEnd = speaker;

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
function render() {
  timekeep += 0.005;
  rotate_me();

  renderer.render( scene, camera );
}

function rotate_me() {
	if(loaded){
  	me3d.rotation.y = timekeep;
	}
}

function speaker(){
	voice.speak( me_text );
}



// ENVIRONMENT
function createEnvironment(){
	// REFERENCE PLANE
	let plane_geo = new THREE.PlaneGeometry(100, 100, 20, 20);
	let plane_mat = new THREE.MeshBasicMaterial({
		color: 0x555555,
		side: THREE.DoubleSide,
		wireframe: true
	});
	let ref_plane = new THREE.Mesh(plane_geo, plane_mat);
	ref_plane.rotation.x = Math.PI/2;
	ref_plane.position.set(0, -40, 0);
	scene.add(ref_plane);

	// LIGHTS!
	let d_light = new THREE.DirectionalLight(0xffffff, 1);
	scene.add(d_light);

  let a_light = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(a_light);

	p_light = new THREE.PointLight(0xffffff, 1.5, 1000, 2);
	p_light.position.set(0, 10, -500);
	scene.add(p_light);

  // model texture
	me3d = "";
  load_model();

}


function load_model() {
  tex_loader.load(
    // URL
    '../models/nico_morphed_bow_texture.png',
    // callback
    function( texture ){
      me_mat = new THREE.MeshLambertMaterial({
  			map: texture,
  			side: THREE.DoubleSide,
  		});

      // load 3d model mesh
      obj_loader.load(
        // URL
        '../models/nico_morphed_bow.obj',
        // called when resource is loaded
      	function ( object ) {
          me3d = object;
          me3d.traverse( function ( node ){
            // For any meshes in the model, add our material.
            if ( node.isMesh ) node.material = me_mat;
          } );
					me3d.scale.set( 0.54, 0.54, 0.54 );
          me3d.position.set( 0, -40, 0 );
      		scene.add( me3d );
					loaded = true;

      	},
      	// called when loading is in progresses
      	function ( xhr ) {
      		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      	},
      	// called when loading has errors
      	function ( error ) {
      		console.log( 'An error happened' );
      	}
      );

    }
  );
	speaker();

}
