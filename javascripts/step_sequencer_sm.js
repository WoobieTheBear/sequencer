/* step sequencer by alfonizer */

var sounds = [], tempo = 0, shuffle = 0, timer, pos = 0, running = false, shuffleArr = [1, 3, 5, 7, 9, 11, 13, 15], bdArr = [], sdArr = [], hhArr = [], set = "Synth";

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
  	bdAkai.load();
  	sdAkai.load();
  	hhAkai.load();  	
  }
});

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
	initSequencer();
	loadPattern();
	initTempo();
}

function initSequencer(){
	addElement('posRow', 'tr', 'seqRow', '<td><label>Position</label><td>', 'sequencer');
	for(i=0; i<16; i++){
		addElement('posDiv' + i, 'td', 'seqDiv', '<span style="font-size: 20px;">&bull;</span>', 'posRow');
	}
	document.getElementById('posDiv0').style.color = '#ff0000';
	addElement('bdRow', 'tr', 'seqRow', '<td><label>Bassdrum</label><td>', 'sequencer');
	for(i=0; i<16; i++){
		addElement('bdDiv' + i, 'td', 'seqDiv', "<label for='checkbox'><input type='checkbox' id='bdStep" + i + "' name='bdStep" + i + "' style='display: none;'><span class='custom checkbox'></span></label>", 'bdRow');
	}
	addElement('sdRow', 'tr', 'seqRow', '<td><label>Snaredrum</label><td>', 'sequencer');
	for(i=0; i<16; i++){
		addElement('sdDiv' + i, 'td', 'seqDiv', "<label for='checkbox'><input type='checkbox' id='sdStep" + i + "' name='sdStep" + i + "' style='display: none;'><span class='custom checkbox'></span></label>", 'sdRow');
	}
	addElement('hhRow', 'tr', 'seqRow', '<td><label>Hi Hat</label><td>', 'sequencer');
	for(i=0; i<16; i++){
		addElement('hhDiv' + i, 'td', 'seqDiv', "<label for='checkbox'><input type='checkbox' id='hhStep" + i + "' name='hhStep" + i + "' style='display: none;'><span class='custom checkbox'></span></label>", 'hhRow');
	}
}

function loadPattern(){
	var patName = document.getElementById('pattern').value;
	if(patName == "Rap"){
		$(':checkbox').parent().find('span').removeClass('checked');
		document.getElementById('seqForm').reset();
		initNewSequence([0, 2, 7, 9], [4, 12], [1, 3, 5, 6, 8, 10, 11, 13, 14, 15]);
		// alert('the pattern you’ve selected is ' + patName);
	}
	if(patName == "Electro"){
		$(':checkbox').parent().find('span').removeClass('checked');
		uncheckAll();
		initNewSequence([0, 4, 8, 12], [4, 12], [2, 6, 10, 14]);
		// alert('the pattern you’ve selected is ' + patName);
	}
	if(patName == "Big Beat"){
		$(':checkbox').parent().find('span').removeClass('checked');
		uncheckAll();
		initNewSequence([0, 3, 6, 8], [4, 12], [0,2,4,6,8,10,12,14]);
		// alert('the pattern you’ve selected is ' + patName);
	}
}

function loadSet(){
	set = document.getElementById('set').value;
}

function initNewSequence(bdSteps, sdSteps, hhSteps){
	for(i=0; i<16; i++){
		if(containItem(i, bdSteps)){ //  || i==2 || i==7 || i==9
			document.getElementById('bdStep' + i).checked = 'true';
			$('input[name=' + 'bdStep' + i + ']').parent().find('span').addClass('checked');
		}
	}
	for(i=0; i<16; i++){
		if(containItem(i, sdSteps)){ //  || i==2 || i==7 || i==9
			document.getElementById('sdStep' + i).checked = 'true';
			$('input[name=' + 'sdStep' + i + ']').parent().find('span').addClass('checked');
		}
	}
	for(i=0; i<16; i++){
		if(containItem(i, hhSteps)){ //  || i==2 || i==7 || i==9
			document.getElementById('hhStep' + i).checked = 'true';
			$('input[name=' + 'hhStep' + i + ']').parent().find('span').addClass('checked');
		}
	}
}

function initTempo(){
	tempo = Math.floor(60000/(parseInt(document.getElementById('myTempo').value) * 4));
	if(running){
		clearInterval(timer);
		timer = setInterval(function(){
			initPlayer();
		}, tempo);
	}
}

function initShuffle(){
	shuffle = Math.floor((tempo/100) * parseInt(document.getElementById('myShuffle').value));
	if(shuffle>50){
		document.getElementById('myShuffle').value = 50;
	}
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
	var seqForm = document.forms['seqForm'];
	var playArr = [];
	if(seqForm.elements['bdStep' + pos].checked){
		if(set == 'Synth'){playArr.push('bdSynth');}
		if(set == 'Human'){playArr.push('bdHuman');}
		if(set == 'Akai'){playArr.push('bdAkai');}
	}
	if(seqForm.elements['sdStep' + pos].checked){
		if(set == 'Synth'){playArr.push('sdSynth');}
		if(set == 'Human'){playArr.push('sdHuman');}
		if(set == 'Akai'){playArr.push('sdAkai');}
	}
	if(seqForm.elements['hhStep' + pos].checked){
		if(set == 'Synth'){playArr.push('hhSynth');}
		if(set == 'Human'){playArr.push('hhHuman');}
		if(set == 'Akai'){playArr.push('hhAkai');}
	}
	if(shuffle > 0 && containItem(pos, shuffleArr)){
		setTimeout(function(){
			for(i in playArr){
				soundManager.play(playArr[i]);
			}
		}, shuffle);
	} else {
		for(i in playArr){
			soundManager.play(playArr[i]);
		}
	}
	step();
	for(i in playArr){
		soundManager.load(playArr[i]);
	}
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
	clearInterval(timer);
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
	timer = setInterval(function(){
		initPlayer();
	}, tempo);
}

function addElement(elId, elTag, elClass, inHyp, elSrc){
	var elment = document.createElement(elTag);
	elment.className = elClass;
	elment.id = elId;
	var src = document.getElementById(elSrc);
	src.appendChild(elment);
	document.getElementById(elment.id).innerHTML = inHyp;
}

function containItem(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

function uncheckAll(){
	var w = document.getElementsByTagName('input');
	for(var i = 0; i < w.length; i++){
		if(w[i].type=='checkbox'){
			w[i].checked = false;
		}
	}
}

