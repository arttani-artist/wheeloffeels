const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const menu = document.getElementById("menu")

const tileSize = 64

let gameRunning = false

function startGame(){

menu.style.display = "none"
canvas.style.display = "block"

gameRunning = true
gameLoop()

}

const level = [

[1,1,1,1,1,1,1,1],
[1,0,0,2,0,0,0,1],
[1,0,0,0,0,3,0,1],
[1,0,0,0,0,0,0,1],
[1,4,0,0,5,0,0,1],
[1,0,0,0,0,0,0,1],
[1,0,6,0,0,0,0,1],
[1,1,1,1,1,1,1,1]

]

let player = {
x:2,
y:2,
emotion:"neutral"
}

const emotions = {
neutral:"#ffffff",
joy:"#ffd93b",
anger:"#ff3b3b",
fear:"#3b6aff",
trust:"#3bff8a"
}

let discovered = {
joy:false,
anger:false,
fear:false,
trust:false
}

function drawTile(x,y,type){

if(type===1){
ctx.fillStyle="#444"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type===2){
ctx.fillStyle="#ffd93b"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type===3){
ctx.fillStyle="#ff3b3b"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type===5){
ctx.fillStyle="#3bff8a"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type===6){
ctx.fillStyle="#3b6aff"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

}

function drawMap(){

for(let y=0;y<level.length;y++){

for(let x=0;x<level[y].length;x++){

drawTile(x,y,level[y][x])

}

}

}

function drawPlayer(){

ctx.fillStyle = emotions[player.emotion]
ctx.globalAlpha = 0.35

ctx.fillRect(
player.x*tileSize+8,
player.y*tileSize+8,
48,
48
)

ctx.globalAlpha = 1

ctx.fillStyle = emotions[player.emotion]

ctx.fillRect(
player.x*tileSize+20,
player.y*tileSize+20,
24,
24
)

}

function checkEmotion(){

let tile = level[player.y][player.x]

if(tile===2){
player.emotion="joy"
discovered.joy=true
}

if(tile===3){
player.emotion="anger"
discovered.anger=true
}

if(tile===5){
player.emotion="trust"
discovered.trust=true
}

if(tile===6){
player.emotion="fear"
discovered.fear=true
}

}

function move(dx,dy){

let speed = 1

if(player.emotion==="joy") speed = 2

let newX = player.x + dx * speed
let newY = player.y + dy * speed

if(level[newY] && level[newY][newX] !== 1){

player.x=newX
player.y=newY

checkEmotion()

}

}

document.addEventListener("keydown",e=>{

if(!gameRunning) return

if(e.key==="ArrowUp") move(0,-1)
if(e.key==="ArrowDown") move(0,1)
if(e.key==="ArrowLeft") move(-1,0)
if(e.key==="ArrowRight") move(1,0)

})

function drawEmotionWheel(){

let cx = 560
let cy = 80
let r = 50

let list = ["joy","trust","fear","anger"]

for(let i=0;i<4;i++){

let angle = (Math.PI*2/4)*i

let x = cx + Math.cos(angle)*r
let y = cy + Math.sin(angle)*r

if(discovered[list[i]]){
ctx.fillStyle = emotions[list[i]]
}else{
ctx.fillStyle = "#333"
}

ctx.beginPath()
ctx.arc(x,y,12,0,Math.PI*2)
ctx.fill()

}

}

function drawHUD(){

ctx.fillStyle="white"
ctx.font="16px monospace"

ctx.fillText("emotion: "+player.emotion,20,30)

drawEmotionWheel()

}

function gameLoop(){

ctx.clearRect(0,0,640,640)

drawMap()
drawPlayer()
drawHUD()

requestAnimationFrame(gameLoop)

}
