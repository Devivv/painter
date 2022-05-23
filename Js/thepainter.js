
// Init Canvas

var canvas = document.getElementById('grid');
var redCanvas = document.getElementById('R_picker');
var greenCanvas = document.getElementById('G_picker');
var blueCanvas = document.getElementById('B_picker');
var colorSelectCanvas = document.getElementById('colorSelect');
var errorElement = document.getElementById('message');

var finalImage = document.getElementById('imageFinal');
var finalMessage = document.getElementById('messageFinal');


var errorType = ['Une erreur lors de la génération de l\'image', "Veuillez dessiner quelque chose, pas une toile à couleur unique."];

// Generate Button

var button = document.getElementById('generateButton');

// Init Mouse and coordinate boxes

var mousePosition = [];
var colorBoxesArray = [];
var stringifyImage = [];
var clickBox = [];
var isMouseDown = false;


// $$$$$$$$\                  $$\           
// \__$$  __|                 $$ |          
//    $$ | $$$$$$\   $$$$$$\  $$ | $$$$$$$\ 
//    $$ |$$  __$$\ $$  __$$\ $$ |$$  _____|
//    $$ |$$ /  $$ |$$ /  $$ |$$ |\$$$$$$\  
//    $$ |$$ |  $$ |$$ |  $$ |$$ | \____$$\ 
//    $$ |\$$$$$$  |\$$$$$$  |$$ |$$$$$$$  |
//    \__| \______/  \______/ \__|\_______/

const mouseCoordinate = (canvas) => { 

    canvas.addEventListener('mousemove', function(event) {
        var rect = canvas.getBoundingClientRect();
        var posX = event.clientX - rect.left;
        var posY = event.clientY - rect.top;
        mousePosition = [posX, posY];
     })
}

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };


const ColorToHex = (color) => {
    var hexadecimal = color.toString(16);
    return hexadecimal == 1 ? "0" + hexadecimal : hexadecimal;
  }
  
  const ConvertRGBtoHex = (red, green, blue) => {
    return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
  }

  const errorMessageFunc = (errorMessage) => {

    errorElement.innerHTML = errorMessage;

}

const mouseListener = (canvas) => {

    canvas.addEventListener('mousedown', function() {
    
        isMouseDown = true;
    })

    canvas.addEventListener('mouseup', function() {
    
        isMouseDown = false;
    })
    
    canvas.addEventListener('mouseout', function() {
    
        isMouseDown = false;
    })
}

const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

// $$\      $$\           $$\            $$$$$$\                                                   
// $$$\    $$$ |          \__|          $$  __$$\                                                  
// $$$$\  $$$$ | $$$$$$\  $$\ $$$$$$$\  $$ /  \__| $$$$$$\  $$$$$$$\ $$\    $$\ $$$$$$\   $$$$$$$\ 
// $$\$$\$$ $$ | \____$$\ $$ |$$  __$$\ $$ |       \____$$\ $$  __$$\\$$\  $$  |\____$$\ $$  _____|
// $$ \$$$  $$ | $$$$$$$ |$$ |$$ |  $$ |$$ |       $$$$$$$ |$$ |  $$ |\$$\$$  / $$$$$$$ |\$$$$$$\  
// $$ |\$  /$$ |$$  __$$ |$$ |$$ |  $$ |$$ |  $$\ $$  __$$ |$$ |  $$ | \$$$  / $$  __$$ | \____$$\ 
// $$ | \_/ $$ |\$$$$$$$ |$$ |$$ |  $$ |\$$$$$$  |\$$$$$$$ |$$ |  $$ |  \$  /  \$$$$$$$ |$$$$$$$  |
// \__|     \__| \_______|\__|\__|  \__| \______/  \_______|\__|  \__|   \_/    \_______|\_______/



// Draw the grid of 30 x 30 boxes

const drawGrid = () => {

    var context = canvas.getContext('2d');
    context.fillStyle = 'rgb(255, 0, 0)';

    for ( let j = 0; j <= 29; j++){
        
        for ( let i = 0; i <= 29; i++){
            
            context.strokeRect(0 + ( 30 * i ), 0 + ( 30 * j ), 30, 30)
        }
    }
}

const InitBoxesArray = () => {

    for ( let j = 0; j <= 29; j++){
        
        for ( let i = 0; i <= 29; i++){
            
            var colorCoordinate = [i, j, '#ffffff'];
            colorBoxesArray.push(colorCoordinate);

        }
    }
}


// Get Box and coloring it if mouse button is down ( slide mode )

const boxColorMouseMove = () => { 

    canvas.addEventListener('mousemove', function() {

        if ( isMouseDown )
        {
            var x = mousePosition[0];
            var y = mousePosition[1];

            var boxX = Math.floor( x / 30);
            var boxY = Math.floor( y / 30);

            clickBox[0] = boxX;
            clickBox[1] = boxY;

            updateBoxColor();
            clickBox = [];
            updateDrawGrid();
        }

    })
}

// Get Box and coloring it if mouse button is click ( click mode )

const boxColorMouseClick = () => { 

    canvas.addEventListener('click', function() {

            var x = mousePosition[0];
            var y = mousePosition[1];

            var boxX = Math.floor( x / 30);
            var boxY = Math.floor( y / 30);

            clickBox[0] = boxX;
            clickBox[1] = boxY;

            updateBoxColor();
            clickBox = [];
            updateDrawGrid();

    })
}


// Return box position if exist in selectedBox array

const updateBoxColor = () => { 

    colorBoxesArray.forEach( ( item ) => {

        if (item[0] == clickBox[0] && item[1] == clickBox[1]){

            item[2] = ConvertRGBtoHex(mainColor[0], mainColor[1], mainColor[2]);
        }
    })  
}


const updateDrawGrid = () => {

    var context = canvas.getContext('2d');
    // We erase all grid for update selected box.
    context.clearRect(0, 0, canvas.width, canvas.height);
    // We re-draw the grid from the selectedBoxes array.
    drawBoxes();
    context.fillStyle = 'rgb(255, 0, 0)';
    drawGrid();
}

const drawBoxes = () => { // Draw a semi transparent box when we click in the grid

    var context = canvas.getContext('2d');

    colorBoxesArray.forEach( item => {
        context.fillStyle = item[2];
        context.fillRect(item[0] * 30, item[1] * 30, 30, 30);

    })
    
}

const generateImageToArray = () => {

    button.addEventListener('click', function() {
            imageToArray();   
    })
}

const imageToArray = () => {

    stringifyImage = [];
    colorBoxesArray.forEach( item => {
        stringifyImage.push(item[2]);
    })

    if ( checkDraw(stringifyImage)) {

        var sendJson = JSON.stringify(colorBoxesArray);
        sendData(sendJson);  
    }
    else {

        stringifyImage = [];
        errorMessageFunc(errorType[1]);
    }



}

// Check the draw have a unique color

const checkDraw = (arrayOfColors) => {

    return !arrayOfColors.every( item => item == arrayOfColors[0] );
}

const sendData = (sendStringify) => {

    var url = 'XXXXXXXXXXXXXXXXXXXXXX'; // FROM API CONTROLLER SYMFONY
    axios({
        method: 'post',
        url: url,
        data: sendStringify,
        responseType: 'blob'
        })
        .then( image => {

            var reader = new window.FileReader();
            reader.readAsDataURL(image.data); 
            reader.onload = function() {
    
                var imageDataUrl = reader.result;
                finalImage.src = imageDataUrl
                messageFinal.innerHTML = 'Vous pouvez enregistrer l\'image sous.'
    
            }
        });
}


const autoDownload = (data) => {
    document.getElementById('imageDownload').src = data;
}

    mouseListener(canvas);
    drawGrid();
    InitBoxesArray();
    mouseCoordinate(canvas);
    boxColorMouseMove();
    boxColorMouseClick();
    generateImageToArray();
    

    // $$$$$$\            $$\                                $$$$$$\                                                   
    // $$  __$$\           $$ |                              $$  __$$\                                                  
    // $$ /  \__| $$$$$$\  $$ | $$$$$$\   $$$$$$\   $$$$$$$\ $$ /  \__| $$$$$$\  $$$$$$$\ $$\    $$\ $$$$$$\   $$$$$$$\ 
    // $$ |      $$  __$$\ $$ |$$  __$$\ $$  __$$\ $$  _____|$$ |       \____$$\ $$  __$$\\$$\  $$  |\____$$\ $$  _____|
    // $$ |      $$ /  $$ |$$ |$$ /  $$ |$$ |  \__|\$$$$$$\  $$ |       $$$$$$$ |$$ |  $$ |\$$\$$  / $$$$$$$ |\$$$$$$\  
    // $$ |  $$\ $$ |  $$ |$$ |$$ |  $$ |$$ |       \____$$\ $$ |  $$\ $$  __$$ |$$ |  $$ | \$$$  / $$  __$$ | \____$$\ 
    // \$$$$$$  |\$$$$$$  |$$ |\$$$$$$  |$$ |      $$$$$$$  |\$$$$$$  |\$$$$$$$ |$$ |  $$ |  \$  /  \$$$$$$$ |$$$$$$$  |
    //  \______/  \______/ \__| \______/ \__|      \_______/  \______/  \_______|\__|  \__|   \_/    \_______|\_______/


    // Init Color

    var r_color = 128;
    var g_color = 128;
    var b_color = 128;


    mainColor = [r_color, g_color, b_color]

    const colorCanvasInit = (canvas, colorValue, rgbIndex) => {

        canvas.color = colorValue;
        canvas.rgbIndex = rgbIndex
        drawColorFaders(canvas);
        changeColorFadersClick(canvas);
        changeColorFadersMouseDown(canvas);
        colorSelectCanvasUpdater();

    }

    // Init and Update Selected color

    const colorSelectCanvasUpdater = () => {

        var context = colorSelectCanvas.getContext('2d');
        context.fillStyle = ConvertRGBtoHex(mainColor[0], mainColor[1], mainColor[2]);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, 50, 50);
    }


    const drawColorFaders = (canvas) => { // Draw a semi transparent box when we click in the grid

        rgbArray = [0, 0, 0];
        rgbArray[canvas.rgbIndex] = canvas.color; // Change the color by index R = 0 G = 1 B = 2
        var context = canvas.getContext('2d');
        context.fillStyle = 'rgb(' +  rgbArray[0] + ',' + rgbArray[1] + ',' + rgbArray[2] + ')';
        var sizeX =  (canvas.color / 255) * 400
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, sizeX, 50);   
    }


    const changeColorFadersClick = (canvas) => { 

        canvas.addEventListener('click', function() {
    
                var x = mousePosition[0];
                var getXCanvas = x / 400;
                canvas.color = Math.floor( getXCanvas * 255).clamp(0, 255);
                mainColor[canvas.rgbIndex] = canvas.color;
                colorSelectCanvasUpdater();
                drawColorFaders(canvas); 
        })
    }

    const changeColorFadersMouseDown = (canvas) => { 

        canvas.addEventListener('mousemove', function() {
    
            if ( isMouseDown )
            {
                var x = mousePosition[0];
                var getXCanvas = x / 400;
                canvas.color = Math.floor( getXCanvas * 255).clamp(0, 255);
                mainColor[canvas.rgbIndex] = canvas.color;
                colorSelectCanvasUpdater();
                drawColorFaders(canvas);
            }
        })
    }

    colorCanvasInit(redCanvas, r_color, 0);
    colorCanvasInit(greenCanvas, g_color, 1);
    colorCanvasInit(blueCanvas, b_color, 2);

    mouseCoordinate(redCanvas);
    mouseCoordinate(greenCanvas);
    mouseCoordinate(blueCanvas);
    
    mouseListener(redCanvas);
    mouseListener(greenCanvas);
    mouseListener(blueCanvas);

    


