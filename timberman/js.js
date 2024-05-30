window.onload=()=>{
    game.init();
};


class Game{
    init = () =>{
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.changeScene("menu");
        this.firstGameStart();
        this.createImagesAndSoundsObjects();
        setInterval(this.update, 10);
    }

    createImagesAndSoundsObjects=()=>{
        this.logo = new Image();
        this.logo.src = "images/logo.png";
        this.background = new Image();
        this.background.src = "images/background.png";
        this.button = new Image();
        this.button.src = "images/button.png";
        this.button.width = 200;
        this.button.height = 60;
        this.select = new Image();
        this.select.src = "images/select.png";
        this.selected = new Image();
        this.selected.src = "images/selected.png";
        this.timeBar = new Image();
        this.timeBar.src = "images/timer.png";
    }
    firstGameStart=()=>{
        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
        this.endless = true;
        this.keyClicked = false;
        this.score = 0;
        this.maxTimeLeft = 1000;
        this.player={
            png: new Image(),
            x: this.canvas.width/2-125,
            y: 0,
            where: 1
        };
        this.logs = []
    }

    drawPlayer=()=>{
        this.player.y = this.canvas.height-this.player.png.height;
        if(this.player.where == 1){
            if(this.keyClicked){
                this.player.png.src = "images/boberbiteleft.png";
                this.player.x = this.canvas.width/2-this.player.png.width-76/2;
            }else{
                this.player.png.src = "images/boberleft.png";
                this.player.x = this.canvas.width/2-this.player.png.width-76;
            }
        }
        else{
            if(this.keyClicked){
                this.player.png.src = "images/boberbiteright.png";
                this.player.x = this.canvas.width/2+76/2;
            }else{
                this.player.png.src = "images/boberright.png";
                this.player.x = this.canvas.width/2+76;
            }
            
            
        }
        this.ctx.drawImage(this.player.png, this.player.x, this.player.y);
    }
    collisionCheck=()=>{
        if(this.player.where == this.logs[0].branch || this.player.where == this.logs[1].branch){
            this.changeScene("gameOver");
            if(this.endless){
                this.checkHighscore();
                clearInterval(this.timer);
            }
            if(this.classic){
                clearInterval(this.timeCounter);
            }
            this.logs = [];
            this.player.where = 1;
        }
        else{
            this.score++;
        }
    }
    checkForEnd=()=>{
        if(this.woodLeft<=0){
            this.changeScene("gameWon");
            this.checkHighscore();
            this.logs = [];
            this.player.where = 1;
            clearInterval(this.timeCounter);
        }
        if(this.timeLeft<=0){
            this.changeScene("gameOver");
            this.checkHighscore();
            this.logs = [];
            this.player.where = 1;
            clearInterval(this.timer);
        }
    }

    keyDown=(e)=>{
        if(!this.keyClicked && this.game){
            this.keyClicked = true;
            if(e.code=="KeyA" || e.code=="ArrowLeft"){
                this.player.where = 1;
            }
            if(e.code=="KeyD" || e.code=="ArrowRight"){
                this.player.where = 2;
            }
            this.collisionCheck();
            this.logs.shift();
            if(this.classic){
                this.woodLeft--;
            }
            if(this.endless ){
                this.timeLeft+=25;
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
        else if(this.gameWon){
            this.drawGameWonPanel();
        }
        else if(this.menu){
            this.drawMainMenu();
        }
        else if(this.optionsMenu){
            this.drawOptionsMenu();
        }
        else if(this.howToPlayMenu){
            this.drawHowToPlayMenu();
        }
        else if(this.levelsMeaningMenu){
            this.drawLevelsMeaningMenu();
        }


    }
    drawGame=()=>{
        this.generateWood();
        this.woodFall();
        this.drawWood();
        this.drawPlayer();
        this.drawScore();
        this.checkForEnd();
        if(this.endless){
            this.drawTimer();
        }
    }
    drawGameOverPanel=()=>{
        this.drawLogo();
        this.drawGameOverText();
        this.drawPlayButton("Zagraj ponownie");
        this.drawMenuButton();
    }
    drawMainMenu=()=>{
        this.drawLogo();
        this.drawLevelSelector();
        this.drawPlayButton("GRAJ");
        this.drawHowToPlayButton();
        this.drawLevelsMeaningButton();
    }
    drawGameWonPanel=()=>{
        this.drawLogo();
        this.drawGameWonText();
        this.drawPlayButton("Zagraj ponownie");
        this.drawMenuButton();
    }
    drawHowToPlayMenu=()=>{
        this.drawLogo();
        this.drawInformationPanel();
        this.drawMenuButton();
        this.ctx.font = "40px Arial"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Jak grać?", this.canvas.width/2-this.ctx.measureText("Jak grać?").width/2, 375);
        this.ctx.font = "16px Arial"
        this.ctx.fillText("Gra BOBER polega na ścinaniu drzewa.", this.canvas.width/2-this.ctx.measureText("Gra BOBER polega na ścinaniu drzewa.").width/2, 410);
        this.ctx.fillText("Główna mechanika polega na tym aby", this.canvas.width/2-this.ctx.measureText("Główna mechanika polega na tym aby").width/2, 440);
        this.ctx.fillText("ścinać drzewo z lewej lub z prawej", this.canvas.width/2-this.ctx.measureText("ścinać drzewo z lewej lub z prawej").width/2, 460);
        this.ctx.fillText("strony za pomocą strzałek.", this.canvas.width/2-this.ctx.measureText("strony za pomocą strzałek.").width/2, 480);
        this.ctx.fillText("Drzewo musimy ściąc z tej strony,", this.canvas.width/2-this.ctx.measureText("Drzewo musimy ściąc z tej strony,").width/2, 500);
        this.ctx.fillText("z której na drzewie nie ma gałęzi oraz", this.canvas.width/2-this.ctx.measureText("z której na drzewie nie ma gałęzi oraz").width/2, 520);
        this.ctx.fillText("tak aby po ścięciu na bobra nie spadła", this.canvas.width/2-this.ctx.measureText("tak aby po ścięciu na bobra nie spadła").width/2, 540);
        this.ctx.fillText("gałąź z następnego segmentu drzewa", this.canvas.width/2-this.ctx.measureText("gałąź z następnego segmentu drzewa.").width/2, 560);
    }
    drawLevelsMeaningMenu=()=>{
        this.drawLogo();
        this.drawInformationPanel();
        this.drawMenuButton();
        this.ctx.font = "40px Arial"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("Poziomy", this.canvas.width/2-this.ctx.measureText("Poziomy").width/2, 375);
        this.ctx.font = "16px Arial"
        this.ctx.fillText("Gra BOBER posiada dwa poziomy.", this.canvas.width/2-this.ctx.measureText("Gra BOBER posiada dwa poziomy.").width/2, 410);
        this.ctx.fillText("1.Endless - Polega on na zdobyciu jak", this.canvas.width/2-this.ctx.measureText("1.Endless - Polega on na zdobyciu jak").width/2, 440);
        this.ctx.fillText("największej ilości punktów w czasie,", this.canvas.width/2-this.ctx.measureText("największej ilości punktów w czasie,").width/2, 460);
        this.ctx.fillText("który rośnie z każdym ściętym drzewem", this.canvas.width/2-this.ctx.measureText("który wraca z każdym ściętym drzewem").width/2, 480);
        this.ctx.fillText("oraz maleje z czasem coraz szybciej.", this.canvas.width/2-this.ctx.measureText("oraz maleje z czasem coraz szybciej.").width/2, 500);

        this.ctx.fillText("2.Classic zetnij 100 drzew w jak", this.canvas.width/2-this.ctx.measureText("2.Classic zetnij 100 drzew w jak").width/2, 540);
        this.ctx.fillText("najkrótszym czasie", this.canvas.width/2-this.ctx.measureText("najkrótszym czasie.").width/2, 560);

    }
    drawHowToPlayButton=()=>{
        this.canvas.addEventListener("mousedown", this.howToPlay);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 600, this.button.width, this.button.height);
        this.ctx.fillText("Jak grać?", this.canvas.width/2-this.ctx.measureText("Jak grać?").width/2, 635);
    }
    drawLevelsMeaningButton=()=>{
        this.canvas.addEventListener("mousedown", this.levelsMeaning);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 300, this.button.width, this.button.height);
        this.ctx.fillText("Opis poziomów gry", this.canvas.width/2-this.ctx.measureText("Opis poziomów gry").width/2, 335);
        

    }
    drawLevelSelector=()=>{


        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"

        this.canvas.addEventListener("mousedown", this.levelSelectEndless);
        this.ctx.drawImage(this.button, 90, 400, this.button.width, this.button.height);
        this.ctx.drawImage(this.select,225, 410, 40, 40)
        if(this.endless){this.ctx.drawImage(this.selected,225, 410, 40, 40)}
        this.ctx.fillText("Endless", (this.canvas.width/2-this.ctx.measureText("Endless").width/2)-150, 435);

        this.canvas.addEventListener("mousedown", this.levelSelectClassic);
        this.ctx.drawImage(this.button, 310, 400, this.button.width, this.button.height);
        this.ctx.drawImage(this.select,450, 410, 40, 40)
        if(this.classic){this.ctx.drawImage(this.selected,450, 410, 40, 40)}
        this.ctx.fillText("Classic", (this.canvas.width/2-this.ctx.measureText("Classic").width/2)+70, 435);
    }
    drawMenuButton=()=>{
        this.canvas.addEventListener("mousedown", this.mainMenu);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 600, this.button.width, this.button.height);
        this.ctx.fillText("Menu", this.canvas.width/2-this.ctx.measureText("Menu").width/2, 635);
    }
    drawPlayButton=(text)=>{
        //dodanie funkcjonalnosci przycisku
        this.canvas.addEventListener("mousedown", this.play);
        //narysowanie przycisku zagraj ponownie
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 500, this.button.width, this.button.height);
        this.ctx.fillText(text, this.canvas.width/2-this.ctx.measureText(text).width/2, 535);
    }
    drawLogo=()=>{
        this.ctx.drawImage(this.logo, this.canvas.width/2-150, 20, 300, 300);
    }
    drawBackground = ()=>{
        this.ctx.drawImage(this.background, 0, 0, 800, 800);
    }
    drawGameOverText=()=>{
        this.drawInformationPanel();
        //wypisanie tekstu game over
        this.ctx.font = "40px Arial"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("GAME OVER", this.canvas.width/2-this.ctx.measureText("GAME OVER").width/2, 375);

        //wypisanie punktow i highscora
        if(this.endless){
            this.ctx.font = "20px Arial"
            this.ctx.fillText("Score: "+this.score, this.canvas.width/2-this.ctx.measureText("Score: "+this.score).width/2, 425);
            this.ctx.fillText("Highscore: "+this.getHighscore(), this.canvas.width/2-this.ctx.measureText("Highscore: "+this.getHighscore()).width/2, 450);
            if(this.newHighscore){
                this.ctx.fillText("NEW HIGHSCORE: "+this.getHighscore(), this.canvas.width/2-this.ctx.measureText("NEW HIGHSCORE: "+this.getHighscore()).width/2, 485);
            }
        }
        if(this.classic){
            this.ctx.font = "20px Arial"
            this.ctx.fillText("Pozostało drzew: "+this.woodLeft, this.canvas.width/2-this.ctx.measureText("Pozostało drzew: "+this.woodLeft).width/2, 450);
        }
    }
    drawGameWonText=()=>{
        this.drawInformationPanel();
        //wypisanie tekstu game over
        this.ctx.font = "40px Arial"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("GAME WON", this.canvas.width/2-this.ctx.measureText("GAME WON").width/2, 375);

        this.ctx.font = "18px Arial"
        this.ctx.fillText("Najszybszy czas: "+this.getHighscore()/100+" sekund", this.canvas.width/2-this.ctx.measureText("Najszybszy czas: "+this.getHighscore()/100+" sekund").width/2, 425);
        if(this.newHighscore){
            this.ctx.fillText("NOWY REKORD: "+this.getHighscore()/100+" sekund", this.canvas.width/2-this.ctx.measureText("NOWY REKORD: "+this.getHighscore()/100+" sekund").width/2, 460);
        }
    }
    drawInformationPanel=()=>{
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(150,300, 300, 400);
    }
    howToPlay=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 600) && this.menu){
            this.changeScene("howToPlayMenu");
        }
    }
    levelsMeaning=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 300) && this.menu){
            this.changeScene("levelsMeaningMenu");
        }
    }

    levelSelectEndless=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 90, 400) && this.menu){
            this.endless = true;
            this.classic = false;
        }
        
    }
    levelSelectClassic=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 310, 400) && this.menu){
            this.endless = false;
            this.classic = true;
        }
    }
    mainMenu=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 600)){
            this.changeScene("menu");
            this.canvas.removeEventListener("mousedown", this.mainMenu);
            this.score = 0;
        }
    }
    play=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 500)){
            this.changeScene("game");
            this.canvas.removeEventListener("mousedown", this.play);
            this.newHighscore = false;

            this.woodLeft = 100;
            this.timeLeft = 500;
            if(this.classic){
                this.time = 0;
                this.timeCounter = setInterval(()=>{
                    this.time++;
                }, 10);
            }
            if(this.endless){
                this.score = 0;
                this.timeSpeed = 1;
                this.timer = setInterval(()=>{
                    this.timeLeft-=this.timeSpeed;
                    if(this.timeLeft>=this.maxTimeLeft){
                        this.timeLeft = this.maxTimeLeft;
                    }
                }, 10);
            }
        }
    }
    changeScene=(scene)=>{
        this.menu = false;
        this.howToPlayMenu = false;
        this.levelsMeaningMenu = false;
        this.game = false;
        this.gameOver = false;
        this.gameWon = false;
        if(scene=="menu"){this.menu=true};
        if(scene=="howToPlayMenu"){this.howToPlayMenu=true};
        if(scene=="levelsMeaningMenu"){this.levelsMeaningMenu=true};
        if(scene=="game"){this.game=true};
        if(scene=="gameOver"){this.gameOver=true};
        if(scene=="gameWon"){this.gameWon=true};

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
                logX: this.canvas.width/2-76/2,
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
                    log.logX = this.canvas.width/2-76/2-wood.width+76

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
    drawScore=()=>{
        this.ctx.fillStyle = "black";
        this.ctx.font = "30px Arial";
        this.ctx.shadowBlur=7;
        this.ctx.font = "20px Arial";
        if(this.endless){
            this.ctx.strokeText("Punktów: "+this.score, 5, 25);
            this.ctx.fillText("Punktów: "+this.score, 5, 25);
        }
        if(this.classic){
            this.ctx.strokeText("Pozostało drzew: "+this.woodLeft, 5, 25);
            this.ctx.fillText("Pozostało drzew: "+this.woodLeft, 5, 25);
            this.ctx.strokeText("Czas: "+this.time/100, this.canvas.width-115, 25);
            this.ctx.fillText("Czas: "+this.time/100, this.canvas.width-115, 25);
        }
        this.ctx.shadowBlur=0;
    }
    getHighscore=()=>{
        if(this.endless){
            this.highscore = localStorage.getItem('endlessscore');
        }
        else if(this.classic){
            this.highscore = localStorage.getItem('classicRecord');
        }
        
        if(this.highscore){

            return parseInt(this.highscore);
        }
        else{
            return 0;
        }
        
    }
    checkHighscore=()=>{
            if(this.endless && this.getHighscore()<this.score){
                localStorage.setItem('endlessscore', this.score);
                this.newHighscore = true;
            }
            
            else if(this.classic && this.getHighscore()>this.time || this.getHighscore()==0){
                localStorage.setItem('classicRecord', this.time);
                this.newHighscore = true;
            }
    }
    drawTimer=()=>{
        this.timeSpeed=1+this.score/100;
        this.ctx.drawImage(this.timeBar, this.canvas.width/2-(this.timeBar.width+3)/2, 75, 200, 56);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.canvas.width/2-(this.timeBar.width+3)/2+10, 82.5,this.timeLeft/5.55 ,41)
    }
    clearCanvas=()=>{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const game = new Game();


/*do zrobienia


menu(
    how to play
)

dzwieki(
    muzka, soundtrack jakas chillera,
    dzwieki - gryzienia drewna, klikania w przycisk
)


*/