class Snake{
    constructor(){
        this.canvas = document.querySelector(".canvas");
        this.context = this.canvas.getContext("2d");
        this.lastKey=0;
        this.dx = 0;
        this.dy = 0;
        this.x = 10;
        this.y = 10;
        this.appleX=-1;
        this.appleY=-1;
        this.appleExists = false;
        this.snakeLen = 2;
        document.getElementById("score").innerHTML = "DŁUGOŚĆ WONSZA: "+ this.snakeLen;
        this.snake = [];
        this.pause = true;
        this.appleEaten = false;
        this.test = false;
        this.makeSnake(this.snakeLen);
        setInterval(this.init, 100);
    }
    clearCanvas=()=>{
        this.context.clearRect(0,0,this.canvas.clientWidth, this.canvas.height);
    };
    init=()=>{
        document.addEventListener("keydown", this.keyDown);
        if(!this.pause){
            this.moveSnake();
        }
        this.spawnApple();
        this.drawSnake();
        this.checkWallCollision();
        this.checkSnakeCollision();
        this.checkAppleCollision();
        
    };
    keyDown=(e)=>{
        if(this.pause){this.pause=false}
        if(!this.test){
            switch(e.keyCode){
                case 37:
                case 65:
                    if(this.lastKey!=6){
                        this.dy = 0;
                        this.dx = -10;
                        this.lastKey = 4;
                    }
                    break;
    
                case 38:
                case 87:
                    if(this.lastKey!=2){
                        this.dy = -10;
                        this.dx = 0;
                        this.lastKey = 8;
                    }
                    break;
                case 39:
                case 68:
                    if(this.lastKey!=4){
                        this.dy = 0;
                        this.dx = 10;
                        this.lastKey = 6;
                    }
                    break;
                case 40:
                case 83:
                    if(this.lastKey!=8){
                        this.dy = 10;
                        this.dx = 0;
                        this.lastKey = 2;
                    }
                    break;
            }
            this.test = true;
        }
        
        
    };
    randomColor=()=>{
        return `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
    };
    makeSnake =(snakeLen) =>{
        for(let i=0; i<snakeLen;i++){
            this.x = this.canvas.width/2+i*10;
            this.y = this.canvas.height/2;
            this.snake.push({x: this.x, y: this.y});

        }
    }
    drawSnake=()=>{
        for(let i = 0; i<this.snake.length; i++){
            this.context.fillStyle = "green"
            this.context.fillRect(this.snake[i].x, this.snake[i].y, 10,10);
        }

    };
    moveSnake=()=>{
        this.clearCanvas();
        this.headX = this.snake[0].x +this.dx;
        this.headY = this.snake[0].y +this.dy;
        this.snake.unshift({x:this.headX, y:this.headY});
        if(!this.appleEaten){
            this.snake.pop();
        }
        else{
            this.appleEaten=false;
        }
        this.test = false;
    };
    checkWallCollision=()=>{
        if(
            this.snake[0].x<0 ||
            this.snake[0].x>this.canvas.width-10 ||
            this.snake[0].y<0 ||
            this.snake[0].y>this.canvas.height-10
        ){
            return this.resetGame();
        }
    }
    checkSnakeCollision=()=>{
        for(let i=1; i<this.snake.length;i++){
            if(this.snake[0].x == this.snake[i].x && this.snake[0].y == this.snake[i].y){
                this.resetGame();
            }
        }
    }
    spawnApple=()=>{
        if(this.appleExists == false){
            this.appleX=Math.floor(Math.random() * 39)*10;
            this.appleY=Math.floor(Math.random() * 39)*10;
            for(let i=0; i<this.snakeLen; i++){
                this.git = false;
                while(!this.git){
                    if(this.appleX==this.snake[i].x && this.appleY==this.snake[i].y){
                        this.appleX=Math.floor(Math.random() * 39)*10;
                        this.appleY=Math.floor(Math.random() * 39)*10;
                    }
                    else{
                        this.git=true;
                    }
                }
            }
            this.appleExists = true;
        }
        this.context.fillStyle = "black";
        this.context.fillRect(this.appleX, this.appleY, 10, 10);

    }
    checkAppleCollision=()=>{
        if(this.appleX==this.snake[0].x && this.appleY == this.snake[0].y){
            this.appleExists = false;
            this.snakeLen +=1;
            this.appleEaten = true;
            document.getElementById("score").innerHTML = "DŁUGOŚĆ WONSZA: "+ this.snakeLen;
        }
    }
    resetGame=()=>{
        alert("KONIEC GRY\nKońcowa Długość WONSZA: "+this.snakeLen);
        this.pause = true;
        this.clearCanvas();
        this.dx = 0;
        this.dy = 0;
        this.snake = [];
        this.snakeLen = 2;
        this.appleExists = false;
        document.getElementById("score").innerHTML = "DŁUGOŚĆ WONSZA: "+ this.snakeLen;
        this.makeSnake(this.snakeLen);
    }

}

const snake = new Snake();