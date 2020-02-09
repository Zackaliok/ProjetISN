alert("Yo la miff");

var AlgorithmeJoueur = "";
var CodeAlgorithmeJoueur = "";
const zoneDuCode = document.getElementById("zoneDuCode");
//Objet représentant l'element "zoneDuCode"


function ajouterBloc(nom){
    AlgorithmeJoueur += "<p class='blocCommande'>"+nom+"</p>";
    zoneDuCode.innerHTML = AlgorithmeJoueur;
}



//========== NE PAS TOUCHER ==========

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 600;
canvas.width = 600;

