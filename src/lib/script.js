//------------------------------ Initialisation ------------------------------

let playerImg;
let blocEnMouvement;

//Zones :
const zoneDuCode = document.getElementById("zoneDuCode");
const zoneDesBlocs = document.getElementById("zoneDesBlocs");
const zonePoubelle = document.getElementById("zonePoubelle");

//Canvas :
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();};


//------------------------------ Classe du joueur + déclaration player ------------------------------

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
        remiseAZero();
        await sleep(500);
        for(var i=0;i<zoneDuCode.childNodes.length;i++){
            switch(zoneDuCode.childNodes[i].id){
                case "Avancer":
                    ctx.clearRect(player.x,player.y,64,64);
                    player.y -= 64;
                    ctx.drawImage(playerImg,player.x,player.y);
                    break;
            }
            await sleep(1000);
        }
    }else{
        alert("Il n'y a pas de bloc dans la zone !"); //Optionnel
    }
}


//------------------------------ Remet à zéro le canvas, etc ------------------------------

function remiseAZero(){
    ctx.clearRect(player.x,player.y,64,64);
    player.x = 400; player.y = 400;
    ctx.drawImage(playerImg,player.x,player.y);
}


//------------------------------ Evenements de début et de fin de drag dans la zone des blocs ------------------------------

zoneDesBlocs.ondragstart = function(e){
    blocEnMouvement = e.target.cloneNode(true);
    blocEnMouvement.style.opacity = .2;
    e.dataTransfer.setData("text/html", this.innerHTML);
};

zoneDesBlocs.ondragend = function(e){
    blocEnMouvement.style.opacity = "";
    //blocEnMouvement = null; //Pour l'instant inutile
};


//------------------------------ TEST ------------------------------

zoneDuCode.onmousedown = function(e){
    if(e.target.tagName=="DIV"){
        blocEnMouvement = e.target;
        e.preventDefault();
    }
    console.log(blocEnMouvement);
//    blocEnMouvement.style.left = e.clientX-rect.left;
//    blocEnMouvement.style.top = e.clientY-rect.top;
}


//------------------------------ Evenements lorsqu'on entre, survole, quitte, et drop dans la zone de code ------------------------------

var rect = zoneDuCode.getBoundingClientRect();
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
    if(blocEnMouvement.dataset.parent=="zoneDesBlocs"){
        zoneDuCode.append(blocEnMouvement);
        blocEnMouvement.dataset.parent = "zoneDuCode";
        blocEnMouvement.style.position="relative";
    }
    //zoneDuCode.classList.remove("survol"); //On restaure l'interface 
};


//------------------------------ Evenements lorsqu'on entre, survole, quitte, et drop dans la zone de la poubelle ------------------------------

zonePoubelle.ondragenter = function(e){
    e.preventDefault();
    if(e.target.id=="imgPoubelle" && blocEnMouvement.dataset.parent=="zoneDuCode"){
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