alert("Yo la miff");

var AlgorithmeJoueur = "";
var CodeAlgorithmeJoueur = "";

function Avancer() {
    AlgorithmeJoueur = AlgorithmeJoueur + "<p class='blocCommande'>Avancer</p>";
    document.getElementById("BlocPlayground").innerHTML=AlgorithmeJoueur;
}

function Sauter() {
  AlgorithmeJoueur = AlgorithmeJoueur + "<p class='blocCommande'>Sauter</p>";
  document.getElementById("BlocPlayground").innerHTML=AlgorithmeJoueur;
}

function TournerAGauche() {
  AlgorithmeJoueur = AlgorithmeJoueur + "<p class='blocCommande'>Tourner à gauche</p>";
  document.getElementById("BlocPlayground").innerHTML=AlgorithmeJoueur;
}

function TournerADroite() {
  AlgorithmeJoueur = AlgorithmeJoueur + "<p class='blocCommande'>Tourner à droite</p>";
  document.getElementById("BlocPlayground").innerHTML=AlgorithmeJoueur;
}
