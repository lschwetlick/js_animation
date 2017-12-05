$( document ).ready(function() {
    console.log( "ready!" );
    canvas.setAttribute("tabindex", 0);
    document.getElementById("canvas").focus;
    var images = {};
    
    // loadImage("owl_body_noeyes");
    loadImage("owlnew");
    // loadImage("left_wing");
    // loadImage("right_wing");
    loadImage("cloud1");
    loadImage("cloud2");
    loadImage("cloud3");
    loadImage("cloud4");
    loadImage("cloud5");
    loadImage("sky");
    loadImage("scroll");
    loadImage("scrollV");
    loadImage("scroll_un");
    
  
    $("#canvas").keydown(function(event) {
        vertK=0;
        horzK=0;
        if ( event.which == 38 ){//up
            vertK=-3
        }
        if ( event.which == 40 ){//down
            vertK=3
        }
        if ( event.which == 37 ){//left
            horzK=-3
        }
        if ( event.which == 39 ){//right
            horzK=3
        }
        if ((vertK!= 0| horzK!=0)&&textShow==true && whichText==1){
            textShow=false;
            whichText=2;
            counter=0;
        }

        if ( event.which == 13 ){//right
            if (scroll_locked){
                scroll_rolled=false;
                textShow=false;
            }
        }
        // Boundaries
        charX=charX+horzK;
        charX = ((charX > 900) ? 900 : charX);
        charX = ((charX < -100) ? -100 : charX);
        charY=charY+vertK;
        charY = ((charY > 300) ? 300 : charY);
        charY = ((charY < 0) ? 0 : charY);



    });

    function loadImage(name) {
        
        images[name] = new Image();
        images[name].onload = function() { 
            resourceLoaded();
        }
        images[name].src = "imgs/" + name + ".png";
    }
    
    var totalResources = 10
    var numResourcesLoaded = 0;
    var fps = 30;
    
    function resourceLoaded() {
        numResourcesLoaded += 1;
        // console.log(numResourcesLoaded)
        if(numResourcesLoaded === totalResources) {
            setInterval(redraw, 1000 / fps);
        }
    }


    // var canvas = $(.canvas)
    var context = $(canvas)[0].getContext("2d");
    // var wr_context = $(writing_canvas)[0].getContext("2d");
    // var context = document.getElementById('canvas').getContext("2d");
    
    var charX = 445;
    var charY = 85;
    
    // blink characteristcs
    var maxEyeHeight = 30;
    var curEyeHeight = maxEyeHeight;
    var eyeOpenTime = 0;
    var timeBtwBlinks = 4000;
    var blinkUpdateTime = 400;                    
    var blinkTimer = setInterval(updateBlink, blinkUpdateTime);

    var wingpos=0;
    var wingup = 1;

    var flyup=1;
    var flyrange=60;
    var flyd = 0;

    var cloudList=[];
    var cloudx=-500;
    var cloudy=100;

    
    var scroll_rolled=true;
    var scroll_locked=false;
    

    var counter=0;
    var textShow=true;
    var whichText=1;

    function redraw() {
        
        if (flyup===1){
            flyd=flyd+1
        } else{
            flyd=flyd-1
        }

        if(flyd>(flyrange/2)){
            flyup=0;
        } else if (flyd<-(flyrange/2)){
            flyup=1;            
        }
        

        
        var x = charX;
        var y = charY+flyd;
        // console.log(y)
        // console.log(x)

        
        canvas.width = canvas.width; // clears the canvas 
        // context.clearRect(0, 0, canvas.width, canvas.height);   
        
        //  Draw Background
        // $('#canvas').css('background-color', 'rgba(0, 0, 200, 1)');
        context.drawImage(images["sky"], 0,0);
        // Clouds
        drawClouds();
        // draw ground
        drawGround();
        
        //instructions
        if (textShow){
            var newText="";
            context.font = "30px courier";
            if (whichText==1){
                text="Move the owl with the arrow keys";
            }
            if (whichText==2){
                text="Try hitting enter to read the scroll";
            }
            newText=newText+text.substring(0,counter)
            context.fillText(newText,10,50); 
            if (counter>=text.length){
                // textShow=false;
                a=1;
            }else{
                counter+=1;
            }
        }

        //scroll
        if(scroll_locked){
            var scrollX=x-40;
            var scrollY=y+250;
        }else{
            var scrollX=770;
            var scrollY=590;            
        }
        if (scroll_rolled){
            if(scroll_locked){
                context.drawImage(images["scrollV"], scrollX, scrollY, 300, 300 * images["scrollV"].height / images["scrollV"].width);
            }else{
                context.drawImage(images["scroll"], scrollX, scrollY, 200, 200 * images["scroll"].height / images["scroll"].width);
            }
        }else{
            context.drawImage(images["scroll_un"], scrollX, scrollY+70, 300, 300 * images["scroll_un"].height / images["scroll_un"].width);
        }
        
        if (!scroll_locked && scroll_rolled && x>scrollX-20 && x<scrollX+100 && y+280>scrollY-50 && y+280<scrollY+50){
            scroll_locked=true;
            textShow=true;
        }
        
        // context.drawImage(images["owl_body_noeyes"], x, y);
        context.drawImage(images["owlnew"], x, y);
        // context.drawImage(images["left_wing"], x, y+163);
        // context.drawImage(images["right_wing"], x+280, y+163);

        drawEllipse(x + 80, y +100, 20, curEyeHeight); // Left Eye
        drawEllipse(x + 150, y +100, 20, curEyeHeight); // Right Eye
        

        drawWing(150,150,x+37,y+165,wingpos,0); //left
        drawWing(150,150,x+180,y+165,wingpos,1); //right
        

        wingpos = ((wingup===1) ? wingpos+4 : wingpos-2);
        
        if (wingpos>60){
            wingup=0;
        }
        if (wingpos<20){
            wingup=1;
        }
        // console.log(wingpos)
        // var shadelength=300+flyd*2;
        // drawEllipse(charX+95, 690, shadelength, 15); //shade
    }

    function typeInstructions(text, counter){
        var newText="";
        newText=newText+text.substring(0,counter)
    }

    function drawGround(){
        // console.log("draw ground")
        context.beginPath();
        context.moveTo(-50,700)
        context.quadraticCurveTo(350,500,1100,700);
        context.fillStyle = 'rgb(12, 56, 7)';
        context.fill();

        context.beginPath();
        context.moveTo(250,700)
        context.quadraticCurveTo(750,500,1200,700);
        context.fillStyle = 'rgb(14, 99, 6)';
        context.fill();
    }

    function drawClouds(){
        cloud_appears = Math.random()<0.004;        
        if (cloudList.length==0){
            cloud_appears = true;                    
        }
        
        if (cloud_appears){
            cloud_shape = Math.ceil(Math.random() * 5); // random int 1-3
            // cloud_height = Math.ceil(Math.random() * 300);
            cloud_height = getRandomInt(-150, 300);

            cloud_speed= Math.ceil(Math.random() * 3);
            newCloud = {type:cloud_shape, x:-500, y:cloud_height, speed:cloud_speed};
            // console.log(newCloud)
            cloudList.push(newCloud)
            // console.log(cloudList.length)
        }
        if (cloudList.length>0){
            for (var c = 0; c <= cloudList.length-1; c++) {
                context.drawImage(images["cloud"+cloudList[c].type], cloudList[c].x, cloudList[c].y);
                cloudList[c].x=cloudList[c].x+cloudList[c].speed;
                if (cloudList[c].x> 1100){
                    cloudList.splice(c, 1)
                    // console.log("one cloud has left the screen")
                }

             }
        }
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

    function drawWing(w,h,hingex,hingey,angle,movementlr){
        context.beginPath();
        context.moveTo(hingex, hingey);
        if (movementlr===0){
            var tipx=hingex-sinDeg(angle)*h
            var tipy=hingey+cosDeg(angle)*h
        }
        else{
            var tipx=hingex+sinDeg(angle)*h
            var tipy=hingey+cosDeg(angle)*h
        }

        beta=180-90-angle
        gamma=180-90-beta
        dx= Math.abs(cosDeg(gamma)*(w/2) + cosDeg(beta)*(h/2))
        dy= Math.abs(sinDeg(gamma)*(w/2) - sinDeg(beta)*(h/2))

        delta=180-90-gamma
        dy2 = Math.abs(cosDeg(gamma)*(h/2) + cosDeg(delta)*(w/2))
        dx2 = Math.abs(sinDeg(gamma)*(h/2) - sinDeg(delta)*(w/2))

        if (movementlr===1){
            tmpx=dx
            tmpy=dy
            
            dx=dx2
            dy=dy2

            dy2=tmpy
            dx2=tmpx
        }

        if (angle<45){
            var cp1x = hingex-dx;
            var cp1y = hingey+dy; 

            var cp2x = hingex+dx2;
            var cp2y = hingey+dy2;  
        } else{
            if (movementlr===0){
                var cp1x = hingex-dx;
                var cp1y = hingey-dy;
    
                var cp2x = hingex-dx2;
                var cp2y = hingey+dy2; 
            } else {
                var cp1x = hingex+dx;
                var cp1y = hingey+dy;
    
                var cp2x = hingex+dx2;
                var cp2y = hingey-dy2;                 
            }
        }


        context.quadraticCurveTo(cp1x,cp1y,tipx, tipy);
        context.quadraticCurveTo(cp2x,cp2y,hingex, hingey);

        context.fillStyle = 'rgb(152, 119, 68)';
        context.fill();
        context.closePath();	
    }
    function sinDeg(angle){
        return(Math.sin(angle* Math.PI / 180.0))
    }
    function cosDeg(angle){
        return(Math.cos(angle* Math.PI / 180.0))
    }
    function asinDeg(angle){
        return(Math.asin(angle* Math.PI / 180.0))
    }

    function drawEllipse(centerX, centerY, width, height) {
        
      context.beginPath();
      
      context.moveTo(centerX, centerY - height/2);
      
      context.bezierCurveTo(
        centerX + width/2, centerY - height/2,
        centerX + width/2, centerY + height/2,
        centerX, centerY + height/2);
    
      context.bezierCurveTo(
        centerX - width/2, centerY + height/2,
        centerX - width/2, centerY - height/2,
        centerX, centerY - height/2);
     
      context.fillStyle = "black";
      context.fill();
      context.closePath();	
    }

    function updateBlink() { 
        eyeOpenTime += blinkUpdateTime;

        if(eyeOpenTime >= timeBtwBlinks){
            blink();
        }
    }

    function blink() {
        curEyeHeight -= 2;
        if (curEyeHeight <= 0) {
            eyeOpenTime = 0;
            curEyeHeight = maxEyeHeight;
        } else {
            setTimeout(blink, 10);
        }
    }


}); //doc

