//------------------------------ Initialisation ------------------------------

var CodeAlgorithmeJoueur = new Array();
var playerImg;
let blocEnMouvement;

//Zones :
const zoneDuCode = document.getElementById("zoneDuCode");
const zoneDesBlocs = document.getElementById("zoneDesBlocs");
const zonePoubelle = document.getElementById("zonePoubelle");

//Canvas :
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 600; canvas.width = 600;


//------------------------------ Classe du joueur + déclaration ------------------------------

class Player {
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

var player = new Player(400,400);


//------------------------------ Ajoute un bloc dans l'esapce de codage ------------------------------

function ajouterBloc(nom){
    zoneDuCode.innerHTML += "<p class='blocCommande'>"+nom+"</p>";
    CodeAlgorithmeJoueur.push(nom);
}


//------------------------------ Charger une image et l'afficher sur le canvas ------------------------------

function loadImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
        playerImg = img;
    });
}

loadImg("src/media/player.png").then(img => {
    ctx.drawImage(img,player.x,player.y);
});


//------------------------------ Executer le code mis en place dans la zone de codage ------------------------------


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executerCode(){
}


//------------------------------ Evenements de début et de fin de drag dans la zone des blocs ------------------------------

zoneDesBlocs.ondragstart = function(e){
    blocEnMouvement = e.target.cloneNode(true);
    blocEnMouvement.style.opacity = .2;
    e.dataTransfer.setData("text/html", this.innerHTML);
};

zoneDesBlocs.ondragend = function(e){
    blocEnMouvement.style.opacity = 1;
    //blocEnMouvement = null; //Pour l'instant inutile
};


//------------------------------ Evenements lorsqu'on entre, survole, quitte, et drop dans la zone de code ------------------------------

zoneDuCode.ondragenter = function(e){
    e.preventDefault();
    //zoneDuCode.classList.add("survol");
};

zoneDuCode.ondragover = function(e){
    e.preventDefault();
};

zoneDuCode.ondragleave = function(e){
    //zoneDuCode.classList.remove("survol");
    //zoneDuCode.idList.add("survol");
};

zoneDuCode.ondrop = function(e){
	zoneDuCode.append(blocEnMouvement);

    //alert(Avancer);
    //zoneDuCode.classList.remove("survol"); //On restaure l'interface 
};


// ---------- Evenements lorsqu'on entre, survole, quitte, et drop dans la zone de la poubelle ----------

let blocASupprimer;

zonePoubelle.ondragenter = function(e){
    e.preventDefault();
    //Je vais essayer de faire un changement de source de l'image
};

zoneDuCode.ondragstart = function(e){
	blocASupprimer = e.target;
};


zonePoubelle.ondragover = function(e){
    e.preventDefault();
};

zonePoubelle.ondrop = function(){
	document.getElementById(blocEnMouvement.id).parentNode.removeChild(blocASupprimer);
};
