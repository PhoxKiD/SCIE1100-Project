var hex = ["rgb(0, 123, 23)", "rgb(0, 123, 230)", "rgb(150, 123, 23)", "rgb(100, 223, 23)", "rgb(150, 223, 203)", "rgb(0, 223, 230)", "rgb(255, 0, 0)", "rgb(224, 124, 255)", "rgb(0, 0, 255)", "rgb(0, 255, 0)", "rgb(255, 195, 66)", "rgb(255, 255, 0)", "rgb(255, 0, 131)", "rgb(124, 187, 255)", "rgb(0, 255, 255)", "rgb(206, 39, 39)", "rgb(41, 58, 188)", "rgb(160, 163, 255)", "rgb(160, 255, 163)", "rgb(200, 0, 255)", "rgb(250, 255, 160)", "rgb(255, 210, 160)", "rgb(178, 255, 255)", "rgb(255, 178, 244)", "rgb(255, 142, 142)", "rgb(15, 145, 41)", "rgb(181, 255, 45)", "rgb(0, 255, 153)", "rgb(152, 0, 255)", "rgb(255, 106, 0)", "rgb(62, 125, 155)", "rgb(155, 155, 62)", "rgb(155, 62, 62)", "rgb(62, 153, 155)", "rgb(71, 56, 153)", "rgb(71, 56, 153)", "rgb(73, 62, 155)", "rgb(155, 62, 143)", "rgb(62, 155, 101)", "rgb(155, 118, 62)", "rgb(62, 125, 155)"];

function getColor(c){
	if( c === " " ){
		return "rgb(365, 365, 365)";
	}else{
		var toInt;
		var isInt = c.replace(/"/);
		//65-90 A-Z 97-122 a-z 48-57 0-9
		if( isInt == parseInt(c) ) {
			for( var i = 0; i < hex.length; i++ ){
				toInt = parseInt(String.fromCharCode(i+48).replace(/"/));
				if( parseInt(c) === toInt ) {
					console.log(hex[i+26]);
					return hex[i+26];
					break;
				}
			}

		}else{
			for( var i = 0; i < hex.length; i++ ) {
				if( c.toLowerCase() == String.fromCharCode(i+97)){
					return hex[i];
					break;
				}
			}
		}

	}
}
//------------------------
// CANVAS
//------------------------
var canvas = document.getElementById("canvas");
var ranger = document.getElementById("ranger");
var ranger_seq = document.getElementById("ranger-sequence");

function pixelate(x){
	canvas.innerHTML = "";
	for( var i = 0; i < x; i++ ){
		canvas.insertAdjacentHTML('beforeend',
			"<input type='text' maxlength=1 class='input-box'>");
	}
}
function canvasEvent(e){
	var eval = String.fromCharCode(e.keyCode).toLowerCase();
	if(e.target.className == 'input-box' && eval.match(/[a-z0-9\s]/)){
		//var eval = e.target.value;
		var color = getColor(eval);
		e.target.setAttribute("PLACEHOLDER", eval);
		e.target.value = null;
		e.target.style.backgroundColor = color;

	}else{
		event.preventDefault();
		event.stopPropagation();
	}

		e.target.value = "";
		console.log(String.fromCharCode(e.keyCode));
}
function resizeBoxes(e){
	var box_width = 0;
	var eval = e.target.value;
	if (eval < 30 ) {
		box_width = 2.5;
		pixelate(400);
	}else if (eval < 75) {
		box_width = 5;
		pixelate(200);
	}else{
		box_width = 10;
		pixelate(100);
	}
	var canvas_boxes = document.getElementsByClassName("input-box");
	for (var i = 0; i < canvas_boxes.length; i++) {
		canvas_boxes[i].style.width = box_width + '%';
		canvas_boxes[i].style.height = (canvas_boxes[i].offsetWidth) + "px";
	}
	console.log(canvas.offsetWidth);
}

canvas.addEventListener('keyup', canvasEvent);
ranger_seq.addEventListener('keyup', function(e){
	var inputs = document.getElementsByClassName("input-box");
	if(e.keyCode == 13){
		for(var i = 0; i < e.target.value.length; i++){
			canvas.children[i].value = e.target.value[i];
			canvas.children[i].style.backgroundColor = getColor(e.target.value[i]);
		}
	}
});
ranger.addEventListener('change', resizeBoxes);

//------------------------
// Color String
//------------------------
var color_input = document.getElementById("color-input");
var color_code = document.getElementById("color-code");
var color_text = document.getElementById("color-text");

function colorString(e){
	if(e.keyCode == 13){
		color_code.innerHTML = "";
		for(var i = 0; i < e.target.value.length; i++){
			color_code.insertAdjacentHTML("beforeend", '<span>' + i + '</span>');
			color_code.children[i].style.backgroundColor = getColor(e.target.value[i]);
		}
	}
}

color_input.addEventListener('keyup', colorString);

//------------------------
// Ceasar cipher
//------------------------
var abc = document.getElementById("abc");
var ceasar = document.getElementById("ceasar");
var ceasar_range = document.getElementById("ceasar-range");
var ceasar_usertext = document.getElementById("ceasar-user-text");
var ceasar_output = document.getElementById("ceasar-output");
var ceasar_decrypt = document.getElementById("ceasar-decrypt");
var range_val = document.getElementById("range-value");
//abc seq
function ceasars(e) {
	var a = e.target.value % 26;
	range_val.textContent = a;
	ceasar.innerHTML = "";
	for (var i = 0; i < 26; i++) {
		if ( a >= 26 ) a -= 26;
		ceasar.insertAdjacentHTML('beforeend', '<span>' + String.fromCharCode(a+65) + '</span>');
		a++;
	}
}
ceasar_range.addEventListener("change", ceasars);

function charpos(z){
	return z.charCodeAt(0) - 65;
}
function ceasarde(text, push, decode) {
	var push = push % 26;
	var i = 0;
	return text.toUpperCase().replace(/[A-Z]/g, function(a) {
		return String.fromCharCode( (charpos(a) + (decode ? 26-push : push )) % 26 + 65 );
	});
}
ceasar_usertext.addEventListener("keyup", function(e){
	if(e.keyCode == 13) {
		var text = this.value;

		ceasar_output.textContent = ceasarde( text, parseInt(ceasar_range.value), false );
		ceasar_decrypt.textContent = ceasarde( ceasar_output.textContent, parseInt(ceasar_range.value), true );
	}
});

for(var i = 0; i < 26; i++ ){
	abc.insertAdjacentHTML('beforeend', '<span>'+String.fromCharCode(i+65)+'</span>');
}

function clipBoard(e){
	var range = document.createRange();
	range.selectNode(abc);
	window.getSelection().addRange(range);
	document.execCommand('copy');
	window.getSelection().empty();
}
var button = document.getElementById("copy");
button.addEventListener("click", clipBoard);

///////////Affine
var affine_input = document.getElementById("affine-input");
var affine_output = document.getElementById("affine-output");
var affine_formula = document.getElementById("affine-formula");
var affine_numbers = document.getElementById("affine-numbers");

function affine_display(e) {
	if(e.keyCode == 13) {
		var etext = e.target.value.toUpperCase();
		var elength = etext.length;
		var cipher = affine_cipher(etext, elength);
		affine_output.textContent = cipher;

		affine_numbers.innerHTML = '';
		for(var i = 0; i < elength; i++){
			affine_numbers.innerHTML += '<span>' + charpos(etext[i]) + '</span>';
		}
	}
}
function affine_cipher(text, size, d) {
	return text.toUpperCase().replace(/[A-Z]/g, function(a) {
		var apos = charpos(a);
		return String.fromCharCode( affine_eq(apos) % 26 + 65 )  ;
	});
}
function affine_eq(s){
	var formula_text = affine_formula.value;
	var formula_str = affine_formula.value.replace('x', '*' + s);
	return eval(formula_str);
}

affine_input.addEventListener('keyup', affine_display);

//////////////////
//Vigenere
//////////////////////////////
var vig_key = document.getElementById("vig-key");
var vig_input = document.getElementById("vig-input");
var vig_output = document.getElementById("vig-output");

function vigenere(text, keystring, decode) {
	var i = 0, b = "A";
	console.log(keystring.length);
	return text.toUpperCase().replace(/[A-Z]/g, function(a) {//replace A to Z; g to retain last letter and replace it
		b = keystring[i++ % keystring.length];
		return String.fromCharCode( ((charpos(a) + (decode ? 26 - charpos(b) : charpos(b))) % 26 + 65) );
	});
}
vig_input.addEventListener('keyup', function(e){
	if(e.keyCode == 13) {
		vig_output.textContent = vigenere(this.value, vig_key.value.toUpperCase(), false);
	}
});

function abcpush(placeholder, k, brackets){
  k = k % 26;
  for(var i = 0; i < 26; i++){
    if( k > 25) k -= 26;
    placeholder.insertAdjacentHTML('beforeend', '<'+brackets+'>'+String.fromCharCode(k+65))+'</'+brackets+'>';
    //console.log(k);
    k++;
  }
}

//abc table
var abc_table = document.getElementById("abc-table");
for(var i = 0; i <= 26; i++){
	abc_table.getElementsByTagName("tbody")[0].insertAdjacentHTML('beforeend', '<tr></tr>');
	if(i==0) {
		abc_table.getElementsByTagName("tbody")[0].insertAdjacentHTML('afterbegin', '<td>0</td>');
		abcpush(abc_table.getElementsByTagName("tr")[i], i, 'td');
	}
	else {
		abc_table.getElementsByTagName("tr")[i].insertAdjacentHTML('beforeend', '<td>' + String.fromCharCode(i+65-1) + '</td>');

		abcpush(abc_table.getElementsByTagName("tr")[i], i-1, 'td');
	}
	//if(i+1 % 26) nth_row++;

}
/*
for(var i = 0; i < 26*26; i++){
	if(i < 26){
		abc_table.getElementsByTagName("tr")[0].insertAdjacentHTML('beforeend', '<td>' + String.fromCharCode(i+65) + '</td5>');
	}else if(i < 26*2){
		abc_table.
	}
}*/
