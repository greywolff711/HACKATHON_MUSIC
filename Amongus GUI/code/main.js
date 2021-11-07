import kaboom from "kaboom";

// initialize context
kaboom();

// Load the Characters 
loadPedit("Enemy ", "sprites/Enemy .pedit");
loadPedit("Main", "sprites/Main.pedit");
loadPedit("metalFloor", "sprites/metalFloor.pedit");
loadPedit("bg", "sprites/bg.pedit");
loadPedit("l1dog", "sprites/l1dog.pedit");
loadPedit("floor1", "sprites/floor1.pedit");
loadPedit("floor2", "sprites/floor2.pedit");
loadPedit("bone1", "sprites/bone1.pedit");
loadPedit("dangerTiles", "sprites/dangerTiles.pedit");
loadPedit("GunSlinger", "sprites/GunSlinger.pedit");
loadPedit("bullets", "sprites/bullets.pedit");
loadPedit("Secret Code ", "sprites/Secret Code .pedit");
loadPedit("AngryEnemy", "sprites/AngryEnemy.pedit");


// MAIN 
scene("game", () => {
// Add the background 
add([
    sprite("bg",{width: width(), height: height()})

]);


// Setting up the main character 
const player = add([
    sprite("Main"),
    pos(20, 20),
    area(),
    body(),
])


// MAP  
addLevel([
  '                                        ',
  '                                        ',
  '                                        ',
  '                                        ',
  '           %%                        %% ',
  '      #                                 ',
  '                  #        %%           ',
  '                                        ',     
  '                                     b @',
  'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
], {
  width : 35,
  height : 50,
  'x': () => [sprite('floor2'), area(), solid()],
  '@': () => [sprite('Secret Code '), area(), body(), solid(),'code'],
  '#': () => [sprite('l1dog'), area(), solid(),'ghost' ],
  '%': () => [sprite('dangerTiles'), area(), solid(),'dangerous' ],
  'b': () => [sprite('AngryEnemy'), area(), solid(),'AngryEnemy', 'dangerous' ],


});

// Bullet Movement 
const BulletSpeed = 180;
action('AngryEnemy', (b) =>{
  b.move(-BulletSpeed,0)
});


// Ghost Movement 
const GhostSpeed = 20;
action('ghost', (d) =>{
  d.move(-GhostSpeed,0)
});

// Main Character Movement 

// JUMP
onKeyPress("space", () => {
    if (player.isGrounded()) {
        player.jump();
    }
});

// RIGHT 
const MoveSpeed = 350;
onKeyPressRepeat("right", () => {
    player.move(MoveSpeed,0);

});

// LEFT 
onKeyPressRepeat("left", () => {
    player.move(-MoveSpeed,0);

});
// Collide with the Code 
player.collides('code', ()=>{
  shake();
  go("win");

});

// Collide with Bullet 
player.collides('dangerous', ()=>{
  destroy(player);
  shake();
  go("lose");

});

// Collide with a ghost 
player.on('headbutt', (obj)=>{
  if(obj.is('ghost')){
  destroy(obj)
  addKaboom(player.pos);
  shake();
  }
});
});




// WIN 
scene("win", () => {
  // Add the background 
add([
    sprite("bg",{width: width(), height: height()})

]);
    add([
        text("Welcome to the party : ABCDEF !"),
        pos(center()),
        origin("center"),
    ]);
    location.replace("http://127.0.0.1:8000/");
});


// LOSE 
scene("lose", () => {
  // Add the background 
add([
    sprite("bg",{width: width(), height: height()})

]);
    add([
        text("Sorry, you lost !"),
        pos(center()),
        origin("center"),
    ])
})



go("game")