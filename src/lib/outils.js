import {deplacementAvatar, affichageZone, joueur} from './script.js';
export var scrollbar;


//Charge le JSON
export function chargerJSON(url){
    return fetch(url).then(async(r) => {return await r.json()});
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
    document.onselectstart = (e) => {e.preventDefault();}; //Empeche la séléction du texte sur la page
    
    scrollbar = document.querySelector('.simplebar-content-wrapper'); //On définit l'élément contenant les scrollbars custom
    
    document.addEventListener("keydown",deplacementAvatar); //Evenement "keydown" (avatar sur les map de zones)
    
    document.querySelector('map').addEventListener("click", (e) => { //Evenement "click" sur les "area" (Map Monde)
        var zone = parseInt(e.target.title.match(/[0-9]/g));
        if(joueur.niveauDebloque.includes(zone+"-1")) affichageZone(zone);
    });
});
