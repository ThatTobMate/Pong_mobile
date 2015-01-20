$(function(){
  canvas = document.getElementById('canvas');

$('#start').on('click', init)

$(document).keydown(function(){
  if(event.keyCode == 39){
    rightDown = true;
  }else if(event.keyCode == 37){
    leftDown = true;
  }
});

$(document).keyup(function(){
  if(event.keyCode == 39){
    rightDown = false;
  }else if(event.keyCode == 37){
    leftDown = false;
  }
})

  user = 0
  computer = 0
  rally = 0

  function init(){
    $('#rally_score').text("");
    $('#notice').text("Let's go!");
    ctx = canvas.getContext('2d');
    WIDTH = canvas.width; //setting the canvas width
    HEIGHT = canvas.height; //setting the canvas height
    x = y = 150;
    dx = 2.75; //moving 2px on refresh horizontally
    dy = 5; //moving 4px on refresh vertically
    radius = 12.5;
    rightDown = leftDown = false; //
    paddlex = paddlexAI = (WIDTH / 2); // setting the paddles as top and bottom 50% each
    paddleh = 15; //variable used in draw() to set the height of each paddle
    paddlew = 90; //variable used in draw() to set the width of each padle
    drawInterval = setInterval(draw, 10)
    rally = 0
  }

  function circle(x, y, r){
    ctx.beginPath();
    ctx.arc(x, y, r, 0, (Math.PI *2));
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
  }

  function rect(x, y, w, h){
    ctx.beginPath();
    ctx.rect(x, y, w, h)
    ctx.closePath();
    ctx.fillStyle = "white";
    ctx.fill();
  }

  function clear(){
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
  }

  function followBallAI(){
    var delayReaction = Math.random();
    if(delayReaction >= 0.25){
      if(x > paddlexAI + paddlew){
        if(paddlexAI + paddlew + 5 <= WIDTH){
          paddlexAI += 5;
        }
      }else if(x < paddlexAI){
        if(paddlexAI - 5 >= 0){
          paddlexAI -= 5
        }
      }else{
        var centerPaddle = Math.random();
        if(centerPaddle > 0.2){
          //if the ball is closer to the left side of the computer paddle
          if(Math.abs(x - paddlexAI) < Math.abs(x - paddlexAI - paddlew)){
            if(paddlexAI - 5 >=0){
              paddlexAI -= 5;
            }
          }else{
            if(paddlexAI + paddlew + 5 <= WIDTH){
              paddlexAI += 5;
            }
          }
        }
      }
    }
  }

  function draw(){
    clear();
    circle(x, y, radius);
    if(rightDown){
      if(paddlex + paddlew + 5 <= WIDTH){
        paddlex += 5 //if the key right down is pressed and the width of the paddle is less than or equal to the width of the canvas add 5px to the paddlex (right)
      }
    }else if(leftDown){
      if(paddlex -5 >= 0){
        paddlex -= 5 //same as above but to the left
      }
    }
    followBallAI();

    //Player paddle
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    //Computer paddle
    rect(paddlexAI, 0, paddlew, paddleh);


    //This bit of code will make the ball bounce off the right and left side of the canvas.
    if((x + dx + radius) > WIDTH || (x + dx - radius) < 0)
    {
      dx = -dx
    }

    //if the ball hits the top of the canvas, the user wins the game.
    if(y + dy - radius <= 0){

      if(x <= paddlexAI || x >= paddlexAI + paddlew){

        //if this condition is true, it means the user has won the game, therefore we stop re-drawing the canvas, because there is nothing to animate anymore, clearInterval stops the execution of the method draw().

        clearInterval(drawInterval);

        //while the alert popup is open, the code is frozen, so the line below alert will only run when the popup is closed.
        
        user ++
        $('#notice').text("Great shot!");
        $('#user').text(user);
        $('#start').text("Serve");
      }else{ //when the ball hits the top paddle
        dy = -dy;
        rally ++
        if(rally >= 10){
        $('#notice').text("What a game!");
        $('#rally_score').text("Rally: " + rally);
      }
      }
      
    }else if(y + dy + radius > HEIGHT){ //lower paddle
      if(x > paddlex && x < paddlex + paddlew){
        dx = 8 * ((x - (paddlex + paddlew / 2))/ paddlew)
        dy = -dy;
        rally ++
        if(rally >= 10){
        $('#notice').text("What a game!");
        $('#rally_score').text("Rally: " + rally);
      }
      }else{
        clearInterval(drawInterval);
        computer ++
        $('#notice').text("Bad luck!");
        $('#computer').text(computer);
        $('#start').text("Serve");
      }
    }

    x += dx;
    y += dy;
  }
});
