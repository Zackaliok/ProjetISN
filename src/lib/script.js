alert("Yo la miff");

var AlgorithmeJoueur = "";
var CodeAlgorithmeJoueur = "";
const zoneDuCode = document.getElementById("zoneDuCode");
//Objet représentant l'element "zoneDuCode"


function ajouterBloc(nom){
    AlgorithmeJoueur += "<p class='blocCommande'>"+nom+"</p>";
    zoneDuCode.innerHTML = AlgorithmeJoueur;
}