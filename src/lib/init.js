import {Joueur, Jeu} from './classes.js';
import {sleep} from './outils.js';

export const joueur = new Joueur(0,0,0);
export const jeu = new Jeu(1,1);

export const canvasJoueur = document.getElementById('canvasJoueur');
export const ctxJoueur = canvasJoueur.getContext('2d');
export const canvasDecors = document.getElementById('canvasDecors');
export const ctxDecors = canvasDecors.getContext('2d');

async function barreDeProgression(){
    for(var i=0;i<=5000;i+=1000){
        document.querySelector(".barreDeProgression").firstChild.style.width = (i/5000)*100+"%";
        document.querySelector(".texteChargement").innerHTML = "Chargement, veuillez patientez... (" + (i/5000)*100+"%)";
        await sleep(1000);
    }
}

(async function chargement(){
    jeu.chargerFichiers();
    
    await barreDeProgression();
    
    document.querySelector(".pageDeChargement").style.display = "none";
    document.querySelector(".mapMonde").style.display = "flex";
})();