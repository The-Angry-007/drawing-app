
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
    GenerateNewImage(e.data.circles,e.data.mapWidth,e.data.mapHeight,e.data.zoom,e.data.bstamps);
});

function AddCircle(circle,pixels,zoom,mapWidth,mapHeight,bstamps = null){
    if (bstamps != null){
        brushSizeStamps = bstamps;
    }
    for (let x = circle.x  - circle.size * zoom; x < circle.x + circle.size * zoom; x ++){
        for (let y = circle.y-circle.size * zoom; y < circle.y + circle.size * zoom; y ++){
            let startx = Math.floor(circle.x-circle.size);
            let starty = Math.floor(circle.y-circle.size);
            let posx = Math.floor(x);
            let posy = Math.floor(y);
            if (posx < 0 || posy < 0){continue;}
            if (posx >= mapWidth * zoom || posy >= mapHeight * zoom){break;}
            let index = (posx * zoom + posy * mapWidth * zoom) * 4
            let pixelCol = {r:pixels[index]/255,g:pixels[index+1]/255,b:pixels[index+2]/255,a:pixels[index+3]/255};
            console.log(circle.size * zoom - 1);
            let col = blendCols({r:0,g:0,b:0,a:brushSizeStamps[Math.floor(circle.size * zoom - 1)][(posx-startx) + (posy-starty) * (circle.size*2+1)]},pixelCol);
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

function DrawCircles(circles,pixels,startTime,zoom,mapWidth,mapHeight){
    while (circles.length > 0 && Date.now() - startTime < (1/60) * 1000){
        AddCircle(circles[0],pixels,zoom,mapWidth,mapHeight);
        circles.splice(0,1);
    }
}

function GenerateNewImage(circles,mapWidth,mapHeight,zoom,bstamps){
    let pixels = new Uint8ClampedArray(mapWidth * mapHeight * 4 * zoom * zoom);
    for (let i = 0; i < circles.length; i ++){
        AddCircle(circles[i],pixels,zoom,mapWidth,mapHeight,bstamps);
    }
    postMessage({pixels:pixels},[pixels.buffer]);
    close();
}