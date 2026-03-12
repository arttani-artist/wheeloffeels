const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
const playerSprite = new Image()
playerSprite.src = "player.png"
const tileSize = 64

let player = {
x:2,
y:2,
emotion:"neutral"
}

const emotionColors = {
neutral:"#ffffff",
joy:"#ffd93b",
anger:"#ff3b3b",
fear:"#3b6aff",
trust:"#3bff8a"
}

function drawTile(x,y,type){

if(type === 1){
ctx.fillStyle="#444"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type === 2){
ctx.fillStyle="#ffd93b"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type === 3){
ctx.fillStyle="#ff3b3b"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type === 5){
ctx.fillStyle="#3bff8a"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type === 6){
ctx.fillStyle="#3b6aff"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

}

function drawMap(){

for(let y=0;y<level1.length;y++){

for(let x=0;x<level1[y].length;x++){

drawTile(x,y,level1[y][x])

}

}

}

function drawPlayer(){

ctx.fillStyle = emotionColors[player.emotion]

ctx.fillRect(
player.x*tileSize + 16,
player.y*tileSize + 16,
32,
32
)

}

function checkEmotion(){

let tile = level1[player.y][player.x]

if(tile === 2) player.emotion = "joy"
if(tile === 3) player.emotion = "anger"
if(tile === 5) player.emotion = "trust"
if(tile === 6) player.emotion = "fear"

}

let speed = 1
function move(dx,dy){

let multiplier = 1

if(player.emotion === "joy") multiplier = 2

let newX = player.x + dx * multiplier
let newY = player.y + dy * multiplier

if(map[newY] && map[newY][newX] !== 1){

player.x=newX
player.y=newY

checkEmotion()

}

}


document.addEventListener("keydown", e => {

if(e.key === "ArrowUp") move(0,-1)
if(e.key === "ArrowDown") move(0,1)
if(e.key === "ArrowLeft") move(-1,0)
if(e.key === "ArrowRight") move(1,0)

})

function gameLoop(){

ctx.clearRect(0,0,canvas.width,canvas.height)

drawMap()
ctx.fillStyle = emotionColors[player.emotion]
ctx.globalAlpha = 0.35

ctx.fillRect(
player.x*tileSize+8,
player.y*tileSize+8,
48,
48
)

ctx.globalAlpha = 1
function drawPlayer(){

ctx.drawImage(
playerSprite,
player.x*tileSize+16,
player.y*tileSize+16,
32,
32
)

}

requestAnimationFrame(gameLoop)

}

gameLoop()
