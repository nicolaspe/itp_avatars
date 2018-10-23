/* me 3d */

// global threejs variables
let container, renderer, camera, scene;
let controls, fbx_loader, tex_loader;
let me3d, mixers;
let p_light;
let clock;

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
	scene.background = new THREE.Color( 0x222 );

	camera = new THREE.PerspectiveCamera(60, wid/hei, 0.1, 5000);
	camera.position.set( 7.4, 2.54, 19.49 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.update();

  tex_loader = new THREE.TextureLoader();
	fbx_loader = new THREE.FBXLoader();
  clock = new THREE.Clock();

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
	controls.update();

  if(mixers.length > 0){
    for( let i = 0; i < mixers.length; i++ ){
      mixers[i].update( clock.getDelta() );
    }
  }
  move_light();

  renderer.render( scene, camera );
}

function move_light() {
  let pos_x =  500. * Math.sin( timekeep );
  let pos_z = -500. * Math.cos( timekeep );

  p_light.position.set( pos_x, 10, pos_z );
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
	ref_plane.position.set(0, -10, 0);
	scene.add(ref_plane);

	// LIGHTS!
	let d_light = new THREE.DirectionalLight(0xffffff, 1);
	scene.add(d_light);

  let a_light = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(a_light);

	p_light = new THREE.PointLight(0xffffff, 1.5, 1000, 2);
	p_light.position.set(0, 10, -500);
	scene.add(p_light);

  // load fbx model and animaion
  mixers = [];
  load_model();
}


function load_model() {
  tex_loader.load(
    // URL
    '../animated/nico_normal.png',
    // callback
    function( texture ){
      me_mat = new THREE.MeshLambertMaterial({
  			map: texture,
  			side: THREE.DoubleSide,
  		});

      // load 3d model mesh
      fbx_loader.load(
        // URL
        '../animated/nico_normal_walk.fbx',
        // called when resource is loaded
      	function ( object ) {
          me3d = object;

          // animation
          me3d.mixer = mew THREE.AnimationMixer( me3d );
          mixers.push( me3d.mixer );
          let action = me3d.mixer.clipAction( me3d.animations[1] );
          action.play();

          me3d.traverse( function ( node ){
            // For any meshes in the model, add our material.
            if ( node.isMesh ) {
              node.material = me_mat;
              node.castShadow = true;
              node.receiveShadow = true;
            }
          } );
          // position and add!
          me3d.scale.set( 10, 10, 10 );
      		scene.add( me3d );
          camera.lookAt( me3d );
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

}
