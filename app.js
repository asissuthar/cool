(function(){
  'use strict';
  const TWO_PI = Math.PI * 2;

  let screenPixelRatio = window.devicePixelRatio || 1;
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  
  let text = document.getElementById('text');

  if(window.location.hash) { 
    text.innerText = window.location.hash.substr(1);
  }
  window.onhashchange = function() {
    text.innerText = window.location.hash.substr(1);
  }

  let canvas = document.getElementsByTagName('canvas')[0];
  let canvasContext = canvas.getContext('2d');

  canvas.width = screenWidth * screenPixelRatio;
  canvas.height = screenHeight * screenPixelRatio;

  canvasContext.scale(screenPixelRatio, screenPixelRatio);
  canvasContext.lineWidth = 1;
  canvasContext.lineCap = 'round';
  canvasContext.strokeStyle = `white`;
  canvasContext.globalAlpha = 0.6;

  let point = {
    start: {
      x: 0,
      y: 0
    },
    end: {
      x: 0,
      y: 0
    }
  };

  let peek = 90;
  let angle = 0;

  function getColor(angle) {
    function color(angle) {
      return Math.cos(angle) * 127 + 128;
    }
    return [
      color(angle),
      color(angle + TWO_PI / 3),
      color(angle + TWO_PI / 3 * 2)
    ];
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function canvasDraw({ start, end }) {

    canvasContext.beginPath();
    canvasContext.moveTo(start.x, start.y);
    canvasContext.lineTo(end.x, end.y);

    let next = {
      x: end.x + getRandomInt(peek, peek/4),
      y: screenHeight / 2 + getRandomInt(peek, -peek)
    };

    canvasContext.lineTo(next.x, next.y);
    
    canvasContext.closePath();  
    angle -= TWO_PI / 50;

    let c = getColor(angle).map(function (color) {
      return Math.trunc(color);
    }).join(',');

    
    canvasContext.stroke();
    canvasContext.fillStyle = `rgb(${c})`;
    canvasContext.fill();
    
    point.start = point.end;
    point.end = next;

  }

  function handle(clear) {
    canvasContext.clearRect(0, 0, screenWidth, screenHeight);
    point = {
      start: {
        x: 0,
        y: screenHeight / 2 + getRandomInt(peek, -peek)
      },
      end: {
        x: 0,
        y: screenHeight / 2 - getRandomInt(peek, -peek)
      }
    };

    while (point.end.x < screenWidth + peek) {
      canvasDraw(point);
    }
  }

  document.onclick = handle;
  handle();
})();