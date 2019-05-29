//Canvas
var x,y;
var roidQuantity=7;
//Ship
let ship = [-4,8,4,8,0,-8];
let shipVelocityX=0;
let shipVelocityY=0;
let shipPositionX=0;
let shipPositionY=0;
let shipRotation=0;
let shipDrag=.98;

//Bullet
let bulletPositionX=0;
let bulletPositionY=0;
let bulletRotation=0
let bulletVelocityX=0;
let bulletVelocityY=0;
let bulletReady=true;
let bulletDiameter = 3;
let isRoid = false;
var fireSound;
var boomSound;
var thrustSound;

//Asteroid
// let roidDiameter;
// let roidPositionX;
// let roidPositionY;
// let roidVelocityX;
// let roidVelocityY;
let roidArray=[];

function preload(){
  fireSound = new Audio("Fire.m4a");
  boomSound = new Audio("Boom.m4a");
  thrustSound = new Audio("Thrust.m4a");
}

//Setup
function setup() {
  createCanvas(1430, 890);
  x=width/2;
  y=height/2
  makeRoidArray();
}

//RoidArray
function makeRoidArray(){
for(let i=0; i< roidQuantity;i++){
  roidArray[i]=new makeRoid();
  } 
}
//RoidObject
function makeRoid(){
  this.isRoid = true;
  this.roidPositionX=random(-x,x);
  this.roidPositionY=random(-y,y);
  this.roidVelocityX=random(-5,5);
  this.roidVelocityY=random(-5,5);
  this.roidDiameter=Math.round(random(20,50));
}
//Explode
function explodeRoid(index){
  boomSound.play();
  roidArray[index].isRoid = false;
  roidArray.splice(index,1);
}
//Hit?
function isRoidHit(index){
      if (roidArray[index].isRoid&&!bulletReady) {
      let minDist = (roidArray[index].roidDiameter/2)+(bulletDiameter/2);
      let xDist = Math.abs(bulletPositionX-roidArray[index].roidPositionX);
      let yDist = Math.abs(bulletPositionY-roidArray[index].roidPositionY);

      if ((xDist <=minDist) && (yDist <=minDist)){
        return true;
      
        }
      }
}

//Draw
function draw() {
  background(0);
  stroke(255);
  noFill();
  angleMode(DEGREES);

  if(roidArray.length<1){
    makeRoidArray();
  }

  //Input
  if(keyIsDown(LEFT_ARROW)){
    shipRotation -=5%360;
    }
  if(keyIsDown(RIGHT_ARROW)){
    shipRotation +=5%360;
    }
  if(keyIsDown(UP_ARROW)){
    thrustSound.play();
    shipVelocityX += (Math.cos((shipRotation-90)*.0174))*.5;
    shipVelocityY += (Math.sin((shipRotation-90)*.0174))*.5;
  }

  if(keyIsDown(DOWN_ARROW)||keyIsDown(32)){
    fireSound.play();    
    if(bulletReady){
      bulletPositionX = shipPositionX;
      bulletPositionY = shipPositionY;
      bulletRotation = shipRotation;
      bulletVelocityX = (Math.cos((bulletRotation-90)*.0174)*10);
      bulletVelocityY = (Math.sin((bulletRotation-90)*.0174)*10);
      bulletReady=false;
    }
  }
  if(keyIsDown(70)){
    fullscreen(true);
  }
  if(keyIsDown(27)){
    fullscreen(false);
    }
function keyReleased(){
  thrustSound.pause();
}   
    shipVelocityY*=shipDrag;
    shipVelocityX*=shipDrag;
    
shipPositionX+=shipVelocityX;
shipPositionY+=shipVelocityY;
if(shipPositionX>x){
  shipPositionX=-x;
}
if(shipPositionX<-x){
  shipPositionX=x;
}
if(shipPositionY>y){
  shipPositionY=-y;
}
if(shipPositionY<-y){
  shipPositionY=y;
}
push();
translate(x,y);
translate(shipPositionX,shipPositionY);
rotate(shipRotation);
triangle(ship[0],ship[1],ship[2],ship[3],ship[4],ship[5]);
pop();

if(bulletPositionX>x||bulletPositionY>y||bulletPositionX<-x||bulletPositionY<-y){
  bulletReady=true;
}
//else bulletReady=false;
if(!bulletReady){
  push();
  translate(x,y);
  translate(bulletPositionX+=bulletVelocityX,bulletPositionY+=bulletVelocityY);
  rotate(bulletRotation);
  ellipse(0,0,bulletDiameter);
  pop();
  }

for(let i = 0; i< roidArray.length; i++){
  roidArray[i].roidPositionX+=roidArray[i].roidVelocityX;
  roidArray[i].roidPositionY+=roidArray[i].roidVelocityY;
    


  if(roidArray[i].roidPositionX<-x){roidArray[i].roidPositionX=x};
  if(roidArray[i].roidPositionX>x){roidArray[i].roidPositionX=-x};
  if(roidArray[i].roidPositionY<-y){roidArray[i].roidPositionY=y};
  if(roidArray[i].roidPositionY>y){roidArray[i].roidPositionY=-y};
  push();
  translate(x,y);
  ellipse(roidArray[i].roidPositionX,roidArray[i].roidPositionY,roidArray[i].roidDiameter);
  pop();
  if(isRoidHit(i)) explodeRoid(i);
}
}
    
