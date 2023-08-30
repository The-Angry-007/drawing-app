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
    UpdateCanvas(e.data.circles,e.data.width,e.data.height);
});

function AddCircle(circle,pixels){
    for (let x = 0; x < mapWidth; x ++){
        for (let y = 0; y < mapHeight ; y ++){//let y = circle.y-circle.size; y < circle.y + circle.size; y ++){
            if (x < 0 || y < 0){continue;}
            if (x >= mapWidth || y >= mapHeight){break;}
            if (dist(x,y,circle.x,circle.y) <= circle.size){
                pixels[(x + y * mapWidth) * 4] = 128;
                pixels[(x + y * mapWidth) * 4 + 1] = 128;
                pixels[(x + y * mapWidth) * 4 + 2] = 128;
                pixels[(x + y * mapWidth) * 4 + 3] = 255;
            }
        }
    }
}