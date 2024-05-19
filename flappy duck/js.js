window.onload=()=>{
    game.init();
}

class Game{
    posX = 100;
    posY = 240;
    gravity = 1;
    score = 0;

    pipes = [];
    pipesGap = 300;
    pipePassed = false;


    init=()=>{ //zainicjowanie elementow potrzebnych do gry oraz wystartowanie gry 
        this.success = new Audio();
        this.success.src = "sounds/success.mp3";

        this.pipeSound = new Audio();
        this.pipeSound.src = "sounds/pipe.wav";

        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");


        this.background = new Image();
        this.background.src = "images/background.png";

        this.bird = new Image();
        this.bird.src = "images/bird.png";

        
        this.dol = new Image();
        this.dol.src = "images/dol.png";

        this.gora = new Image();
        this.gora.src = "images/gora.png";
        this.gora.height = 650


        this.canvas.addEventListener("click", this.moveUp);
        document.addEventListener("keydown", (e)=>{
            if(e.key == " "){
                this.moveUp();
            }
        });
        this.generatePipe();
        this.startGame();

    }

    startGame=()=>{ //ustawienie odswiezania gry
        const fps = 60;
        setInterval(this.updateGame, 100/fps);
        
    }

    updateGame=()=>{ //wywolanie funkcji aktualizujacych elementy gry
        this.drawBird();
        this.gravityUpdate();
        this.pipesMove();
        this.pipesDraw();
    }

    gravityUpdate=()=>{ //funkcja obslugujaca spadanie ptaka
        this.posY +=this.gravity;
    }

    moveUp=()=>{ //funkcja obslugujaca latanie ptaka
        this.posY-=75;
        this.quackSound();
    }
    quackSound=()=>{ //funkcja, ktora umozliwia wywolanie dziweku ptaka wiecej razy zanim skonczy sie grac dzwiek
        var audio = new Audio('sounds/quack.wav');
        audio.play();
    }

    drawBird = ()=>{  //rysowanie ptaka
        this.birdCollison();
        this.ctx.drawImage(this.background, 0,0);
        this.ctx.drawImage(this.bird, this.posX, this.posY);
        
    }
    birdCollison=()=>{  //sprawdzanie kolizji ptaka
        if(this.posY+this.bird.height>=this.canvas.height){ //sprawdzenie czy ptak jest na podlodze
            this.posY=this.canvas.height-this.bird.height;
        }
        else if(this.posY<=0){ //sprawdzenie czy ptak jest na suficie
            this.posY = 0;
        }


        if(this.posX<=this.pipes[0].goraX+this.gora.width && 
            this.posX+this.bird.width>= this.pipes[0].goraX &&
            this.posY+this.bird.height>=this.pipes[0].goraY &&
            this.posY <= this.pipes[0].goraY+this.gora.height){
                this.lose();
        } // warunek sprawdzajacy gorna rure
        else if(this.posX<=this.pipes[0].dolX+this.gora.width &&
            this.posX+this.bird.width>= this.pipes[0].dolX &&
            this.posY+this.bird.height>=this.pipes[0].dolY &&
            this.posY <= this.pipes[0].dolY+this.dol.height){
                this.lose();
            } //warunek sprawdzajacy dolna rure
        else if(this.posX>=this.pipes[0].goraX+this.gora.width&&
                this.posY>=this.pipes[0].goraY+this.gora.height &&
                this.posY+this.bird.height<=this.pipes[0].dolY){ //warunek sprawdzajacy dziure miedzy rurami
                    if(!this.pipePassed){ //sprawdzenie czy rura zostala ominieta w celu wywolania ponizszych instrukcji tylko raz
                        this.success.play();
                        this.score+=1
                        if(this.pipesGap >150){
                            this.pipesGap -=5
                        }
                        this.pipePassed = true;
                        document.getElementById("score").innerHTML = "Punkty: "+this.score;
                    }
        }
    }

    pipesMove=()=>{ //funkcja poruszajaca rurami
        for(let i =0; i<this.pipes.length; i++){
            this.pipes[i].goraX-=1;
            this.pipes[i].dolX-=1;
            if(this.pipes[i].goraX==this.canvas.width-600){
                this.generatePipe();
            }
            if(this.pipes[i].goraX<=0-this.gora.width){ //usuwanie rur po tym jak wyjda po za plansze
                this.pipes.shift();
                this.pipePassed = false;
            }
        }
    }

    pipesDraw=()=>{ //rysowanie rur
        for(let i =0; i<this.pipes.length; i++){
            this.ctx.drawImage(this.gora, this.pipes[i].goraX, this.pipes[i].goraY);
            this.ctx.drawImage(this.dol, this.pipes[i].dolX, this.pipes[i].dolY);
        }
    }

    generatePipe=()=>{ //generowanie rury
        this.pipeX = this.canvas.width;
        this.pipeY = (-1)*Math.floor(Math.random()* this.gora.height);
        let dolY = this.pipeY+this.gora.height+this.pipesGap
        this.pipes.push({goraX: this.pipeX, goraY: this.pipeY, dolX: this.pipeX, dolY: dolY});
    }

    lose=()=>{ //funkcja wywolywana podczas zderzenia z rura
        this.pipeSound.play();
        this.pipePassed = false;
        this.posY = 240;
        this.score = 0
        this.pipes = [];
        this.pipesGap = 300;
        this.generatePipe();
        document.getElementById("score").innerHTML = "Punkty: "+this.score;
    }
}

const game = new Game();


/*Zrodla:
grafiki: 
background: https://www.istockphoto.com/pl/wektor/t%C5%82o-gry-pikselowej-pixel-art-sceny-gry-z-zielon%C4%85-traw%C4%85-i-wysokimi-drzewami-na-tle-gm1324202788-409621472
kiwi: paint,
rury: paint,

dzwieki:
sukces: https://freesound.org/people/Gronkjaer/sounds/654321/
kwak: https://freesound.org/people/Gamezger/sounds/398088/
uderzenie: https://freesound.org/people/ani_music/sounds/244983/
*/