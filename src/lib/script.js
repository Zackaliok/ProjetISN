//------------------------------ Initialisation ------------------------------

alert("Yo la miff");

var AlgorithmeJoueur = "";
var CodeAlgorithmeJoueur = "";

const zoneDuCode = document.getElementById("zoneDuCode"); //Objet représentant l'element "zoneDuCode"

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 600; canvas.width = 600;



//------------------------------ Ajoute un bloc dans l'esapce de codage ------------------------------

function ajouterBloc(nom){
    AlgorithmeJoueur += "<p class='blocCommande'>"+nom+"</p>";
    zoneDuCode.innerHTML = AlgorithmeJoueur;
}


//------------------------------ Charger une image et l'afficher sur le canvas ------------------------------
// La documentation arrive !

function loadImg(url){
    return new Promise(resolve => {
        const img = new Image();
        img.addEventListener("load", () => {
            resolve(img);
        });
        img.src = url;
    });
}

loadImg("src/media/delete.png").then(img => {
    ctx.drawImage(img,0,0); //TEST !!
});
