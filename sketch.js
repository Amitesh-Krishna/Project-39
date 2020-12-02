var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var hp,curFrame=0;//health points

function preload(){
  trex_running = loadAnimation("Img/trex1.png","Img/trex3.png","Img/trex4.png");
  trex_collided = loadImage("Img/trex_collided.png");
  
  groundImage = loadImage("Img/ground2.png");
  
  cloudImage = loadImage("Img/cloud.png");
  
  obstacle1 = loadImage("Img/obstacle1.png");
  obstacle2 = loadImage("Img/obstacle2.png");
  obstacle3 = loadImage("Img/obstacle3.png");
  obstacle4 = loadImage("Img/obstacle4.png");
  obstacle5 = loadImage("Img/obstacle5.png");
  obstacle6 = loadImage("Img/obstacle6.png");
  
  restartImg = loadImage("Img/restart.png")
  gameOverImg = loadImage("Img/gameOver.png")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height - 40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5 * (windowWidth/windowHeight) * (windowHeight/windowWidth);
  trex.velocityX = 6;
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.velocityX = 6;
  ground.scale = 3 * (windowWidth/windowHeight)* (windowHeight/windowWidth);
  ground.depth = 0;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = (windowWidth/windowHeight)
  
  restart = createSprite(width/2,height/2 + 60);
  restart.addImage(restartImg);  
 
  gameOver.scale = 0.5 * (windowWidth/windowHeight)* (windowHeight/windowWidth);
  restart.scale = 0.5 * (windowWidth/windowHeight)* (windowHeight/windowWidth);
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
  hp = new Health(3);
}

function draw() {
  background(180);
  //displaying score
  textSize(30);
  text("Score: "+ round(score), ground.x,50);
  if(gameState === PLAY){
    score+= 1/20;
    gameOver.visible = false;
    restart.visible = false; 

    ground.velocityX = 6+score/100;
    trex.velocityX = 6+score/100;

    camera.x = ground.x;
    gameOver.x = ground.x;
    restart.x = ground.x;
    invisibleGround.x = ground.x;

    hp.display();
    //jump when the space key is pressed
    if(keyDown("space") && trex.y >= height - 65){
      trex.velocityY = -18;
    }
    
    //add gravity
    if(trex.y<842){
        trex.velocityY = trex.velocityY + 0.8;
    }
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex) && frameCount > curFrame){
        hp.damage();
        //curFrame += frameCount + 20;
    }

    if(hp.dead()){
        gameState = END;
    }
  }
   else if (gameState === END) {
     gameOver.visible = true;
     restart.visible = true; 
     
     //change the trex animation
     trex.changeAnimation("collided", trex_collided);
     ground.velocityX = 0;
     trex.velocityY = 0;
     trex.velocityX = 0;
     
     textSize(50);
     fill("red");   
     //text("Press Space",width/2-150,height/2-40); 
     
     
     //set lifetime of the game objects so that they are never destroyed
     obstaclesGroup.setLifetimeEach(-1); 
     cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if((touches.length > 0 || keyDown("space")) &&restart.visible==true)   {
      reset();
  }

  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(ground.x+ground.width/2,height - 35,10,40);
   
   //obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5  * (windowWidth/windowHeight)* (windowHeight/windowWidth);
    obstacle.lifetime = width/6;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
    var cloud = createSprite(ground.x+ground.width/2,120,40,10);
    cloud.y = Math.round(random(80,height-80));
    cloud.addImage(cloudImage);
    cloud.scale = 1.2 * (windowWidth/windowHeight)* (windowHeight/windowWidth);
    //cloud.velocityX = -3;
    
    //assign lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
  
  score = 0;
  
  //trex.destroy();
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  gameOver.visible = false;
  restart.visible = false;
  
  gameState = PLAY;
  
  trex.changeAnimation("running");
}