import {Joueur, Jeu} from './classes.js';
import {sleep} from './outils.js';

export const joueur = new Joueur(0,0,0); //Déclaration de l'objet Joueur avec 3 paramètres (x,y,dir)
export const jeu = new Jeu(1,1); //Représente les niveaux et zones débloqués

export const canvas = document.getElementById('canvas'); //Variable représentant le canvas
export const ctx = canvas.getContext('2d'); //Variable représentant le "context" (la où on dessine)

async function barreDeProgression(){
    for(var i=0;i<=5000;i+=1000){
        document.querySelector(".barreDeProgression").firstChild.style.width = (i/5000)*100+"%";
        document.querySelector(".texteChargement").innerHTML = "Chargement, veuillez patientez... (" + (i/5000)*100+"%)";
        await sleep(1000);
    }
}

(async function chargement(){
    jeu.chargerFichiers();
    
//    await barreDeProgression(); //Bypass
    
    document.querySelector(".pageDeChargement").style.display = "none";
    document.querySelector(".mapMonde").style.display = "flex";
})();