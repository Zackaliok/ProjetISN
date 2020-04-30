//------------------------------ Elements DOM ------------------------------

const conteneurCode = document.getElementById("conteneurCode"); //Variable représentant la zone du code
const partieCode = document.getElementById("partieCode"); //Variable représentant la zone du code
const partieBanque = document.getElementById("partieBanque"); //Variable représentant la zone de la banque de bloc
const partieControle = document.getElementById("partieControle"); //Variable représentant la zone des controles
const blocDepart = document.getElementById("blocDepart"); //Variable représentant le bloc de départ
const menuContextuel = document.querySelector(".menuContextuel"); //Variable représentant le menu contextuel personnalisé
const wrapper = document.querySelector(".wrapper"); //Variable représentant le contenant principal de l'app
const popups = document.querySelector(".popup"); //Variable représentant la popup
const menu = document.querySelector(".menu"); //Variable représentant le menu
const enTete = document.querySelector(".en-tete"); //Variable représentant l'en-tete
const mapMonde = document.querySelector(".mapMonde"); //Variable représentant la zone de "map monde" dans le menu
const toucheFlecheGauche = document.getElementById("toucheFlecheGauche"); //Variable représentant les touches sur les map de zones
const toucheFlecheDroite = document.getElementById("toucheFlecheDroite"); //Variable représentant les touches sur les map de zones
const toucheEntree = document.getElementById("toucheEntree"); //Variable représentant les touches sur les map de zones
const toucheEchap = document.getElementById('toucheEchap'); //Variable représentant les touches sur les map de zones
const imgModeSombre = document.getElementById("imgModeSombre"); //Variable représentant les images pour les boutons
const imgMusique = document.getElementById("imgMusique"); //Variable représentant les images pour les boutons
const controlesJeu = document.getElementById("controlesJeu"); //Variable représentant les images pour les paramètres
const menuParametres = document.getElementById("menuParametres"); //Variable représentant les images pour les paramètres
var classBlocs = document.getElementsByClassName('bloc'); //Variable représentant tout les éléments avec la class "bloc"

//Créer l'élément image lorsque deux blocs peuvent être collés
var insertionBloc = document.createElement("img");
insertionBloc.src = "src/media/bloc-shadow.png";
insertionBloc.className = "insertionBloc";

//Variable representant la scrollbar custom
var scrollbar;
window.addEventListener("DOMContentLoaded",()=>{scrollbar = document.querySelector('.simplebar-content-wrapper');});