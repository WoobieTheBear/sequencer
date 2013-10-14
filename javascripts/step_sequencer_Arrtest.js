/* step sequencer by alfonizer */
var	tempo = 0,
	shuffle = 0,
	timer,
	pos = 0,
	running = false,
	set = "Synth";

var	playArr = [];

window.onload = function(evt){
	// document.getElementById('addBD').onclick = function(evt){initSound(1)};
	document.getElementById('myTempo').onblur = function(evt){initTempo()};
	document.getElementById('myTempo').onchange = function(evt){initTempo()};
	document.getElementById('myTempo').value = 100;
	document.getElementById('myShuffle').onblur = function(evt){initShuffle()};
	document.getElementById('myShuffle').onchange = function(evt){initShuffle()};
	document.getElementById('myShuffle').value = 0;
	document.getElementById('pattern').onchange = function(evt){loadPattern()};
	document.getElementById('set').onchange = function(evt){loadSet()};
	document.getElementById('start').onclick = function(evt){startRun()};
	document.getElementById('stop').onclick = function(evt){stopRun()};
	document.getElementById('delete').onclick = function(evt){uncheckAll()}; // savePlayArr()
	document.getElementById('save').onclick = function(evt){savePlayArr()};
	initSequencer();
	initSaveData();
	loadPattern();
	initTempo();
}

soundManager.setup({
  url: 'sounds/',
  flashVersion: 9, // optional: shiny features (default = 8)
  // optional: ignore Flash where possible, use 100% HTML5 mode
  preferFlash: false,
  onready: function() {
  	var bdSynth = soundManager.createSound({
  		id: 'bdSynth',
  		url: 'sounds/bdSynth.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var sdSynth = soundManager.createSound({
  		id: 'sdSynth',
  		url: 'sounds/sdSynth.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var hhSynth = soundManager.createSound({
  		id: 'hhSynth',
  		url: 'sounds/hhSynth.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var bdHuman = soundManager.createSound({
  		id: 'bdHuman',
  		url: 'sounds/bdHuman.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var sdHuman = soundManager.createSound({
  		id: 'sdHuman',
  		url: 'sounds/sdHuman.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var hhHuman = soundManager.createSound({
  		id: 'hhHuman',
  		url: 'sounds/hhHuman.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var bdAkai = soundManager.createSound({
  		id: 'bdAkai',
  		url: 'sounds/bdAkai.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var sdAkai = soundManager.createSound({
  		id: 'sdAkai',
  		url: 'sounds/sdAkai.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	var hhAkai = soundManager.createSound({
  		id: 'hhAkai',
  		url: 'sounds/hhAkai.mp3',
  		stream: false,
  		autoLoad: true
  	});
  	bdSynth.load();
  	sdSynth.load();
  	hhSynth.load();
  	bdHuman.load();
  	sdHuman.load();
  	hhHuman.load();
  	bdAkai.load();
  	sdAkai.load();
  	hhAkai.load();  	
  }
});

function initSequencer(){
	// addElem(elemTag, elemSRC, elemID, elemClass, elemHyp, elemStyle, elemClick)
	addElem('div', 'sequencer', 'posRow', 'seqRow');
	addElem('div', 'posRow', 'labelPos', 'labelDiv', 'Position');
	// addElement('posRow', 'tr', 'seqRow', '<td><label>Position</label><td>', 'sequencer');
	for(i=0; i<16; i++){
		addElem('div', 'posRow', 'posDiv' + i, 'posDiv', '&bull;', 'font-size: 20px;');
		// addElement('posDiv' + i, 'td', 'seqDiv', '<span style="font-size: 20px;">&bull;</span>', 'posRow');
	}
	document.getElementById('posDiv0').style.color = '#ff0000';
	addElem('div', 'sequencer', 'bdRow', 'seqRow');
	addElem('div', 'bdRow', 'labelBD', 'labelDiv', 'Bassdrum');
	// addElement('bdRow', 'tr', 'seqRow', '<td><label>Bassdrum</label><td>', 'sequencer');
	for(i=0; i<16; i++){
		addElem('div', 'bdRow', 'bdDiv' + i, 'seqDiv', '<div class="off" onClick="changeOnOff(' + i + ', \'bd\')">' + '<div>');
		// addElement('bdDiv' + i, 'td', 'seqDiv', "<label for='checkbox'><input type='checkbox' id='bdStep" + i + "' name='bdStep" + i + "' style='display: none;'><span class='custom checkbox'></span></label>", 'bdRow');
	}
	addElem('div', 'sequencer', 'sdRow', 'seqRow');
	addElem('div', 'sdRow', 'labelSD', 'labelDiv', 'Snaredrum');
	for(i=0; i<16; i++){
		addElem('div', 'sdRow', 'sdDiv' + i, 'seqDiv', '<div class="off" onClick="changeOnOff(' + i + ', \'sd\')">' + '<div>');
	}
	addElem('div', 'sequencer', 'hhRow', 'seqRow');
	addElem('div', 'hhRow', 'labelHH', 'labelDiv', 'High Hat');
	for(i=0; i<16; i++){
		addElem('div', 'hhRow', 'hhDiv' + i, 'seqDiv', '<div class="off" onClick="changeOnOff(' + i + ', \'hh\')">' + '<div>');
	}
}

function loadPattern(){
	uncheckAll();
	var patName = document.getElementById('pattern').value;
	if(patName == "Rap"){
		playArr =[ ['bd'], ['hh'], ['bd'], ['hh'], ['sd'], ['hh'], ['hh'], ['bd'], ['hh'], ['bd'], ['hh'], ['hh'], ['sd'], ['hh'], ['hh'], ['hh'] ];
		initNewSequence(playArr);
	}
	if(patName == "Electro"){
		playArr =[ ['bd'], [], ['hh'], [], ['sd','bd'], [], ['hh'], [], ['bd'], [], ['hh'], [], ['bd','sd'], [], ['hh'], [] ];
		initNewSequence(playArr);
	}
	if(patName == "Big Beat"){
		playArr =[ ['bd','hh'], [], ['hh'], ['bd'], ['sd', 'hh'], [], ['bd','hh'], [], ['bd','hh'], [], ['hh'], [], ['sd', 'hh'], [], ['hh'], [] ];
		initNewSequence(playArr);
	}
	if(patName == "Personal"){
		playArr = JSON.parse(localStorage.saveArr);
		set = localStorage.saveSet;
		document.getElementById('myTempo').value = localStorage.saveTempo;
		initTempo();
		document.getElementById('myShuffle').value = localStorage.saveShuffle;
		initShuffle();
		document.getElementById('set').value = set;
		initNewSequence(playArr);
	}
}

function changeOnOff(pos, sample) {
	if(!containItem(sample, playArr[pos])){
		playArr[pos].push(sample);
		document.getElementById(sample + 'Div' + pos).firstChild.className = "on";
	} else {
		removeString(playArr[pos], sample);
		document.getElementById(sample + 'Div' + pos).firstChild.className = "off";
	}
}

function loadSet(){
	set = document.getElementById('set').value;
}

function initNewSequence(inputArr){
	for(i=0; i<16; i++){
		if(containItem('bd', inputArr[i])){ //  || i==2 || i==7 || i==9
			document.getElementById('bdDiv' + i).firstChild.className = "on";
		}
		if(containItem('sd', inputArr[i])){ //  || i==2 || i==7 || i==9
			document.getElementById('sdDiv' + i).firstChild.className = "on";
		}
		if(containItem('hh', inputArr[i])){ //  || i==2 || i==7 || i==9
			document.getElementById('hhDiv' + i).firstChild.className = "on";
		}
	}
}

function initTempo(){
	var tempoInput = parseInt(document.getElementById('myTempo').value);
	if(tempoInput<1){
		document.getElementById('myTempo').value = 1;
	} else if(tempoInput>220){
		document.getElementById('myTempo').value = 220;
	}
	tempo = Math.floor(60000/(parseInt(document.getElementById('myTempo').value) * 4));
	if(running){
		timer.cancel();;
		timer = accurateInterval(tempo, function() {
			initPlayer();
		});
	}
}

function initShuffle(){
	var shuffleInput = document.getElementById('myShuffle').value;
	if(shuffleInput<0){
		document.getElementById('myShuffle').value = 0;
	} else if(shuffleInput>50){
		document.getElementById('myShuffle').value = 50;
	}
	shuffle = Math.floor((tempo/100) * parseInt(document.getElementById('myShuffle').value));
}

function step(){
	document.getElementById('posDiv' + pos).style.color = '#ff0000';
	if(pos>0){
		document.getElementById('posDiv' + (pos-1)).style.color = '#000000';
	} else {
		document.getElementById('posDiv' + (15)).style.color = '#000000';
	}
	if(pos == 15){
		pos = -1;
	}
	pos ++;
}

function initPlayer(){
	if(shuffle > 0 && (pos-1)%2 == 0){
		var shuffpos = pos;
		setTimeout(function(){
			for(i in playArr[shuffpos]){
				soundManager.play(playArr[shuffpos][i] + set);
			}
		}, shuffle);
	} else {
		for(i in playArr[pos]){
			soundManager.play(playArr[pos][i] + set);
		}
	}
	step();
}

function startRun(){
	if(running){
		stopRun();
	}
	pos = 0;
	initPlayer();
	timerRun();
	running = true;
	$('#start').addClass('playing');
}

function stopRun(){
	timer.cancel();
	for(i=1; i<16; i++){
		document.getElementById('posDiv' + i).style.color = '#000000';
	}
	document.getElementById('posDiv0').style.color = '#ff0000';
	running = false;
	pos = 0;
	$('#start').removeClass('playing');
}

function timerRun(){
	initTempo();
	timer = accurateInterval(tempo, function() {
		initPlayer();
	});
}

function savePlayArr(){
	if(typeof(Storage)!=="undefined") {
		localStorage.saveArr = JSON.stringify(playArr);
		localStorage.saveSet = set;
		localStorage.saveShuffle = document.getElementById('myShuffle').value;
		localStorage.saveTempo = document.getElementById('myTempo').value;
		if(!document.getElementById('persPat')){
			addElem('option', 'pattern', 'persPat', false, 'Personal');
		}
	} else {
		alert('Your browser is so outdated, your grandma would have had a more recent one on her last Computer. =D');
	}
}

function initSaveData(){
	if(localStorage.saveArr){
		addElem('option', 'pattern', 'persPat', false, 'Personal');
	}
}

function addElem(elemTag, elemSRC, elemID, elemClass, elemHyp, elemStyle, elemClick){
	var newElement = document.createElement(elemTag);
	if(elemID){
		newElement.id = elemID;
	}
	if(elemClass){
		newElement.className = elemClass;
	}
	if(elemStyle){
		newElement.style.cssText = elemStyle;
	}
	var src = document.getElementById(elemSRC);
	src.appendChild(newElement);
	if(elemHyp && elemID){
		document.getElementById(newElement.id).innerHTML = elemHyp;
	}
	if(elemClick && elemID){
		document.getElementById(newElement.id).onclick = function(){ elemClick };
	}
}

function removeString(array, string){
	for (var i=array.length-1; i>=0; i--) {
		if (array[i] === string) {
			array.splice(i, 1);
		}
	}
}

function containItem(obj, list) {
    var cont;
    for (cont = 0; cont < list.length; cont++) {
        if (list[cont] === obj) {
            return true;
        }
    }
    return false;
}

function uncheckAll(){
	playArr = [];
	for(i=0; i<16; i++){
		playArr.push([]);
		document.getElementById('bdDiv' + i).firstChild.className = "off";
		document.getElementById('sdDiv' + i).firstChild.className = "off";
		document.getElementById('hhDiv' + i).firstChild.className = "off";
	}
}

(function() {
  window.accurateInterval = function(time, fn) {
    var cancel, nextAt, timeout, wrapper, _ref;
    nextAt = new Date().getTime() + time;
    timeout = null;
    if (typeof time === 'function') _ref = [time, fn], fn = _ref[0], time = _ref[1];
    wrapper = function() {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = function() {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel
    };
  };
}).call(this);
