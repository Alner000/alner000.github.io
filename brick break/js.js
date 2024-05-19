class BrickBreak{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.gap = 11;
        this.brickWidth = 50;
        this.brickHeight = 30;
        this.bricks = [];
        this.ballX = 230;
        this.ballY = 250;
        this.ballDirection = 180;
        this.barWidth = 100;
        this.barHeight = 10;
        this.barX = (499/2)-50;
        this.score = 0;
        this.lifes = 3;
        this.bricksLeft = 24;
        this.generateBricks();
        this.drawBall();
        setInterval(this.init, 1);
    }
    
    init=()=>{
        this.clearCanvas();
        document.addEventListener("mousemove", this.moveBar);
        this.drawBricks();
        this.functionBallDirection();
        this.checkForEnd();
        this.moveBall();
        this.drawBall();
        this.drawBar();
        if(this.ballY < this.bricks[2][0].y+this.brickHeight){
            this.brickHit();
        }


    }

    clearCanvas=()=>{
        this.ctx.fillStyle="white";
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    }

    generateBricks=()=>{
        for(let r = 0; r<3; r++){
            let c = 0;
            this.bricks[r] = [];
            for(let i = 0; i<=(this.canvas.width-40); i+=this.brickWidth+this.gap){
                const x = c * (this.brickWidth + this.gap) + this.gap;
                const y = r * (this.brickHeight + this.gap) + this.gap;
                this.bricks[r][c]={
                    x: x,
                    y: y,
                    alive: true
                };
                c++;
            }
        }
    }

    drawBricks=()=>{
        for(let r = 0; r<3; r++){
            let c = 0;
            for(let i = 0; i<this.canvas.width-40; i+=this.brickWidth+this.gap){
                if(this.bricks[r][c].alive==true){
                    this.ctx.fillStyle = "red";
                    this.ctx.fillRect(parseInt(this.bricks[r][c].x), this.bricks[r][c].y, this.brickWidth, this.brickHeight);
                }
                c++;
            }
        }
    }

    brickHit=()=>{
        for(let r = 0; r<3; r++){
            for(let c = 0; c<8; c++){
                if(this.bricks[r][c].alive){
                    if(
                    this.ballX-10 <= this.bricks[r][c].x+this.brickWidth 
                    && this.ballX+10 >= this.bricks[r][c].x 
                    && this.ballY-10 <= this.bricks[r][c].y+this.brickHeight 
                    && this.ballY+10 >= this.bricks[r][c].y)
                    {
                            if(this.ballX+10 == this.bricks[r][c].x){
                                if(this.ballDirection == 45){
                                    this.ballDirection = 315;
                                }
                                else if(this.ballDirection == 135){
                                    this.ballDirection = 225;
                                }

                            }
                            else if(this.ballX-10 == this.bricks[r][c].x+this.brickWidth){
                                if(this.ballDirection == 45){
                                    this.ballDirection = 315;
                                }
                                else if(this.ballDirection == 315){
                                    this.ballDirection = 45;
                                }
                            }
                            else if(this.ballY+10 == this.bricks[r][c].y){
                                if(this.ballDirection == 180){
                                    this.ballDirection = 0;
                                }
                                else if(this.ballDirection == 225){
                                    this.ballDirection = 315;
                                }
                                else if(this.ballDirection == 135){
                                    this.ballDirection = 45;
                                }
                            }
                            else if(this.ballY-10 <= this.bricks[r][c].y+this.brickHeight){
                                if(this.ballDirection == 0){
                                    this.ballDirection = 180;
                                }
                                else if(this.ballDirection == 45){
                                    this.ballDirection = 135;
                                }
                                else if(this.ballDirection == 315){
                                    this.ballDirection = 225;
                                }
                            }
                            this.bricks[r][c].alive = false;
                            this.score+=20;
                            this.bricksLeft -=1;
                            document.getElementById("score").innerHTML = "PUNKTY: "+ this.score;
                    }
                }
            }
        }
    }

    functionBallDirection=()=>{
        if(this.ballY >= 499-30){ //zderzenie z paletka
            if(this.ballX >= this.barX+30 && this.ballX<= this.barX+this.barWidth-30){
                this.ballDirection = 0;
            }
            else if(this.ballX >=this.barX && this.ballX<= this.barX+29){
                this.ballDirection = 315;
            }
            else if(this.ballX >=this.barX+31 && this.ballX<= this.barX+this.barWidth){
                this.ballDirection = 45;
            }
        }
        else if(this.ballY <= 0+10){ //zderzenie z sufitem
            if(this.ballDirection == 0){
                this.ballDirection = 180;
            }
            else if(this.ballDirection == 45){
                this.ballDirection = 135;
            }
            else if(this.ballDirection == 315){
                this.ballDirection = 225;
            }
        }
        else if(this.ballX <= 0+10 ){ //zderzenie z lewa sciana
            if(this.ballDirection == 315){
                this.ballDirection = 45;
            }
            else if(this.ballDirection == 225){
                this.ballDirection = 135;
            }
        }
        else if(this.ballX >= this.canvas.width-5){ //zderzenie z prawa sciana
            if(this.ballDirection == 45){
                this.ballDirection = 315;
            }
            else if(this.ballDirection == 135){
                this.ballDirection = 225;
            }  
        }
    }

    checkForEnd=()=>{
        if(this.ballY >= this.canvas.height){
            this.lifes -=1;
            document.getElementById("life").innerHTML = "Życia: "+ this.lifes;
            this.ballDirection = 180;
            this.ballX = 250;
            this.ballY = 250;
            if(this.lifes == 0){
                alert("KONIEC GRY ILOŚĆ PUNKTÓW: "+this.score);
                document.getElementById("score").innerHTML = "PUNKTY: "+ this.score;
                this.generateBricks();
                this.score = 0;
                this.lifes = 3;
            }
        }
        if(this.bricksLeft == 0 ){
            alert("WYGRAŁEŚ ILOŚĆ PUNKTÓW: "+this.score*this.lifes);
            document.getElementById("score").innerHTML = "PUNKTY: "+ this.score;
            this.generateBricks();
            this.score = 0;
            this.lifes = 3;
        }
    }


    moveBall=()=>{
        if(this.ballDirection == 180){
            this.ballY +=1;
        }
        else if(this.ballDirection == 0){
            this.ballY -=1;
        }
        else if(this.ballDirection == 45){
            this.ballY -=1;
            this.ballX +=1;
        }
        else if(this.ballDirection == 135){
            this.ballY +=1;
            this.ballX +=1;
        }
        else if(this.ballDirection == 225){
            this.ballY +=1;
            this.ballX -=1;
        }
        else if(this.ballDirection == 315){
            this.ballY -=1;
            this.ballX -=1;
        }


    }
    drawBall=()=>{
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.ballX, this.ballY, 10,  0, Math.PI*2);
        this.ctx.fillStyle = "blue";
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawBar=()=>{
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.barX, 499-20, this.barWidth, this.barHeight);
    }
    moveBar=(e)=>{
        if(e.offsetX<50){
            this.barX = 0;
        }
        else if(e.offsetX > 450){
            this.barX = 400;
        }
        else{
            this.barX = e.offsetX-50;
        }
        
        
    }
    

}

const brick = new BrickBreak();