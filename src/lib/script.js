//------------------------------ Initialisation ------------------------------

//Bloc, joueur, map et audio :
var blocEnMouvement, indexBloc, tileSet, infoZone, zone=1, niveau=1; //Variables globales
var blocArray = new Array(), map = new Array(); //Array contenant la liste des blocs collés, et la "carte" pour le niveau
var audio = new Audio(); //Variable représenant l'audio de la page
var joueur = new Joueur(0,0,0); //Déclaration de l'objet Joueur avec 3 paramètres (x,y,dir)

//Canvas + image :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)
chargerImg("src/media/tileset.png").then(i => tileSet=i); //Charge le "tileset";

//Empêcher la selection :
document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction du texte sur la page

//Bypass les menus :
affichageMenu();
//affichageZone(4);
//setTimeout(function (){affichageNiveau(2);},100);


//Créer un temps d'arret :
function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}


//--------------------------- Menu, map monde et choix du niveau -----------------------

//Ajoute un evenement "onclick" aux "area" :
var area = document.getElementsByTagName("area");
for(var i=0;i<area.length;i++){
    area[i].addEventListener("click", function(){
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
    niveau = 1; //On place le joueur sur le niveau 1 quand il arrive dans la zone
    switch(z){
        case 1: document.querySelector("#AvatarJoueurMap1").style.left="500px";document.querySelector("#AvatarJoueurMap1").style.bottom="300px";break;
        case 2: document.querySelector("#AvatarJoueurMap2").style.left="475px";document.querySelector("#AvatarJoueurMap2").style.bottom="500px";break;
        case 3: document.querySelector("#AvatarJoueurMap3").style.left="600px";document.querySelector("#AvatarJoueurMap3").style.bottom="250px"; break;
        case 4: document.querySelector("#AvatarJoueurMap4").style.left="525px";document.querySelector("#AvatarJoueurMap4").style.bottom="300px";break;
    }
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

        switch(zone + "-" + niveau){
            case "1-1": document.querySelector("#AvatarJoueurMap1").style.left="500px";document.querySelector("#AvatarJoueurMap1").style.bottom="300px";break;
            case "1-2": document.querySelector("#AvatarJoueurMap1").style.left="635px";document.querySelector("#AvatarJoueurMap1").style.bottom="415px";break;
            case "1-3": document.querySelector("#AvatarJoueurMap1").style.left="825px";document.querySelector("#AvatarJoueurMap1").style.bottom="485px";break;
            case "1-4": document.querySelector("#AvatarJoueurMap1").style.left="825px";document.querySelector("#AvatarJoueurMap1").style.bottom="325px";break;
            case "1-5": document.querySelector("#AvatarJoueurMap1").style.left="1035px";document.querySelector("#AvatarJoueurMap1").style.bottom="370px";break;
            case "2-1": document.querySelector("#AvatarJoueurMap2").style.left="475px";document.querySelector("#AvatarJoueurMap2").style.bottom="500px";break;
            case "2-2": document.querySelector("#AvatarJoueurMap2").style.left="885px";document.querySelector("#AvatarJoueurMap2").style.bottom="470px";break;
            case "2-3": document.querySelector("#AvatarJoueurMap2").style.left="575px";document.querySelector("#AvatarJoueurMap2").style.bottom="375px";break;
            case "2-4": document.querySelector("#AvatarJoueurMap2").style.left="715px";document.querySelector("#AvatarJoueurMap2").style.bottom="225px";break;
            case "2-5": document.querySelector("#AvatarJoueurMap2").style.left="1000px";document.querySelector("#AvatarJoueurMap2").style.bottom="350px";break;
            case "3-1": document.querySelector("#AvatarJoueurMap3").style.left="600px";document.querySelector("#AvatarJoueurMap3").style.bottom="250px";break;
            case "3-2": document.querySelector("#AvatarJoueurMap3").style.left="610px";document.querySelector("#AvatarJoueurMap3").style.bottom="475px";break;
            case "3-3": document.querySelector("#AvatarJoueurMap3").style.left="825px";document.querySelector("#AvatarJoueurMap3").style.bottom="360px";break;
            case "3-4": document.querySelector("#AvatarJoueurMap3").style.left="925px";document.querySelector("#AvatarJoueurMap3").style.bottom="375px";break;
            case "3-5": document.querySelector("#AvatarJoueurMap3").style.left="1025px";document.querySelector("#AvatarJoueurMap3").style.bottom="475px";break;
            case "4-1": document.querySelector("#AvatarJoueurMap4").style.left="525px";document.querySelector("#AvatarJoueurMap4").style.bottom="300px";break;
            case "4-2": document.querySelector("#AvatarJoueurMap4").style.left="635px";document.querySelector("#AvatarJoueurMap4").style.bottom="465px";break;
            case "4-3": document.querySelector("#AvatarJoueurMap4").style.left="780px";document.querySelector("#AvatarJoueurMap4").style.bottom="385px";break;
            case "4-4": document.querySelector("#AvatarJoueurMap4").style.left="950px";document.querySelector("#AvatarJoueurMap4").style.bottom="450px";break;
            case "4-5": document.querySelector("#AvatarJoueurMap4").style.left="850px";document.querySelector("#AvatarJoueurMap4").style.bottom="235px";break;
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
    if(e.target==conteneurCode || e.target.className=="bloc" || e.target.tagName=="BUTTON" || e.target.tagName=="INPUT") e.preventDefault();
};

document.onmousedown = function(e){
    if(menuContextuel.style.display=="block" && e.target!==menuContextuel && e.target.tagName!=="BUTTON") menuContextuel.style.display = "none";
    else if(e.buttons==2 && wrapper.style.display=="flex" && ((e.target.className=="bloc" && e.target.parentNode!==partieBanque) || e.target==conteneurCode)){
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
    if(conteneurCode.children.length > 1){
        menuContextuel.style.display = "none";
        while(conteneurCode.children.length > 1){conteneurCode.removeChild(conteneurCode.children[1]);}
        blocArray.splice(0,blocArray.length);
        blocDepart.dataset.stackedbot = "false";
    }else{
        menuContextuel.style.display = "none";
    }
}

function dupliquerBloc(){
    if(blocEnMouvement.className=="bloc" && blocEnMouvement.id!=="blocDepart"){
        var coord = (blocEnMouvement.style.transform.match(/\d+/g).map(Number) + "").split(",");
        menuContextuel.style.display = "none";
        blocEnMouvement = blocEnMouvement.cloneNode(true);
        conteneurCode.append(blocEnMouvement);
        blocEnMouvement.style.transform = "translate("+(parseInt(coord[0])+20)+"px, "+(parseInt(coord[1])+20)+"px)";
        blocEnMouvement.dataset.stackedtop = "false";
        blocEnMouvement.dataset.stackedbot = "false"
    }else{
        menuContextuel.style.display = "none";
    }
}


//------------------------------ Menu paramètres -------------------------------------------

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
    if(imgModeSombre.src.includes("black")){
        imgModeSombre.src = "src/media/icon/moon-white.png";
        partieBanque.style.background = "#717171";
        conteneurCode.style.background = "#717171";
        enTete.style.background = "#3c5a96";
        partieControle.style.background = "#717171";
        document.body.style.background = "rgb(60,60,60)";
    }else{
        imgModeSombre.src="src/media/icon/moon-black.png";
        partieBanque.style.background = "white";
        conteneurCode.style.background = "white";
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
    document.querySelector(".mapZone"+zone).style.display = "none";
    document.querySelector(".zoneFleches").style.display = "none";
    menu.style.display = "flex";
    mapMonde.style.display = "block";
    wrapper.style.display = "none";
    enTete.style.display = "none";
    menuParametres.style.display = "none";
    controlesJeu.style.display = "flex";
}


//------------------------------ Gestion du "tileset" et de la map ------------------------------

function chargerImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
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
            joueur.startPos(384,384,0);
            afficherBloc(["Avancer"]);
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
            joueur.startPos(256,384,1);
            afficherBloc(["Avancer","TournerAGauche"]);
        break;

        case "3-1":
            map[0] = Array(0,0,0,0,0,0,0,0,0);
            map[1] = Array(0,0,0,0,2,0,0,0,0);
            map[2] = Array(0,0,0,0,1,0,0,0,0);
            map[3] = Array(0,0,0,0,1,0,0,0,0);
            map[4] = Array(0,0,0,0,1,0,0,0,0);
            map[5] = Array(0,0,0,0,1,0,0,0,0);
            map[6] = Array(0,0,0,0,1,0,0,0,0);
            map[7] = Array(0,0,0,0,1,0,0,0,0);
            map[8] = Array(0,0,0,0,0,0,0,0,0);
            joueur.startPos(256,448,0);
            afficherBloc(["Avancer","Repeter"]);
        break;

        case "3-2":
            map[0] = Array(0,0,0,0,0,0,0,0,0);
            map[1] = Array(0,0,0,0,0,0,0,0,0);
            map[2] = Array(0,0,0,0,0,1,2,0,0);
            map[3] = Array(0,0,0,0,1,1,0,0,0);
            map[4] = Array(0,0,0,1,1,0,0,0,0);
            map[5] = Array(0,0,1,1,0,0,0,0,0);
            map[6] = Array(0,0,0,0,0,0,0,0,0);
            map[7] = Array(0,0,0,0,0,0,0,0,0);
            map[8] = Array(0,0,0,0,0,0,0,0,0);
            joueur.startPos(128,320,1);
            afficherBloc(["Avancer","Repeter","TournerADroite","TournerAGauche","Si"]);
        break;

        case "3-3":
            map[0] = Array(0,0,0,0,0,0,0,0,0);
            map[1] = Array(0,0,1,1,2,0,0,0,0);
            map[2] = Array(0,0,3,0,0,0,0,0,0);
            map[3] = Array(0,0,1,0,0,0,0,0,0);
            map[4] = Array(0,0,1,1,3,1,1,0,0);              // A COMPLETER J'AI PAS FINI CE NIVEAU (TRISTAN)
            map[5] = Array(0,0,0,0,0,0,3,0,0);
            map[6] = Array(0,0,0,0,0,0,1,0,0);
            map[7] = Array(0,1,1,1,1,1,1,0,0);
            map[8] = Array(0,0,0,0,0,0,0,0,0);
            joueur.startPos(64,448,1);
            afficherBloc(["Avancer","Repeter","TournerADroite","TournerAGauche","Sauter"]);
        break;

        case "3-4":
            map[0] = Array(0,0,0,0,0,0,0,0,0);
            map[1] = Array(0,1,3,1,0,0,0,0,0);
            map[2] = Array(0,3,0,3,0,0,0,0,0);
            map[3] = Array(0,1,0,1,0,1,3,1,0);
            map[4] = Array(0,0,0,3,0,3,0,1,0);              // A COMPLETER J'AI PAS FINI CE NIVEAU (TRISTAN)
            map[5] = Array(0,2,0,1,3,1,0,1,0);
            map[6] = Array(0,1,0,0,0,0,0,1,0);
            map[7] = Array(0,1,3,1,3,1,3,1,0);
            map[8] = Array(0,0,0,0,0,0,0,0,0);
            joueur.startPos(64,192,0);
            afficherBloc(["Avancer","Repeter","TournerADroite","TournerAGauche","Sauter"]);
          break;
        case "3-5":
            map[0] = Array(0,0,0,0,0,0,0,0,0);
            map[1] = Array(0,0,0,0,4,1,1,0,0);
            map[2] = Array(0,0,0,0,1,0,3,0,0);
            map[3] = Array(0,1,1,4,1,0,4,0,0);
            map[4] = Array(0,1,0,0,0,0,1,0,0);          // A COMPLETER J'AI PAS FINI CE NIVEAU (TRISTAN)
            map[5] = Array(0,1,0,0,4,3,1,0,0);
            map[6] = Array(0,0,0,0,1,0,0,0,0);
            map[7] = Array(0,0,0,0,1,1,4,2,0);
            map[8] = Array(0,0,0,0,0,0,0,0,0);
            joueur.startPos(64,256,0);
            afficherBloc(["Avancer"]);
          break;
    }
    afficherMap();
    scrollbar.scrollLeft = 0; scrollbar.scrollTop = 0;
    joueur.afficher(joueur.startX,joueur.startY,joueur.startDir);
}

function afficherMap(){
    for(var i=0;i<map.length;i++){
        for(var j=0;j<map[i].length;j++){
            switch(map[i][j]){
                case 0: ctx.drawImage(tileSet,128,0,64,64,64*j,64*i,64,64); break; //Herbe
                case 1: ctx.drawImage(tileSet,0,128,64,64,64*j,64*i,64,64); break; //Sol
                case 2: ctx.drawImage(tileSet,64,128,64,64,64*j,64*i,64,64); break; //Case Cible
                case 3: ctx.drawImage(Trou,0,0,64,64,64*j,64*i,64,64)break;//Trou
                case 4: break;//Ennemi
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

function remiseAZero(){
    ctx.drawImage(tileSet,0,128,64,64,joueur.x,joueur.y,64,64);
    joueur.pos(joueur.startX,joueur.startY,joueur.startDir);
    joueur.afficher(joueur.startX,joueur.startY,joueur.startDir);
}

async function executionCode(){
    if(blocArray.length>1){
        remiseAZero();
        await sleep(500);
        for(var bloc of blocArray){
            switch(bloc.id){
                case "Avancer":
                case "Sauter":
                case "TournerADroite":
                case "TournerAGauche":
                    joueur[bloc.id]();
                break;

                case "Repeter":
                    if(bloc.children[1].hasChildNodes && bloc.querySelector('#inputRepeter').value > 0){
                        for(var i=0;i<bloc.querySelector('#inputRepeter').value;i++){
                            for(var child of bloc.children[1].children){
                                joueur[child.id]();
                                await sleep(800);
                            }
                        }
                    }
                break;
            }
            win();
            await sleep(800);
        }
    }else{
        popup("Ajoute un (ou plusieurs) bloc(s) pour exécuter le code !");
    }
}


//------------------------------ Attacher les blocs entre eux ------------------------------

function changementPath(nb,bloc){
    bloc.getElementsByTagName("path")[0].setAttribute("d", bpath[bloc.children[1].children.length+nb]);
    bloc.style.height = 74+(33*(bloc.children[1].children.length+nb))+"px";
    bloc.children[0].setAttribute("height", 74+(33*(bloc.children[1].children.length+nb)));
    bloc.children[0].setAttribute("viewBox", "0 0 150 "+(74+(33*(bloc.children[1].children.length+nb))));
}

function detectionCollage(){
    for(var bloc of classBlocs){
        var rectA = bloc.getBoundingClientRect();
        var rectB = blocEnMouvement.getBoundingClientRect();
        if(bloc.hasAttribute("data-specialstack") && bloc.dataset.specialstack=="true") var gRect = bloc.children[1].lastChild.getBoundingClientRect();

        if(bloc!==blocEnMouvement && bloc.dataset.stackedtop=="true" && bloc.dataset.stackedbot=="false" && bloc.parentNode==conteneurCode){
            if(rectA.bottom+15 >= rectB.top && rectA.bottom-15 <= rectB.top && rectA.left-30 <= rectB.left && rectA.right+30 >= rectB.right){ //Zone "normal"
                insertionBloc.className = "insertionBloc";
                bloc.appendChild(insertionBloc);
            }
            else if(rectA.top+53>=rectB.top && rectA.top+13<=rectB.top && rectA.left+5<=rectB.left && rectA.left+35>=rectB.left && bloc.hasAttribute("data-specialstack") && bloc.dataset.specialstack=="false"){
                insertionBloc.className = "insertionBloc2";
                bloc.appendChild(insertionBloc);
                changementPath(1,bloc);
            }
            else if(bloc.hasAttribute("data-specialstack") && bloc.dataset.specialstack=="true" && gRect.bottom+15>=rectB.top && gRect.bottom-15<=rectB.top && gRect.left-30<=rectB.left && gRect.right+30>=rectB.right){
                insertionBloc.className = "insertionBloc3";
                bloc.children[1].lastChild.appendChild(insertionBloc);
                changementPath(1,bloc);
            }
            else if(bloc.contains(insertionBloc)){
                insertionBloc.parentElement.removeChild(insertionBloc);
                if(bloc.hasAttribute("data-specialstack")) changementPath(0,bloc);
            }
        }
    }
}

function collageBloc(){
    for(var bloc of classBlocs){
        var blocRect = bloc.getBoundingClientRect();
        var conteneurRect = conteneurCode.getBoundingClientRect();
        if(bloc.querySelector(".insertionBloc")!==null && bloc.querySelector(".insertionBloc2")==null && bloc.querySelector(".insertionBloc3")==null){ //Zone "normal"
            blocEnMouvement.style.transform = "translate("+(blocRect.left-conteneurRect.left)+"px, "+(blocRect.bottom-conteneurRect.top-7)+"px)";
            blocEnMouvement.dataset.stackedtop = "true";
            bloc.dataset.stackedbot = "true";
            bloc.removeChild(insertionBloc);
            blocArray.push(blocEnMouvement);
        }
        else if(bloc.querySelector(".insertionBloc")==null && bloc.querySelector(".insertionBloc2")==null && bloc.querySelector(".insertionBloc3")!==null){ //Zone "special" si il y'a deja un bloc
            var enfantCoord = (bloc.children[1].lastChild.style.transform.match(/\d+/g).map(Number) + "").split(",");
            bloc.children[1].lastChild.removeChild(insertionBloc);
            bloc.children[1].lastChild.dataset.stackedbot = "true";
            blocEnMouvement.dataset.stackedtop = "true";
            blocEnMouvement.style.transform = "translate(0px, "+(parseInt(enfantCoord[1])+33)+"px)";
            bloc.children[1].appendChild(blocEnMouvement);
        }
        else if(bloc.querySelector(".insertionBloc")==null && bloc.querySelector(".insertionBloc2")!==null && bloc.querySelector(".insertionBloc3")==null){ //Zone "special" (Repeter, si, ect)
            bloc.removeChild(insertionBloc);
            bloc.children[1].appendChild(blocEnMouvement);
            bloc.dataset.specialstack = "true";
            blocEnMouvement.dataset.stackedtop = "true";
            blocEnMouvement.style.transform = "translate(0px, 0px)";
        }
    }
}


//------------------------------ Déplacement des blocs à l'intérieur de la zone de code ------------------------------

conteneurCode.onmousedown = function(e){
    if(e.target.className=="bloc" && e.target.id!=="blocDepart" && e.buttons==1){
        window.addEventListener('mousemove', deplacerBloc, true);
        blocEnMouvement = e.target;
        blocEnMouvement.style.cursor = "grabbing";
        blocEnMouvement.style.filter = "drop-shadow(1px 1px 4px gray)";
        blocEnMouvement.style.zIndex = 100;
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
    var blocRect = blocEnMouvement.getBoundingClientRect();
    var sourisX = e.clientX - conteneurCode.getBoundingClientRect().left - blocRect.width/2;
    var sourisY = e.clientY - conteneurCode.getBoundingClientRect().top - blocRect.height/2;

    if(blocEnMouvement.dataset.stackedtop=="true" && blocEnMouvement.dataset.stackedbot=="false" && blocEnMouvement.parentElement.className!=="stack"){
        blocEnMouvement.style.transform = "translate("+sourisX+"px, "+sourisY+"px)";
        blocEnMouvement.dataset.stackedtop = "false";
        if(blocArray.includes(blocEnMouvement)){
            indexBloc = blocArray.indexOf(blocEnMouvement);
            blocArray[indexBloc-1].dataset.stackedbot = "false";
            blocArray.splice(indexBloc,1);
        }
    }
    else if(blocEnMouvement.dataset.stackedtop=="true" && blocEnMouvement.dataset.stackedbot=="false" && blocEnMouvement.parentElement.className=="stack"){
        blocEnMouvement.dataset.stackedtop=="false";
        if(blocEnMouvement.parentNode.children.length == 1) blocEnMouvement.parentNode.parentNode.dataset.specialstack = "false";
        else blocEnMouvement.previousSibling.dataset.stackedbot="false";
        conteneurCode.appendChild(blocEnMouvement);
        blocEnMouvement.style.transform = "translate("+sourisX+"px, "+sourisY+"px)";
    }
    else if(blocEnMouvement.dataset.stackedtop=="false" && blocEnMouvement.dataset.stackedbot=="false"){
        blocEnMouvement.style.transform = "translate("+sourisX+"px, "+sourisY+"px)";
    }

    if(blocRect.right > infoZone.right){scrollbar.scrollLeft += 25;}
    else if(blocRect.left < infoZone.left){scrollbar.scrollLeft -= 25;}
    else if(blocRect.top < infoZone.top){scrollbar.scrollTop -= 25;}
    else if(blocRect.bottom > infoZone.bottom){scrollbar.scrollTop += 25;}

    detectionCollage();
}


//------------------------------ Drag & Drop ------------------------------

partieBanque.ondragstart = function(e){blocEnMouvement = e.target.cloneNode(true);};
conteneurCode.ondragenter = function(e){e.preventDefault();};
conteneurCode.ondragover = function(e){e.preventDefault();};

conteneurCode.ondrop = function(e){
    conteneurCode.append(blocEnMouvement);
    blocEnMouvement.removeAttribute("draggable");
    blocEnMouvement.style.position = "absolute";
    blocEnMouvement.style.margin = "0";
    var blocRect = blocEnMouvement.getBoundingClientRect();
    var sourisX = e.clientX - conteneurCode.getBoundingClientRect().left - blocRect.width/2;
    var sourisY = e.clientY - conteneurCode.getBoundingClientRect().top - blocRect.height/2;
    blocEnMouvement.style.transform = "translate("+sourisX+"px, "+sourisY+"px)";
}


//------------------------------ Debugage et tests ------------------------------

window.addEventListener("keydown", function(e){
    if(e.keyCode == 96){
    }
});
