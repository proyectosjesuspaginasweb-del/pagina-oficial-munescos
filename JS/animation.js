/*Efecto del nav al bajar*/

 const navAction = [
 {id: "nav-action", className: "is-scrolled"},
 {id: "nav-who-action", className: "is-scrolled-who"}
 ]

 const elementosDOM = navAction.map(item => ({
 	el: document.getElementById(item.id),
     className: item.className
 }));

     window.addEventListener("scroll", () =>{
     const scrollNav = window.scrollY;
     const isMobile = window.innerWidth <= 568;
	
     elementosDOM.forEach(({el, className}) =>{
         if (!isMobile && scrollNav > 100) {
             el.classList.add(className);
       } else {
        el.classList.remove(className);
    }
    });
});

/*active para menu despegable*/

/*active para menu despegable*/

// Seleccionamos el botón específico, no todo el contenedor
const btnAbrir = document.getElementById("activebtnav");
// Seleccionamos lo que queremos mostrar/ocultar
const menuOpciones = document.getElementById("navpeelable");
const containerimgnav = document.getElementById("containerimgnav");

btnAbrir.addEventListener("click", (event) => {

    menuOpciones.classList.toggle("scroll-action-nav");
    menuOpciones.classList.toggle("menu-open");
});

/*Efecto de size de xo*/

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,Draggable)
    let iteration = 0; // gets iterated when we scroll all the way to the end or start and wraps around - allows us to smoothly continue the playhead scrubbing in the correct direction.

// set initial state of items
gsap.set('.cards li', {xPercent: 400, opacity: 0, scale: 0});

const spacing = 0.1, // spacing of the cards (stagger)
	snapTime = gsap.utils.snap(spacing), // we'll use this to snapTime the playhead on the seamlessLoop
	cards = gsap.utils.toArray('.cards li'),
	// this function will get called for each element in the buildSeamlessLoop() function, and we just need to return an animation that'll get inserted into a master timeline, spaced
	animateFunc = element => {
		const tl = gsap.timeline();
		tl.fromTo(element, {scale: 0, opacity: 0}, {scale: 1, opacity: 1, zIndex: 100, duration: 0.5, yoyo: true, repeat: 1, ease: "power1.in", immediateRender: false})
		.fromTo(element, {xPercent: 400}, {xPercent: -400, duration: 1, ease: "none", immediateRender: false}, 0);
		return tl;
	},
	seamlessLoop = buildSeamlessLoop(cards, spacing, animateFunc),
	playhead = {offset: 0}, // a proxy object we use to simulate the playhead position, but it can go infinitely in either direction and we'll just use an onUpdate to convert it to the corresponding time on the seamlessLoop timeline.
	wrapTime = gsap.utils.wrap(0, seamlessLoop.duration()), // feed in any offset (time) and it'll return the corresponding wrapped time (a safe value between 0 and the seamlessLoop's duration)
	scrub = gsap.to(playhead, { // we reuse this tween to smoothly scrub the playhead on the seamlessLoop
		offset: 0,
		onUpdate() {
			seamlessLoop.time(wrapTime(playhead.offset)); // convert the offset to a "safe" corresponding time on the seamlessLoop timeline
		},
		duration: 0.5,
		ease: "power3",
		paused: true
	})

    function moverA(nuevoOffset) {
    gsap.to(playhead, {
        offset: nuevoOffset,
        duration: 0.5,
        ease: "power3",
        onUpdate() {
            // Esto mantiene el bucle infinito funcionando mientras se mueve
            seamlessLoop.time(wrapTime(playhead.offset));
        }
    });
}

/*aqui se sustituyo el scroll por que los botones hagan el afecto*/

// Sustituye tus botones por estos:
document.querySelector(".next").addEventListener("click", () => {
    moverA(playhead.offset + spacing);
});

document.querySelector(".prev").addEventListener("click", () => {
    moverA(playhead.offset - spacing);
});

/*aqui finaliza se sustituyo el scroll por que los botones hagan el afecto*/

	// converts a progress value (0-1, but could go outside those bounds when wrapping) into a "safe" scroll value that's at least 1 away from the start or end because we reserve those for sensing when the user scrolls ALL the way up or down, to wrap.
	progressToScroll = progress => gsap.utils.clamp(1, trigger.end - 1, gsap.utils.wrap(0, 1, progress) * trigger.end),
	wrap = (iterationDelta, scrollTo) => {
		iteration += iterationDelta;
		trigger.scroll(scrollTo);
		trigger.update(); // by default, when we trigger.scroll(), it waits 1 tick to update().
	};

// when the user stops scrolling, snap to the closest item.
ScrollTrigger.addEventListener("scrollEnd", () => scrollToOffset(scrub.vars.offset));

// feed in an offset (like a time on the seamlessLoop timeline, but it can exceed 0 and duration() in either direction; it'll wrap) and it'll set the scroll position accordingly. That'll call the onUpdate() on the trigger if there's a change.
function scrollToOffset(offset) { // moves the scroll playhead to the place that corresponds to the totalTime value of the seamlessLoop, and wraps if necessary.
	let snappedTime = snapTime(offset),
		progress = (snappedTime - seamlessLoop.duration() * iteration) / seamlessLoop.duration(),
		scroll = progressToScroll(progress);
	if (progress >= 1 || progress < 0) {
		return wrap(Math.floor(progress), scroll);
	}
	trigger.scroll(scroll);
}

document.querySelector(".next").addEventListener("click", () => scrollToOffset(scrub.vars.offset + spacing));
document.querySelector(".prev").addEventListener("click", () => scrollToOffset(scrub.vars.offset - spacing));


// below is the dragging functionality (mobile-friendly too)...
Draggable.create(".drag-proxy", {
  type: "x",
  trigger: ".cards",
  onPress() {
    this.startOffset = scrub.vars.offset;
  },
  onDrag() {
    scrub.vars.offset = this.startOffset + (this.startX - this.x) * 0.001;
    scrub.invalidate().restart(); // same thing as we do in the ScrollTrigger's onUpdate
  },
  onDragEnd() {
    scrollToOffset(scrub.vars.offset);
  }
});


function buildSeamlessLoop(items, spacing, animateFunc) {
	let overlap = Math.ceil(1 / spacing), // number of EXTRA animations on either side of the start/end to accommodate the seamless looping
		startTime = items.length * spacing + 0.5, // the time on the rawSequence at which we'll start the seamless loop
		loopTime = (items.length + overlap) * spacing + 1, // the spot at the end where we loop back to the startTime
		rawSequence = gsap.timeline({paused: true}), // this is where all the "real" animations live
		seamlessLoop = gsap.timeline({ // this merely scrubs the playhead of the rawSequence so that it appears to seamlessly loop
			paused: true,
			repeat: 0, // to accommodate infinite scrolling/looping
			onRepeat() { // works around a super rare edge case bug that's fixed GSAP 3.6.1
				this._time === this._dur && (this._tTime += this._dur - 0.01);
			}
		}),
		l = items.length + overlap * 2,
		time, i, index;

	// now loop through and create all the animations in a staggered fashion. Remember, we must create EXTRA animations at the end to accommodate the seamless looping.
	for (i = 0; i < l; i++) {
		index = i % items.length;
		time = i * spacing;
		rawSequence.add(animateFunc(items[index]), time);
		i <= items.length && seamlessLoop.add("label" + i, time); // we don't really need these, but if you wanted to jump to key spots using labels, here ya go.
	}

	// here's where we set up the scrubbing of the playhead to make it appear seamless.
	rawSequence.time(startTime);
	seamlessLoop.to(rawSequence, {
		time: loopTime,
		duration: loopTime - startTime,
		ease: "none"
	}).fromTo(rawSequence, {time: overlap * spacing + 1}, {
		time: startTime,
		duration: startTime - (overlap * spacing + 1),
		immediateRender: false,
		ease: "none"
	});
	return seamlessLoop;
}
});

/*Fin efecto de size de xo*/

/*BTN STWICH CLARO/OSCURO*/

/*Boton de modo oscuro/claro*/

const temaCheckbox = document.getElementById("theme-checkbox");
const imgWho = document.querySelector(".ContainerWhoXo");
const btnBlack = document.querySelector(".slider");

temaCheckbox.addEventListener("change", ()=>{

    if (temaCheckbox.checked) {
        document.body.classList.add("dark-mode");
        console.log("Modo Oscuro Activado");
        imgWho.classList.add("the-containercontactXo");
        btnBlack.classList.add("mode-black-slider")

    } else {
        document.body.classList.remove("dark-mode");
        console.log("Modo Claro Activado");
        imgWho.classList.remove("the-containercontactXo");
        btnBlack.classList.remove("mode-black-slider")
    }
});