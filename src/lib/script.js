//------------------------------ Initialisation ------------------------------

//Bloc, joueur et map :
var blocEnMouvement, indexBloc, tileSet, sourisX, sourisY, nbCollage=0; //Variables globales
var blocArray = new Array(); //Array contenant les blocs dans l'ordre d'affichage (de haut en bas)
var map = new Array(); //Array à deux dimension (matrice) servant de carte pour construire les niveaux

//Zones :
const partieCode = document.getElementById("partieCode"); //Variable représentant la zone du code
const partieBanque = document.getElementById("partieBanque"); //Variable représentant la zone de la banque de bloc
const blocDepart = document.getElementById("blocDepart"); //Variable représentant le bloc de départ
const menuContextuel = document.querySelector(".menuContextuel"); //Variable représentant le menu contextuel personnalisé
const wrapper = document.querySelector(".wrapper"); //Variable représentant le contenant principal de l'app
var infoZone; //Variable représentant les caractèristiques (position, hauteur, etc) de la zone du code

//Canvas + image :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)
chargerImg("src/media/tileset.png"); //Charge le "tileset";

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction (texte, images) sur la page

//Déclaration du chapitre actuel et du niveau :
var chapitre = 1;
var niveau = 1;

//Variables pour savoir qui est affiché :
var mapMonde = true;
var mapZone = false;          //Touche pas j'en ai besoin (Tristan)
var niveauAffiché = false;


//--------------------------- Switch Menu vers les niveaux et Initialisation de ceux-ci -----------------------

//Bypass des menus :
//affichageZone(1);
//setTimeout(function (){affichageNiveau(1);},10);

function affichageZone(z){
    chapitre = z;
    alert("Affiche de la zone "+z);
    document.querySelector(".MapMonde").style.display="none";
    document.querySelector(".MapZone"+z).style.display="block";
    //document.querySelector(".boutonNiveau"+z).style.display="block";   //A mettre s'il y a un problème avec la selection de niveaux
    document.querySelector(".zoneFlèches").style.display="block";
    mapMonde=false;
    mapZone=true;     //Touche pas j'en ai besoin (Tristan)
}

//Abonnement pour le keydown avec la fonction
document.addEventListener("keydown",async function(evt) {
    if(mapZone==true){
        switch (evt.keyCode){
            case 37: //FlècheGauche
                document.getElementById("FlècheGauche").src="src/media/FlècheGaucheGlow.png";
                await sleep(100);
                document.getElementById("FlècheGauche").src="src/media/FlècheGauche.png";
                if(niveau!=1){
                    niveau=niveau-1;
                }
                //alert(niveau);
            break;
            case 39: //FlècheDroite
                document.getElementById("FlècheDroite").src="src/media/FlècheDroiteGlow.png";
                await sleep(100);
                document.getElementById("FlècheDroite").src="src/media/FlècheDroite.png";
                if(niveau!=5) {
                    niveau=niveau+1;
                }
                //alert(niveau);
            break;
            case 13: //Touche Entrée
              document.getElementById("Jouer").src="src/media/TouchePGlow.png";
              await sleep(100);
              document.getElementById("Jouer").src="src/media/ToucheP.png";
              affichageNiveau(niveau);
            break;
            case 27: //Touche Echap
              document.getElementById('Echap').src="src/media/EchapGlow.png";
              await sleep(100);
              document.getElementById('Echap').src="src/media/Echap.png";
              mapZone = false;
              mapMonde = true;
              document.querySelector(".MapMonde").style.display="block";
              document.querySelector(".MapZone"+chapitre).style.display="none";
              document.querySelector(".zoneFlèches").style.display="none";
              break;
        }
    }else{
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

    creerMap();

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


//------------------------------ Pop-up ! ------------------------------

function popup(texte){
    var popup = document.querySelector(".popup");
    popup.style.display = "flex";
    popup.style.top = "100px";
    popup.style.left = "calc(50% - 50px)";
    popup.children[0].innerHTML = texte;
}


//------------------------------ Menu contextuel (clique-droit) ------------------------------

document.oncontextmenu = (e) => {e.preventDefault();};

document.onmousedown = function(e){
    if(e.buttons == 1 && menuContextuel.style.display == "block" && e.target!==menuContextuel && e.target.tagName!=="BUTTON"){
        menuContextuel.style.display = "none";
    }
    else if(e.buttons == 2 && e.target!==partieBanque && e.target.parentNode!==partieBanque && wrapper.style.display=="flex"){
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

    pos(x,y,dir){
        this.x=x;
        this.y=y;
        this.dir=dir;
    }

    afficher(x,y,dir){
        this.dir = dir;
        switch(dir){
            case 0: //HAUT
                ctx.drawImage(tileSet,64,64,64,64,x,y,64,64);
                break;
            case 1: //DROITE
                ctx.drawImage(tileSet,64,0,64,64,x,y,64,64);
                break;
            case 2: //BAS
                ctx.drawImage(tileSet,0,64,64,64,x,y,64,64);
                break;
            case 3: //GAUCHE
                ctx.drawImage(tileSet,0,0,64,64,x,y,64,64);
                break;
        }
    }
}

var joueur = new Joueur(384,384,0); //Déclaration de l'objet Joueur avec 3 paramètres (x,y,dir)


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
        tileSet = img;
    });
}

function creerMap(){
    switch(chapitre + "-" + niveau){
        case "1-1":
            map[0] = Array(0,0,0,0,0,0,0,0,0);
            map[1] = Array(0,0,0,0,0,0,0,0,0);
            map[2] = Array(0,0,0,0,0,0,0,0,0);
            map[3] = Array(0,0,0,0,0,0,2,0,0);
            map[4] = Array(0,0,0,0,0,0,1,0,0);
            map[5] = Array(0,0,0,0,0,0,1,0,0);
            map[6] = Array(0,0,0,0,0,0,1,0,0);
            map[7] = Array(0,0,0,0,0,0,0,0,0);
            map[8] = Array(0,0,0,0,0,0,0,0,0);
            joueur.pos(384,384,0);
        break;

        case "1-2":
            map[0] = Array(0,0,0,0,0,0,0,0,0);
            map[1] = Array(0,0,0,0,0,0,0,0,0);
            map[2] = Array(0,0,0,0,0,0,0,0,0);
            map[3] = Array(0,0,0,0,0,0,2,0,0);
            map[4] = Array(0,0,0,0,0,0,1,0,0);
            map[5] = Array(0,0,0,0,0,0,1,0,0);
            map[6] = Array(0,0,0,0,1,1,1,0,0);
            map[7] = Array(0,0,0,0,0,0,0,0,0);
            map[8] = Array(0,0,0,0,0,0,0,0,0);
            joueur.pos(256,384,0);
        break;

    }
    afficherMap();
    joueur.afficher(joueur.x,joueur.y,joueur.dir);
}

function afficherMap(){
    for(var i=0;i<map.length;i++){
        for(var j=0;j<map[i].length;j++){
            switch(map[i][j]){
                case 0: //Herbe
                    ctx.drawImage(tileSet,128,0,64,64,64*j,64*i,64,64);
                break;

                case 1: //Sol
                    ctx.drawImage(tileSet,0,128,64,64,64*j,64*i,64,64);
                break;

                case 2: //Case Cible
                    ctx.drawImage(tileSet,64,128,64,64,64*j,64*i,64,64);
                break;
            }
        }
    }
}


//------------------------------ Executer le code + vérifier si le joueur a gagner ------------------------------

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); //Méthode asynchrone permettant de créer un 'temps d'arret' (ex : sleep(1000) arretera le code pendant 1sec)
}

async function win(){
    if(map[joueur.y/64][joueur.x/64] == 2){
        await sleep(200);
        alert("Tu as gagner !");
    }
}

async function executionCode(){
    remiseAZero();
    await sleep(800);
    if(blocArray.length>1 && blocDepart.dataset.stackedbot=="true"){
        for(var i=1;i<blocArray.length;i++){
            if(blocArray[i].dataset.stackedtop=="true"){
                switch(blocArray[i].id){
                    case "Avancer":
                        ctx.drawImage(tileSet,0,128,64,64,joueur.x,joueur.y,64,64);
                        joueur.y-=64;
                        joueur.afficher(joueur.x,joueur.y,joueur.dir);
                        win();
                    break;
                }
                await sleep(1000);
            }
        }
    }
}

function remiseAZero(){
    afficherMap();
    joueur.x = 384; joueur.y = 384; joueur.dir=0;
    joueur.afficher(joueur.x,joueur.y,joueur.dir);
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
        //popup("Prends un bloc et glisse-le faire la zone du milieu")
        popup("Suce ta race");
    }
});
