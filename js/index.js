// Drawing with text. Ported from Generative Design book - http://www.generative-gestaltung.de - Original licence: http://www.apache.org/licenses/LICENSE-2.0

// Application variables
var position = {x: 0, y: window.innerHeight/2};
var counter = 0;
var minFontSize = 3;
var angleDistortion = 0;
var letters = "HAPPY BIRTHDAY KIRK!!!!! Love, Olivia";
var undoStack = [];
var undoCount = 0;

// Drawing variables
var canvas;
var context;
var mouse = {x: 0, y: 0, down: false}

function init() {
  
  /*Bind keyboards with jquery - alex */
  $(document).bind('keydown',function(key){
    if(key.ctrlKey && key.which == 90){
      debugger;//remove the last stroke
         undoStack.splice(-undoCount,undoCount);
        //clean the canvas
        canvas.width = canvas.width; 
        //redraw the paint
         $.each(undoStack,function(){
           draw.apply(this,this);
         })
    }
   })

   
  
  canvas = document.getElementById( 'canvas' );
  context = canvas.getContext( '2d' );
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  canvas.addEventListener('mousemove', mouseMove, false);
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup',   mouseUp,   false);
  canvas.addEventListener('mouseout',  mouseUp,  false);  
  canvas.addEventListener('dblclick', doubleClick, false);
  
  window.onresize = function(event) {
    /*
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    */
  }
}

function mouseMove ( event ){
  mouse.x = event.pageX;
  mouse.y = event.pageY;
  draw();
}

function draw(d,fontSize,letter,stepSize,angle,savedMouse) {
 if ( mouse.down || angle != undefined ) {
   if (!mouse.down) { mouse.x = savedMouse.x, mouse.y = savedMouse.y}
    var d = d || distance( position, mouse );
    var fontSize = fontSize || minFontSize + d/2;
    var letter = letter ||letters[counter];
    var stepSize = stepSize || textWidth( letter, fontSize );
    
    if (d > stepSize) {
      var angle = angle || Math.atan2(mouse.y-position.y, mouse.x-position.x);
      
      context.font = fontSize + "px Georgia";
    
      context.translate( position.x, position.y);
      context.rotate( angle );
      context.fillText(letter,0,0);
      context.rotate( -angle );
      context.translate( -position.x, -position.y);
    
      counter++;
      if (counter > letters.length-1) {
        counter = 0;
      }
     
      position.x = position.x + Math.cos(angle) * stepSize;
      position.y = position.y + Math.sin(angle) * stepSize;
      
      }

undoCount += 1;   undoStack.push([d,fontSize,letter,stepSize,angle,mouse])
  }
  
}

function distance( pt, pt2 ){
  
  var xs = 0;
  var ys = 0;
 
  xs = pt2.x - pt.x;
  xs = xs * xs;
 
  ys = pt2.y - pt.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

function mouseDown( event ){
  mouse.down = true;
  undoCount = 0;
  position.x = event.pageX;
  position.y = event.pageY;
  
  document.getElementById('info').style.display = 'none';
}

function mouseUp( event ){
  if(mouse.down) {
    console.log(undoStack);
  }
    mouse.down = false;
    
}

function doubleClick( event ) {
  canvas.width = canvas.width; 
}

function textWidth( string, size ) {
  context.font = size + "px Georgia";
  
  if ( context.fillText ) {
    return context.measureText( string ).width;
  } else if ( curContext.mozDrawText) {
    return context.mozMeasureText( string );
  }
  
 };

$(document).ready(function(){
  init();
 
})
