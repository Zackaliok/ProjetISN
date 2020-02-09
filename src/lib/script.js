//------------------------------ Initialisation ------------------------------

var CodeAlgorithmeJoueur = new Array();
var playerImg;

const zoneDuCode = document.getElementById("zoneDuCode"); //Objet représentant l'element "zoneDuCode"

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 600; canvas.width = 600;


//------------------------------ Classe du joueur + déclaration ------------------------------

class Player {
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
}

var player = new Player(400,400);


//------------------------------ Ajoute un bloc dans l'esapce de codage ------------------------------

function ajouterBloc(nom){
    zoneDuCode.innerHTML += "<p class='blocCommande'>"+nom+"</p>";
    CodeAlgorithmeJoueur.push(nom);
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
        playerImg = img;
    });
}

loadImg("src/media/player.png").then(img => {
    ctx.drawImage(img,player.x,player.y);
});


//------------------------------ Executer le code mis en place dans la zone de codage ------------------------------


function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
}

async function executerCode(){
    for(var i=0;i<CodeAlgorithmeJoueur.length;i++){
        switch(CodeAlgorithmeJoueur[i]){
            case "Avancer":
                ctx.clearRect(player.x,player.y,64,64);
                player.y -= 64;
                ctx.drawImage(playerImg,400,player.y);
                break;
        }
        await sleep(1000);
    }
}