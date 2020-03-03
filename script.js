//------------------------------ Initialisation ------------------------------

//Bloc et joueur :
var imgJoueur, blocEnMouvement, sourisX, sourisY, indexBloc; //Variables globales
var blocArray = new Array(); //Array contenant les blocs dans l'ordre d'affichage (de haut en bas)

//Zones :
const zoneDuCode = document.getElementById("zoneDuCode"); //Variable représentant la zone du code
const zoneDesBlocs = document.getElementById("zoneDesBlocs"); //Variable représentant la zone des blocs
var infoZone = zoneDuCode.getBoundingClientRect(); //Variable représentant les caractèristiques (position, hauteur, etc) de la zone du code

//Canvas :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction (texte, images) sur la page


//------------------------------ Classe du joueur + déclaration ------------------------------
/*
    Les classe représentent des objets ayant des caractéristiques.
    Le "contructor" est l'élément obligatoire d'une classe, il permet d'enregistrer les différents paramètres.
    Par exemple, ici l'objet 'Joueur' a 3 paramètres, les positions x et y ainsi que la direction (dir).
    Par abus de langage on peut dire que le "constructor" agit comme une fonction au sein de la classe.
    Ainsi, "afficher" peut-être considérer (et remplacer) comme une fonction, elle sera appeler de cette manière :
    'joueur.afficher(x,y,dir)'.
*/

class Joueur {
    constructor(x,y,dir){
        this.x=x;
        this.y=y;
        this.dir=dir;
    }
    
    afficher(x,y,dir){
        this.dir = dir;
        switch(dir){
            case "HAUT":
                ctx.drawImage(imgJoueur,64,64,64,64,x,y,64,64);
                break;
            case "BAS":
                ctx.drawImage(imgJoueur,0,64,64,64,x,y,64,64);
                break;
            case "GAUCHE":
                ctx.drawImage(imgJoueur,0,0,64,64,x,y,64,64);
                break;
            case "DROITE":
                ctx.drawImage(imgJoueur,64,0,64,64,x,y,64,64);
                break;
        }
    }
}

var joueur = new Joueur(400,400,"HAUT"); //Déclaration de l'objet Joueur avec 3 paramètres (x,y,dir)


//------------------------------ Charger le "tileset" et l'afficher sur le canvas ------------------------------
/*
    Pour faire court, lorque l'on créer un objet 'Image()' et qu'on souhaite lui attribuer une source, le navigateur doit 
    d'abords charger l'image, sauf que le reste du code est exécuté en même temps et l'image n'a pas fini de charger avant
    qu'on lui attribue la source (qui ducoup n'existe pas). Pour palier à ce problème, on utilise la méthode asynchrone "Promise"
    qui représente littéralement une promesse. Cette promesse peut-être résolue dans le temps et bloque l'éxécution du code.
    Ainsi, lorque la promesse est résolue (ici le chargement de l'image) la méthode renvoie le résultat et permet l'exécution du code.
*/

function chargerImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
        imgJoueur = img;
    });
}

chargerImg("src/media/joueurSet.png").then(img => {
    joueur.afficher(joueur.x,joueur.y,joueur.dir);
});


//------------------------------ Executer le code mis en place dans la zone de code ------------------------------

var audio = new Audio();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); //Méthode asynchrone permettant de créer un 'temps d'arret' (ex : sleep(1000) arretera le code pendant 1sec)
}

async function executerCode(){
    if(zoneDuCode.hasChildNodes()){
        remiseAZero();
        await sleep(500);
        for (var i = 0; i < blocArray.length; i++){
			if(blocArray[i].dataset.type=="musique"){
				var idBloc = blocArray[i].id;
				audio.src="src/media/noteMusique/piano/"+idBloc+".mp3";
				audio.play();
				await sleep(800);
			}
			else if(blocArray[i].dataset.type=="deplacement"){
				alert("Deplacement du joueur");
			}
			else{
				alert("erreur");
			}
		}
    }else{
        alert("Il n'y a pas de bloc dans la zone !");
    }
}


//------------------------------ Remettre à zéro le canvas, etc ------------------------------

function remiseAZero(){
    ctx.clearRect(joueur.x,joueur.y,64,64);
    joueur.x = 400; joueur.y = 400;
    joueur.afficher(joueur.x,joueur.y,"HAUT");
}


//------------------------------ Trier les blocs dans le tableau selon leur position en X ------------------------------

function trierBloc(){
    for(var i=0;i<blocArray.length;i++){
        var bloc1Haut = blocArray[indexBloc].getBoundingClientRect().top;
        var bloc2Haut = blocArray[i].getBoundingClientRect().top;
        if((bloc1Haut < bloc2Haut && indexBloc > i) || (bloc1Haut > bloc2Haut && indexBloc < i)){
            blocArray[i] = blocArray.splice(indexBloc, 1, blocArray[i])[0];
        }
    }
}


//------------------------------ Déplacement des blocs à l'intérieur de la zone de code ------------------------------

zoneDuCode.onmousedown = function(e){
    if(e.target.dataset.parent=="zoneDuCode" && e.which !== 3){
        window.addEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement = e.target;
    }
};

window.onmouseup = function(){
    window.removeEventListener('mousemove', deplacerBloc, true);
};

function deplacerBloc(e){
	indexBloc = blocArray.indexOf(blocEnMouvement);
    if(e.clientX-75 > infoZone.left && e.clientX+75 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+20 < infoZone.bottom){
        blocEnMouvement.style.left = sourisX + 'px';
        blocEnMouvement.style.top = sourisY + 'px';
        sourisX = e.clientX - 75; sourisY = e.clientY - 20;
        trierBloc();
    }
}


//------------------------------ Evenements de début et de fin de drag dans la zone des blocs ------------------------------

zoneDesBlocs.ondragstart = function(e){
    blocEnMouvement = e.target.cloneNode(true);
    blocEnMouvement.style.opacity = .2;
    e.dataTransfer.setData("text/html", this.innerHTML);
};

zoneDesBlocs.ondragend = function(e){
    blocEnMouvement.style.opacity = "";
};


//------------------------------ Evenements lorsqu'on entre, survole et drop dans la zone de code ------------------------------

zoneDuCode.ondragenter = function(e){
    e.preventDefault();
};

zoneDuCode.ondragover = function(e){
    e.preventDefault();
};

zoneDuCode.ondrop = function(e){
    if(blocEnMouvement.dataset.parent=="zoneDesBlocs"){
        zoneDuCode.appendChild(blocEnMouvement);
        blocArray.push(blocEnMouvement);
		indexBloc = blocArray.indexOf(blocEnMouvement);
        
        sourisX = e.clientX - 75; sourisY = e.clientY - 20;
        blocEnMouvement.style.left = sourisX + 'px';
        blocEnMouvement.style.top = sourisY + 'px';
        
        blocEnMouvement.setAttribute("draggable",false);
        blocEnMouvement.dataset.parent = "zoneDuCode";
        blocEnMouvement.style.position = "absolute";
		
		trierBloc();
    }
};




window.addEventListener("keydown",function(e){
	switch(e.keyCode){
		case 96:
			var wrapper = document.querySelector(".wrapper");
			console.log(window.getComputedStyle(wrapper,"display"));
			break;
	}
});

