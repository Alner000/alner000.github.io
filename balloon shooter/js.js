class BalloonShooter{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.balloons = [];
        this.balloonsLeft;
        this.balloonRadius = 30;
        this.gap = 60;
        this.gapy = 100;
        this.playerx = 150;
        this.playery = this.canvas.height-150;
        this.playerwidth = 10;
        this.playerheight = 10;
        this.dartsLeft = 5;
        this.score = 0;
        this.flying = false;
        this.generateBalloons();
        this.dart = {x: this.playerx, y: this.playery, width: 2,
        height: 30, mass: 0.1, dx: 0, dy: 0};
        canvas.addEventListener("mousedown", this.startLine);
        canvas.addEventListener("mousemove", this.moveLine);
        canvas.addEventListener("mouseup", this.shoot);
        setInterval(this.init, 10);

    }

    init=()=>{
        this.clearCanvas();
        this.drawClouds();
        this.drawBalloons();
        this.drawCannon();
        this.drawLine();
        this.dartShoot();
        
        this.text();
        this.checkForEnd();

    }

    clearCanvas=()=>{
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    }
    text=()=>{
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'black';
        let x = this.playerx +250;
        let y = this.playery +50;
        this.ctx.fillText('Pozostało lotek: '+ this.dartsLeft, x, y);
        x = this.playerx +500;
        y = this.playery +50;
        this.ctx.fillText('Punkty: '+ this.score, x, y);

    }

    startLine=()=>{
        if(this.flying == false){
            this.rysowanie = true;
        }
    }

    moveLine=(e)=>{
            this.crosshairX = (this.playerx)+((e.offsetX-(this.playerx))*(-1));
            this.crosshairY = (this.playery)+((e.offsetY-(this.playery))*(-1)); //ne dziala
            if(this.flying !=true){
                this.diffX=(e.offsetX-(this.playerx))*(-1)  //- odleglosc miedzy graczem a koncem celownika X
                this.diffY=(e.offsetY-(this.playery))*(-1) //- odleglosc miedzy graczem a koncem celownika Y
            }

    }
    shoot=()=>{
        if(this.rysowanie){
            this.flying = true;
        }
        this.rysowanie = false;

    }

    drawLine=()=>{
        if(this.rysowanie){
            this.ctx.beginPath();
            this.ctx.moveTo((this.playerx+this.ctx.lineWidth/2), (this.playery+this.ctx.lineWidth/2));
            this.ctx.lineTo(this.crosshairX, this.crosshairY);
            this.ctx.stroke();
        }
    }

    dartShoot=()=>{

        if(this.flying !=true){
            this.dart.dx = this.diffX/10;
            this.dart.dy = this.diffY/10;
        }

        if(this.flying){

            this.ctx.save();
            this.drawDart();
            this.ctx.restore();
            
            this.dart.x += this.dart.dx;
            this.dart.y += this.dart.dy;
            this.dart.dy += this.dart.mass;
            this.dartCheckCollision();
        }
    }

    drawDart=()=>{
        this.ctx.translate(this.dart.x, this.dart.y);
        this.ctx.rotate(Math.atan2((this.dart.y+this.dart.dy)-this.dart.y, (this.dart.x+this.dart.dx)-this.dart.x)+(90*(Math.PI/180)));
        this.ctx.translate((-1)*(this.dart.x), (-1)*(this.dart.y));
        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(this.dart.x, this.dart.y, this.dart.width, this.dart.height);
        this.ctx.fillStyle= "white";
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(this.dart.x, this.dart.y, this.dart.width, this.dart.height-22);
        this.ctx.beginPath();
        this.ctx.moveTo(this.dart.x, this.dart.y+1);
        this.ctx.lineTo(this.dart.x-2, this.dart.y+8);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(this.dart.x+2, this.dart.y+1);
        this.ctx.lineTo(this.dart.x+4, this.dart.y+8);
        this.ctx.stroke();
    }

    dartCheckCollision=()=>{
        if(this.dart.x+this.dart.width<=0 || this.dart.x >= this.canvas.width || this.dart.y >= this.canvas.height){
            this.flying = false;
            this.dart.x = this.playerx;
            this.dart.y = this.playery;
            this.dartsLeft--;
            
        }
        for(let i=0;i<this.balloons.length; i++){
            if(this.dart.x<=
                this.balloons[i].x+this.balloonRadius &&
                this.dart.x>=this.balloons[i].x-this.balloonRadius &&
                this.dart.y<=this.balloons[i].y+this.balloonRadius &&
                this.dart.y>=this.balloons[i].y-this.balloonRadius)
            {
                
                if(this.balloons[i].alive){
                    this.score+=100;
                    this.balloonsLeft--;
                }
                this.balloons[i].alive = false;

            }
        }
    }

    generateBalloons=()=>{
            for(let r = 0; r<3; r++){
                for(let c = 0; c<8; c++){
                    this.x = (c * (this.balloonRadius + this.gap) + this.gap)+200;
                    this.y = (r * (this.balloonRadius + this.gapy) + this.gapy);
                    this.balloons.push({x: this.x, y:this.y, alive: true});
                }

            }
            this.balloonsLeft = this.balloons.length;

    }
    drawBalloons=()=>{
        for(let i=0; i< this.balloons.length; i++){
            if(this.balloons[i].alive){
                this.ctx.strokeStyle = "red";
                this.ctx.fillStyle = "red";
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(this.balloons[i].x, this.balloons[i].y, this.balloonRadius,  0, Math.PI*2);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.font = '20px Arial';
                this.ctx.fillStyle = 'black';
                let x = this.balloons[i].x-this.balloonRadius*0.15;
                let y = this.balloons[i].y+this.balloonRadius*1.68;
                this.ctx.fillText(')', x, y);
                this.ctx.fillStyle='red';
                this.ctx.fillRect(this.balloons[i].x-this.balloonRadius/4,  this.balloons[i].y, this.balloonRadius/2, this.balloonRadius*1.3);
                this.ctx.fillRect(this.balloons[i].x-this.balloonRadius/2+this.balloonRadius*0.2,  this.balloons[i].y+this.balloonRadius*1.25, this.balloonRadius*0.6, this.balloonRadius/10);

            }

        }
    }

    drawCannon=()=>{
        if(this.flying == false){
            this.ctx.save();
            this.ctx.translate(this.dart.x, this.dart.y);
            this.ctx.rotate(Math.atan2((this.dart.y+this.dart.dy)-this.dart.y, (this.dart.x+this.dart.dx)-this.dart.x)+(90*(Math.PI/180)));
            this.ctx.translate((-1)*(this.dart.x), (-1)*(this.dart.y));
            this.ctx.fillStyle='brown';
            this.ctx.fillRect(this.playerx, this.playery, this.dart.width, this.dart.height);
            this.ctx.fillStyle= "white";
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.fillRect(this.playerx, this.playery, this.dart.width, this.dart.height-22);
            this.ctx.beginPath();
            this.ctx.moveTo(this.playerx, this.playery+1);
            this.ctx.lineTo(this.playerx-2, this.playery+8);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(this.playerx+2, this.playery+1);
            this.ctx.lineTo(this.playerx+4, this.playery+8);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    drawClouds=()=>{
        this.ctx.fillStyle = "white";
        this.ctx.beginPath();
        this.ctx.arc(400, this.canvas.height, 150,  0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(600, this.canvas.height, 200,  0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(800, this.canvas.height, 100,  0, Math.PI*2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, 100,  0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(150, 0, 150,  0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(300, 0, 100,  0, Math.PI*2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width, 0, 50,  0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width-100, 0, 100,  0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width-200, 0, 80,  0, Math.PI*2);
        this.ctx.fill();
    }

    checkForEnd=()=>{
        if(this.balloonsLeft ==0){
            alert("WYGRAŁEŚ, ILOŚĆ PUNKTÓW: "+this.score);
        }
        if(this.dartsLeft == 0){
            alert("KONIEC GRY, ILOŚĆ PUNKTÓW: "+this.score);
            this.dartsLeft = 5;
            this.score = 0;
            this.balloons = [];
            this.generateBalloons();
        }
    }

}

const balloons = new BalloonShooter();