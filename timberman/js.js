window.onload=()=>{
    game.init();
};


class Game{
    /*
    nazwa funckji: <init>
    argumenty: <>
    typ zwracany: <>
    informacje: <Zainicjowanie całej gry, zapisanie obiektu canvasa, wyznaczenie contekstu 2d canvasa, zmiana sceny na menu, wywołanie funkcji firstGameStart oraz createImagesAndSoundsObjects odpowiadającym stworzeniu podstawowych elementów gry oraz na końcu rozpoczęcie intervalu wywołującego funkcję update>
    autor: <6185>
    */
    init = () =>{
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.changeScene("menu");
        this.firstGameStart();
        this.createImagesAndSoundsObjects();
        setInterval(this.update, 10);
    }
    /*
    nazwa funckji: <createImagesAndSoundsObjects>
    argumenty: <>
    typ zwracany: <brak>
    informacje: <Stworzenie obiektów audiowizualnych wykorzystywanych w grze>
    autor: <6185>
    */
    createImagesAndSoundsObjects=()=>{
        this.logo = new Image();
        this.logo.src = "images/logo.png";
        this.background = new Image();
        this.background.src = "images/background4.png";
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

        this.music = new Audio();
        this.music.src = "sounds/music.wav";
        this.music.volume = 0.3;
        this.gameOverSound = new Audio();
        this.gameOverSound.src = "sounds/gamelost.wav";
        this.gameWonSound = new Audio();
        this.gameWonSound.src = "sounds/gamewon.wav";
    }
    /*
    nazwa funckji: <firstGameStart>
    argumenty: <>
    typ zwracany: <brak>
    informacje: <Dodanie eventListenerów wciśnięcia klawisza oraz puszczenia klawisza, ustawienie zmiennych potrzebnych do działania gry na odpowiednie wartości, stworzenie obiektu gracza oraz tablicy logs>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <keyDown>
    argumenty: <e>, <argument potrzebny dla eventListenera w celu pobrania wartości klawisza>
    typ zwracany: <brak>
    informacje: <Sprawdzenie czy kliknięto odpowiedni klawisz a następnie sprawdzane jest czy keyClicked jest false(czy inny klawisz jest kliknięty), oraz czy aktualna scena to scena gry, w wypadku spełnienia tych warunków keyClicked ustawiany jest na true(do momentu puszczenia klawisza), wywoływany jest dźwięk ugryzienia drewna a następnie sprawdzana jest strona klikniętego klawisza (lewo czy prawo) w zależnosci od tego ustawiany jest atrybut gracza player.where. Następnie wywoływane jest sprawdzenie kolizji, usuwany jest pierwszy element tablicy logs oraz w zależności od trybu: tryb classic: zmniejszana jest ilość pozostałych drzew. tryb endless: zwracane jest troszke czasu>
    autor: <6185>
    */
    keyDown=(e)=>{
        if(!this.keyClicked && this.game){
            if(e.code=="KeyA" || e.code=="ArrowLeft" || e.code=="KeyD" || e.code=="ArrowRight"){
                this.keyClicked = true;
                this.biteSound();
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
    }
    /*
    nazwa funckji: <keyUp>
    argumenty: <e>, <argument potrzebny dla eventListenera w celu pobrania wartości klawisza>
    typ zwracany: <brak>
    informacje: <Po puszczeniu klawisza strzałek lub a, d zmiana wartości zmiennej keyClicked na false>
    autor: <6185>
    */
    keyUp=(e)=>{
        if(e.code =="KeyA" || e.code=="KeyD" || e.code=="ArrowLeft"|| e.code=="ArrowRight"){
            this.keyClicked = false;
        }
    }
    /*
    nazwa funckji: <update>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Główna funkcja całej gry, odtwarza muzyke, co 10 milisekund czyści canvas rysuje tło gry oraz odpowiednie sceny w zależności od aktualnie wywołanej sceny>
    autor: <6185>
    */
    update=()=>{
        this.clearCanvas();
        this.drawBackground();
        this.music.play();
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
    /*
    nazwa funckji: <drawMainMenu>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie funkcji potrzebnych na stworzenie sceny "menu">
    autor: <6185>
    */
    drawMainMenu=()=>{
        this.drawLogo();
        this.drawLevelSelector();
        this.drawPlayButton("GRAJ");
        this.drawHowToPlayButton();
        this.drawLevelsMeaningButton();
    }
    /*
    nazwa funckji: <drawHowToPlayMenu>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie funkcji potrzebnych na stworzenie sceny "howToPlayMenu" oraz wypisanie teksu opisującego gre>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <drawLevelsMeaningMenu>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie funkcji potrzebnych na stworzenie sceny "LevelsMeaning" oraz wypisanie teksu opisującego poziomy>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <drawGame>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie funkcji potrzebnych na stworzenie sceny "game", główna scena gry>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <drawGameOverPanel>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie funkcji potrzebnych na stworzenie sceny "gameOver": drawLogo, drawGameOverText, drawPlayButton z napisem "Zagraj ponownie" oraz drawMenuButton>
    autor: <6185>
    */
    drawGameOverPanel=()=>{
        this.drawLogo();
        this.drawGameOverText();
        this.drawPlayButton("Zagraj ponownie");
        this.drawMenuButton();
    }
    /*
    nazwa funckji: <drawGameWonPanel>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie funkcji potrzebnych na stworzenie sceny "gameWon": drawLogo, drawGameWonText, drawPlayButton z napisem "Zagraj ponownie" oraz drawMenuButton>
    autor: <6185>
    */
    drawGameWonPanel=()=>{
        this.drawLogo();
        this.drawGameWonText();
        this.drawPlayButton("Zagraj ponownie");
        this.drawMenuButton();
    }
    /*
    nazwa funckji: <drawHowToPlayButton>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Dodanie eventListenera zawierającego funkcjonalność "howToPlay" oraz narysowanie obrazka przycisku wraz z tekstem "Jak grać?">
    autor: <6185>
    */
    drawHowToPlayButton=()=>{
        this.canvas.addEventListener("mousedown", this.howToPlay);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 600, this.button.width, this.button.height);
        this.ctx.fillText("Jak grać?", this.canvas.width/2-this.ctx.measureText("Jak grać?").width/2, 635);
    }
    /*
    nazwa funckji: <drawLevelsMeaningButton>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Dodanie eventListenera zawierającego funkcjonalność "levelsMeaning" oraz narysowanie obrazka przycisku wraz z tekstem "Opis poziomów gry">
    autor: <6185>
    */
    drawLevelsMeaningButton=()=>{
        this.canvas.addEventListener("mousedown", this.levelsMeaning);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 300, this.button.width, this.button.height);
        this.ctx.fillText("Opis poziomów gry", this.canvas.width/2-this.ctx.measureText("Opis poziomów gry").width/2, 335);
        

    }
    /*
    nazwa funckji: <drawLevelSelector>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Dodanie eventListenera zawierającego funkcjonalność "levelSelectorEndless" oraz "levelSelectorClassic", narysowanie obrazków przycisków wraz z tekstem odpowiadającym trybom gry oraz narysowanie kwadratów wskazujących na wybrany tryb>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <drawMenuButton>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Dodanie eventListenera zawierającego funkcjonalność przycisku "menu", narysowanie obrazka przycisku wraz z tekstem "Menu" w stałym miejscu>
    autor: <6185>
    */
    drawMenuButton=()=>{
        this.canvas.addEventListener("mousedown", this.mainMenu);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 600, this.button.width, this.button.height);
        this.ctx.fillText("Menu", this.canvas.width/2-this.ctx.measureText("Menu").width/2, 635);
    }
    /*
    nazwa funckji: <drawPlayButton>
    argumenty: <text>, <string zawierający napis, który chcemy aby widniał na przycisku "play">
    typ zwracany: <brak>
    informacje: <Dodanie eventListenera zawierającego funkcjonalność przycisku "play", narysowanie obrazka przycisku wraz z wskazanym tekstem w stałym miejscu>
    autor: <6185>
    */
    drawPlayButton=(text)=>{
        this.canvas.addEventListener("mousedown", this.play);
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Arial"
        this.ctx.drawImage(this.button, 200, 500, this.button.width, this.button.height);
        this.ctx.fillText(text, this.canvas.width/2-this.ctx.measureText(text).width/2, 535);
    }

    //narysowanie loga
    drawLogo=()=>{
        this.ctx.drawImage(this.logo, this.canvas.width/2-150, 20, 300, 300);
    }
    //narysowanie obrazka tła
    drawBackground = ()=>{
        this.ctx.drawImage(this.background,0, 0, 600, 800);
    }
    /*
    nazwa funckji: <drawGameOverText>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Rysowanie tekstu dla funkcji drawGameOverPanel, wypisanie napisu "GAME OVER" i w zależności od trybu: tryb endless: punktów osiągniętych w grze, zapisanego rekordu za pomocą funkcji getHighscore oraz sprawdzenie czy zaistniał nowy rekord, jeżeli tak, wypisanie "NOWY REKORD" i wartość punktową nowego rekordu. Dla trybu classic: wypisanie pozostałej ilości drzew>
    autor: <6185>
    */
    drawGameOverText=()=>{
        this.drawInformationPanel();
        this.ctx.font = "40px Arial"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("GAME OVER", this.canvas.width/2-this.ctx.measureText("GAME OVER").width/2, 375);

        if(this.endless){
            this.ctx.font = "20px Arial"
            this.ctx.fillText("Punktów: "+this.score, this.canvas.width/2-this.ctx.measureText("Punktów: "+this.score).width/2, 425);
            this.ctx.fillText("Highscore: "+this.getHighscore(), this.canvas.width/2-this.ctx.measureText("Highscore: "+this.getHighscore()).width/2, 450);
            if(this.newHighscore){
                this.ctx.fillText("NEW HIGHSCORE: "+this.getHighscore(), this.canvas.width/2-this.ctx.measureText("NEW HIGHSCORE: "+this.getHighscore()).width/2, 475);
            }
        }
        if(this.classic){
            this.ctx.font = "20px Arial"
            this.ctx.fillText("Pozostało drzew: "+this.woodLeft, this.canvas.width/2-this.ctx.measureText("Pozostało drzew: "+this.woodLeft).width/2, 450);
        }
    }
    /*
    nazwa funckji: <drawGameWonText>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Rysowanie tekstu dla funkcji drawGameWonPanel, wypisanie napisu "GAME WON", czasu osiągniętego w grze, zapisanego rekordu za pomocą funkcji getHighscore oraz sprawdzenie czy zaistniał nowy rekord, jeżeli tak, wypisanie "NOWY REKORD" i wartość czasu nowego rekordu>
    autor: <6185>
    */
    drawGameWonText=()=>{
        this.drawInformationPanel();
        this.ctx.font = "40px Arial"
        this.ctx.fillStyle = "black";
        this.ctx.fillText("GAME WON", this.canvas.width/2-this.ctx.measureText("GAME WON").width/2, 375);

        this.ctx.font = "18px Arial"
        this.ctx.fillText("Twój czas: "+this.time/100+" sekund", this.canvas.width/2-this.ctx.measureText("Twój czas: "+this.time/100+" sekund").width/2, 425);
        this.ctx.fillText("Rekord: "+this.getHighscore()/100+" sekund", this.canvas.width/2-this.ctx.measureText("Rekord: "+this.getHighscore()/100+" sekund").width/2, 450);
        if(this.newHighscore){
            this.ctx.fillText("NOWY REKORD: "+this.getHighscore()/100+" sekund", this.canvas.width/2-this.ctx.measureText("NOWY REKORD: "+this.getHighscore()/100+" sekund").width/2, 475);
        }
    }
    //narysowanie "tła" dla tekstu
    drawInformationPanel=()=>{ 
        this.ctx.fillStyle = "grey";
        this.ctx.fillRect(150,300, 300, 400);
    }
    /*
    nazwa funckji: <howToPlay>
    argumenty: <e>, <argument potrzebny do pobrania pozycji myszki, wywoływany poprzez eventListener>
    typ zwracany: <brak>
    informacje: <funkcjonalność przycisku "HowToPlayButton". Wywołanie checkIfMousePositionIsInThisButton z argumentami: e.offsetX, e.offsetY, X przycisku oraz Y przycisku. Po otrzymaniu wartości true zmieniana jest scena na "HowToPlayMenu" oraz usuwany jest eventListener z tą funkcjonalnością>
    autor: <6185>
    */
    howToPlay=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 600) && this.menu){
            this.canvas.removeEventListener("mousedown", this.howToPlay);
            this.changeScene("howToPlayMenu");
        }
    }
    /*
    nazwa funckji: <levelsMeaning>
    argumenty: <e>, <argument potrzebny do pobrania pozycji myszki, wywoływany poprzez eventListener>
    typ zwracany: <brak>
    informacje: <funkcjonalność przycisku "LevelsMeaningButton". Wywołanie checkIfMousePositionIsInThisButton z argumentami: e.offsetX, e.offsetY, X przycisku oraz Y przycisku. Po otrzymaniu wartości true zmieniana jest scena na "LevelsMeaning" oraz usuwany jest eventListener z tą funkcjonalnością>
    autor: <6185>
    */
    levelsMeaning=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 300) && this.menu){
            this.canvas.removeEventListener("mousedown", this.levelsMeaning);
            this.changeScene("levelsMeaningMenu");
        }
    }
    /*
    nazwa funckji: <levelSelectEndless>
    argumenty: <e>, <argument potrzebny do pobrania pozycji myszki, wywoływany poprzez eventListener>
    typ zwracany: <brak>
    informacje: <funkcjonalność przycisku "levelSelector". Wywołanie checkIfMousePositionIsInThisButton z argumentami: e.offsetX, e.offsetY, X przycisku oraz Y przycisku. Po otrzymaniu wartości true wywoływana jest zmiana wartości zmiennej classic na false oraz endless na true>
    autor: <6185>
    */
    levelSelectEndless=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 90, 400) && this.menu){

            this.endless = true;
            this.classic = false;
        }
        
    }
    /*
    nazwa funckji: <levelSelectClassic>
    argumenty: <e>, <argument potrzebny do pobrania pozycji myszki, wywoływany poprzez eventListener>
    typ zwracany: <brak>
    informacje: <funkcjonalność przycisku "levelSelector". Wywołanie checkIfMousePositionIsInThisButton z argumentami: e.offsetX, e.offsetY, X przycisku oraz Y przycisku. Po otrzymaniu wartości true wywoływana jest zmiana wartości zmiennej endless na false oraz classic na true>
    autor: <6185>
    */
    levelSelectClassic=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 310, 400) && this.menu){
            this.endless = false;
            this.classic = true;
        }
    }
    /*
    nazwa funckji: <mainMenu>
    argumenty: <e>, <argument potrzebny do pobrania pozycji myszki, wywoływany poprzez eventListener>
    typ zwracany: <brak>
    informacje: <funkcjonalność przycisku "Menu". Wywołanie checkIfMousePositionIsInThisButton z argumentami: e.offsetX, e.offsetY, X przycisku oraz Y przycisku. Po otrzymaniu wartości true wywoływana jest zmiana sceny z wykorzystaniem funkcji changeScene na scene "menu" oraz usunięcie eventListenera zawierającego funkcjonalność przycisku>
    autor: <6185>
    */
    mainMenu=(e)=>{
        if(this.checkIfMousePositionIsInThisButton(e.offsetX, e.offsetY, 200, 600)){
            this.changeScene("menu");
            this.canvas.removeEventListener("mousedown", this.mainMenu);
        }
    }
    /*
    nazwa funckji: <play>
    argumenty: <e>, <argument potrzebny do pobrania pozycji myszki, wywoływany poprzez eventListener>
    typ zwracany: <brak>
    informacje: <funkcjonalność przycisku "play". Majpierw wywoływana jest funkcja checkIfMousePositionIsInThisButton z argumentami zawierającymi e.offsetX, e.offsetY, X przycisku oraz Y przycisku. Po otrzymaniu wartości true wywoływana jest porządana funkcjonalość tj. Zmiana sceny z wykorzystaniem funkcji changeScene na scene "game", usuniecie eventListenera zawierającego funkcjonalność przycisku, ustawienie wartości zmiennych na podstawowe(newHighscore na false, pozostałe drzewo na 100 oraz pozostały czas na 5 sekund) oraz w zależnośći od trybu gry: tryb classic: ustawienie czasu na 0 oraz wywołanie intervalu liczącego czasu. tryb endless: ustawienie szybkości timera, punktów na 0 oraz wywołanie intervalu zmniejszającego pozostały czas, oraz sprawdzanie czy pozostały czas nie przekracza wartości maksymalnej.>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <changeScene>
    argumenty: <scene>, <string zawierający nazwę sceny, na którą chcemy przejść>
    typ zwracany: <brak>
    informacje: <Zmieniana jest wartość wszystkich scen na false a następnie w zależnośći od argumentu zmieniana jest wartość podanej sceny na true>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <checkIfMousePositionIsInThisButton>
    argumenty: <mousePosX, mousePosY, buttonX, buttonY> - <lokacja x myszki>, <lokacja y myszki>, <pozycja x przycisku>, <pozycja y przycisku>
    typ zwracany: <boolean>, <true lub false>
    informacje: <Sprawdzenie czy pozycja myszki znajduje się na wybranym przycisku, w przypadku spełnienia warunku zwracane jest true oraz wywoływany jest dźwięk przycisku>
    autor: <6185>
    */
    checkIfMousePositionIsInThisButton=(mousePosX, mousePosY, buttonX, buttonY)=>{
        if(mousePosX>=buttonX && mousePosX<=buttonX+this.button.width &&
            mousePosY>=buttonY && mousePosY<=buttonY+this.button.height
        ){
            this.btnSound();
            return true;
        }
        else{
            return false;
        }
    }
    /*
    nazwa funckji: <drawPlayer>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Rysowanie gracza w zależnośći od jego pozycji (1 po lewej) oraz stanu (przytrzymywany przycisk = ugryzienie)>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <collisionCheck>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Funkcja jest wywoływana tylko po ścięciu kawałka drzewa, sprawdzana jest pozycja gracza, czy jest równa najniższej gałęźi (w celu sprawdzenia czy gracz nie chce sciąć drzewa tam gdzie istnieje gałąź) lub gałęźi nad graczem(w celu sprawdzenia czy na gracza nie spadnie gałąź). W przypadku spełnienia warunku wywoływany jest ekran przegranej, sprawdzany jest stan rekordu(w trybie endless), odgrywany jest dźwięk przegranej, resetowane są: tablica logs oraz pozycja gracza. W przeciwnym wypadku zwiększana jest liczba zdobytych punktów(tryb endless)>
    autor: <6185>
    */
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
            this.gameOverSound.play();
        }
        else{
            this.score++;
        }
    }    
    /*
    nazwa funckji: <checkForEnd>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Funkcja sprawdza warunki zakończenia gry, w przypadku trybu classic, sprawdzana jest ilośc pozostałych drzew, w wypadku gdy liczba wyniesie 0 scena jest zmieniana na ekran zwycięstwa, odgrywany jest dźwięk zwycięstwam, sprawdzany jest stan rekordu oraz usunięty zostaje interval służący do zliczania upłyniętego czasu. W przypadku trybu classic sprawdzana jest ilość pozostałego czasu, w wypadku gdy czas wyniesie 0 scena jest zmieniana na ekran przegranej, odgyrwany jest dźwięk przegranej, sprawdzany jest stan rekordu oraz usunięty zostaje interval służący do obniżania pozostałego czasu. Na koniec w obu przypadkach resetowana jest tablica kawałków drzwa oraz pozycja gracza.>
    autor: <6185>
    */
    checkForEnd=()=>{
        if(this.woodLeft<=0){
            this.changeScene("gameWon");
            this.gameWonSound.play();
            this.checkHighscore();
            this.logs = [];
            this.player.where = 1;
            clearInterval(this.timeCounter);
        }
        if(this.timeLeft<=0){
            this.changeScene("gameOver");
            this.gameOverSound.play();
            this.checkHighscore();
            this.logs = [];
            this.player.where = 1;
            clearInterval(this.timer);
        }
    }
    /*
    nazwa funckji: <generateWood>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Funkcja służąca do wygenerowania kawałków drzewa "logs". Funkcja ograniczona jest do wygenerowania 20 kawałków w celu optymalizacyjnych.Jeżeli tablica logs jest pusta, oznacza to start gry, pierwszy kawałek drzewa nie będzie posiadał gałęźi w celu wyeliminowania błedów. Funkcja następnie generuje losową liczbę od 0 do 2, która określa miejsce wystąpienia gałęźi w danym kawałku drewna. Funkcja sprawdza czy ostatni kawałek wygenerowanego drzewa jest przeciwieństwem wylosowanej gałęźi w celu uniknięcia sytuacji gdzie nie istnieje odpowiednia strona do ścięcia drzewa, gdy zaistnieje taka sytuacja gałąź ustawiana jest na brak(0). Następnie funkcja sprawdza czy ostatni kawałek drzewa posiadał gałąź, jeżeli nie a wylosowana liczba to 0 funkcja losuje cyfrę tylko między 1 a 2 w celu uniknięcia dłuższych przerw bez gałęźi. Po sprawdzeniu wszystkich warunków i odpowiednim wylosowaniu strony, z której wystąpi gałąź do tablicy logs dodawny jest element drzewa z wymiarami, lokalizacją oraz najważniejsze z stroną gałęźi>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <drawWood>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Zmiana wybranego obrazka w zależności od atrybutu branch każdego "log" a następnie rysowanie każdego kawałka drzewa w oparciu o atrybuty danego kawałka>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <woodFall>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Funkcja powodująca spadanie wszystkich wygenerowanych segmentów drzewa do momentu spadnięcia na ziemię lub niższy kawałek drzewa>
    autor: <6185>
    */
    woodFall=()=>{
        for(let i=0; i<this.logs.length; i++){
            if(this.logs[i].logY <= this.canvas.height-((i+1)*this.logs[i].height)){
                this.logs[i].logY+=15;
            }
        }
    }
    /*
    nazwa funckji: <drawScore>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Rysowanie: w trybie endless: ilości zdobytych punktów, w trybie classic: ilość pozostałych drzew oraz długość rozgrywki>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <biteSound>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie dźwięku ugryźienia drzewa>
    autor: <6185>
    */
    biteSound=()=>{
        var bite = new Audio();
        bite.src="sounds/bite.wav";
        bite.play();
    }    
    /*
    nazwa funckji: <btnSound>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Wywołanie dźwięku przycisku>
    autor: <6185>
    */
    btnSound=()=>{
        var btnSound = new Audio();
        btnSound.src="sounds/button.wav";
        btnSound.play();
    }
    /*
    nazwa funckji: <drawTimer>
    argumenty: <brak>
    typ zwracany: <brak>
    informacje: <Funkcja, która zwiększa poziom trudności w trybie gry endless oraz rysuje wskaźnik czasu na canvasie w trybie endless>
    autor: <6185>
    */
    drawTimer=()=>{
        this.timeSpeed=1+this.score/100;
        this.ctx.drawImage(this.timeBar, this.canvas.width/2-(this.timeBar.width+3)/2, 75, 200, 56);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.canvas.width/2-(this.timeBar.width+3)/2+10, 82.5,this.timeLeft/5.55 ,41)
    }
    /*
    nazwa funckji: <getHighscore>
    argumenty: <brak>
    typ zwracany: <int>, <zwracany jest dotychczasowy najwyższy wynik> 
    informacje: <Funkcja służąca do pobrania dotychczasowego najwyższego wyniku>
    autor: <6185>
    */
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
    /*
    nazwa funckji: <checkHighscore>
    argumenty: <brak>
    typ zwracany: <brak>, 
    informacje: <sprawdzenie czy pobito dotychczasowo zapisany w localStorage rekord. W zależnosci od trybu gry sprawdzany jest score lub time, w przypadku pobicia rekordu zapisywany jest nowy rekord>
    autor: <6185>
    */
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
    clearCanvas=()=>{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

const game = new Game();
