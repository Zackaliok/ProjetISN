//------------------------------ Initialisation ------------------------------

//Bloc, joueur, map et audio :
var blocEnMouvement, indexBloc, tileSet, infoZone, zone=1, niveau=1; //Variables globales
var blocArray = new Array(); //Array contenant les blocs dans l'ordre d'affichage (de haut en bas)
var map = new Array(); //Array à deux dimension (matrice) servant de carte pour construire les niveaux
var audio = new Audio(); //Variable représenant l'audio de la page
var joueur = new Joueur(384,384,0); //Déclaration de l'objet Joueur avec 3 paramètres (x,y,dir)

//Canvas + image :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)
chargerImg("src/media/tileset.png"); //Charge le "tileset";

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction (texte, images) sur la page

//Bypass les menus :
affichageMenu();
affichageZone(1);
setTimeout('affichageNiveau(1)',10);

//Créer un temps d'arret :
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//--------------------------- Menu, map monde et choix du niveau -----------------------

//Ajoute un evenement "onclick" aux "area" :
var area = document.getElementsByTagName("area");
for(var i=0;i<area.length;i++){
    area[i].addEventListener("click", function() {
        affichageZone(parseInt(this.title.match(/\d+/)));
    });
}

function affichageMenu(){
    document.querySelector(".accueil").style.display = "none";
    mapMonde.style.display = "flex";
}

function affichageZone(z){
    zone = z;
    mapMonde.style.display = "none";
    document.querySelector(".mapZone"+z).style.display = "block";
    document.querySelector(".zoneFleches").style.display = "flex";
}

function affichageNiveau(n){
    niveau = n;
    alert("Vous êtes dans la zone " + zone + " au niveau " + niveau + ".");
    menu.style.display = "none";
    wrapper.style.display = "flex";
    enTete.style.display = "flex";
    document.querySelector(".mapZone"+zone).style.display = "none";
    enTete.innerHTML = "Zone "+zone+" &nbsp; | &nbsp; Niveau "+niveau;
    infoZone = partieCode.getBoundingClientRect();
    blocArray.push(blocDepart);
    creerMap();
}

document.addEventListener("keydown", (e) => {
    if(document.querySelector(".mapZone"+zone).style.display=="block"){
        switch(e.keyCode){
            case 37: //Flèche Gauche
                toucheFlecheGauche.src = "src/media/touche/toucheFlecheGaucheGlow.png";
                setTimeout('toucheFlecheGauche.src="src/media/touche/toucheFlecheGauche.png"',100);
                if(niveau!=1){niveau -= 1;}
            break;
            case 39: //Flèche Droite
                toucheFlecheDroite.src = "src/media/touche/toucheFlecheDroiteGlow.png";
                setTimeout('toucheFlecheDroite.src="src/media/touche/toucheFlecheDroite.png"',100);
                if(niveau!=5){niveau += 1;}
            break;
            case 13: //Touche Entrée
                toucheEntree.src = "src/media/touche/toucheEntreeGlow.png";
                setTimeout('toucheEntree.src="src/media/touche/toucheEntree.png"',100);
                affichageNiveau(niveau);
            break;
            case 27: //Touche Echap
                toucheEchap.src = "src/media/touche/toucheEchapGlow.png";
                setTimeout('toucheEchap.src="src/media/touche/toucheEchap.png"',100);
                mapMonde.style.display = "block";
                document.querySelector(".mapZone"+zone).style.display = "none";
                document.querySelector(".zoneFleches").style.display = "none";
            break;
        }
    }
});


//------------------------------ Pop-up ! ------------------------------

function popup(texte){
    popups.style.visibility = "visible";
    popups.style.display = "flex";
    popups.children[0].innerHTML = texte;
    popups.style.animation = "ouverturePopup 0.2s ease-in 0s 1 normal forwards";
    audio.src = "src/media/son/orb.mp3";
    audio.play();
}

function fermerPopup(){
    popups.style.animation = "fermeturePopup 1s ease-out 0.2s 1 normal forwards";
}


//------------------------------ Menu contextuel (clique-droit) ------------------------------

document.oncontextmenu = (e) => {
    if(e.target==partieCode || e.target==blocDepart || e.target.className=="bloc" || e.target.tagName=="BUTTON"){
        e.preventDefault();
    }
};

document.onmousedown = function(e){
    if(menuContextuel.style.display=="block" && e.target!==menuContextuel && e.target.tagName!=="BUTTON"){
        menuContextuel.style.display = "none";
    }
    else if(e.buttons==2 && wrapper.style.display=="flex" && ((e.target.className=="bloc" && e.target.parentNode!==partieBanque) || e.target==partieCode)){
        var x = e.clientX + 10; var y = e.clientY;
        menuContextuel.style.display = "block";
        menuContextuel.style.left = x+"px";
        menuContextuel.style.top = y+"px";
        blocEnMouvement = e.target;
    }
};

function supprimerBloc(){
    if(blocEnMouvement.className=="bloc" && blocEnMouvement.dataset.stackedtop=="false" && blocEnMouvement.dataset.stackedbot=="false"){
        menuContextuel.style.display = "none";
        blocEnMouvement.parentNode.removeChild(blocEnMouvement);
    }else{
        menuContextuel.style.display = "none";
    }
}

function supprimerToutLesBloc(){
    if(partieCode.children.length > 1){
        menuContextuel.style.display = "none";
        while(partieCode.children.length > 1){partieCode.removeChild(partieCode.children[1]);}
        blocArray.splice(0,blocArray.length);
        blocDepart.dataset.stackedbot = "false";
    }else{
        menuContextuel.style.display = "none";
    }
}

function dupliquerBloc(e){
    if(blocEnMouvement.className=="bloc"){
        menuContextuel.style.display = "none";
        blocEnMouvement = blocEnMouvement.cloneNode(true);
        partieCode.append(blocEnMouvement);
        blocEnMouvement.style.left = parseInt(blocEnMouvement.style.left)+10+"px";
        blocEnMouvement.style.top = parseInt(blocEnMouvement.style.top)+10+"px";
        blocEnMouvement.dataset.stackedtop = "false";
        blocEnMouvement.dataset.stackedbot = "false"
    }else{
        menuContextuel.style.display = "none";
    }
}


//------------------------------ Menu paramètres -------------------------------------------

var modeSombre = false; //Pour activer le mode sombre.

function afficherParametres(){
    if(menuParametres.style.display=="none"){
        controlesJeu.style.display = "none";
        menuParametres.style.display = "flex";
    }else{
        menuParametres.style.display = "none";
        controlesJeu.style.display = "flex";
    }
}

function switchMusique(){
    if(audio.muted==false){
        audio.muted = true;
        imgMusique.src="src/media/icon/audio-off-icon.png";
        popup("Musique désactivée !");
    }else{
        audio.muted = false;
        imgMusique.src="src/media/icon/audio-icon.png";
        popup("Musique activée !");
    }
}

function switchModeSombre() {
    if(modeSombre==false){
        modeSombre = true;
        imgModeSombre.src = "src/media/icon/moon-white.png";
        partieBanque.style.background = "rgb(60,60,60)";
        partieCode.style.background = "rgb(60,60,60)";
        enTete.style.background = "#3c5a96";
        partieControle.style.background = "rgb(60,60,60)";
        document.body.style.background = "#6a758a";
    }else{
        modeSombre = false;
        imgModeSombre.src="src/media/icon/moon-black.png";
        partieBanque.style.background = "white";
        partieCode.style.background = "white";
        enTete.style.background = "#6699ff";
        partieControle.style.background = "white";
        document.body.style.background = "#bbcdf0";
    }
}

function switchCodeSource(){
    //Bon euh faudrait qu'on complete ca a la fin
}

function retournerAuMenu(){
    supprimerToutLesBloc();
    document.querySelector(".mapZone"+zone).style.display="none";
    document.querySelector(".zoneFleches").style.display="none";
    menu.style.display = "flex";
    mapMonde.style.display = "block";
    wrapper.style.display = "none";
    enTete.style.display = "none";
    menuParametres.style.display="none";
    controlesJeu.style.display="flex";
}


//------------------------------ Gestion du "tileset" et de la map ------------------------------

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

function afficherBloc(liste){
    for(var i=0;i<partieBanque.children.length;i++){
        document.getElementById(partieBanque.children[i].id).style.display = "none";
    }
    for(var i=0;i<liste.length;i++){
        document.getElementById(liste[i]).style.display = "block";
    }
}

function creerMap(){
    switch(zone + "-" + niveau){
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
//            afficherBloc(["Avancer"]);
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
            joueur.pos(256,384,1);
//            afficherBloc(["Avancer","Sauter"]);
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

function win(){
    if(map[joueur.y/64][joueur.x/64]==2){
        popup("Tu as completé le niveau "+niveau+" de la zone "+zone+" !");
        setTimeout(() => {
            fermerPopup();
            supprimerToutLesBloc();
            affichageNiveau(niveau+1);
        },3000);
    }
}

async function executionCode(){
    creerMap();
    await sleep(800);
    for(var i=1;i<blocArray.length;i++){
        if(blocArray.length>1){
            switch(blocArray[i].id){
                case "Avancer":
                    var sauvPos = [joueur.x,joueur.y];
                    ctx.drawImage(tileSet,0,128,64,64,sauvPos[0],sauvPos[1],64,64);
                    switch(joueur.dir){
                        case 0: joueur.y-=64; break;
                        case 1: joueur.x+=64; break;
                        case 2: joueur.y+=64; break;
                        case 3: joueur.x-=64; break;
                    }
                    if(map[joueur.y/64][joueur.x/64]!==0){
                        joueur.afficher(joueur.x,joueur.y,joueur.dir);
                    }else{
                        joueur.afficher(sauvPos[0],sauvPos[1],joueur.dir);
                    }
                break;
            }
            win();
            await sleep(800);
        }
    }
}


//------------------------------ Attacher les blocs entre eux ------------------------------

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
        if(partieCode.children[i]!==blocEnMouvement && partieCode.children[i].children[1].style.display == "block"){
            blocEnMouvement.style.left = partieCode.children[i].getBoundingClientRect().left-5+"px";
            blocEnMouvement.style.top = partieCode.children[i].getBoundingClientRect().bottom-12+"px";
            blocEnMouvement.dataset.stackedtop = "true";
            partieCode.children[i].dataset.stackedbot = "true";
            partieCode.children[i].children[1].style.display = "none";
            
            blocArray.push(blocEnMouvement);
        }
    }
}


//------------------------------ Déplacement des blocs à l'intérieur de la zone de code ------------------------------

partieCode.onmousedown = function(e){
    if(e.target.className=="bloc" && e.buttons == 1){
        window.addEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement = e.target;
        blocEnMouvement.style.cursor = "grabbing";
        blocEnMouvement.style.filter = "drop-shadow(1px 1px 4px gray)";
    }
};

document.onmouseup = function(e){
    if(blocEnMouvement!==undefined && wrapper.style.display=="flex"){
        window.removeEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement.style.cursor = "grab";
        blocEnMouvement.style.zIndex = 0;
        blocEnMouvement.style.filter = "";
        collageBloc();
    }
};

function deplacerBloc(e){
	indexBloc = blocArray.indexOf(blocEnMouvement);
    blocEnMouvement.style.zIndex = 100;
    if(e.clientX-75 > infoZone.left && e.clientX+75 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+20 < infoZone.bottom){
        if(blocEnMouvement.dataset.stackedtop == "true"){
            if(blocEnMouvement.dataset.stackedbot == "false"){
                var sourisX = e.clientX - 75; var sourisY = e.clientY - 20;
                blocEnMouvement.style.left = sourisX+"px";
                blocEnMouvement.style.top = sourisY+"px";
                blocEnMouvement.dataset.stackedtop = "false";
                blocArray[indexBloc-1].dataset.stackedbot = "false";
                blocArray.splice(indexBloc,1);
            }
        }else{
            var sourisX = e.clientX - 75; var sourisY = e.clientY - 20;
            blocEnMouvement.style.left = sourisX+"px";
            blocEnMouvement.style.top = sourisY+"px";
        }
        detectionCollage();
    }
}


//------------------------------ Drag & Drop ------------------------------

partieBanque.ondragstart = function(e){blocEnMouvement = e.target.cloneNode(true);};
partieCode.ondragenter = function(e){e.preventDefault();};
partieCode.ondragover = function(e){e.preventDefault();};

partieCode.ondrop = function(e){
    partieCode.append(blocEnMouvement);
    blocEnMouvement.removeAttribute("draggable");
    blocEnMouvement.style.position = "absolute";

    if(e.clientX-75 > infoZone.left && e.clientX+75 < infoZone.right && e.clientY-20 > infoZone.top && e.clientY+20 < infoZone.bottom){
        var sourisX = e.clientX - 75; var sourisY = e.clientY - 20;
        blocEnMouvement.style.left = sourisX+"px";
        blocEnMouvement.style.top = sourisY+"px";
    }else{
        blocEnMouvement.style.left = "50%";
        blocEnMouvement.style.top = "50%";
    }
};


//------------------------------ Debugage et tests ------------------------------

window.addEventListener("keydown", function(e){
    if(e.keyCode == 96){
        console.log(blocArray);
    }
});
