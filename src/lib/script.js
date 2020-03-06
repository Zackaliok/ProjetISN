//------------------------------ Initialisation ------------------------------

//Bloc et joueur :
var blocEnMouvement, sourisX, sourisY, indexBloc, blocParent; //Variables globales
var blocArray = new Array(); //Array contenant les blocs dans l'ordre d'affichage (de haut en bas)

//Zones :
const partieCode = document.getElementById("partieCode"); //Variable représentant la zone de code
const partieBanque = document.getElementById("partieBanque"); //Variable représentant la zone de la banque de bloc
var infoZone = partieCode.getBoundingClientRect(); //Variable représentant les caractèristiques (position, hauteur, etc) de la zone du code

//Canvas :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction (texte, images) sur la page


//------------------------------ Trier les blocs & les coller ------------------------------

function trierBloc(){
    for(var i=0;i<blocArray.length;i++){
        var bloc1Haut = blocArray[indexBloc].getBoundingClientRect().top;
        var bloc2Haut = blocArray[i].getBoundingClientRect().top;
        if((bloc1Haut < bloc2Haut && indexBloc > i) || (bloc1Haut > bloc2Haut && indexBloc < i)){
            blocArray[i] = blocArray.splice(indexBloc, 1, blocArray[i])[0];
        }
    }
}

function collageBloc(){
    for(var i=0;i<blocArray.length;i++){
        var rect1 = blocArray[indexBloc].getBoundingClientRect();
        var rect2 = blocArray[i].getBoundingClientRect();
        if(rect1.top-10 <= rect2.bottom && indexBloc > i){
            if(rect1.left >= rect2.left-20 && rect1.right <= rect2.right+20){
                blocArray[i].childNodes[3].style.display = "block";
                blocParent = blocArray[i];
            }
        }else{
            blocArray[i].childNodes[3].style.display = "none";
        }
    }
}


//------------------------------ Déplacement des blocs à l'intérieur de la zone de code ------------------------------

partieCode.onmousedown = function(e){
    if(e.target.dataset.parent=="partieBanque" && e.which !== 3){
        window.addEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement = e.target;
        blocEnMouvement.style.cursor = "grabbing";
    }
};

document.onmouseup = function(e){
    if(blocEnMouvement!==undefined){
        window.removeEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement.style.cursor = "grab";
        
        if(blocParent!== undefined && blocParent.childNodes[3].style.display == "block"){
            blocEnMouvement.style.left = getComputedStyle(blocParent).left;
            blocEnMouvement.style.top = (parseInt(getComputedStyle(blocParent).top)+33).toString()+"px";
            blocEnMouvement.dataset.stacked = "true";
            blocParent.dataset.stacked = "true";
            blocParent.childNodes[3].style.display = "none";
        }
        blocEnMouvement = undefined;
    }
};

function deplacerBloc(e){
	indexBloc = blocArray.indexOf(blocEnMouvement);
    if(e.clientX-75 > infoZone.left && e.clientX+75 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+20 < infoZone.bottom){
        sourisX = e.clientX - 75; sourisY = e.clientY - 20;
        blocEnMouvement.style.left = sourisX+"px";
        blocEnMouvement.style.top = sourisY+"px";
        trierBloc();
        
        if(blocEnMouvement.dataset.stacked == "true"){
            blocArray[indexBloc+1].style.left = sourisX+"px";
            blocArray[indexBloc+1].style.top = sourisY+33+"px";
        }
        
        collageBloc();
    }
}


//------------------------------ Drag & Drop ------------------------------

partieBanque.ondragstart = function(e){
    blocEnMouvement = e.target.cloneNode(true);
    e.dataTransfer.setData("text/html", this.innerHTML);
};

partieBanque.ondrop = function(e){blocEnMouvement = undefined;};
partieBanque.ondragover = function(e){e.preventDefault();};
partieCode.ondragenter = function(e){e.preventDefault();};
partieCode.ondragover = function(e){e.preventDefault();};

partieCode.ondrop = function(e){
    partieCode.appendChild(blocEnMouvement);
    blocArray.push(blocEnMouvement);
    indexBloc = blocArray.indexOf(blocEnMouvement);
    blocEnMouvement.removeAttribute("draggable");
    blocEnMouvement.style.position = "absolute";
    
    if(e.clientX-75 > infoZone.left && e.clientX+75 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+20 < infoZone.bottom){
        sourisX = e.clientX - 75; sourisY = e.clientY - 20;
        blocEnMouvement.style.left = sourisX+"px"; blocEnMouvement.style.top = sourisY+"px";
    }else{
        blocEnMouvement.style.left = "50%"; blocEnMouvement.style.top = "50%";
    }
    trierBloc();
    blocEnMouvement = undefined;
};