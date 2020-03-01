//------------------------------ Initialisation ------------------------------

//Bloc et joueur :
var imgJoueur, blocEnMouvement, sourisX, sourisY, idBloc;
var blocArray = new Array();

//Zones :
const zoneDuCode = document.getElementById("zoneDuCode");
const zoneDesBlocs = document.getElementById("zoneDesBlocs");
var infoZone = zoneDuCode.getBoundingClientRect();

//Canvas :
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();};


//------------------------------ Classe du joueur + déclaration ------------------------------

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

var joueur = new Joueur(400,400,"HAUT");


//------------------------------ Charger le "tileset" et l'afficher sur le canvas ------------------------------

function loadImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
        imgJoueur = img;
    });
}

loadImg("src/media/joueurSet.png").then(img => {
    joueur.afficher(joueur.x,joueur.y,joueur.dir);
});


//------------------------------ Executer le code mis en place dans la zone de code ------------------------------


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executerCode(){
    if(zoneDuCode.hasChildNodes()){
        remiseAZero();
        await sleep(500);
        //Code à faire !!!
    }else{
        alert("Il n'y a pas de bloc dans la zone !"); //Optionnel
    }
}


//------------------------------ Remettre à zéro le canvas, etc ------------------------------

function remiseAZero(){
    ctx.clearRect(joueur.x,joueur.y,64,64);
    joueur.x = 400; joueur.y = 400;
    joueur.afficher(joueur.x,joueur.y,"HAUT");
}


//------------------------------ Déplacement des blocs à l'intérieur de la zone de code ------------------------------

zoneDuCode.onmousedown = function(e){
    if(e.target.dataset.parent=="zoneDuCode" && e.which !== 3){
        window.addEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement = e.target;
        idBloc = blocArray.indexOf(blocEnMouvement);
    }
};

window.onmouseup = function(){
    window.removeEventListener('mousemove', deplacerBloc, true);
};

function deplacerBloc(e){
    if(e.clientX-75 > infoZone.left && e.clientX+85 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+30 < infoZone.bottom){
        blocEnMouvement.style.transform = "translate("+sourisX+"px, "+sourisY+"px)";
        sourisX = e.clientX - infoZone.left - 75;
        sourisY = e.clientY - infoZone.top - 20;
        
        for(var i=0;i<blocArray.length;i++){
            var bloc1Top = blocArray[idBloc].getBoundingClientRect().top;
            var bloc2Top = blocArray[i].getBoundingClientRect().top;
            
            if((bloc1Top < bloc2Top && idBloc > i) || (bloc1Top > bloc2Top && idBloc < i)){
                blocArray[i] = blocArray.splice(idBloc, 1, blocArray[i])[0];
            }
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
        
        sourisX = e.clientX - infoZone.left - 75;
        sourisY = e.clientY - infoZone.top - 20;
        blocEnMouvement.style.transform = "translate("+sourisX+"px, "+sourisY+"px)";
        
        idBloc = blocArray.indexOf(blocEnMouvement);
//        for(var i=0;i<blocArray.length;i++){
//            var blocHaut = blocArray[i].getBoundingClientRect().top;
//
//            if(blocArray[idBloc].getBoundingClientRect().top < blocHaut && idBloc > i){
//                blocArray[i] = blocArray.splice(idBloc, 1, blocArray[i])[0];
//            }
//        }
                
        blocEnMouvement.setAttribute("draggable",false);
        blocEnMouvement.dataset.parent = "zoneDuCode";
    }
};