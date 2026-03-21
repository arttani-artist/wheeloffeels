const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
const menu = document.getElementById("menu")

const tileSize = 64

let gameRunning = false

function startGame(){
menu.style.display = "none"
canvas.style.display = "block"
loadGame()
gameRunning = true
gameLoop()
}

//////////////////////
// ROOMS /////////////
//////////////////////

const rooms = {

hub: {
map: [
[1,1,1,1,1,1,1,1],
[1,0,0,2,0,0,"joy",1],
[1,0,0,0,0,0,0,1],
[1,3,0,0,4,0,5,1],
[1,0,0,0,0,0,0,1],
[1,0,0,0,6,0,0,1],
[1,"anger",0,0,0,0,"fear",1],
[1,1,1,1,1,1,1,1]
]
},

joy: {
map: [
[1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,"fear",1],
[1,0,1,1,1,0,0,1],
[1,0,0,0,1,0,0,1],
[1,0,1,0,0,0,0,1],
[1,0,0,0,1,0,0,1],
[1,"hub",0,0,0,0,0,1],
[1,1,1,1,1,1,1,1]
]
},

fear: {
map: [
[1,1,1,1,1,1,1,1],
[1,0,8,8,0,0,"hub",1],
[1,0,1,1,1,0,0,1],
[1,0,0,0,1,0,0,1],
[1,0,1,0,0,0,0,1],
[1,0,0,0,1,0,0,1],
[1,"joy",0,0,0,0,0,1],
[1,1,1,1,1,1,1,1]
]
},

anger: {
map: [
[1,1,1,1,1,1,1,1],
[1,0,0,7,0,0,"hub",1],
[1,0,1,1,1,0,0,1],
[1,0,0,0,1,0,0,1],
[1,0,1,0,0,0,0,1],
[1,0,0,0,1,0,0,1],
[1,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1]
]
}

}

let currentRoom = "hub"

//////////////////////
// PLAYER ////////////
//////////////////////

let player = {
x:2,
y:2,
emotion:"neutral",
stored:null
}

const emotions = {
neutral:"#ffffff",
joy:"#ffd93b",
anger:"#ff3b3b",
fear:"#3b6aff",
trust:"#3bff8a",
blend:"#ff66ff"
}

let discovered = {
joy:false,
anger:false,
fear:false,
trust:false
}

//////////////////////
// NPC //////////////
//////////////////////

let npc = {
x:4,
y:4,
active:false,
dialogue:["...hello","stay with me","trust matters"]
}

let showingDialogue = false
let dialogueIndex = 0

//////////////////////
// DRAW //////////////
//////////////////////

function drawTile(x,y,type){

if(type===1){
ctx.fillStyle="#444"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type===7){
ctx.fillStyle="#aa3333"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(type===8){
if(player.emotion==="fear"){
ctx.fillStyle="#3b6aff"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}
}

if(type===2) ctx.fillStyle="#ffd93b"
if(type===3) ctx.fillStyle="#ff3b3b"
if(type===5) ctx.fillStyle="#3bff8a"
if(type===6) ctx.fillStyle="#3b6aff"

if([2,3,5,6].includes(type)){
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

if(typeof type==="string"){
ctx.fillStyle="#999"
ctx.fillRect(x*tileSize,y*tileSize,tileSize,tileSize)
}

}

function drawMap(){

let map = rooms[currentRoom].map

for(let y=0;y<map.length;y++){
for(let x=0;x<map[y].length;x++){
drawTile(x,y,map[y][x])
}
}

}

function drawPlayer(){

ctx.fillStyle = emotions[player.emotion]
ctx.globalAlpha = 0.3
ctx.fillRect(player.x*tileSize+8,player.y*tileSize+8,48,48)
ctx.globalAlpha = 1

ctx.fillStyle = emotions[player.emotion]
ctx.fillRect(player.x*tileSize+20,player.y*tileSize+20,24,24)

}

function drawNPC(){
if(player.emotion==="trust"){
ctx.fillStyle="#3bff8a"
ctx.fillRect(npc.x*tileSize+20,npc.y*tileSize+20,24,24)
}
}

//////////////////////
// LOGIC /////////////
//////////////////////

function checkTile(){

let map = rooms[currentRoom].map
let tile = map[player.y][player.x]

if(tile===2){player.emotion="joy"; discovered.joy=true}
if(tile===3){player.emotion="anger"; discovered.anger=true}
if(tile===5){player.emotion="trust"; discovered.trust=true}
if(tile===6){player.emotion="fear"; discovered.fear=true}

// room transition
if(typeof tile==="string"){
currentRoom = tile
player.x=2
player.y=2
}

// npc active
npc.active = (player.emotion==="trust")

saveGame()

}

function tryPush(x,y,dx,dy){
let map = rooms[currentRoom].map

if(map[y][x]===7 && player.emotion==="anger"){
let nx=x+dx, ny=y+dy
if(map[ny][nx]===0){
map[ny][nx]=7
map[y][x]=0
return true
}
}

return false
}

function move(dx,dy){

let map = rooms[currentRoom].map
let speed = player.emotion==="joy" ? 2 : 1

for(let i=0;i<speed;i++){

let nx = player.x + dx
let ny = player.y + dy

if(!map[ny]) return
if(map[ny][nx]===1) return

if(map[ny][nx]===7){
if(!tryPush(nx,ny,dx,dy)) return
}

player.x=nx
player.y=ny

checkTile()

}

}

//////////////////////
// BLENDING //////////
//////////////////////

function blend(){

if(!player.stored){
player.stored = player.emotion
}else{
player.emotion = "blend"
player.stored = null
}

}

//////////////////////
// INPUT /////////////
//////////////////////

document.addEventListener("keydown",e=>{

if(!gameRunning) return

if(e.key==="ArrowUp") move(0,-1)
if(e.key==="ArrowDown") move(0,1)
if(e.key==="ArrowLeft") move(-1,0)
if(e.key==="ArrowRight") move(1,0)

if(e.key===" "){
blend()
}

if(e.key==="e"){
if(Math.abs(player.x-npc.x)<=1 && Math.abs(player.y-npc.y)<=1){
showingDialogue=true
dialogueIndex=0
}
}

})

//////////////////////
// DIALOGUE //////////
//////////////////////

function drawDialogue(){

if(!showingDialogue) return

ctx.fillStyle="black"
ctx.fillRect(50,500,540,100)

ctx.fillStyle="white"
ctx.fillText(npc.dialogue[dialogueIndex],70,550)

}

//////////////////////
// SAVE //////////////
//////////////////////

function saveGame(){
localStorage.setItem("plutchikSave", JSON.stringify({
player,discovered,currentRoom
}))
}

function loadGame(){
let data = localStorage.getItem("plutchikSave")
if(data){
let save = JSON.parse(data)
player=save.player
discovered=save.discovered
currentRoom=save.currentRoom
}
}

//////////////////////
// WHEEL (SPIN) //////
//////////////////////

let spin = 0

function drawWheel(){

spin += 0.02

let cx=560, cy=80, r=50
let list=["joy","trust","fear","anger"]

for(let i=0;i<4;i++){

let angle=(Math.PI*2/4)*i + spin

let x=cx+Math.cos(angle)*r
let y=cy+Math.sin(angle)*r

ctx.fillStyle = discovered[list[i]] ? emotions[list[i]] : "#333"

ctx.beginPath()
ctx.arc(x,y,12,0,Math.PI*2)
ctx.fill()

}

}

function drawHUD(){

ctx.fillStyle="white"
ctx.fillText("emotion: "+player.emotion,20,20)

if(player.stored){
ctx.fillText("stored: "+player.stored,20,40)
}

drawWheel()

}

//////////////////////
// LOOP //////////////
//////////////////////

function gameLoop(){

ctx.clearRect(0,0,640,640)

drawMap()
drawNPC()
drawPlayer()
drawHUD()
drawDialogue()

requestAnimationFrame(gameLoop)

}
