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

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();};


//------------------------------ Classe du joueur + déclaration ------------------------------

class Player {
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

var player = new Player(400,400);


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
    if(zoneDuCode.hasChildNodes()){
        var commandeTableau = new Array();
        for(var i=0;i<zoneDuCode.childNodes.length;i++){
            commandeTableau.push(zoneDuCode.childNodes[i].id);
        }
        /////////
        for(var i=0;i<commandeTableau.length;i++){
            switch(commandeTableau[i]){
                case "Avancer":
                    ctx.clearRect(player.x,player.y,64,64);
                    player.y -= 64;
                    ctx.drawImage(playerImg,player.x,player.y);
                    break;
            }
            await sleep(1000);
        }
    }
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

zoneDuCode.ondragstart = function(e){
	blocEnMouvement = e.target;
};

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
    blocEnMouvement.dataset.parent = "zoneDuCode";
    //zoneDuCode.classList.remove("survol"); //On restaure l'interface 
};


//------------------------------ Evenements lorsqu'on entre, survole, quitte, et drop dans la zone de la poubelle ------------------------------

zonePoubelle.ondragenter = function(e){
    e.preventDefault();
    if(e.target.id=="imgPoubelle"){
        e.target.src = "src/media/trash_open.png";
    }
};

zonePoubelle.ondragover = function(e){
    e.preventDefault();
};

zonePoubelle.ondragleave = function(e){
    if(e.target.id=="imgPoubelle"){
        e.target.src = "src/media/trash_close.png";
    }
};

zonePoubelle.ondrop = function(e){
    if(blocEnMouvement.dataset.parent!=="zoneDesBlocs"){
        blocEnMouvement.parentNode.removeChild(blocEnMouvement);
        e.target.src = "src/media/trash_close.png";
    }
};