//------------------------------ Classes ------------------------------
/*
    Les classes représentent des objets ayant des caractéristiques.
    Le "contructor" est l'élément obligatoire d'une classe, il permet d'enregistrer les différents paramètres quand l'objet est créé.
    Par exemple, ici l'objet 'Joueur' a 3 paramètres, les positions x et y ainsi que la direction (dir).
    Par abus de langage on peut dire que le "constructor" agit comme une fonction au sein de la classe.
    Ainsi, "afficher" peut-être considérer (et remplacer) comme une fonction, elle sera appeler de cette manière :
    'joueur.afficher(x,y,dir)'.
*/

import {files, joueur, ctx} from './script.js';
import {tileParCoord, remplacementCanvas} from './niveaux.js';
import {chargerJSON, chargerImg} from './outils.js';

export class Joueur {
    constructor(x,y,dir){
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.niveauDebloque = ["1-1"];
    }

    pos(x,y,dir){
        this.x = x;
        this.y = y;
        this.dir = dir;
    }

    afficher(x,y,dir){
        joueur.pos(x,y,dir);
        switch(this.dir){
            case 0: ctx.drawImage(files.tileset,0,512,64,64,x,y,64,64); break; //HAUT
            case 1: ctx.drawImage(files.tileset,64,512,64,64,x,y,64,64); break; //DROITE
            case 2: ctx.drawImage(files.tileset,128,512,64,64,x,y,64,64); break; //BAS
            case 3: ctx.drawImage(files.tileset,196,512,64,64,x,y,64,64); break; //GAUCHE
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
        if(tileParCoord(joueur.x,joueur.y)[0]!="herbe") this.afficher(this.x,this.y,this.dir);
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
        if(tileParCoord(joueur.x,joueur.y)[0]!="herbe") this.afficher(this.x,this.y,this.dir);
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

export class FileManager {
    constructor(){
        chargerJSON('src/data/tiles.json').then(r => {
            this.tilesData = r;
        });
        
        chargerJSON('src/data/zones.json').then(r => {
            this.zonesData = r;
        });
        
        chargerImg("src/media/assets.png").then(img => {
            this.tileset = img;
        });
    }
}
