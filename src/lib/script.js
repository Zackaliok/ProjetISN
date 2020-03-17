//------------------------------ Initialisation ------------------------------

//Bloc et joueur :
var blocEnMouvement, indexBloc, sourisX, sourisY, chapitre=0, niveau=0; //Variables globales
var blocArray = new Array(); //Array contenant les blocs dans l'ordre d'affichage (de haut en bas)

//Zones :
const partieCode = document.getElementById("partieCode"); //Variable représentant la zone du code
const partieBanque = document.getElementById("partieBanque"); //Variable représentant la zone de la banque de bloc
var infoZone; //Variable représentant les caractèristiques (position, hauteur, etc) de la zone du code

//Canvas :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction (texte, images) sur la page


//---------------------------Switch Menu vers les niveaux et Initialisation de ceux-ci-----------------------

function affichageZone(z) {
    chapitre = z;
    alert("Affiche de la zone "+z);
    document.querySelector(".MapMonde").style.display="none";
    document.querySelector(".MapZone"+z).style.display="block";
}


function affichageNiveau(n){
    niveau = n;
    alert("Vous êtes dans la zone " + chapitre + " au niveau " + niveau + ".");
    
    document.querySelector(".menu").style.display="none";
    document.querySelector(".wrapper").style.display="flex";
    document.querySelector(".en-tete").style.display="flex";
    infoZone = partieCode.getBoundingClientRect(); 

//    switch(z){
//        case 1: //Affichage des blocs disponibles dans la zone 1:
//            document.getElementById('Avancer').style.display="block";
//            document.getElementById('Sauter').style.display="block";
//            document.getElementById('TournerAGauche').style.display="block";
//            document.getElementById('TournerADroite').style.display="block";
//            document.getElementById('Attaquer').style.display="block";
//            document.getElementById('TirerAlArc').style.display="block";
//        break;
//
//        case 2: //Affichage des blocs disponibles dans la zone 2:
//            document.getElementById('Avancer').style.display="block";
//            document.getElementById('Sauter').style.display="block";
//            document.getElementById('TournerAGauche').style.display="block";
//            document.getElementById('TournerADroite').style.display="block";
//            document.getElementById('Attaquer').style.display="block";
//            document.getElementById('TirerAlArc').style.display="block";
//            document.getElementById('Répéter').style.display="block";
//        break;
//
//        case 3: //Affichage des blocs disponibles dans la zone 3:
//            document.getElementById('Avancer').style.display="block";
//            document.getElementById('Sauter').style.display="block";
//            document.getElementById('TournerAGauche').style.display="block";
//            document.getElementById('TournerADroite').style.display="block";
//            document.getElementById('Attaquer').style.display="block";
//            document.getElementById('TirerAlArc').style.display="block";
//            document.getElementById('Répéter').style.display="block";
//            document.getElementById('If').style.display="block";
//        break;
//
//        case 4: //Affichage des blocs disponibles dans la zone 4:
//            //A continuer...
//        break;
//    }
//}


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
//            blocParent.dataset.stackedbot = "false";
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

partieCode.ondragenter = function(e){e.preventDefault();};
partieCode.ondragover = function(e){e.preventDefault();};

partieCode.ondrop = function(e){ 
    partieCode.append(blocEnMouvement);
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
