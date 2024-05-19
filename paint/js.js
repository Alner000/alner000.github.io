let canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
let canvas2 = document.getElementById("canvas2");
var ctx2 = canvas2.getContext('2d');
let drawing = false;
let px;
let py;

canvas.addEventListener("mousedown", zacznijRysowac);
canvas.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("mouseup", skonczRysowac);
document.getElementById("trojkat").addEventListener("change", trojkat);
document.getElementById("gr").addEventListener("change", setWidth);
document.getElementById("kolorki").addEventListener("change", setColor);


function trojkat(e){
    let x1 = 0;
    let x2 = 0;
    let x3 = 0;
    let y1 = 0;
    let y2 = 0;
    let y3 = 0;
    if(document.getElementById("trojkat").checked){
        canvas.removeEventListener("mousedown", zacznijRysowac);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("mouseup", skonczRysowac);

        canvas.addEventListener("mousedown", pozStart);
        canvas.addEventListener("mousemove", pozDruga);
        canvas.addEventListener("mouseup", trojkatRysuj);

    }
    else{
        canvas.removeEventListener("mousedown", pozStart);
        canvas.removeEventListener("mousemove", pozDruga);
        canvas.removeEventListener("mouseup", trojkatRysuj);


        canvas.addEventListener("mousedown", zacznijRysowac);
        canvas.addEventListener("mousemove", mouseMoveHandler, false);
        canvas.addEventListener("mouseup", skonczRysowac);
    }
}

function pozStart(e){
    rysuj = true;
    ctx2.lineCap = "round";
    ctx2.lineJoin = "round";
    y1 = e.offsetY;
    x1 = e.offsetX;
}

function pozDruga(e){
    y2 = e.offsetY;
    x2 = x1;
    y3 = e.offsetY;
    x3 = e.offsetX;

    if(rysuj){
        ctx2.clearRect(0,0,canvas2.width,canvas2.height);
        ctx2.beginPath();
        ctx2.moveTo(x1, y1);
        ctx2.lineTo(x2, y2);
        ctx2.lineTo(x3, y3);
        ctx2.closePath();
        ctx2.stroke();
        
    }
    
}

function trojkatRysuj(e){
    rysuj = false;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();
    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
}



function setColor(e){
    ctx.fillStyle = e.target.value;
    ctx.strokeStyle = e.target.value;
    ctx2.fillStyle = e.target.value;
    ctx2.strokeStyle = e.target.value;
}

function setWidth(e){
    ctx.lineWidth = e.target.value;
    ctx2.lineWidth = e.target.value;
    document.getElementById("label").innerHTML = e.target.value+"px";
}


function zacznijRysowac(e){
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawing = true;
    px = e.offsetX;
    py = e.offsetY;
    
}
function skonczRysowac(e){
    drawing = false;
    
}

function mouseMoveHandler(e){
    if(drawing==true){
        if(e.which == 3 || document.getElementById("gumka").checked){
            ctx.strokeStyle = "white";
        }
        else{
            ctx.strokeStyle = document.getElementById("kolorki").value;
        }
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        px = e.offsetX;
        py = e.offsetY
        
    }
}



function reset(){
    ctx.fillStyle = 'white';
    ctx.clearRect(0,0, canvas.width, canvas.height);
}
