const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const size = Math.min(window.innerWidth,window.innerHeight);
const width = size;
const height = size;
const fpsText = document.getElementById("fps");
const scaledCanvas = document.getElementById("scaledCanvas");
const scaledCtx = scaledCanvas.getContext("2d");
scaledCanvas.style.display = "none";
canvas.width = width;
canvas.height = height;
let circles = [];
let mapWidth = width;
let mapHeight = height;
let brushSize = 3;
let stepSize = brushSize / 3;
let prevTime = 0;
let workers = [];
let cursorPosx = 0;
let cursorPosy = 0;
let pixels = new Uint8ClampedArray(mapWidth * mapHeight * 4);
let circlesToBeDrawn = [];
let mouseDown = false;
let mousePosX = 0;
let mousePosY = 0;

let brushSizeStamps = [];
for (let i = 1; i < 20; i ++){
    brushSizeStamps.push([]);
    let size = (i * 2)+1;
    //write circles to stamps
    for (let j = 0; j < size; j ++){
        for (let k = 0; k < size; k ++){
            let distToCenter = 1-dist(k,j,i,i) / dist(0,0,i, i);
            if (distToCenter < 0.5){
                distToCenter = 0;
            }else{
                distToCenter = 1;
            }
            
            brushSizeStamps[i-1].push(distToCenter);
        }
    }
    //blend stamps
    // for (let j = 0; j < size; j ++){
    //     for (let k = 0; k < size; k ++){
    //         let total = 0;
    //         let divAmount = 0;
    //         let weights = [
    //             1,2,1,
    //             2,20,2,
    //             1,2,1
    //         ]
    //         for (let l = -1; l <= 1; l ++){
    //             for (let m = -1; m <= 1; m ++){
    //                 let x = k + l;
    //                 let y = j + m;
    //                 if (x < 0 || y < 0 || x >= size || y >= size){
    //                     continue;
    //                 }
    //                 let weight = weights[(l + 1) + (m + 1) * 3];
    //                 divAmount += weight;
    //                 total += brushSizeStamps[i-1][y * size + x] * weight;
    //             }
    //         }
    //         brushSizeStamps[i-1][j * size + k] = total / divAmount;
    //     }
    // }
}




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
        circlesToBeDrawn.push(c);
    }
    DrawCircles(circlesToBeDrawn,time)
    scaledCanvas.width = mapWidth;
    scaledCanvas.height = mapHeight;
    scaledCtx.putImageData(new ImageData(pixels,mapWidth,mapHeight),0,0);
    ctx.drawImage(scaledCanvas,0,0,width*2,height*2);    

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