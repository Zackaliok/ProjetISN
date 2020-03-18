//------------------------------ Initialisation ------------------------------

//Bloc et joueur :
var blocEnMouvement, indexBloc, imgJoueur, sourisX, sourisY, nbCollage=0; //Variables globales
var blocArray = new Array(); //Array contenant les blocs dans l'ordre d'affichage (de haut en bas)

//Zones :
const partieCode = document.getElementById("partieCode"); //Variable représentant la zone du code
const partieBanque = document.getElementById("partieBanque"); //Variable représentant la zone de la banque de bloc
const blocDepart = document.getElementById("blocDepart"); //Variable représentant le bloc de départ
const menuContextuel = document.querySelector(".menuContextuel"); //Variable représentant la div du menu contextuel personnalisé
var infoZone; //Variable représentant les caractèristiques (position, hauteur, etc) de la zone du code

//Canvas :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction (texte, images) sur la page

//Déclaration du chapitre actuel et du niveau :
var chapitre = 1;
var niveau = 1;

//Variables pour savoir qui est affiché :
var mapMonde = true;
var mapZone = false;          //Touche pas j'en ai besoin (Tristan)
var niveauAffiché = false;


//---------------------------Switch Menu vers les niveaux et Initialisation de ceux-ci-----------------------

affichageNiveau(1); 
//Bypass la selection de zone et niveaux

function affichageZone(z){
    chapitre = z;
    alert("Affiche de la zone "+z);
    document.querySelector(".MapMonde").style.display="none";
    document.querySelector(".MapZone"+z).style.display="block";
    document.querySelector(".boutonNiveau"+z).style.display="block";
    document.querySelector(".zoneFlèches").style.display="block";
    mapMonde=false;
    mapZone=true;     //Touche pas j'en ai besoin (Tristan)
}

//Abonnement pour le keydown avec la fonction
document.addEventListener("keydown",(evt) => {
  if (mapZone==true) {
    switch (evt.keyCode) {
      case 37://FlècheGauche
          if (niveau!=1) {
            niveau=niveau-1;
          }
          alert(niveau);
        break;
      case 39://FlècheDroite
          if (niveau!=5) {
            niveau=niveau+1;
          }
          alert(niveau);
        break;
      case 13://Touche Entrée   Avant c'était la touche P mais j'ai changé
          affichageNiveau(niveau);
        break;
    }
  } else {
    //alert("Ya une couuille");
  }
});


function affichageNiveau(n){
    niveau = n;
    alert("Vous êtes dans la zone " + chapitre + " au niveau " + niveau + ".");

    mapZone=false;      //Touche pas j'en ai besoin (Tristan)
    niveauAffiché=true;
    
    document.querySelector(".menu").style.display="none";
    document.querySelector(".wrapper").style.display="flex";
    document.querySelector(".en-tete").style.display="flex";
    infoZone = partieCode.getBoundingClientRect();
    blocArray.push(blocDepart);

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
}


//------------------------------ Menu contextuel (clique-droit) ------------------------------




document.oncontextmenu = (e) => {e.preventDefault();};

document.onmousedown = function(e){
    if(e.buttons == 1 && menuContextuel.style.display == "block" && e.target!==menuContextuel && e.target.tagName!=="BUTTON"){
        menuContextuel.style.display = "none";
    }
    else if(e.buttons == 2 && e.target!==partieBanque && e.target.parentNode!==partieBanque){
        var x = e.clientX + 10; var y = e.clientY;
        menuContextuel.style.display = "block";
        menuContextuel.style.left = x+"px";
        menuContextuel.style.top = y+"px";
        blocEnMouvement = e.target;
    }
};

function supprimerBloc(){
    if(blocEnMouvement.className=="bloc" && blocEnMouvement.dataset.stackedtop=="false" && blocEnMouvement.dataset.stackedbot=="false"){
        indexBloc = blocArray.indexOf(blocEnMouvement);
        blocArray.splice(indexBloc,1);
        blocEnMouvement.parentNode.removeChild(blocEnMouvement);
        menuContextuel.style.display = "none"; 
    }else{
        menuContextuel.style.display = "none";
    }
}




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
            case 0: //HAUT
                ctx.drawImage(imgJoueur,64,64,64,64,x,y,64,64);
                break;
            case 1: //DROITE
                ctx.drawImage(imgJoueur,64,0,64,64,x,y,64,64);
                break;
            case 2: //BAS
                ctx.drawImage(imgJoueur,0,64,64,64,x,y,64,64);
                break;
            case 3: //GAUCHE
                ctx.drawImage(imgJoueur,0,0,64,64,x,y,64,64);
                break;
        }
    }
}

var joueur = new Joueur(400,400,0); //Déclaration de l'objet Joueur avec 3 paramètres (x,y,dir)


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
    for(var i=0;i<partieCode.children.length;i++){
        var child = partieCode.children[i];
        var rect1 = blocEnMouvement.getBoundingClientRect();
        var rect2 = partieCode.children[i].getBoundingClientRect();
        if(child!==blocEnMouvement && (child.dataset.stackedtop=="true" || child.id=="blocDepart") && child.dataset.stackedbot=="false"){
            if(rect1.top-15 <= rect2.bottom && rect1.top-15 >= rect2.bottom-20 && rect1.left >= rect2.left-30 && rect1.right <= rect2.right+30){
                partieCode.children[i].children[1].style.display = "block";
                
            }else{
                partieCode.children[i].children[1].style.display = "none";
            }
        }
    }
}

function collageBloc(){
    for(var i=0;i<partieCode.children.length;i++){
        if(partieCode.children[i]!==blocEnMouvement){
            if(partieCode.children[i].children[1].style.display == "block"){
                nbCollage++;
                blocEnMouvement.style.left = blocDepart.getBoundingClientRect().left-5+"px";
                blocEnMouvement.style.top = blocDepart.getBoundingClientRect().top+(33*nbCollage)+5+"px";

                blocEnMouvement.dataset.stackedtop = "true";
                partieCode.children[i].dataset.stackedbot = "true";
                partieCode.children[i].children[1].style.display = "none";
            }
        }
    }
}


//------------------------------ Déplacement des blocs à l'intérieur de la zone de code ------------------------------

partieCode.onmousedown = function(e){
    if(e.target.className=="bloc" && e.buttons == 1){
        window.addEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement = e.target;
        blocEnMouvement.style.cursor = "grabbing";
    }
};

document.onmouseup = function(e){
    if(e.target.className=="bloc"){
        window.removeEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement.style.cursor = "grab";
        blocEnMouvement.style.zIndex = 0;
        collageBloc();
    }
};

function deplacerBloc(e){
	indexBloc = blocArray.indexOf(blocEnMouvement);
    blocEnMouvement.style.zIndex = 100;

    if(e.clientX-75 > infoZone.left && e.clientX+75 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+20 < infoZone.bottom){
        if(blocEnMouvement.dataset.stackedtop == "true"){
            if(blocEnMouvement.dataset.stackedbot !== "true"){
                sourisX = e.clientX - 75; sourisY = e.clientY - 20;
                blocEnMouvement.style.left = sourisX+"px";
                blocEnMouvement.style.top = sourisY+"px";
                nbCollage--;
                blocEnMouvement.dataset.stackedtop = "false";
                for(var i=0;i<blocArray.length;i++){
                    blocArray[indexBloc-1].dataset.stackedbot = "false";
                }
            }
        }else{
            sourisX = e.clientX - 75; sourisY = e.clientY - 20;
            blocEnMouvement.style.left = sourisX+"px";
            blocEnMouvement.style.top = sourisY+"px";
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
