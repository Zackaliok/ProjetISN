//------------------------------ Initialisation ------------------------------

//Bloc et joueur :
var blocEnMouvement, indexBloc, sourisX, sourisY; //Variables globales
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


//---------------------------Switch Menu vers les niveaux et Initialisation de ceux-ci-----------------------

var chapitre=0;
var niveau=0;
var leMenuEstAffiché=true;
var unNiveauEstAffiché=false;

function affichageDuNiveauSouhaité(z,n){
    chapitre=z;
    niveau=n;
    alert("Vous êtes dans la zone " + chapitre + " au niveau " + niveau + ".");

    leMenuEstAffiché=false;
    document.getElementById('menu').style.display="none";
    unNiveauEstAffiché=true;
    document.getElementById('wrapper').style.display="flex";


    //Code que je vais compléter... (Tristan)
    switch (z){
      case 1:
        //document.getElementById('Avancer').style.display="flex";
        //document.getElementById('Sauter').style.display="flex";
        break;
      case 2:

        break;
      case 3:

        break;
      case 4:

        break;
    }

}


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

function detectionCollage(){
    for(var i=0;i<blocArray.length;i++){
        var rect1 = blocArray[indexBloc].getBoundingClientRect();
        var rect2 = blocArray[i].getBoundingClientRect();
        
        if(rect1.top-10 <= rect2.bottom && rect1.left >= rect2.left-20 && rect1.right <= rect2.right+20 && blocArray[i].dataset.stackedbot=="false" && indexBloc > i){
            blocArray[i].children[1].style.display = "block";
        }else{
            blocArray[i].children[1].style.display = "none";
        }
    }
}

function collageBloc(){
    for(var i=0;i<blocArray.length;i++){
        if(blocArray[i].children[1].style.display == "block"){
            blocEnMouvement.style.left = getComputedStyle(blocArray[i]).left;
            blocEnMouvement.style.top = (parseInt(getComputedStyle(blocArray[i]).top)+33).toString()+"px";
            
            blocEnMouvement.dataset.stackedtop = "true";
            blocArray[i].dataset.stackedbot = "true";
            blocArray[i].children[1].style.display = "none";
        }
    }
}


//------------------------------ Déplacement des blocs à l'intérieur de la zone de code ------------------------------

partieCode.onmousedown = function(e){
    if(e.target.className=="bloc" && e.which !== 3){
        window.addEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement = e.target;
        blocEnMouvement.style.cursor = "grabbing";
    }
};

document.onmouseup = function(e){
    if(e.target.className=="bloc"){
        window.removeEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement.style.cursor = "grab";
        collageBloc();
    }
};

function deplacerBloc(e){
	indexBloc = blocArray.indexOf(blocEnMouvement);
    if(e.clientX-75 > infoZone.left && e.clientX+75 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+20 < infoZone.bottom){
        sourisX = e.clientX - 75; sourisY = e.clientY - 20;
        blocEnMouvement.style.left = sourisX+"px";
        blocEnMouvement.style.top = sourisY+"px";
        
        if(blocEnMouvement.dataset.stackedbot == "true"){
            for(var i=0;i<blocArray.length;i++){
                if(blocArray[i].dataset.stackedtop == "true"){
                    blocArray[i].style.left = sourisX+"px";
                    blocArray[i].style.top = sourisY+(33*(i))+"px";
                }
            }
        }
        
        if(blocEnMouvement.dataset.stackedtop == "true"){
            blocEnMouvement.dataset.stackedtop = "false";
            blocParent.dataset.stackedbot = "false";
        }
        
        trierBloc();
        detectionCollage();
    }
}


//------------------------------ Drag & Drop ------------------------------

partieBanque.ondragstart = function(e){
    blocEnMouvement = e.target.cloneNode(true);
    e.dataTransfer.setData("text/html", this.innerHTML);
};

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
        blocEnMouvement.style.left = sourisX+"px";
        blocEnMouvement.style.top = sourisY+"px";
    }else{
        blocEnMouvement.style.left = "50%"; 
        blocEnMouvement.style.top = "50%";
    }
    
    trierBloc();
};


//------------------------------ Debugage et tests ------------------------------

window.addEventListener("keydown", function(e){
    if(e.keyCode == 96){
        console.log(blocArray)
    }
});
