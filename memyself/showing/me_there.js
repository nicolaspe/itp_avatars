/* me 3d */

// global threejs variables
let container, renderer, camera, scene;
let controls, obj_loader, tex_loader;
let me3d, loaded;
let p_light;
let timekeep = 0;
let voice;
let me_text = "finally, this representation completes this set: my physical body itself. so here I am. The physical representation, the embodiment of my persona. Inside this fully textured and sometimes functional avatar you can find the essence of Nicolas. It's there, muddled between anxieties, dreams, judgements and more, but it's there. But is this more valid than the previous ones? the fact that I'm 'stuck' on it is not enough to say it is. if we use bodies to express ourselves, this one does only an OK job. my male coded body for this non binary person.";

window.addEventListener('load', init);

function init(){
	voice = new p5.Speech();
	voice.onEnd = speaker;

	speaker();
}

function speaker(){
	voice.speak( me_text );
}
