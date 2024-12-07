/*
Placeholders pour les champs qui affichent l'operation et le resultat.
La variable 'visualOperation' est une chaine de caractères qui sera affichée à l'utilisateur, en haut de la calculatrice.
La variable 'operation' est ce qui sera evalué avec la fonction eval()
On a besoin de les stocker dans des variables différentes car les signes affichés sont différents des signent qui servent à évaluer (le signe diviser '÷' par exemple)
*/
var visualOperation = document.getElementById("calculator-screen-operation");
visualOperation.innerHTML = "0";
var operation = "";

/* Le resultat qui sera affiché sur l'ecran de la calculatrice */
var result = document.getElementById("calculator-screen-result");
result.innerHTML = "0";

/* On reset la calculatrice quand l'utilisateur clique sur le resultat */
result.onclick = function() { clear(); };

/* On stocke certains element (les boutons des operateurs) dans des variables  */
var divide = document.getElementById("divide");
var multiply = document.getElementById("multiply");
var minus = document.getElementById("minus");
var plus = document.getElementById("plus");

/*
Adding corresponding events when the user clicks on an operator.
	- if the last character is already an operator, the new clicked operator takes its place,
	- else we just add the new operator.
*/
divide.onclick = function() {
	if (endsWithOperator()) {
		visualOperation.innerHTML = visualOperation.innerHTML.substring(0, visualOperation.innerHTML.length - 1) + "÷";
		operation = operation.substring(0, operation.length - 1) + "/";
	} else {
		visualOperation.innerHTML += "÷";
		operation += "/";
	}
};

multiply.onclick = function() {
	if (endsWithOperator()) {
		visualOperation.innerHTML = visualOperation.innerHTML.substring(0, visualOperation.innerHTML.length - 1) + "×";
		operation = operation.substring(0, operation.length - 1) + "*";
	} else {
		visualOperation.innerHTML += "×";
		operation += "*";
	}
};

minus.onclick = function() {
	if (endsWithOperator()) {
		visualOperation.innerHTML = visualOperation.innerHTML.substring(0, visualOperation.innerHTML.length - 1) + "–";
		operation = operation.substring(0, operation.length - 1) + "-";
	} else {
		visualOperation.innerHTML += "–";
		operation += "-";
	}
};

plus.onclick = function() {
	if (endsWithOperator()) {
		visualOperation.innerHTML = visualOperation.innerHTML.substring(0, visualOperation.innerHTML.length - 1) + "+";
		operation = operation.substring(0, operation.length - 1) + "+";
	} else {
		visualOperation.innerHTML += "+";
		operation += "+";
	}
};

/*
Quand l'utilisateur clique sur un chiffre, on ajoute ce chiffre
*/
var num0 = document.getElementById("num0");
num0.onclick = function() { concatNumber(0); };

var num1 = document.getElementById("num1");
document.getElementById("num1").onclick = function() { concatNumber(1); };

var num2 = document.getElementById("num2");
document.getElementById("num2").onclick = function() { concatNumber(2); };

var num3 = document.getElementById("num3");
document.getElementById("num3").onclick = function() { concatNumber(3); };

var num4 = document.getElementById("num4");
document.getElementById("num4").onclick = function() { concatNumber(4); };

var num5 = document.getElementById("num5");
document.getElementById("num5").onclick = function() { concatNumber(5); };

var num6 = document.getElementById("num6");
document.getElementById("num6").onclick = function() { concatNumber(6); };

var num7 = document.getElementById("num7");
document.getElementById("num7").onclick = function() { concatNumber(7); };

var num8 = document.getElementById("num8");
document.getElementById("num8").onclick = function() { concatNumber(8); };

var num9 = document.getElementById("num9");
document.getElementById("num9").onclick = function() { concatNumber(9); };

/*
Quand l'utilisateur clique sur le point '.' : 
	- si le signe precedent est un operateur, on ajoute un zero devant le point,
	- si les dernier nombre de la chaine est deja decimal, on ne fait rien
	- sinon, on ajoute le point
*/
var dot = document.getElementById("dot");
dot.onclick = function() {
	if ( endsWithOperator() ) {
		visualOperation.innerHTML += "0.";
		operation += "0.";
		evaluate();
	} else if ( !lastNumberisDecimal() ) {
		visualOperation.innerHTML += ".";
		operation += ".";
		evaluate();
	}	
};

/* Ajout des chiffres cliqués à la chaine representant l'operation. */
function concatNumber(x) {
	updateVisualOperation(x);
	operation += x;
	evaluate();
}

function evaluate() {
	result.innerHTML = eval(operation);
	result.innerHTML = result.innerHTML.substring(0, 8);
}

function updateVisualOperation(x) {
	visualOperation.innerHTML === "0" ? visualOperation.innerHTML = x : visualOperation.innerHTML += x;
}

/* Reset total de la calculatrice */
function clear() {
	visualOperation.innerHTML = "0";
	operation = "";
	result.innerHTML = "0";
}

/* Fonction qui retourne true si le dernier caractere de 'operation' est un operateur */
function endsWithOperator() {
	if (operation.endsWith("/") || operation.endsWith("*") || operation.endsWith("-") || operation.endsWith("+")) {
		return true;
	}
	return false;
}

/* Fonction qui retourne true si le dernier nombre de 'operation' est decimal (et contient donc dejà un '.') */
function lastNumberisDecimal() {
	if (operation.indexOf(".") != -1) {
		/*
		Si 'operation' contient deja un '.', on verifie si celui-ci se trouve après le dernier operateur utilisé
		*/
		if (operation.lastIndexOf("/") < operation.lastIndexOf(".") || 
			operation.lastIndexOf("*") < operation.lastIndexOf(".") || 
			operation.lastIndexOf("-") < operation.lastIndexOf(".") || 
			operation.lastIndexOf("+") < operation.lastIndexOf(".") ) {
			return true;
		}
	}
	return false;
}

/*
Gestion du bouton 'C' pour corriger la frappe
*/
var correct = document.getElementById("correct");
correct.onclick = function() {
	visualOperation.innerHTML = visualOperation.innerHTML.substring(0, visualOperation.innerHTML.length - 1);
	operation = operation.substring(0, operation.length - 1);
	
	/* Si l'utilisateur appuie sur 'C' pour enlever tous les caracteres, on reset la calculatrice */
	if (visualOperation.length == 0 || operation.length == 0) {
		clear();
	}
	
	/*
	Après chaque appuie sur 'C', on met à jour le result :
		- si operation ne se termine pas par un operateur, on evalue toute la chaine, 
		- si a la suite d'un appuie sur 'C' le dernier caracere est un operateur, on evalue operation sans ce dernier operateur
	*/
	if (operation.length != 0 && !endsWithOperator()) {
		evaluate();
	}
	
	if (endsWithOperator()) {
		result.innerHTML = eval( operation.substring(0, operation.length - 1) );
	}
}


/*
Keyboard support (european azerty keyboard, not tested with other configurations) : 
	- The calculator supports the keypad for numbers, period, operators.
	- It also supports 'regular' number (row above the letters), shift must be pressed to use them,
	- It supports /, *, -, and + on 'regular' keyboard (part where the letters are). Depending on the operator, shift should be pressed (true for / and + ; false for * and -).
	- The 'backslash' key act as the 'C' key, the 'delete' key resets the calculator. 
*/
document.addEventListener('keydown', function(event) {
	
	/* User press 0 */
    if(event.keyCode == 96 || (event.shiftKey && event.keyCode == 48)) { num0.click(); }
	
	/* User press 1 */
    else if(event.keyCode == 97 || (event.shiftKey && event.keyCode == 49)) { num1.click(); }
	
	/* User press 2 */
    else if(event.keyCode == 98 || (event.shiftKey && event.keyCode == 50)) { num2.click(); }
	
	/* User press 3 */
    else if(event.keyCode == 99 || (event.shiftKey && event.keyCode == 51)) { num3.click(); }

	/* User press 4 */
    else if(event.keyCode == 100 || (event.shiftKey && event.keyCode == 52)) { num4.click(); }

	/* User press 5 */
    else if(event.keyCode == 101 || (event.shiftKey && event.keyCode == 53)) { num5.click(); }
	
	/* User press 6 */
    else if(event.keyCode == 102 || (event.shiftKey && event.keyCode == 54)) { num6.click(); }
	
	/* User press 7 */
    else if(event.keyCode == 103 || (event.shiftKey && event.keyCode == 55)) { num7.click(); }
	
	/* User press 8 */
    else if(event.keyCode == 104 || (event.shiftKey && event.keyCode == 56)) { num8.click(); }
	
	/* User press 9 */
    else if(event.keyCode == 105 || (event.shiftKey && event.keyCode == 57)) { num9.click(); }
	
	/* User press '.' */
    else if(event.keyCode == 110) { dot.click(); }
	
	/* User press '/' */
    else if(event.keyCode == 111 || (event.shiftKey && event.keyCode == 58)) { divide.click(); }
	
	/* User press '*' */
    else if(event.keyCode == 106 || event.keyCode == 170) { multiply.click(); }
	
	/* User press '-' */
    else if(event.keyCode == 109 || event.keyCode == 54) { minus.click(); }
	
	/* User press '+' */
    else if(event.keyCode == 107 || (event.shiftKey && event.keyCode == 61)) { plus.click(); }

	/* User press BackSpace : act as the 'C' button */
    else if(event.keyCode == 8) { correct.click(); }
	
	/* User press Delete : reset the calculator */
    else if(event.keyCode == 46) { clear(); }
});
