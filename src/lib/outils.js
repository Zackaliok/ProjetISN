import {deplacementAvatar, affichageZone, popup} from './script.js';
import {jeu} from './init.js';
export var scrollbar;


//Charge le JSON
export function chargerJSON(url){
    return fetch(url).then(r => {return r.json()});
}

//Charge l'image
export function chargerImg(url){
    return new Promise(resolve => {
        let img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
    });
}

//Fonction Sleep
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Event Listener
window.addEventListener("DOMContentLoaded", () => {
    document.onselectstart = (e) => {e.preventDefault()};
    scrollbar = document.querySelector('.simplebar-content-wrapper');
    document.addEventListener("keydown",deplacementAvatar);
    for(const el of document.querySelectorAll('img')) {el.setAttribute('draggable', false);}
    
    document.querySelector('map').addEventListener("click", (e) => {
        var zone = parseInt(e.target.title.match(/[0-9]/g));
        if(jeu.niveauDebloque.includes(zone+"-1")) affichageZone(zone);
        else popup("Tu ne peux pas accéder à une zone non débloquée !");
    });
});
