//window.onload = function() {

		//GENERAL
		function abcpush(placeholder, k, brackets) {
			k = k % 26;
			for (var i = 0; i < 26; i++) {
				if (k > 25)
					k -= 26;
				placeholder.insertAdjacentHTML('beforeend', '<' + brackets + '>' + String.fromCharCode(k + 65)) + '</' + brackets + '>';
				//console.log(k);
				k++;
			}
		}

		function charpos(z) {
			return z.charCodeAt(0) - 65;
		}

		//------------------------
		// caesar cipher
		//------------------------
		var caesar_abc = document.getElementById("caesar_abc");
		var caesar_ci = document.getElementById("caesar_ci");
		var caesar_range = document.getElementById("caesar-range");
		var caesar_usertext = document.getElementById("caesar-user-text");
		var caesar_output = document.getElementById("caesar-output");
		var caesar_decrypt = document.getElementById("caesar-decrypt");
		var range_val = document.getElementById("range-value");
		var caesar_dbutton = document.getElementById("caesar-dbutton");
		var caesar_cbutton = document.getElementById("caesar-cbutton");
		caesar_range.addEventListener("change", function(e) {
			var tval = this.value % 26;
			range_val.value = tval;
			caesar_ci.innerHTML = '';
			abcpush(caesar_ci, tval, 'span');
		});
		abcpush(caesar_abc, 0, 'span');
		abcpush(caesar_ci, caesar_range.value, 'span');

		function caesarcipher(text, key) {
			text = text.toUpperCase();
			var ctext = '';
			for(var i=0; i<text.length; i++){
				var pushkey = charpos(text[i]) + key;
				ctext += String.fromCharCode( pushkey % 26 + 65 );
			}
			return ctext.replace(/[^A-Z]/gi, ' ');
		}
		function caesardecipher(text, key) {
				text = text.toUpperCase();
				var ctext = '';
				for(var i=0; i<text.length; i++){
					var pushkey = (charpos(text[i]) - key) >= 0 ? charpos(text[i]) - key : 26 + (charpos(text[i]) - key);
					ctext += String.fromCharCode( (pushkey % 26) + 65 );
				}
				return ctext.replace(/[^A-Z]/gi, ' ');
		}
		caesar_cbutton.addEventListener('click', function(e) {
			var text = caesar_usertext.value.replace(/[\n]/g, ' ');
			caesar_output.textContent = caesarcipher(text, parseInt(caesar_range.value));
			caesar_decrypt.textContent = '';
		});
		caesar_dbutton.addEventListener('click', function(e) {
			var text = caesar_usertext.value.replace(/[\n]/g, ' ');
			caesar_decrypt.textContent = caesardecipher(text, parseInt(caesar_range.value));
			caesar_output.textContent = '';
		});

		function clipBoard(e) {
			var range = document.createRange();
			range.selectNode(abc);
			window.getSelection().addRange(range);
			document.execCommand('copy');
			window.getSelection().empty();
		}
		var button = document.getElementById("copy");
		button.addEventListener("click", clipBoard);

		//Frequency analysis
		var freq = [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074];
		var graf = document.getElementById('graph');
		var resetgb = document.getElementById('reset-graph');
		for(var i=0; i<26; i++) {
		  graf.children[i].children[1].style.height = (freq[i]*25) + 'px';
		}
		var dynamicgraf = function(e) {
			var text = e.target.value.toUpperCase().replace(/[\s]/g, '');
			for(var i=0; i< text.length; i++) {
				var current =	graf.children[ charpos( text[i] ) ].children[2];
				var currentheight = parseInt(window.getComputedStyle(current).getPropertyValue('height'));
				var regex = new RegExp( (text[i]), 'g' );
				var currentmatch = text[i] + '=' + text.match(regex, 'e').length;
				current.style.height = (currentheight + 10) + 'px';
				//console.log(("str1,str2,str3,str4".match(/,/g) || []).length);
				console.log(text[i] + '=' + text.match(regex, 'e').length);
			}
		}
		var resetg = function(e) {
			for(var i=0; i<26; i++) {
			  graf.children[i].children[2].style.height = 0;
			}
		}
		caesar_usertext.addEventListener('keyup', function(e){
			if(e.keyCode == 13) {
				dynamicgraf(e);
			}
		});
		resetgb.addEventListener('click', resetg)
		/*
		    Affine
		    */
		var affine_input = document.getElementById("affine-input");
		var affine_output = document.getElementById("affine-output");
		var affine_formula = document.getElementById("affine-formula");
		var affine_numbers = document.getElementById("affine-numbers");

		function affine_display(e) {
			if (e.keyCode == 13) {
				var etext = e.target.value.toUpperCase();
				var elength = etext.length;
				var cipher = affine_cipher(etext, elength);
				affine_output.textContent = cipher;

				affine_numbers.innerHTML = '';
				for (var i = 0; i < elength; i++) {
					affine_numbers.innerHTML += '<span>' + charpos(etext[i]) + '</span> -';
				}
			}
		}

		function affine_cipher(text, d) {
			return text.toUpperCase().replace(/[A-Z]/g, function(a) {
				var apos = charpos(a);
				return String.fromCharCode(affine_eq(apos) % 26 + 65);
			});
		}

		function affine_eq(s) {
			var formula_str = affine_formula.value.toLowerCase().replace('x', '*' + s);
			return eval(formula_str);
		}

		affine_input.addEventListener('keyup', affine_display);

		//////////////////
		//Vigenere
		//////////////////////////////
		var vig_key = document.getElementById("vig-key");
		var vig_input = document.getElementById("vig-input");
		var vig_output = document.getElementById("vig-output");

		function vigenere_cipher(text, keystring, decode) {
			var i = 0,
				b = "A";
			return text.toUpperCase().replace(/[A-Z]/g, function(a) {
				b = keystring[i++ % keystring.length].toUpperCase();
				return String.fromCharCode(((charpos(a) + (decode ?
					26 - charpos(b) :
					charpos(b))) % 26 + 65));
			});
		}
		vig_input.addEventListener('keyup', function(e) {
			if (e.keyCode == 13) {
				vig_output.textContent = vigenere_cipher(this.value, vig_key.value, false);
			}
		});

		//abc table
		var abc_table = document.getElementById("abc-table");
		for (var i = 0; i <= 26; i++) {
			abc_table.getElementsByTagName("tbody")[0].insertAdjacentHTML('beforeend', '<tr></tr>');
			if (i === 0) {
				abc_table.getElementsByTagName("tbody")[0].insertAdjacentHTML('afterbegin', '<td>0</td>');
				abcpush(abc_table.getElementsByTagName("tr")[i], i, 'td');
			}
			else {
				abc_table.getElementsByTagName("tr")[i].insertAdjacentHTML('beforeend', '<td>' + String.fromCharCode(i + 65 - 1) + '</td>');

				abcpush(abc_table.getElementsByTagName("tr")[i], i - 1, 'td');
			}

		}

		//cipher quotes
		var pquotes = document.querySelectorAll('q');
		for (var i = 0; i < pquotes.length; i++) {
			if (pquotes[i].parentNode.parentNode.parentNode.id === 'caesar-page') {
				pquotes[i].textContent = caesarcipher(pquotes[i].textContent, parseInt(caesar_range.value));
			} else if (pquotes[i].parentNode.parentNode.parentNode.id === 'affine-page') {
				pquotes[i].textContent = affine_cipher(pquotes[i].textContent, false);
			} else if (pquotes[i].parentNode.parentNode.parentNode.id === 'vigenere-page') {
				pquotes[i].textContent = vigenere_cipher(pquotes[i].textContent, vig_key.value, false);
			}
		}

		//////////////////////////////
		//COLOR CIPHER
		/////////////////////////////
		var canvas_ci = document.getElementById('canvas-img');
			var colors = canvas_ci.getContext('2d');
		var canvas_uinput = document.getElementById('canvas-input');
		var hex = ["rgb(0, 123, 23)", "rgb(0, 123, 230)", "rgb(150, 123, 23)", "rgb(100, 223, 23)", "rgb(150, 223, 203)", "rgb(0, 223, 230)", "rgb(255, 0, 0)", "rgb(224, 124, 255)", "rgb(0, 0, 255)", "rgb(0, 255, 0)", "rgb(255, 195, 66)", "rgb(255, 255, 0)", "rgb(255, 0, 131)", "rgb(124, 187, 255)", "rgb(0, 255, 255)", "rgb(206, 39, 39)", "rgb(41, 58, 188)", "rgb(160, 163, 255)", "rgb(160, 255, 163)", "rgb(200, 0, 255)", "rgb(250, 255, 160)", "rgb(255, 210, 160)", "rgb(178, 255, 255)", "rgb(255, 178, 244)", "rgb(255, 142, 142)", "rgb(15, 145, 41)", "rgb(181, 255, 45)", "rgb(0, 255, 153)", "rgb(152, 0, 255)", "rgb(255, 106, 0)", "rgb(62, 125, 155)", "rgb(155, 155, 62)", "rgb(155, 62, 62)", "rgb(62, 153, 155)", "rgb(71, 56, 153)", "rgb(71, 56, 153)", "rgb(73, 62, 155)", "rgb(155, 62, 143)", "rgb(62, 155, 101)", "rgb(155, 118, 62)", "rgb(62, 125, 155)"];
		var canvas_encrypt = document.getElementById('encrypt-canvas');
		var loadimg = document.getElementById('img-load');
		var loadedcanvas = document.getElementById('img-loaded');
		var loadedctximage = loadedcanvas.getContext('2d');
		var pix = 10;

		if(canvas_ci.getContext){
			loadimg.addEventListener('change', displayImg, false);
			canvas_encrypt.addEventListener('click', canvas_cipher);
		}
		function canvas_cipher(e){
			var text = canvas_uinput.value;
			for(var i=0; i<text.length; i++){
				//console.log(text.length + '=' + text)
				var acolor = getRgb( getColor(text[i]) );
				colors.fillStyle = 'rgb(' + acolor[0] + ',' + acolor[1] + ',' + acolor[2] + ')';
				colors.fillRect(i*pix, 0, pix, pix);
			}
		}
		function colorpix(x, y){
			var pixelData = loadedctximage.getImageData(x, y, 1, 1).data;
			return pixelData;
		}
		function canvas_decipher(e){

		}
		function displayImg(e){
			var reader = new FileReader();
			reader.onload = function(event){
				var img = new Image();
				img.onload = function(){
					loadedcanvas.width = img.width;
					loadedcanvas.height = img.height;
					loadedctximage.drawImage(img, 0, 0);
				}
				img.src = event.target.result;
			}
			reader.readAsDataURL(e.target.files[0]);
		}

		function getRgb(c){
			return c.replace(/[^\d,]/g, '').split(',');
		}
		function getColor(c){
			var intc = parseInt(c);
			if( !isNaN(intc) ){
				for( var i = 0; i < hex.length; i++ ){
					var toInt = parseInt(String.fromCharCode(i+48).replace(/"/));
					if( parseInt(c) === toInt ) {
						//console.log(hex[i+26]);
						return hex[i+26];
						break;
					}
				}
			}else if( c.toLowerCase() != c.toUpperCase() ) {
				for( var i = 0; i < hex.length; i++ ) {
					if( c.toLowerCase() == String.fromCharCode(i+97) ) {
						return hex[i];
						break;
					}
				}
			}else{
				return 'rgb(365, 365, 365)';
			}
		}

	//} //end onload