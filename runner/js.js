window.onload=()=>{
    lionRunner.init();
};

class LionRunner{
   init=()=>{

    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.image = new Image();
    this.image.src = "images/cat.png";

    this.rock1 = new Image();
    this.rock1.src = `images/1.png`;
    this.rock2 = new Image();
    this.rock2.src = `images/2.png`;
    this.rock3 = new Image();
    this.rock3.src = `images/3.png`;
    this.rock4 = new Image();
    this.rock4.src = `images/4.png`;

    this.music = new Audio();
    this.music.src = "sounds/music.wav";
    this.music.volume = 0.1;
    this.gameOverSound = new Audio();
    this.gameOverSound.src = "sounds/gameover.wav";

    this.rocks = [this.rock1, this.rock2, this.rock3, this.rock4];

    this.background = new Image();
    this.background.src = "images/background.png"

    this.backgroundX1 = 0;
    this.backgroundX2 = this.background.width;
    this.backgroundX3 = this.background.width*2;
    this.currentFrame = 0;
    this.framesMax = 8;
    this.frameWidth = 250;
    this.frameHeight = 125;
    this.drawPosX = 100;
    this.gravity = 2;
    this.jump = 0;
    this.gameSpeed = 40;
    this.score = 0;
    this.obstacles = [];
    this.drawPosY = this.canvas.height-this.frameHeight;
    this.gameOver = true;
    this.newHighscore = false;

    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keydown", this.reset);
    document.addEventListener("mousedown", this.keyDown);
    document.addEventListener("mousedown", this.reset);

    this.generateObstacle();
    setInterval(this.update, 40);

   }

   keyDown=(e)=>{
    if((e.code == "ArrowUp"|| e.code=="Space" || e.code == null)&& !this.gameOver){
        if(this.drawPosY==this.canvas.height-this.frameHeight){
            this.jumpSound();
            this.jump = -25;
            }
    }
   }
   reset = (e)=>{
    if((e.code =="Enter" || e.code =="KeyR"|| e.code == null) && this.gameOver){
        this.music.play();
        this.obstacles = [];
        this.gameSpeed = 40;
        this.currentFrame = 0;
        this.score = 0;
        this.backgroundX1 = 0;
        this.backgroundX2 = this.background.width;
        this.drawPosY = this.canvas.height-this.frameHeight;
        this.gameOver = false;
        this.newHighscore = false;
    }
   }
    

    update = () =>{
        this.clearCanvas();
        this.drawBackground();
        this.drawText();
        if(!this.gameOver){
            this.music.play();
            this.checkForCollison();
            this.gameSpeedIncrease();
            this.moveBackground();
            this.moveObstacles();
            this.removeObstacle();
            this.drawObstacles();
            this.animate();
            this.drawPlayer();
        }
    }

    animate =()=>{
        if(this.drawPosY!=this.canvas.height-this.frameHeight){
            this.currentFrame = 0;
        }
        if(this.drawPosX-1>=this.canvas.width){
            this.currentFrame = 0;
            this.drawPosX = 0-this.frameWidth;
        }
        if(this.drawPosX+this.frameWidth<=-1){
            this.currentFrame = 0;
            this.drawPosX = this.canvas.width;
        }
        if(this.currentFrame > this.framesMax-1){
            this.currentFrame = 0;
        }
        this.currentFrame++;
        if(this.currentFrame <= 4){
            this.cutX = (this.currentFrame-1)*this.frameWidth;
            this.cutY = 0;
        }
        else{
            this.cutX = ((this.currentFrame-1)%4)*this.frameWidth;
            this.cutY = 125;
        }
    }

    drawPlayer=()=>{
        this.ctx.drawImage(this.image, this.cutX, this.cutY, this.frameWidth, this.frameHeight, this.drawPosX, this.drawPosY, this.frameWidth, this.frameHeight)
        this.jump +=this.gravity;
        this.drawPosY = Math.min(this.drawPosY+this.jump, this.canvas.height-this.frameHeight);
    }

    generateObstacle=()=>{
        let random = Math.floor((Math.random() * 4) + 1);
            let rock = {
                png: this.rocks[random-1],
                rockX: this.canvas.width,
                rockY: this.canvas.height-70,
                rockWidth: 150,
                rockHeight: 100
            }
            this.obstacles.push(rock);
            setTimeout(this.generateObstacle, Math.floor((Math.random() * 1500) + 1100));

        }

    

    moveObstacles = ()=>{
        this.obstacles.forEach(obstacle => {
            obstacle.rockX -=this.gameSpeed;
        });
    }

    removeObstacle=()=>{
        if(this.obstacles.length>4){
            this.obstacles.shift();
        }
    }

    drawObstacles=()=>{
        this.obstacles.forEach(obstacle => {
            this.ctx.drawImage(obstacle.png, obstacle.rockX, obstacle.rockY, obstacle.rockWidth, obstacle.rockHeight);
        });
    }

    drawBackground=()=>{
        this.ctx.drawImage(this.background, this.backgroundX1, 0);
        this.ctx.drawImage(this.background, this.backgroundX2, 0);
        this.ctx.drawImage(this.background, this.backgroundX3, 0);
    }

    moveBackground=()=>{
        this.backgroundX1-=this.gameSpeed/10;
        this.backgroundX2-=this.gameSpeed/10;
        this.backgroundX3-=this.gameSpeed/10;
        if(this.backgroundX1<= -(this.background.width)){
            this.backgroundX1 = this.backgroundX3+this.background.width;
        }
        if(this.backgroundX2<= -(this.background.width)){
            this.backgroundX2 = this.backgroundX1+this.background.width;
        }
        if(this.backgroundX3<= -(this.background.width)){
            this.backgroundX3 = this.backgroundX2+this.background.width;
        }
    }

    checkForCollison=()=>{
        this.obstacles.forEach(obstacle => {
            if(this.drawPosY<=obstacle.rockY+obstacle.rockHeight 
                && this.drawPosY+this.frameHeight>=obstacle.rockY+35 
                && this.drawPosX+this.frameWidth > obstacle.rockX 
                && this.drawPosX< obstacle.rockX+obstacle.rockWidth-35){
                    this.checkHighscore();
                    this.gameOver = true;
                    this.music.pause();
                    this.gameOverSound.play();
                }
        });
    }

    drawText=()=>{
        this.ctx.font = "30px Arial";
        this.ctx.shadowBlur=7;
        if(this.gameOver){
            this.ctx.shadowColor="black";
            this.ctx.shadowBlur=7;
            this.ctx.lineWidth=4;
            this.ctx.strokeText("Naciśnij 'spację' aby skakać", this.canvas.width/2-400, this.canvas.height/2+100);
            this.ctx.strokeText("Naciśnij 'enter' lub 'r' aby zacząć/zresetować grę", this.canvas.width/2-400, this.canvas.height/2+50);
            this.ctx.fillText("Naciśnij 'spację' aby skakać", this.canvas.width/2-400, this.canvas.height/2+100);
            this.ctx.fillText("Naciśnij 'enter' lub 'r' aby zacząć/zresetować grę", this.canvas.width/2-400, this.canvas.height/2+50);

        }
        else{
            this.score+=1;
        }
        this.ctx.font = "20px Arial";
        this.ctx.strokeText("Punktów: "+this.score, 5, 25);
        this.ctx.fillText("Punktów: "+this.score, 5, 25);
        this.ctx.strokeText("Najwyższy wynik: "+this.getHighscore(), this.canvas.width-225, 25);
        this.ctx.fillText("Najwyższy wynik: "+this.getHighscore(), this.canvas.width-225, 25);
        if(this.newHighscore){
            this.ctx.font = "40px Arial";
            this.ctx.strokeText("NOWY REKORD: "+this.getHighscore(), this.canvas.width/2-300, this.canvas.height/2-100);
            this.ctx.fillText("NOWY REKORD: "+this.getHighscore(), this.canvas.width/2-300, this.canvas.height/2-100);
        }
        this.ctx.shadowBlur=0;
    }

    gameSpeedIncrease=()=>{
        this.gameSpeed=40+(this.score/100);
    }

    getHighscore=()=>{
        this.highscore = localStorage.getItem('highscore');
        if(this.highscore){
            return parseInt(this.highscore);
        }
        else{
            return 0;
        }
    }
    checkHighscore=()=>{
        if(this.getHighscore()<this.score){
            localStorage.setItem('highscore', this.score);
            this.newHighscore = true;
        }
    }

    jumpSound=()=>{
        let random = Math.floor((Math.random() * 3) + 1)
        var audio = new Audio("sounds/jumps/"+random+".wav");
        audio.play();
    }

    clearCanvas=()=>{
        this.ctx.fillStyle = "white";
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
}

const lionRunner = new LionRunner();