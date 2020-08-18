import {jeu, ctx} from './init.js';
import {tileParCoord, remplacementCanvas} from './niveaux.js';
import {chargerJSON, chargerImg} from './outils.js';


export class Jeu {
    constructor(zone, niveau){
        this.zone = zone;
        this.niveau = niveau;
        this.niveauDebloque = ["1-1"];
        
        this.musique = new Audio();
        this.sfx = new Audio();
    }
    
    chargerFichiers(){
        chargerJSON('src/data/tiles.json').then(r => {this.tilesData = r;});
        chargerJSON('src/data/zones.json').then(r => {this.zonesData = r;});
        chargerImg("src/media/assets.png").then(img => {this.tileset = img;});
    }
    
    jouerMusique(){
        this.musique.src="src/media/son/musiqueZone.wav"; //A changer après en ajoutant "this.zone"
        this.musique.play();
        this.musique.loop=true;
    }
    
    jouerSFX(nom){
        this.sfx.src = "src/media/son/"+nom+".mp3";
        this.sfx.play();
        this.sfx.loop=false;
    }
}

export class Joueur {
    constructor(x,y,dir){
        this.x = x;
        this.y = y;
        this.dir = dir;
    }

    pos(x,y,dir){
        this.x = x;
        this.y = y;
        this.dir = dir;
    }

    afficher(x,y,dir){
        this.pos(x,y,dir);
        switch(this.dir){
            case 0: ctx.drawImage(jeu.tileset,0,512,64,64,x,y,64,64); break; //HAUT
            case 1: ctx.drawImage(jeu.tileset,64,512,64,64,x,y,64,64); break; //DROITE
            case 2: ctx.drawImage(jeu.tileset,128,512,64,64,x,y,64,64); break; //BAS
            case 3: ctx.drawImage(jeu.tileset,196,512,64,64,x,y,64,64); break; //GAUCHE
        }
    }
    
    Avancer(){
        var sauvPos = [this.x,this.y];
        remplacementCanvas(this.x,this.y);
        switch(this.dir){
            case 0: this.y-=64; break;
            case 1: this.x+=64; break;
            case 2: this.y+=64; break;
            case 3: this.x-=64; break;
        }
        if(tileParCoord(this.x,this.y)[0]!="herbe") this.afficher(this.x,this.y,this.dir);
        else this.afficher(sauvPos[0],sauvPos[1],this.dir);
    }
    
    Sauter(){
        var sauvPos = [this.x,this.y];
        remplacementCanvas(this.x,this.y);
        switch (this.dir){
            case 0: this.y-=128; break;
            case 1: this.x+=128; break;
            case 2: this.y+=128; break;
            case 3: this.x-=128; break;
        }
        if(tileParCoord(this.x,this.y)[0]!="herbe"){
            this.afficher(this.x,this.y,this.dir);
        }
        else this.afficher(sauvPos[0],sauvPos[1],this.dir);
    }
    
    
    TournerADroite(){
        remplacementCanvas(this.x,this.y);
        this.dir = (this.dir+1)%4;
        this.afficher(this.x,this.y,this.dir);
    }
    
    TournerAGauche(){
        remplacementCanvas(this.x,this.y);
        this.dir -= 1;
        if(this.dir==-1) this.dir=3;
        this.afficher(this.x,this.y,this.dir);
    }
}
