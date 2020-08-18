//Import :
import {joueur, jeu, canvas, ctx} from './init.js';
import {chargerMap, tileParCoord, remplacementCanvas} from './niveaux.js';
import {chargerJSON, chargerImg, sleep, scrollbar} from './outils.js';
export var blocEnMouvement, blocArray = new Array(); 

//DOM :
const conteneurCode = document.getElementById("conteneurCode");
const partieBanque = document.getElementById("partieBanque");
const blocDepart = document.getElementById("blocDepart");
const menuContextuel = document.querySelector(".menuContextuel");

//Permet d'instancier les fonctions importées sur "window" (pour le onclick)
for(const el of document.getElementsByTagName("*")){
    if(el.hasAttribute("onclick")){
        var fn = el.getAttribute("onclick").replace("()",'');
        window[fn] = eval(fn);
    }
}

//Bypass le menu principal :
//setTimeout(() => {
//    affichageZone(1);
//    affichageNiveau(1);
//},100);


//--------------------------- Menu, map monde et choix du niveau -----------------------

export function affichageZone(z){
    jeu.zone = z;
    document.querySelector(".mapMonde").style.display = "none";
    document.querySelector(".mapZone").style.display = "flex";
    document.querySelector(".mapZone").firstChild.src = "src/media/map/mapZone"+z+".png";
    document.querySelector(".zoneTouches").style.display = "flex";
    document.querySelector("#avatarJoueur").style.display = "block";
    document.querySelector("#avatarJoueur").style.transform = "translate("+jeu.zonesData[jeu.zone][jeu.niveau][0]+"px, "+jeu.zonesData[jeu.zone][jeu.niveau][1]+"px)";
}

function affichageNiveau(n){
    jeu.niveau = n;
    document.querySelector(".menuPrincipal").style.display = "none";
    document.querySelector(".wrapper").style.display = "flex";
    document.querySelector(".mapZone").style.display = "none";
    document.querySelector("header").innerHTML = `Zone ${jeu.zone} - Niveau ${jeu.niveau} &nbsp; | &nbsp; ${jeu.zonesData[jeu.zone].nom}`;
    if(!blocArray.includes(blocDepart)) blocArray.push(blocDepart);
    chargerMap(jeu.zone,jeu.niveau);
    jeu.jouerMusique();
}

export function deplacementAvatar(e){
    if(document.querySelector(".mapZone").style.display=="flex"){
        var avatar = document.querySelector("#avatarJoueur");
        
        if(e.keyCode == 37 || e.keyCode == 27 ||e.keyCode == 13 ||e.keyCode == 39){
            document.querySelector('#touche'+e.keyCode).children[0].setAttribute('stroke','orange');
            document.querySelector('#touche'+e.keyCode).children[1].setAttribute('fill','orange');
            setTimeout(() => {
                document.querySelector('#touche'+e.keyCode).children[0].setAttribute('stroke','gray');
                document.querySelector('#touche'+e.keyCode).children[1].setAttribute('fill','gray');
            },200);
        }
        
        switch(e.keyCode){
            case 37: //Flèche Gauche
                if(jeu.niveau!==1 && jeu.niveauDebloque.includes(jeu.zone+"-"+(jeu.niveau-1))){
                    jeu.niveau -= 1;
                    avatar.style.transform = "translate("+jeu.zonesData[jeu.zone][jeu.niveau][0]+"px, "+jeu.zonesData[jeu.zone][jeu.niveau][1]+"px)";
                }
            break;
                
            case 39: //Flèche Droite
                if(jeu.niveau!==5 && jeu.niveauDebloque.includes(jeu.zone+"-"+(jeu.niveau+1))){
                    jeu.niveau += 1;
                    avatar.style.transform = "translate("+jeu.zonesData[jeu.zone][jeu.niveau][0]+"px, "+jeu.zonesData[jeu.zone][jeu.niveau][1]+"px)";
                }
            break;
                
            case 13: //Touche Entrée
                avatar.style.display = "none";
                affichageNiveau(jeu.niveau);
            break;
                
            case 27: //Touche Echap
                document.querySelector(".mapMonde").style.display = "flex";
                avatar.style.display = "none";
                document.querySelector(".mapZone").style.display = "none";
                document.querySelector(".zoneTouches").style.display = "none";
            break;
        }
    }
}


//------------------------------ Pop-up ! ------------------------------

export function popup(texte){
    if(document.querySelector(".popup").style.visibility == 'hidden'){
        document.querySelector(".popup").style.opacity = "1";
        document.querySelector(".popup").style.visibility = "visible";
        document.querySelector(".popup").children[0].innerHTML = texte;
        jeu.jouerSFX("popup");
    }
}

function fermerPopup(){
    document.querySelector(".popup").style.top = "5%";
    document.querySelector(".popup").style.opacity = "0";
    document.querySelector(".popup").style.visibility = "hidden";
}


//------------------------------ Menu contextuel (clique-droit) ------------------------------

document.oncontextmenu = (e) => {
    if(e.target==conteneurCode || e.target.className=="bloc" || e.target.tagName=="BUTTON" || e.target.tagName=="INPUT") e.preventDefault();
};

document.onmousedown = function(e){
    if(menuContextuel.style.display=="block" && e.target!==menuContextuel && e.target.tagName!=="BUTTON") menuContextuel.style.display = "none";
    else if(e.buttons==2 && document.querySelector(".wrapper").style.display=="flex" && ((e.target.className=="bloc" && e.target.parentNode!==partieBanque) || e.target==conteneurCode)){
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


//------------------------------ Menu pause -------------------------------------------

function afficherMenuPause(){
    const menuPause = document.querySelector(".menuPause");
    if(menuPause.style.display=="none"){
        menuPause.style.display = "flex";
        document.querySelector(".wrapper").style.filter = "blur(5px)";
        
    }else{
        menuPause.style.display = "none";
        document.querySelector(".wrapper").style.filter = "";
    }
}

document.querySelector("#volumeMusique").addEventListener("input",(e) => {jeu.musique.volume = e.target.value/100;}); //Volume musique
document.querySelector("#volumeSFX").addEventListener("input",(e) => {jeu.sfx.volume = e.target.value/100;}); //Volume SFX

document.querySelector("#remiseAZero").addEventListener("mouseout", (e) => {
    e.target.querySelector('path').setAttribute("transform", "rotate(0,500,500)");
});

document.querySelector("#remiseAZero").addEventListener("mouseenter", (e) => {
    e.target.querySelector('path').style.transition = "all 0.5s ease-in-out";
    e.target.querySelector('path').setAttribute("transform", "rotate(-20,500,500)");
});

function switchModeSombre(){
    if(document.getElementById("modeSombre").checked){
        partieBanque.style.background = "var(--bg-modeSombre)";
        document.querySelector("#partieCode").style.background = "var(--bg-modeSombre)";
        document.getElementById("partieControle").style.background = "var(--bg-modeSombre)";
        document.querySelector("#iconModeSombre").setAttribute("fill","#151515");
        document.querySelector("header").style.background = "#3c5a96";
        document.body.style.background = "#262626";
        document.documentElement.style.setProperty("--controles-hover","#5a5a5a");
        for(const el of document.querySelector(".controles").children) {el.children[0].setAttribute("fill","#dbdbdb");}
    }else{
        partieBanque.style.background = "white";
        document.querySelector("#partieCode").style.background = "white";
        document.querySelector("header").style.background = "#6699ff";
        document.getElementById("partieControle").style.background = "white";
        document.body.style.background = "#bbcdf0";
        document.querySelector("#iconModeSombre").setAttribute("fill","white");
        document.documentElement.style.setProperty("--controles-hover","#e8e8e8");
        for(const el of document.querySelector(".controles").children) {el.children[0].setAttribute("fill","black");}
    }
}

function switchCodeSource(){
    //Bon euh faudrait qu'on complete ca a la fin
}

function retournerAuMenuPrincipal(){
    supprimerToutLesBlocs();
    document.querySelector(".mapZone").style.display = "none";
    document.querySelector("#avatarJoueur").style.display = "none";
    document.querySelector(".zoneTouches").style.display = "none";
    document.querySelector(".menuPause").style.display = "none";
    document.querySelector(".menuPrincipal").style.display = "flex";
    document.querySelector(".mapMonde").style.display = "flex";
    document.querySelector(".wrapper").style.display = "none";
    document.querySelector(".wrapper").style.filter = "";
    jeu.musique.pause();
}

function updateComptageBlocs(){
    var blocTotal = (blocArray.length-1);
    for(const bloc of blocArray){
        if(bloc.id=="Repeter") blocTotal += bloc.children[1].children.length;
        var tauxRemplissage = (blocTotal/jeu.niveauxData.objectifBloc)*100;
        if(blocTotal > jeu.niveauxData.objectifBloc){
            document.querySelector(".texteComptageBlocs").innerHTML = `${blocTotal} / ${jeu.niveauxData.objectifBloc}`;
            document.querySelector(".comptageBlocs div").style.background = "#d86060";
        }else{
            document.querySelector(".texteComptageBlocs").innerHTML = `${blocTotal} / ${jeu.niveauxData.objectifBloc}`;
            document.querySelector(".comptageBlocs div").style.background = "#50d6d6";
            document.querySelector(".comptageBlocs div").style.width = tauxRemplissage+"%";
        }
    }
}

//------------------------------ Executer le code + vérifier si le joueur a gagner ------------------------------

function win(){
    if(tileParCoord(joueur.x,joueur.y)[0]=="objectif"){
        if(jeu.niveau<5){
            popup(`Tu as completé  le niveau ${jeu.niveau} de la zone ${jeu.zone} !`);
            setTimeout(() => {
                fermerPopup();
                supprimerToutLesBlocs();
                affichageNiveau(jeu.niveau+1);
                if(jeu.niveauDebloque.includes(jeu.zone+"-"+jeu.niveau)==false) jeu.niveauDebloque.push(jeu.zone+"-"+jeu.niveau)
            },2000);
        }else{
            popup("Tu as fini la 1ère zone, bravo jeune aventurier !<br> (le reste n'est pas encore fait, désolé :/)");
        }
    }
}

function remiseAZero(){
    remplacementCanvas(joueur.x,joueur.y);
    joueur.afficher(jeu.niveauxData.depart[0]*64,jeu.niveauxData.depart[1]*64,jeu.niveauxData.depart[2]);
}

async function executionCode(){
    if(blocArray.length>=2){
        document.getElementById('executionCode').disabled = true;
        remiseAZero();
        await sleep(200);
        for(const bloc of blocArray){
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
    if(blocEnMouvement!==undefined && document.querySelector(".wrapper").style.display=="flex"){
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

window.addEventListener("keydown", (e) => {
    if(e.keyCode == 96){
//        console.log(blocArray)
    }
});
