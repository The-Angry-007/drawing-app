
function dist(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
}

function UpdateCanvas(circles,mapWidth,mapHeight){
    console.log("starting thread")
    let pixelData = new Uint8ClampedArray(mapWidth * mapHeight * 4);
    for (let x = 0; x < mapWidth; x ++){
        for (let y = 0; y < mapHeight; y ++){
            for (let i = 0; i < circles.length; i ++){
                if (dist(x,y,circles[i].x,circles[i].y) <= circles[i].size){
                    pixelData[(x + y * mapWidth) * 4 + 0] = 128;
                    pixelData[(x + y * mapWidth) * 4 + 1] = 128;
                    pixelData[(x + y * mapWidth) * 4 + 2] = 128;
                    pixelData[(x + y * mapWidth) * 4 + 3] = 255;

                }
            }
        }
    }
    let data = new ImageData(pixelData,mapWidth);
    postMessage(data);
    close();
}

addEventListener("message",function(e){
    AddCircle(e.data.circle,e.data.pixels,e.data.pixelsWidth,e.data.pixelsHeight);
});

function AddCircle(circle){
    console.log("drawing...");
    for (let x = circle.x  - circle.size; x < circle.x + circle.size; x ++){
        for (let y = circle.y-circle.size; y < circle.y + circle.size; y ++){
            let startx = Math.floor(circle.x-circle.size);
            let starty = Math.floor(circle.y-circle.size);
            let posx = Math.floor(x);
            let posy = Math.floor(y);
            if (posx < 0 || posy < 0){continue;}
            if (posx >= mapWidth || posy >= mapHeight){break;}
            let index = (posx + posy * mapWidth) * 4
            let pixelCol = {r:pixels[index]/255,g:pixels[index+1]/255,b:pixels[index+2]/255,a:pixels[index+3]/255};
            let col = blendCols({r:0,g:0,b:0,a:brushSizeStamps[circle.size-1][(posx-startx) + (posy-starty) * (circle.size*2+1)]},pixelCol);
            pixels[index] = col.r * 255;
            pixels[index+1] = col.g * 255;
            pixels[index+2] = col.b * 255;
            pixels[index+3] = col.a * 255;

        }
    }
}

function blendCols(a,b){
    let alpha = a.a + b.a * (1-a.a);
    let r = (a.r * a.a + b.r * b.a * (1-a.a)) / alpha;
    let g = (a.g * a.a + b.g * b.a * (1-a.a)) / alpha;
    let blue = (a.b * a.a + b.b * b.a * (1-a.a)) / alpha;
    return {r:r,g:g,b:blue,a:alpha};
}

function DrawCircles(circles,startTime){
    while (circles.length > 0 && Date.now() - startTime < (1/60) * 1000){
        AddCircle(circles[0]);
        circles.splice(0,1);
    }
}