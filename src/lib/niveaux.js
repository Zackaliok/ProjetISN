import {joueur, jeu, ctxDecors} from './init.js';
import {chargerJSON, scrollbar} from './outils.js';
export var tilesMap = new Map();


function afficherBloc(liste){
    for(var el of partieBanque.children){el.style.display = "none";}
    for(var el of liste){document.getElementById(el).style.display = "block";}
}

export function chargerMap(zone, niveau){
    chargerJSON('src/niveaux/'+zone+'-'+niveau+'.json').then(niveauData => {
        jeu.niveauxData = niveauData;
        niveauData.decors.forEach(partie => {
            if(partie.hasOwnProperty("modif")) var modif = [partie.modif[0],partie.modif[1],partie.modif[2],partie.modif[3]];
            else var modif = [64,64,0,0];

            partie.coord.forEach(coord => {
                for(var i=coord[0];i<=coord[1];i++){
                    for(var j=coord[2];j<=coord[3];j++){
                        tilesMap.set((i+","+j),[partie.tile,coord[4]]);
                        if(coord[4]!=null) rotationCanvas(i,j,coord[4],jeu.tilesData[partie.tile],modif);
                        else ctxDecors.drawImage(jeu.tileset,jeu.tilesData[partie.tile][0]*64,jeu.tilesData[partie.tile][1]*64,modif[0],modif[1],(i*64)-modif[2],(j*64)-modif[3],modif[0],modif[1]);
                    }
                }
            });
        });

        afficherBloc(niveauData.blocs);
        scrollbar.scrollLeft = 0; scrollbar.scrollTop = 0;
        joueur.afficher(niveauData.depart[0]*64,niveauData.depart[1]*64,niveauData.depart[2]);
        document.querySelector(".texteComptageBlocs").innerHTML = "0 / " + niveauData.objectifBloc;
    });
}

export function tileParCoord(x,y){
    return tilesMap.get(Math.trunc(x/64)+","+Math.trunc(y/64));
}

function rotationCanvas(x,y,deg,tile,modif){
    ctxDecors.save();
    ctxDecors.translate((x*64)+32,(y*64)+32);
    ctxDecors.rotate((deg*90)*(Math.PI/180));
    ctxDecors.translate(-(x*64)-32,-(y*64)-32);
    ctxDecors.drawImage(jeu.tileset,tile[0]*64,tile[1]*64,modif[0],modif[1],(x*64)-modif[2],(y*64)-modif[3],modif[0],modif[1]);
    ctxDecors.restore();
}




//----------------------------------- SAVE ------------------------------------------

//function creerMap(){
//    switch(zone + "-" + niveau){
//        case "3-1":
//            map[0] = Array(0,0,0,0,0,0,0,0,0);
//            map[1] = Array(0,0,0,0,2,0,0,0,0);
//            map[2] = Array(0,0,0,0,1,0,0,0,0);
//            map[3] = Array(0,0,0,0,1,0,0,0,0);
//            map[4] = Array(0,0,0,0,1,0,0,0,0);
//            map[5] = Array(0,0,0,0,1,0,0,0,0);
//            map[6] = Array(0,0,0,0,1,0,0,0,0);
//            map[7] = Array(0,0,0,0,1,0,0,0,0);
//            map[8] = Array(0,0,0,0,0,0,0,0,0);
//            joueur.startPos(256,448,0);
//            afficherBloc(["Avancer","Repeter"]);
//        break;
//
//        case "3-2":
//            map[0] = Array(0,0,0,0,0,0,0,0,0);
//            map[1] = Array(0,0,0,0,0,0,0,0,0);
//            map[2] = Array(0,0,0,0,0,1,2,0,0);
//            map[3] = Array(0,0,0,0,1,1,0,0,0);
//            map[4] = Array(0,0,0,1,1,0,0,0,0);
//            map[5] = Array(0,0,1,1,0,0,0,0,0);
//            map[6] = Array(0,0,0,0,0,0,0,0,0);
//            map[7] = Array(0,0,0,0,0,0,0,0,0);
//            map[8] = Array(0,0,0,0,0,0,0,0,0);
//            joueur.startPos(128,320,1);
//            afficherBloc(["Avancer","Repeter","TournerADroite","TournerAGauche","Si"]);
//        break;
//
//        case "3-3":
//            map[0] = Array(0,0,0,0,0,0,0,0,0);
//            map[1] = Array(0,0,1,1,2,0,0,0,0);
//            map[2] = Array(0,0,3,0,0,0,0,0,0);
//            map[3] = Array(0,0,1,0,0,0,0,0,0);
//            map[4] = Array(0,0,1,1,3,1,1,0,0);              // A COMPLETER J'AI PAS FINI CE NIVEAU (TRISTAN)
//            map[5] = Array(0,0,0,0,0,0,3,0,0);
//            map[6] = Array(0,0,0,0,0,0,1,0,0);
//            map[7] = Array(0,1,1,1,1,1,1,0,0);
//            map[8] = Array(0,0,0,0,0,0,0,0,0);
//            joueur.startPos(64,448,1);
//            afficherBloc(["Avancer","Repeter","TournerADroite","TournerAGauche","Sauter"]);
//        break;
//
//        case "3-4":
//            map[0] = Array(0,0,0,0,0,0,0,0,0);
//            map[1] = Array(0,1,3,1,0,0,0,0,0);
//            map[2] = Array(0,3,0,3,0,0,0,0,0);
//            map[3] = Array(0,1,0,1,0,1,3,1,0);
//            map[4] = Array(0,0,0,3,0,3,0,1,0);
//            map[5] = Array(0,2,0,1,3,1,0,1,0);
//            map[6] = Array(0,1,0,0,0,0,0,1,0);
//            map[7] = Array(0,1,3,1,3,1,3,1,0);
//            map[8] = Array(0,0,0,0,0,0,0,0,0);
//            joueur.startPos(64,192,0);
//            afficherBloc(["Avancer","Repeter","TournerADroite","TournerAGauche","Sauter"]);
//          break;
//            
//        case "3-5":
//            map[0] = Array(0,0,0,0,0,0,0,0,0);
//            map[1] = Array(0,0,0,0,4,1,1,0,0);
//            map[2] = Array(0,0,0,0,1,0,3,0,0);
//            map[3] = Array(0,1,1,4,1,0,4,0,0);
//            map[4] = Array(0,1,0,0,0,0,1,0,0);
//            map[5] = Array(0,1,0,0,4,3,1,0,0);
//            map[6] = Array(0,0,0,0,1,0,0,0,0);
//            map[7] = Array(0,0,0,0,1,1,4,2,0);
//            map[8] = Array(0,0,0,0,0,0,0,0,0);
//            joueur.startPos(64,256,0);
//            afficherBloc(["Avancer"]);
//          break;
//    }
//}