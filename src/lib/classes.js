//------------------------------ Classe Joueur ------------------------------
/*
    Les classe représentent des objets ayant des caractéristiques.
    Le "contructor" est l'élément obligatoire d'une classe, il permet d'enregistrer les différents paramètres.
    Par exemple, ici l'objet 'Joueur' a 3 paramètres, les positions x et y ainsi que la direction (dir).
    Par abus de langage on peut dire que le "constructor" agit comme une fonction au sein de la classe.
    Ainsi, "afficher" peut-être considérer (et remplacer) comme une fonction, elle sera appeler de cette manière :
    'joueur.afficher(x,y,dir)'.
*/

class Joueur {
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
    
    startPos(x,y,dir){
        this.startX = x;
        this.startY = y;
        this.startDir = dir;
        joueur.pos(x,y,dir);
    }

    afficher(x,y,dir){
        this.dir = dir;
        switch(dir){
            case 0: ctx.drawImage(tileSet,64,64,64,64,x,y,64,64); break; //HAUT
            case 1: ctx.drawImage(tileSet,64,0,64,64,x,y,64,64); break; //DROITE
            case 2: ctx.drawImage(tileSet,0,64,64,64,x,y,64,64); break; //BAS
            case 3: ctx.drawImage(tileSet,0,0,64,64,x,y,64,64); break; //GAUCHE
        }
    }
    
    Avancer(){
        var sauvPos = [this.x,this.y];
        ctx.drawImage(tileSet,0,128,64,64,this.x,this.y,64,64);
        switch(this.dir){
            case 0: this.y-=64; break;
            case 1: this.x+=64; break;
            case 2: this.y+=64; break;
            case 3: this.x-=64; break;
        }
        if(map[this.y/64][this.x/64]!==0) this.afficher(this.x,this.y,this.dir);
        else {
            this.afficher(sauvPos[0],sauvPos[1],this.dir);
            this.pos(sauvPos[0],sauvPos[1],this.dir);
        }
    }
    
    Sauter(){
        var sauvPos = [this.x,this.y];
        ctx.drawImage(tileSet,0,128,64,64,this.x,this.y,64,64);
        switch (this.dir){
            case 0: this.y-=128; break;
            case 1: this.x+=128; break;
            case 2: this.y+=128; break;
            case 3: this.x-=128; break;
        }
        if(map[this.y/64][this.x/64]!==0) this.afficher(this.x,this.y,this.dir);
        else {
            this.afficher(sauvPos[0],sauvPos[1],this.dir);
            this.pos(sauvPos[0],sauvPos[1],this.dir);
        }
    }
    
    
    TournerADroite(){
        ctx.drawImage(tileSet,0,128,64,64,this.x,this.y,64,64);
        this.dir = (this.dir+1)%4;
        this.afficher(this.x,this.y,this.dir);
    }
    
    TournerAGauche(){
        ctx.drawImage(tileSet,0,128,64,64,this.x,this.y,64,64);
        this.dir -= 1;
        if(this.dir==-1) this.dir=3;
        this.afficher(this.x,this.y,this.dir);
    }
}
