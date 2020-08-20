import {jeu, ctxJoueur} from './init.js';
import {tileParCoord} from './niveaux.js';
import {chargerJSON, chargerImg, sleep} from './outils.js';


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
        chargerJSON('src/data/animations.json').then(r => {this.anim = r;});
        chargerImg("src/media/assets.png").then(img => {this.tileset = img;});
    }
    
    jouerMusique(){
        if(this.musique.paused){
            this.musique.src="src/media/son/musiqueZone.wav"; //A changer après en ajoutant "this.zone"
            this.musique.play();
            this.musique.loop = true;
        }
    }
    
    jouerSFX(nom){
        this.sfx.src = "src/media/son/"+nom+".mp3";
        this.sfx.play();
        this.sfx.loop = false;
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
        ctxJoueur.drawImage(jeu.tileset,64*dir,512,64,64,x,y,64,64);
    }
    
    async Avancer(){ 
        for(let i=0;i<4;i++){
            var sauvPos = [this.x,this.y];
            ctxJoueur.clearRect(this.x,this.y,64,64);
            switch(this.dir){
                case 0: this.y -= 16; break;
                case 1: this.x += 16; break;
                case 2: this.y += 16; break;
                case 3: this.x -= 16; break;
            }
            if(tileParCoord(this.x,this.y)[0]!=="herbe"){
                ctxJoueur.drawImage(jeu.tileset,this.dir*64,jeu.anim.marche[i],64,64,this.x,this.y,64,64);
                await sleep(400);
            }
            else this.afficher(sauvPos[0],sauvPos[1],this.dir);
        }
    }
    
    async Sauter(){
        var sauvPos = [this.x,this.y];
        ctxJoueur.clearRect(this.x,this.y,64,64);
        switch(this.dir){
            case 0: this.y -= 128; break;
            case 1: this.x += 128; break;
            case 2: this.y += 128; break;
            case 3: this.x -= 128; break;
        }
        if(tileParCoord(this.x,this.y)[0]!=="herbe"){
            ctxJoueur.drawImage(jeu.tileset,this.dir*64,512,64,64,this.x,this.y,64,64);
            await sleep(400);
        }
        else this.afficher(sauvPos[0],sauvPos[1],this.dir);
    }
    
    
    async TournerADroite(){
        ctxJoueur.clearRect(this.x,this.y,64,64);
        this.dir = (this.dir+1)%4;
        this.afficher(this.x,this.y,this.dir);
        await sleep(400);
    }
    
    async TournerAGauche(){
        ctxJoueur.clearRect(this.x,this.y,64,64);
        this.dir -= 1;
        if(this.dir==-1) this.dir=3;
        this.afficher(this.x,this.y,this.dir);
        await sleep(400);
    }
}
