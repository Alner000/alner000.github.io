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
        this.background.src = "images/background.png"

        this.keyClicked = false;
        this.score = 0;

        this.player={
            png: new Image(),
            x: this.canvas.width/2-125,
            y: 0,
            where: 1
        };
        this.logs = []
        setInterval(this.update, 10);
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
            alert("Koniec gry, punktów: "+ this.score);
            this.score = 0;
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
        this.generateWood();
        this.woodFall();
        this.drawWood();
        this.drawPlayer();
        this.drawText();
    }

    drawBackground = ()=>{
        this.ctx.drawImage(this.background, 0, 0, 800, 800);
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
        this.ctx.font = "30px Arial";
        this.ctx.shadowBlur=7;
        this.ctx.font = "20px Arial";
        this.ctx.strokeText("Punktów: "+this.score, 5, 25);
        this.ctx.fillText("Punktów: "+this.score, 5, 25);
        this.ctx.shadowBlur=0;
    }
}

const game = new Game();