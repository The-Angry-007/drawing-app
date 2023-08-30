const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = Math.min(window.innerWidth,window.innerHeight);
const width = size;
const height = size;
const fpsText = document.getElementById("fps");
canvas.width = width;
canvas.height = height;
let circles = [];
let mapWidth = width;
let mapHeight = height;
let stepSize = 1;
let brushSize = 3;





let mouseDown = false;
let mousePosX = 0;
let mousePosY = 0;

document.addEventListener("mousedown", (event)=>{
    mouseDown = true;
    mousePosX = event.clientX;
    mousePosY = event.clientY;
    cursorPosx = mousePosX + stepSize;
    cursorPosy = mousePosY;
})
document.addEventListener("mousemove", (event) =>{
    mousePosX = event.clientX;
    mousePosY = event.clientY;
})
document.addEventListener("mouseup", () =>{
    mouseDown = false;
})

let prevTime = 0;
let worker;
let cursorPosx = 0;
let cursorPosy = 0;
let pixelArray = new Uint8ClampedArray(mapWidth * mapHeight * 4);
function animate(){
    let time = Date.now();
    let dt = time - prevTime;
    if (prevTime == 0){
        dt = 0;
    }
    prevTime = time;
    fpsText.innerHTML = "fps: " + Math.floor(1/dt*1000);
    while (mouseDown && dist(mousePosX,mousePosY,cursorPosx,cursorPosy) >= stepSize){
        let size = dist(mousePosX,mousePosY,cursorPosx,cursorPosy); 
        cursorPosx -= (cursorPosx - mousePosX) / size * stepSize;
        cursorPosy -= (cursorPosy - mousePosY) / size * stepSize;
        let c = {x:cursorPosx,y:cursorPosy,size:brushSize}
        circles.push(c);
        AddCircle(c,pixelArray);

    }
    ctx.clearRect(0,0,width,height);
    ctx.putImageData(new ImageData(pixelArray,mapWidth,mapHeight),0,0);
    // if (moved){
    //     if (worker != null){worker.terminate();}
    //     worker = new Worker("canvasManager.js");
    //     worker.postMessage({circles:circles,width:mapWidth,height:mapHeight});
        
    //     worker.addEventListener("message",(event)=>{
    //         console.log("thread finished");
    //         ctx.clearRect(0,0,width,height);
    //         ctx.putImageData(event.data,0,0);
    //         worker = null;
    //     })
    // }
    requestAnimationFrame(animate);
}
animate();