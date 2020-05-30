//------------------------------ Initialisation ------------------------------

//Import :
import {Joueur, FileManager} from './classes.js';
import {chargerMap, tileParCoord, remplacementCanvas} from './niveaux.js';
import {chargerJSON, chargerImg, sleep, scrollbar} from './outils.js';

//Bloc, joueur et audio :
export var blocEnMouvement, zone=1, niveau=1; //Variables globales
export var blocArray = new Array(); //Array contenant la liste des blocs collés, et la "carte" pour le niveau
const audio = new Audio(); //Variable représenant l'audio de la page
var musiqueAutorisee = true; // Variable autorisant ou non la lecture d'une musique (à l'exception des son comme les popups)
export const joueur = new Joueur(0,0,0); //Déclaration de l'objet Joueur avec 3 paramètres (x,y,dir)

//Fichiers :
export const files = new FileManager(); //Charge les fichiers afin d'éviter de les charger à chaque niveaux

//Canvas :
const canvas = document.getElementById('canvas'); //Variable représentant le canvas
export const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)

//Permet d'instancier les fonctions importées sur "window" (pour le onclick)
for(const el of document.querySelectorAll('button')){
    var fn = el.getAttribute("onclick").replace("()",'');
    window[fn] = eval(fn);
}

//Bypass les menus :
affichageMenu();
/*setTimeout(() => {
    affichageZone(1);
    affichageNiveau(1);
},50);*/


//--------------------------- Menu, map monde et choix du niveau -----------------------

function affichageMenu(){
    document.querySelector(".accueil").style.display = "none";
    mapMonde.style.display = "flex";
}

export function affichageZone(z){
    zone = z;
    mapMonde.style.display = "none";
    document.querySelector(".mapZone"+z).style.display = "block";
    document.querySelector(".zoneFleches").style.display = "flex";
    document.querySelector("#avatarJoueur").style.display = "block";
    document.querySelector("#avatarJoueur").style.transform = "translate("+files.zonesData[zone][niveau][0]+"px, "+files.zonesData[zone][niveau][1]+"px)";
}

function affichageNiveau(n){
    niveau = n;
    menu.style.display = "none";
    wrapper.style.display = "flex";
    enTete.style.display = "flex";
    document.querySelector(".mapZone"+zone).style.display = "none";
    enTete.innerHTML = `Zone ${zone} - Niveau ${niveau} &nbsp; | &nbsp; ${files.zonesData[zone].nom}`;
    if(!blocArray.includes(blocDepart)) blocArray.push(blocDepart);
    chargerMap(zone,niveau);
    musique();
}


function musique() {

    if (musiqueAutorisee==true) {
        switch (zone) {
        case 1:
            audio.src="src/media/son/testArabe.wav";// A changer pour mettre les plaines
            audio.play();
            break;
        case 2:
            audio.src="src/media/son/testArabe.wav";
            audio.play();
            break;
        case 3:
            audio.src="src/media/son/testArabe.wav";// A changer pour mettre les grottes
            audio.play();
            break;
        case 4:
            audio.src="src/media/son/testArabe.wav";// A changer pour mettre les volcans
            audio.play();
            break;
    }
    /*   Quand on aura les 4 musiques
      audio.src="src/media/son/musiqueAmbiance"+zone+".wav";
      audio.play();
    */
    audio.loop=true;
    }
}


export function deplacementAvatar(e){
    if(document.querySelector(".mapZone"+zone).style.display=="block"){
        var avatar = document.querySelector("#avatarJoueur");
        switch(e.keyCode){
            case 37: //Flèche Gauche
                toucheFlecheGauche.src = "src/media/touche/toucheFlecheGaucheGlow.png";
                setTimeout('toucheFlecheGauche.src="src/media/touche/toucheFlecheGauche.png"',100);
                if(niveau!==1 && joueur.niveauDebloque.includes(zone+"-"+(niveau-1))){
                    niveau -= 1;
                    avatar.style.transform = "translate("+files.zonesData[zone][niveau][0]+"px, "+files.zonesData[zone][niveau][1]+"px)";
                }
            break;
                
            case 39: //Flèche Droite
                toucheFlecheDroite.src = "src/media/touche/toucheFlecheDroiteGlow.png";
                setTimeout('toucheFlecheDroite.src="src/media/touche/toucheFlecheDroite.png"',100);
                if(niveau!==5 && joueur.niveauDebloque.includes(zone+"-"+(niveau+1))){
                    niveau += 1;
                    avatar.style.transform = "translate("+files.zonesData[zone][niveau][0]+"px, "+files.zonesData[zone][niveau][1]+"px)";
                }
            break;
                
            case 13: //Touche Entrée
                toucheEntree.src = "src/media/touche/toucheEntreeGlow.png";
                setTimeout('toucheEntree.src="src/media/touche/toucheEntree.png"',100);
                avatar.style.display = "none";
                affichageNiveau(niveau);
            break;
                
            case 27: //Touche Echap
                toucheEchap.src = "src/media/touche/toucheEchapGlow.png";
                setTimeout('toucheEchap.src="src/media/touche/toucheEchap.png"',100);
                mapMonde.style.display = "flex";
                avatar.style.display = "none";
                document.querySelector(".mapZone"+zone).style.display = "none";
                document.querySelector(".zoneFleches").style.display = "none";
            break;
        }
    }
}


//------------------------------ Pop-up ! ------------------------------

export function popup(texte){
    if(popups.style.visibility == 'hidden'){
        popups.style.visibility = "visible";
        popups.style.display = "flex";
        popups.children[0].innerHTML = texte;
        popups.style.animation = "ouverturePopup 0.2s ease-in 0s 1 normal forwards";
        audio.src = "src/media/son/orb.mp3";
        audio.play();
        audio.loop=false;
    }
}

function fermerPopup(){
    popups.style.animation = "fermeturePopup 1s ease-out 0.2s 1 normal forwards";
    setTimeout(() => {popups.style.visibility = "hidden"},1200);
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
    menuContextuel.style.display = "none";
    if(blocEnMouvement.className=="bloc" && blocEnMouvement.dataset.stackedtop=="false" && blocEnMouvement.dataset.stackedbot=="false"){
        blocEnMouvement.parentNode.removeChild(blocEnMouvement);
    }
}

function supprimerToutLesBlocs(){
    menuContextuel.style.display = "none";
    if(conteneurCode.children.length > 1 && document.getElementById('executionCode').disabled==false){
        while(conteneurCode.children.length > 1){conteneurCode.removeChild(conteneurCode.children[1]);}
        blocArray.splice(1,blocArray.length);
        blocDepart.dataset.stackedbot = "false";
        updateComptageBlocs();
    }
}

function dupliquerBloc(){
    menuContextuel.style.display = "none";
    if(blocEnMouvement.className=="bloc" && blocEnMouvement.id!=="blocDepart"){
        var coord = (blocEnMouvement.style.transform.match(/\d+/g).map(Number) + "").split(",");
        blocEnMouvement = blocEnMouvement.cloneNode(true);
        conteneurCode.append(blocEnMouvement);
        blocEnMouvement.style.transform = "translate("+(parseInt(coord[0])+20)+"px, "+(parseInt(coord[1])+20)+"px)";
        blocEnMouvement.dataset.stackedtop = "false";
        blocEnMouvement.dataset.stackedbot = "false"
    }
}


//------------------------------ Menu paramètres -------------------------------------------

function afficherParametres(){
    const menuParametres = document.getElementById("menuParametres");
    const controlesJeu = document.getElementById("controlesJeu");
    if(menuParametres.style.display=="none"){
        controlesJeu.style.display = "none";
        menuParametres.style.display = "flex";
    }else{
        menuParametres.style.display = "none";
        controlesJeu.style.display = "flex";
    }
}

function switchMusique(){
    if(audio.paused==false){
        audio.pause();
        imgMusique.src="src/media/icon/audio-off-icon.png";
        musiqueAutorisee=false;
    }else{
        audio.play();
        imgMusique.src="src/media/icon/audio-icon.png";
        musiqueAutorisee=true;
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
    supprimerToutLesBlocs();
    document.querySelector(".mapZone"+zone).style.display = "none";
    document.querySelector("#avatarJoueur").style.display = "none";
    document.querySelector(".zoneFleches").style.display = "none";
    document.getElementById("menuParametres").style.display = "none";
    document.getElementById("controlesJeu").style.display = "flex";
    menu.style.display = "flex";
    mapMonde.style.display = "flex";
    wrapper.style.display = "none";
    enTete.style.display = "none";
    audio.pause();
}

function updateComptageBlocs(){
    var blocTotal = (blocArray.length-1);
    for(const bloc of blocArray){
        if(bloc.id=="Repeter") blocTotal += bloc.children[1].children.length;
        var tauxRemplissage = (blocTotal/files.niveauxData.objectifBloc)*100;
        if(blocTotal > files.niveauxData.objectifBloc){
            document.querySelector(".texteComptageBlocs").innerHTML = blocTotal +" / "+ files.niveauxData.objectifBloc;
            document.querySelector(".comptageBlocs div").style.background="#d86060";
        }else{
            document.querySelector(".texteComptageBlocs").innerHTML = blocTotal +" / "+ files.niveauxData.objectifBloc;
            document.querySelector(".comptageBlocs div").style.background="#50d6d6";
            document.querySelector(".comptageBlocs div").style.width = tauxRemplissage+"%";
        }
    }
}

//------------------------------ Executer le code + vérifier si le joueur a gagner ------------------------------

function win(){
    if(tileParCoord(joueur.x,joueur.y)[0]=="objectif"){
        if(niveau<5){
            popup(`Tu as completé  le niveau ${niveau} de la zone ${zone} !`);
            setTimeout(() => {
                fermerPopup();
                supprimerToutLesBlocs();
                affichageNiveau(niveau+1);
                if(joueur.niveauDebloque.includes(zone+"-"+niveau)==false) joueur.niveauDebloque.push(zone+"-"+niveau)
            },2000);
        }else{
            popup("Tu as fini la 1ère zone, bravo jeune aventurier !<br> (le reste n'est pas encore fait, désolé :/)");
        }
    }
}

function remiseAZero(){
    remplacementCanvas(joueur.x,joueur.y);
    joueur.afficher(files.niveauxData.depart[0]*64,files.niveauxData.depart[1]*64,files.niveauxData.depart[2]);
}

async function executionCode(){
    if(blocArray.length>=2){
        document.getElementById('executionCode').disabled = true;
        remiseAZero();
        await sleep(200);
        for(var bloc of blocArray){
            switch(bloc.id){ //"Empiler" des 'case' à le même effet que le "||" (pour le if() par exemple)
                case "Avancer":
                case "Sauter":
                case "TournerADroite":
                case "TournerAGauche":
                    joueur[bloc.id](); //La forme objet[var]() sert à utiliser une variable en tant que méthode, par exemple joueur.afficher() peut s'écrire joueur["afficher"]();
                break;

                case "Repeter":
                    if(bloc.children[1].hasChildNodes && bloc.querySelector('#inputRepeter').value > 0){
                        for(var i=0;i<bloc.querySelector('#inputRepeter').value;i++){
                            for(var child of bloc.children[1].children){
                                joueur[child.id]();
                                await sleep(500);
                            }
                        }
                    }
                break;
            }
            win();
            await sleep(500);
        }
        document.getElementById('executionCode').disabled = false;
    }else{
        popup("Ajoute un (ou plusieurs) bloc(s) pour exécuter le code !");
    }
}


//------------------------------ Attacher les blocs entre eux ------------------------------

//Créer l'élément image lorsque deux blocs peuvent être collés
var insertionBloc = document.createElement("img");
insertionBloc.src = "src/media/bloc-shadow.png";
insertionBloc.className = "insertionBloc";

function changementPath(modifier,bloc){
    var path = bloc.querySelector("path").getAttribute("d");
    var n1 = parseInt(path.substring(81,80+path.substring(81).indexOf('h')));
    var n2 = parseInt(path.substring(132+path.substring(130).indexOf('v')));
    var res = path.substring(0,81) + (n1+(33*modifier)) + path.substring(81+path.substring(82).indexOf('h'),132+path.substring(130).indexOf('v')) + (n2-(33*modifier));
    bloc.querySelector("path").setAttribute("d",res);
    bloc.style.height = bloc.getBoundingClientRect().height+(33*modifier)+"px";
    bloc.children[0].setAttribute("height", parseInt(bloc.children[0].getAttribute("height"))+(33*modifier));
    bloc.children[0].setAttribute("viewBox", "0 0 150 " + (parseInt(bloc.children[0].getAttribute("viewBox").split(' ')[3])+(33*modifier)).toString());
}

function detectionCollage(){
    for(var bloc of document.getElementsByClassName('bloc')){
        var rectA = bloc.getBoundingClientRect();
        var rectB = blocEnMouvement.getBoundingClientRect();
        if(bloc.hasAttribute("data-specialstack") && bloc.dataset.specialstack=="true") var gRect = bloc.children[1].lastChild.getBoundingClientRect();

        if(bloc!==blocEnMouvement && bloc.dataset.stackedtop=="true" && bloc.dataset.stackedbot=="false" && bloc.parentNode==conteneurCode){
            if(rectA.bottom+15 >= rectB.top && rectA.bottom-15 <= rectB.top && rectA.left-30 <= rectB.left && rectA.right+30 >= rectB.right){ //Zone "normal"
                insertionBloc.className = "insertionBloc";
                bloc.appendChild(insertionBloc);
            }
            else if(rectA.top+53>=rectB.top && rectA.top+13<=rectB.top && rectA.left+5<=rectB.left && rectA.left+35>=rectB.left && bloc.hasAttribute("data-specialstack") && bloc.dataset.specialstack=="false"){
                if(bloc.contains(insertionBloc)==false) changementPath(1,bloc);
                insertionBloc.className = "insertionBloc2";
                bloc.appendChild(insertionBloc);
            }
            else if(bloc.hasAttribute("data-specialstack") && bloc.dataset.specialstack=="true" && gRect.bottom+15>=rectB.top && gRect.bottom-15<=rectB.top && gRect.left-30<=rectB.left && gRect.right+30>=rectB.right){
                if(bloc.contains(insertionBloc)==false) changementPath(1,bloc);
                insertionBloc.className = "insertionBloc3";
                bloc.children[1].lastChild.appendChild(insertionBloc);
            }
            else if(bloc.contains(insertionBloc)){
                insertionBloc.parentElement.removeChild(insertionBloc);
                if(bloc.hasAttribute("data-specialstack") && insertionBloc.className!=='insertionBloc') changementPath(-1,bloc);
            }
        }
    }
}

function collageBloc(){
    for(var bloc of document.getElementsByClassName('bloc')){
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
    updateComptageBlocs();
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
    var infoZone = document.getElementById("partieCode").getBoundingClientRect();
    var sourisX = e.clientX - conteneurCode.getBoundingClientRect().left - blocRect.width/2;
    var sourisY = e.clientY - conteneurCode.getBoundingClientRect().top - blocRect.height/2;

    if(blocEnMouvement.dataset.stackedtop=="true" && blocEnMouvement.dataset.stackedbot=="false" && blocEnMouvement.parentElement.className!=="stack"){
        blocEnMouvement.style.transform = "translate("+sourisX+"px, "+sourisY+"px)";
        blocEnMouvement.dataset.stackedtop = "false";
        if(blocArray.includes(blocEnMouvement)){
            var indexBloc = blocArray.indexOf(blocEnMouvement);
            blocArray[indexBloc-1].dataset.stackedbot = "false";
            blocArray.splice(indexBloc,1);
        }
    }
    else if(blocEnMouvement.dataset.stackedtop=="true" && blocEnMouvement.dataset.stackedbot=="false" && blocEnMouvement.parentElement.className=="stack"){
        blocEnMouvement.dataset.stackedtop=="false";
        if(blocEnMouvement.parentNode.children.length == 1) blocEnMouvement.parentNode.parentNode.dataset.specialstack = "false";
        else blocEnMouvement.previousSibling.dataset.stackedbot = "false";
        changementPath(-1,blocEnMouvement.parentNode.parentNode);
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


//------------------------------ Debugage et test ------------------------------

window.addEventListener("keydown", async function(e){
    if(e.keyCode == 96){
        console.log(blocArray)
    }
});
