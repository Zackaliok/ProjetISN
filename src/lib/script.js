//------------------------------ Initialisation ------------------------------

var CodeAlgorithmeJoueur = new Array();
var playerImg;

const zoneDuCode = document.getElementById("zoneDuCode");
const Poubelle = document.getElementById("Poubelle");

var blocEnMouvement;

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


// ---------- Evenements de début et de fin de drag ----------

document.ondragstart = function(e){
    blocEnMouvement = e.target.cloneNode(true);
    blocEnMouvement.style.opacity = .2;
    e.dataTransfer.setData("text/html", this.innerHTML);
};

document.ondragend = function(e){
    blocEnMouvement.style.opacity = 1;
//    blocEnMouvement = null; //Pour l'instant inutile
};


// ---------- Evenements lorsqu'on entre, survole, et quitte la zone de 'drop' ----------

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
}


// ---------- Evenements lorsqu'on 'drop' une div ----------

zoneDuCode.ondrop = function(e){
    zoneDuCode.append(blocEnMouvement);
    //alert(Avancer);
    //zoneDuCode.classList.remove("survol"); //On restaure l'interface 
};


// ---------- Evenements lorsqu'on entre, survole, et quitte la zone de la poubelle ----------

Poubelle.ondragenter = function(e){
    e.preventDefault();
    //Je vais essayer de faire un changement de source de l'image
};

Poubelle.ondragover = function(e){
    e.preventDefault();
};

Poubelle.ondrop = function(e){
    var el = document.getElementById(e.dataTransfer.getData('Text'));
    el.parentNode.removeChild(el);
    //BON NSM J'Y ARRIVE PAS CA MME SOULE
};
