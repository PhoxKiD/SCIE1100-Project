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
			resetg();
			dynamicbars(text);
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
		//button.addEventListener("click", clipBoard);

		//Frequency analysis
		var freq = [8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153, 0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758, 0.978, 2.360, 0.150, 1.974, 0.074];
		var graf = document.getElementById('graph');
		var resetgb = document.getElementById('reset-graph');
		for(var i=0; i<26; i++) {
		  graf.children[i].children[1].style.height = (freq[i]*20) + 'px';
		}
		/*var dynamicgraf = function(e) {
			var text = e.target.value.toUpperCase().replace(/[\s]/g, '');
			for(var i=0; i< text.length; i++) {
				var current =	graf.children[ charpos( text[i] ) ].children[2];
				var currentheight = parseInt(window.getComputedStyle(current).getPropertyValue('height'));
				var regex = new RegExp( (text[i]), 'g' );
				var currentmatch = text[i] + '=' + text.match(regex, 'e').length;
				current.style.height = (currentheight + 10) + 'px';
				//console.log(("str1,str2,str3,str4".match(/,/g) || []).length);
				//console.log(text[i] + '=' + text.match(regex, 'e').length);
			}
		}*/
		function dynamicbars(e) {
			var text = e.toUpperCase();
			var length = text.replace(/[^A-Z]/g, '').length;
			var r = text.replace(/[A-Z]/g, function(a) {
				var t = charpos(a);
				var bar = graf.children[t].children[2];
				var height = bar.offsetHeight + 1;
				bar.style.height = height + 'px';
				return 1;
			});
			for(var i=0; i<26; i++) {
				var bar = graf.children[i].children[2];
				var h = bar.offsetHeight;
				bar.style.height = (h / length * 1000) + 'px';
				if(0 != h)
					bar.textContent = Math.round(h / length * 100) + '%';
			}
		}
		function resetg(e) {
			for(var i=0; i<26; i++) {
			  graf.children[i].children[2].style.height = 0;
			}
		}
		/*
		    Affine
		    */
		var affine_input = document.getElementById("affine-input");
		var affine_output = document.getElementById("affine-output");
		var affine_formula = document.getElementById("affine-formula");
		var affine_numbers = document.getElementById("affine-numbers");
		var affine_cbutton = document.getElementById("affine-cbutton");
		var affine_debutton = document.getElementById("affine-debutton");

		function affine_display(e) {
			var etext = affine_input.value.toUpperCase();
			var elength = etext.length;
			var cipher = affine_cipher(etext, elength);
			affine_output.textContent = cipher;
			/*affine_numbers.innerHTML = '';
			for (var i = 0; i < elength; i++) {
				affine_numbers.innerHTML += '<span>' + charpos(etext[i]) + '</span> ';
			}*/
		}
		function affine_cut() {
			var coeff = affine_formula.value.substr(0, affine_formula.value.indexOf('x'));
			var base = affine_formula.value.split('+')[1];
			var nums = [ parseInt(coeff), parseInt(base) ];
			return nums;
		}
		function affine_dec1() {
			var formula = affine_cut();
			var text = affine_input.value.toUpperCase();
			var ainverse = modulx(xgcd(formula[0], 26)[0], 26 );
			var constx = formula[1];
			console.log(ainverse);
			for(var i=0; i<text.length; i++) {
				var result = ainverse * (charpos( text[i] )- constx ) % 26;
				affine_output.textContent += String.fromCharCode( result + 65).replace(/[^A-Z]/g, ' ');
				//console.log(i +'='+ String.fromCharCode( result + 65).replace(/[^A-Z]/g, ''))
			}
		}
		function modulx(x, n) {
		    return ((x%n)+n)%n;
		};
		function modinverse(a, b) {
			var i = b;
			while(b != 1) {
				var t = b;
				b = a%b;
				a = t;
			}
			console.log(b+'-'+i+'/'+a);
			//if( (b-i) < 0 ) return modulx( (b-i)a, a );
			//return (( (b-i)/a ) + i)%i;
			return ( (b-i)/a%i + i )%i;
		}
		function xgcd(a,b)
		{
		if (b == 0)
			{return [1, 0, a]}
		else
			{
			 temp = xgcd(b, a % b);
			 x = temp[0];
			 y = temp[1];
			 d = temp[2];
			 return [y, x-y*Math.floor(a/b), d];
			}
		}
		console.log(xgcd(5,26));
		function gcd(a, b) {
			while(b != 0){
				var t = b;
				b = a % b;
				a = t;
			}
			return a;
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

		affine_cbutton.addEventListener('click', function(e) {
			affine_output.textContent = '';
			affine_display(e);
		});
		affine_debutton.addEventListener('click', function(e) {
			var cut = affine_formula.value.substr(0, affine_formula.value.indexOf('x'));
			if( gcd( parseInt(cut), 26 ) === 1 ) {
				affine_output.textContent = '';
				affine_dec1(e);
			}else {
				affine_output.textContent = "The coefficient of x is not pseudoprime to 26";
			}
		});
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
		var canvas_detext = document.getElementById("canvas-decipher");

		if(canvas_ci.getContext){
			loadimg.addEventListener('change', displayImg, false);
			canvas_encrypt.addEventListener('click', canvas_cipher);
		}
		function canvas_cipher(e){
			var text = canvas_uinput.value;
			var t = 0;
		  var x = 50;
		  var y = 0;
	    for(var i=0; i<10;i++) {
	      for(var k=0; k<10; k++) {
					var acolor = getRgb( getColor(text[t]) );
					t++;
					colors.fillStyle = 'rgb(' + acolor[0] + ',' + acolor[1] + ',' + acolor[2] + ')';
	        colors.fillRect(k * x, y, x, x);
	      }
	      y += 50;
	    }
		}
		function canvas_decipher(cont){
			var y = 0;
			canvas_detext.textContent = '';
			for(var i=0; i<10;i++) {
	      for(var k=0; k<10; k++) {
					var temp = cont.getImageData(k*50, i*50, 1, 1).data;
					var temprgb = 'rgb(' + temp[0] + ', ' + temp[1] + ', ' + temp[2] + ')';

					for(var j=0; j<26; j++) {
						if( temprgb == hex[j] ) {
							canvas_detext.textContent += String.fromCharCode(j+65);
							break;
						}
					}
	      }
	      y += 50;
	    }
		}
		function displayImg(e){
			var reader = new FileReader();
			reader.onload = function(event){
				var img = new Image();
				img.onload = function(){
					loadedcanvas.width = img.width;
					loadedcanvas.height = img.height;
					loadedctximage.drawImage(img, 0, 0);

					canvas_decipher(loadedctximage);
					console.log(loadedctximage.getImageData(50, 0, 1,1).data);
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
			}else if( c.match(/[A-z]/gi) ) {
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
