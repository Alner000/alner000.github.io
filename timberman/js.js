window.onload=()=>{
    game.init();
};


class Game{
    init = () =>{
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
        this.background = new Image();
        this.background.src = "images/background.png";
        this.button = new Image();
        this.button.src = "images/button.png";
        this.button.width = 200;
        this.button.height = 60;

        this.menu = false;
        this.optionsMenu = false;
        this.highscoreMenu = false;
        this.game = true;
        this.gameOver = false;

        this.keyClicked = false;
        this.score = 0;
        this.player={
            png: new Image(),
            x: this.canvas.width/2-125,
            y: 0,
            where: 1
        };
        this.logs = []
        this.time = 150;
        setInterval(this.update, 10);
        setInterval(()=>{
            console.log(this.time--);
        }, 100)
    }

    drawPlayer=()=>{
        this.player.y = this.canvas.height-this.player.png.height;
        if(this.player.where == 1){
            if(this.keyClicked){
                this.player.png.src = "images/boberbiteleft.png";
                this.player.x = 250-this.player.png.width;
            }else{
                this.player.png.src = "images/boberleft.png";
                this.player.x = 250-this.player.png.width-(144-76);
            }
        }
        else{
            if(this.keyClicked){
                this.player.png.src = "images/boberbiteright.png";
                this.player.x = 250+76;
            }else{
                this.player.png.src = "images/boberright.png";
                this.player.x = 250+this.player.png.width;
            }
            
            
        }
        this.ctx.drawImage(this.player.png, this.player.x, this.player.y);
    }
    collisionCheck=()=>{
        if(this.player.where == this.logs[0].branch || this.player.where == this.logs[1].branch){
            this.game = false;
            this.gameOver = true;
            this.checkHighscore();
            this.logs = [];
            this.player.where = 1;
        }
        else{
            this.score++;
        }
    }

    keyDown=(e)=>{
        if(!this.keyClicked){
            if(e.code=="KeyA" || e.code=="ArrowLeft"){
                this.keyClicked = true;
                this.player.where = 1;
                this.collisionCheck();
                this.logs.shift();
            }
            if(e.code=="KeyD" || e.code=="ArrowRight"){
                this.keyClicked = true;
                this.player.where = 2;
                this.collisionCheck();
                this.logs.shift();
            }
        }
    }
    keyUp=(e)=>{
        if(e.code =="KeyA" || e.code=="KeyD" || e.code=="ArrowLeft"|| e.code=="ArrowRight"){
            this.keyClicked = false;
        }
    }

    update=()=>{
        this.clearCanvas();
        this.drawBackground();

        if(this.game){
            this.drawGame();
        }
        else if(this.gameOver){
            this.drawGameOverPanel();
        }
        else if(this.menu){
            this.drawMainMenu();
        }
        else if (this.highscoreMenu){
            this.drawHighscoreMenu();
        }
        else if(this.optionsMenu){
            this.drawOptionsMenu();
        }


    }
    drawGame=()=>{
        this.generateWood();
        this.woodFall();
        this.drawWood();
        this.drawPlayer();
        this.drawText();
    }
    drawGameOverPanel=()=>{
        this.canvas.addEventListener("mousedown", this.playAgain);

        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(150,200, 300, 400);


        this.ctx.font = "40px Arial"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("GAME OVER", this.canvas.width/2-this.ctx.measureText("GAME OVER").width/2, 275);
        this.ctx.font = "20px Arial"
        this.ctx.fillText("Score: "+this.score, this.canvas.width/2-this.ctx.measureText("Score: "+this.score).width/2, 325);
        this.ctx.fillText("Highscore: "+this.getHighscore(), this.canvas.width/2-this.ctx.measureText("Highscore: "+this.getHighscore()).width/2, 350);
        if(this.newHighscore){
            this.ctx.fillText("NEW HIGHSCORE: "+this.getHighscore(), this.canvas.width/2-this.ctx.measureText("NEW HIGHSCORE: "+this.getHighscore()).width/2, 385);
        }

        this.ctx.fillStyle = "white";
        this.ctx.drawImage(this.button, 200, 400, this.button.width, this.button.height);
        this.ctx.fillText("Zagraj ponownie", this.canvas.width/2-this.ctx.measureText("Zagraj ponownie").width/2, 435);
        this.ctx.drawImage(this.button, 200, 500, this.button.width, this.button.height);
        this.ctx.fillText("Menu (work in progress", this.canvas.width/2-this.ctx.measureText("Menu (work in progress").width/2, 535);
    }
    drawMainMenu=()=>{

    }
    drawHighscoreMenu=()=>{

    }
    drawOptionsMenu=()=>{

    }

    drawBackground = ()=>{
        this.ctx.drawImage(this.background, 0, 0, 800, 800);
    }

    playAgain=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 400)){
            this.newHighscore = false;
            this.gameOver = false;
            this.game = true;
            this.canvas.removeEventListener("mousedown", this.playAgain);
            this.score = 0;
        }
    }

    checkIfMousePositionIsInThisButton=(mousePosX, mousePosY, buttonX, buttonY)=>{
        if(mousePosX>=buttonX && mousePosX<=buttonX+this.button.width &&
            mousePosY>=buttonY && mousePosY<=buttonY+this.button.height
        ){
            return true;
        }
        else{
            return false;
        }
    }

    getHighscore=()=>{
        this.highscore = localStorage.getItem('treescore');
        if(this.highscore){
            return parseInt(this.highscore);
        }
        else{
            return 0;
        }
    }
    checkHighscore=()=>{
        if(this.getHighscore()<this.score){
            localStorage.setItem('treescore', this.score);
            this.newHighscore = true;
        }

    }

    generateWood=()=>{
        if(this.logs.length<20){
            let randomBranch = Math.floor(Math.random() * 3);
            if(this.logs.length>0){
                if(this.logs[this.logs.length-1].branch != randomBranch && this.logs[this.logs.length-1].branch!=0){
                    randomBranch = 0;
                }
                if(this.logs[this.logs.length-1].branch==0 && randomBranch==0){
                    randomBranch =Math.floor((Math.random() * 2) + 1)
                }
                
            }
            else if(this.logs.length==0){
                randomBranch =0;
            }
            this.logs.push({
                width: 50,
                height: 150,
                logX: 250,
                logY: -150,
                branch: randomBranch
            })
        }
    }

    drawWood=()=>{
        this.logs.forEach(log => {
            let wood = new Image;
            
            switch(log.branch){
                case 0:
                    wood.src = "images/tree.png";
                    break;
                case 1:
                    wood.src = "images/tree1.png";
                    log.logX = 250-wood.width+76

                    break;
                case 2:
                    wood.src = "images/tree2.png";
                    
                    break;
                }
                this.ctx.drawImage(wood, log.logX, log.logY, wood.width, log.height);
            
        });
    }

    woodFall=()=>{
        for(let i=0; i<this.logs.length; i++){
            if(this.logs[i].logY <= this.canvas.height-((i+1)*this.logs[i].height)){
                this.logs[i].logY+=15;
            }
        }
    }
    clearCanvas=()=>{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    drawText=()=>{
        this.ctx.fillStyle = "black";
        this.ctx.font = "30px Arial";
        this.ctx.shadowBlur=7;
        this.ctx.font = "20px Arial";
        this.ctx.strokeText("Punktów: "+this.score, 5, 25);
        this.ctx.fillText("Punktów: "+this.score, 5, 25);
        this.ctx.shadowBlur=0;
    }
}

const game = new Game();