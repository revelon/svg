// SVG Submarine Assault version 1.0
// move = main view / move step, levelShips = number of ships per level, addEnSpeed = how quickly should enemy be generated
var Basics = {move:5, levelShips:4, addEnSpeed:6500, maxDamage:30, serverScoreScript:"subscore.php", svgns:"http://www.w3.org/2000/svg", xlinkns:"http://www.w3.org/1999/xlink" };
var Settings = { all:1, sounds:0, sndAvail:1, clouds:1, quality:1, gradients:1, fullScreen:0, shipAppearNice:1, messages:1, strokes:1, deepAndCompass:1, panels:1, shipWave:1, niceView:1, night:1, note:". Effective to new ships only, not existing ones!" };
var IntroOutro = { msie:0, introMask:null, startScreen:null, inputNameBox:null, endScreen:null, scoreShow:null };
var Torpedo = { arr:null, arrCY:null, arrR:null, arrRY:null, x:0, y:0, r:0, elemens:null, loadInd:null, fly:0 };
var enemies, destroyedCount, score, hits, worldE, worldF, gameRunning, eNums, enemyShots, eDamage, shipAlertRight, shipAlertLeft, level, withShift, eThumbs, levelReached;
var svgDocument, world, activeElements, keyHandler, mainPanel1, mainPanel0, eCompass, eDeepMeter, eMessage, eScore, eElapsed, elapsed, eLevel, subDamage;
var dx = 0; var dy = 0; 

// array of definitions of enemies/ships
var def = new Array();                      // more colors   #9DCEF2
// ship 1
def[1] = new Array();   def[1]['template'] = '#ship1';  def[1]['enemy'] = 1;  
def[1]['points'] = 2;   def[1]['movement'] = 70;        def[1]['sink'] = '#ship1sink';
def[1]['speed'] = 1.4;  def[1]['fill'] = "#4B705A";
def[1]['x1'] = 640;     def[1]['y1'] = 80; // allowed range of initial apperiance
def[1]['x2'] = 25;      def[1]['y2'] = 145; // corrections to the above values
def[1]['BBwidth'] = 62; def[1]['BBheight'] = 12; // bouncing box size used to detect collisions
def[1]['fireX'] = 51;   def[1]['fireY'] = -7; // coordinates of cannon/fire position
// ship 2
def[2] = new Array();   def[2]['template'] = '#ship2';  def[2]['enemy'] = 1;
def[2]['points'] = 3;   def[2]['movement'] = 90;        def[2]['sink'] = '#ship2sink';
def[2]['speed'] = 1.2;  def[2]['fill'] = "#5C647F";
def[2]['x1'] = 630;     def[2]['y1'] = 75;
def[2]['x2'] = 25;      def[2]['y2'] = 145;
def[2]['BBwidth'] = 77; def[2]['BBheight'] = 13;
def[2]['fireX'] = 23;   def[2]['fireY'] = -8;
// ship 3
def[3] = new Array();   def[3]['template'] = '#ship3';  def[3]['enemy'] = 1;
def[3]['points'] = 4;   def[3]['movement'] = 50;        def[3]['sink'] = '#ship3sink';
def[3]['speed'] = 1;    def[3]['fill'] = "#4F8661";
def[3]['x1'] = 600;     def[3]['y1'] = 70;
def[3]['x2'] = 50;      def[3]['y2'] = 135;
def[3]['BBwidth'] = 93; def[3]['BBheight'] = 18;
def[3]['fireX'] = 25;   def[3]['fireY'] = -11;
// ship 4
def[4] = new Array();   def[4]['template'] = '#ship4';  def[4]['enemy'] = 1;
def[4]['points'] = 3;   def[4]['movement'] = 80;        def[4]['sink'] = '#ship4sink';
def[4]['speed'] = 1.3;  def[4]['fill'] = "#898E9D";
def[4]['x1'] = 620;     def[4]['y1'] = 80;
def[4]['x2'] =  20;     def[4]['y2'] = 145;
def[4]['BBwidth'] = 105;def[4]['BBheight'] = 12;
def[4]['fireX'] = 76;   def[4]['fireY'] = -10;
// ship 5
def[5] = new Array();   def[5]['template'] = '#ship5';  def[5]['enemy'] = 1;
def[5]['points'] = 2;   def[5]['movement'] = 50;        def[5]['sink'] = '#ship5sink';
def[5]['speed'] = 1;    def[5]['fill'] = "#00487D";
def[5]['x1'] = 580;     def[5]['y1'] = 85;
def[5]['x2'] =  30;     def[5]['y2'] = 145;
def[5]['BBwidth'] = 115;def[5]['BBheight'] = 11;
def[5]['fireX'] = 65;   def[5]['fireY'] = -8;
// ship 6
def[6] = new Array();   def[6]['template'] = '#ship6';  def[6]['enemy'] = 1;
def[6]['points'] = 4;   def[6]['movement'] = 66;        def[6]['sink'] = '#ship6sink';
def[6]['speed'] = 1.1;  def[6]['fill'] = "#550B80";
def[6]['x1'] = 550;     def[6]['y1'] = 28;
def[6]['x2'] =  20;     def[6]['y2'] = 145;
def[6]['BBwidth'] = 142;def[6]['BBheight'] = 7;
def[6]['fireX'] = 80;   def[6]['fireY'] = -2;
// ship 7
def[7] = new Array();   def[7]['template'] = '#ship7';  def[7]['enemy'] = 1;
def[7]['points'] = 3;   def[7]['movement'] = 70;        def[7]['sink'] = '#ship7sink';
def[7]['speed'] = 1.2;  def[7]['fill'] = "#385A11";
def[7]['x1'] = 620;     def[7]['y1'] = 80;
def[7]['x2'] =  20;     def[7]['y2'] = 145;
def[7]['BBwidth'] = 77; def[7]['BBheight'] = 12;
def[7]['fireX'] = 57;   def[7]['fireY'] = -3;
// ship 8
def[8] = new Array();   def[8]['template'] = '#ship8';  def[8]['enemy'] = 1;
def[8]['points'] = 2;   def[8]['movement'] = 40;        def[8]['sink'] = '#ship8sink';
def[8]['speed'] = 1.1;  def[8]['fill'] = "#7F3E04";
def[8]['x1'] = 620;     def[8]['y1'] = 80;
def[8]['x2'] =  20;     def[8]['y2'] = 145;
def[8]['BBwidth'] = 90; def[8]['BBheight'] = 15;
def[8]['fireX'] = 80;   def[8]['fireY'] = -4;
// ship 9
def[9] = new Array();   def[9]['template'] = '#ship9';  def[9]['enemy'] = 0;
def[9]['points'] = -15; def[9]['movement'] = 150;       def[9]['sink'] = '#ship9sink';
def[9]['speed'] = 1;    def[9]['fill'] = "#99714E";
def[9]['x1'] = 630;     def[9]['y1'] = 70;
def[9]['x2'] =  20;     def[9]['y2'] = 150;
def[9]['BBwidth'] = 70; def[9]['BBheight'] = 6;
def[9]['fireX'] = 0;    def[9]['fireY'] = 0;
// ship 10
def[10] = new Array();  def[10]['template'] = '#ship10';def[10]['enemy'] = 1;
def[10]['points'] = 2;  def[10]['movement'] = 100;      def[10]['sink'] = '#ship10sink';
def[10]['speed'] = 1.1; def[10]['fill'] = "#3F4222";
def[10]['x1'] = 630;    def[10]['y1'] = 70;
def[10]['x2'] =  20;    def[10]['y2'] = 145;
def[10]['BBwidth'] = 80;def[10]['BBheight'] = 12;
def[10]['fireX'] = 11;  def[10]['fireY'] = -2;

// global initialization after onload
function init(evt) {
  svgDocument = evt.target.ownerDocument;                 activeElements = svgDocument.getElementById("activeElements");
  world = svgDocument.getElementById("world");            enemyShots = svgDocument.getElementById("enemyShots");
  mainPanel1 = svgDocument.getElementById("mainPanel1");  mainPanel0 = svgDocument.getElementById("mainPanel0");
  eCompass = svgDocument.getElementById("compass");       eDeepMeter = svgDocument.getElementById("deepMeter");
  eNums = svgDocument.getElementById("nums").firstChild;  shipAlertLeft = svgDocument.getElementById("shipAlertLeft");
  eDamage = svgDocument.getElementById("damage").firstChild; shipAlertRight = svgDocument.getElementById("shipAlertRight");
  eMessage = svgDocument.getElementById("message").firstChild; eScore = svgDocument.getElementById("score").firstChild;
  eElapsed = svgDocument.getElementById("elapsed").firstChild; eLevel = svgDocument.getElementById("level").firstChild;
  subDamage = svgDocument.getElementById("subDamage");    eThumbs = svgDocument.getElementById("thumbs");
  levelReached = svgDocument.getElementById("levelReached");
  Settings.setSounds(null);
  IntroOutro.init();
}

// damage to U-boat handler
function destroyed(addH) {
  hits += addH;
  var proc = (hits/Basics.maxDamage);
  eDamage.data = Math.round(100*proc) + " %";
  subDamage.setAttributeNS(null, "width", 310*proc);
  if (hits >= Basics.maxDamage) {
    gameRunning = 0;
    for (var i = enemies.length-1; i >= 0; i--) {
      enemies[i].resetTimers();
      enemies[i].alive = 0;
    }
    return 1;
  }
}

// play sound
function playSound(s) {
  if (Settings.sounds) top.soundWrap(s);
}

// stop sound being played
function playSoundX(s) {
  if (Settings.sounds) top.soundWrapX(s);
}

// keyboard evaluation during gameplay
function keyDown(evt) {
  var c = (evt.keyCode) ? evt.keyCode : evt.charCode;
  switch(c) {
    case 37: // left
    case 63234:
      dx = 1; break;
    case 39: // right
    case 63235:
      dx = -1; break;
    case 40: // down
    case 63233:
      dy = -1; break;
    case 38: // up
    case 63232:
      dy = 1; break;
    case 32: // fire
      if (Torpedo.x) {
        playSound('notAvail');
        message('Not loaded new torpedo yet!');
        mainPanel("#779");
      } else Torpedo.fire();
      break;
    case 16: // shift
      withShift = 1; break;
    case 27: // esc
      gameRunning = score = 0;
      IntroOutro.endAnimDest(0 , 1, 1);
  }
}

// keyboard evaluation during gameplay - reverse
function keyUp(evt) {
  switch(evt.keyCode) {
    case 37: // left
    case 63234:
    case 39: // right
    case 63235:
      dx = 0; break;
    case 40: // down
    case 63233:
    case 38: // up
    case 63232:
      dy = 0; break;
    case 16: // shift
      withShift = 0;
  }
}

// navigation through environment
function moveWorld() {
  if (!dx && !dy) return;
  var x2 = worldE+(dx*(Basics.move-(3*withShift))); var y2 = worldF+(dy*(Basics.move-(3*withShift)));
  if (x2>183) return message('Reached left zoom limit at '+worldE);
  else if (x2<-540) return message('Reached right zoom limit at '+worldE);
  else if (y2<-90) return message('Reached top zoom limit at '+worldF);
  else if (y2>60) return message('Reached bottom zoom limit at '+worldF);
  var matrix = "translate("+(worldE=x2)+" "+(worldF=y2)+")";
  world.setAttribute("transform", matrix);
  (dx) ? compass(x2/2) : deep(y2/2);
}

// highlighting of dashboard for several actions
function mainPanel(color) {
  (Settings.niceView) ? mainPanel1.setAttributeNS(null, "fill", color) : mainPanel0.setAttributeNS(null, "fill", color);
  window.setTimeout("mainPanelOff()", 450);
}

// returning dashboar to original state
function mainPanelOff() {
  (Settings.niceView) ? mainPanel1.setAttributeNS(null, "fill", "#000") : mainPanel0.setAttributeNS(null, "fill", "#000");
}

// initialize indicator of new enemy
function enemyAlert(x) {
  var xPrefix = (worldE>0) ? -1 : 1;
  var view = (200+(xPrefix*Math.abs(worldE)));
  if (view>=x) enemyAlertAnim(0, "visible", 5);
  else enemyAlertAnim(1, "visible", 5);
  playSound('enemyAlert');
}

// animate (blink) indicator of new enemy
function enemyAlertAnim(which, to, howMany) {
  if (which) shipAlertRight.setAttributeNS(null, "visibility", to);
  else shipAlertLeft.setAttributeNS(null, "visibility", to);
  if (howMany) {
    var to = (to=="hidden") ? "visible" : "hidden";
    window.setTimeout("enemyAlertAnim("+which+",'"+to+"',"+(--howMany)+")", 400);
  }
}

// handling game score
function addScore(x) {
  score += x;
  eScore.data = score;
}

// manipulation / rotation of dashboard compass
function compass(x) {
  if (Settings.deepAndCompass) eCompass.setAttribute("transform", "rotate("+x+",20,150)");
}

// adding new enemy handler
function generateEnemy() {
  if (!gameRunning) return;
  var i = enemies.length;
  if ((Basics.levelShips+(level-1)*2) == i) return; // do not generate more
  var n = def.length-1;
  var prev1 = (i>0) ? enemies[i-1].type : 0;
  var prev2 = (i>1) ? enemies[i-2].type : 0;
  var type = 0;
  while (!type || (type == prev1) || (type == prev2)) type = Math.round(Math.random()*n);
  enemies[i] = new Ship(i, type);
  enemyStatus();
  var maxCoef = (level>5) ? 5 : level;
  window.setTimeout("generateEnemy()", Basics.addEnSpeed-maxCoef*750);
}

// checking function between game levels
function enemyStatus() {
  var el = enemies.length;
  eNums.data = destroyedCount+" of "+el+" of "+(Basics.levelShips+(level-1)*2);
  if (el && (Basics.levelShips+(level-1)*2) == destroyedCount) {
    level++; score += 10;
    message("Next level reached, bonus added!");
    eLevel.data = "Level: "+level;
    addScore(0);
    Settings.setNight();
    afterLevel(1);
  }
}

// notification of next level handler
function afterLevel(x) {
  if (x) {
    levelReached.firstChild.data = "Level "+level+", "+((Settings.night)?"night ":"day ")+Math.ceil(level/2);
    if (level==1) svgDocument.getElementById("controls").setAttributeNS(null, "visibility", "visible")
    levelReached.setAttributeNS(null, "visibility", "visible")
    playSound('gotBonus');
    window.setTimeout("afterLevel(0)", 2000);
  } else { // a bit a lot of reseting there, but there were sometimes occuring really strange errors on several timers
    levelReached.setAttributeNS(null, "visibility", "hidden");
    if (level==1) svgDocument.getElementById("controls").setAttributeNS(null, "visibility", "hidden")
    for (var i = enemies.length-1; i >= 0; i--) {
      enemies[i].resetTimers();
      enemies[i].alive = 0;
    }
    while (activeElements.hasChildNodes()) activeElements.removeChild(activeElements.firstChild);
    while (enemyShots.hasChildNodes()) enemyShots.removeChild(enemyShots.firstChild);
    while (eThumbs.hasChildNodes()) eThumbs.removeChild(eThumbs.firstChild);
    enemies = new Array();
    destroyedCount = 0;
    window.setTimeout("generateEnemy()", 1000);
  }
}

// time measuring method
function timeElapsed() {
  elapsed += 2;
  eElapsed.data = elapsed + " s";
  if (gameRunning) window.setTimeout("timeElapsed()", 2000);
}

// deep'o'meter on the dasboard manipulation
function deep(y) {
  if (Settings.deepAndCompass) eDeepMeter.setAttribute("y", 1*(y+267));
}

// debugging messages function
function message(msg){
  if (Settings.messages) eMessage.data = msg;
}


// ************************************************************************************************
// Ship Object
// ************************************************************************************************

// object of enemy ship - constructor - prototypes follow
function Ship (id, type) {
  this.id = id;
  this.type = type;
  this.alive = 0; // untill fully appear
  this.appr = 1; // flag for initialization phase
  this.shot = this.shotSmoke = this.blast = this.thumb = this.fireCY = this.fireR = this.wave = null;
  this.setPosition();
  this.ship = svgDocument.createElementNS(Basics.svgns, "use");
  this.ship.setAttributeNS(Basics.xlinkns, "href", def[this.type]['template']);
  this.ship.setAttributeNS(null, "x", this.x);
  this.ship.setAttributeNS(null, "y", this.y);
  message("Enemy No. "+id+" of type '"+type+"' added at x="+this.x+", y="+this.y);
  this.direction = (this.id%2==0) ? -1 : 1;
  enemyAlert(this.x);
  this.thumbOn();
  if (!def[this.type]['enemy']) this.rescTimer = window.setTimeout("enemies["+this.id+"].rescued(20)", 12000); // lifetime for innocent ships
  if (Settings.shipWave) this.addWave();
  if (Settings.shipAppearNice) {
    this.ship.setAttributeNS(null, "fill", def[this.type]['fill']);
    this.ship.setAttributeNS(null, "fill-opacity", 0);
    activeElements.appendChild(this.ship);
    this.appearNice(20);
  } else {
    this.ship.setAttributeNS(null, "stroke", "#eee");
    this.ship.setAttributeNS(null, "fill", "none");
    activeElements.appendChild(this.ship);
    this.apprTimer = window.setTimeout("enemies["+this.id+"].appear()", 2500);
  }
}

// try to calculate optimal initial ship position
Ship.prototype.setPosition = function () {
  var xp = new Array(); var yp = new Array();
  xp[0] = 1; yp[0] = 1;
  for (var c = 1; c < 730; c++) {yp[c] = 0; xp[c] = 0;}
  for (var i = enemies.length-1; i > -1 ; i--) {
    if (enemies[i].alive || enemies[i].appr) {
      var tp = enemies[i].type;
      for (var a = 0; a < def[tp]['BBwidth']; a++) xp[(a+enemies[i].x)] = 1;
      for (var a = 0; a < 14; a++) {xp[(a+enemies[i].x+def[tp]['BBwidth'])] = 1; xp[(-1*a+enemies[i].x)] = 1;}
      for (var a = 0; a < def[tp]['BBheight']; a++) yp[(a+enemies[i].y)] = 1;
      for (var a = 0; a < 4; a++) {yp[(a+enemies[i].y+def[tp]['BBheight'])] = 1; yp[(-1*a+enemies[i].y)] = 1;}
    }
  }
  // allow limited number only of tries to find non-confliction ship position
  for (a = 0; a < 25; a++) {
    this.x = Math.round(Math.random()*def[this.type]['x1']+def[this.type]['x2']);
    if (!xp[this.x]) break;
  }
  for (a = 0; a < 10; a++) {
    this.y = Math.round(Math.random()*def[this.type]['y1'])+def[this.type]['y2'];
    if (!yp[this.y]) break;
  }
  // when random generator failed us, reach for the extremes, at least for x-axis
  if (xp[this.x]) {
    if (this.id%2) {
      this.x = def[this.type]['x2']+10;
      while (xp[this.x]) this.x++;
    } else {
      this.x = def[this.type]['x1']+def[this.type]['x2']-10;
      while (xp[this.x]) this.x--;
    }
  }
  //this.x = 1*def[this.type]['x1'] + def[this.type]['x2']; this.y = 1*def[this.type]['y1'] + def[this.type]['y2']; // debugging
}

// reset all possible timers since they are causeing troubles between levels
Ship.prototype.resetTimers = function () {
  if (this.rescTimer) window.clearTimeout(this.rescTimer);
  if (this.apprTimer) window.clearTimeout(this.apprTimer);
  if (this.moveTimer) window.clearTimeout(this.moveTimer);
  if (this.fireTimer) window.clearTimeout(this.fireTimer);
  if (this.explTimer) window.clearTimeout(this.explTimer);
}

// adding thumbnail of new ship to the dashboard status
Ship.prototype.thumbOn = function () {
  this.thumb = svgDocument.createElementNS(Basics.svgns, "use");
  this.thumb.setAttributeNS(Basics.xlinkns, "href", "#shipIco");
  var corr = (this.id>11) ? 270+42 : 0;
  this.thumb.setAttributeNS(null, "x", 107-corr+this.id*26);
  this.thumb.setAttributeNS(null, "y", (this.id>11) ? 307: 294);
  this.thumb.setAttributeNS(null, "fill", (def[this.type]['enemy']) ? "green" : "gold");
  eThumbs.appendChild(this.thumb);
}

// highlighting thumbnail on dashboard when ship is gone
Ship.prototype.thumbOff = function (x) {
  this.thumb.setAttributeNS(null, "fill", (x) ? "blue" : "red");
}

// changing direction of wave caused by ship movement
Ship.prototype.setWaveX = function () {
  if (this.wave) this.wave.setAttributeNS(null, "cx", (this.direction==1) ? this.x : (this.x+def[this.type]['BBwidth']));
}

// creating new wave for ship object
Ship.prototype.addWave = function () {
/* commented part for debugging purposes of active area
  this.wave = svgDocument.createElementNS(Basics.svgns, "rect"); this.wave.setAttributeNS(null, "fill-opacity", .5);
  this.wave.setAttributeNS(null, "fill", "none"); this.wave.setAttributeNS(null, "stroke", "black");
  this.wave.setAttributeNS(null, "x", this.x); this.wave.setAttributeNS(null, "y", this.y);
  this.wave.setAttributeNS(null, "width", def[this.type]['BBwidth']);
  this.wave.setAttributeNS(null, "height", def[this.type]['BBheight']); */
  this.wave = svgDocument.createElementNS(Basics.svgns, "ellipse");
  this.wave.setAttributeNS(null, "fill", "#7c9bfc");
  this.setWaveX();
  this.wave.setAttributeNS(null, "cy", this.y+def[this.type]['BBheight']-.5);
  this.wave.setAttributeNS(null, "rx", 20);
  this.wave.setAttributeNS(null, "ry", 1.5);
  this.wave.setAttributeNS(null, "visibility", "hidden");
  activeElements.appendChild(this.wave);
}

// method for friendly ships, releasing them after a while
Ship.prototype.rescued = function (by) {
  if (!this.alive) return;
  if (by==20) { // first time
    this.ship.setAttributeNS(null, "stroke", "none");
    if (this.wave) this.wave.setAttributeNS(null, "visibility", "hidden");
    playSound('gotBonus');
  }
  this.ship.setAttributeNS(null, "fill-opacity", by/20);
  if (--by>=0) this.rescTimer = window.setTimeout("enemies["+this.id+"].rescued("+by+")", 100);
  else {
    if (this.ship) activeElements.removeChild(this.ship);
    if (this.wave) activeElements.removeChild(this.wave);
    this.blast = this.ship = this.wave = null;
    this.thumbOff(1);
    destroyedCount++;
    mainPanel("green");
    addScore(Math.abs(def[this.type]['points']));
    enemyStatus();
    this.alive = 0;
    message("Friendly ship No. "+this.id+" rescued for bonus...");
  }
}

// simple appear method of newly added ship - no animation
Ship.prototype.appear = function () {
  this.ship.setAttributeNS(null, "stroke", (Settings.strokes) ? "#000" : "none");
  this.ship.setAttributeNS(null, "fill", def[this.type]['fill']);
  this.alive = 1; this.appr = 0;
  this.move(def[this.type]['movement']);
  if (this.wave) this.wave.setAttributeNS(null, "visibility", "visible");
}

// animated appear method of newly added ship - fade in
Ship.prototype.appearNice = function (by) {
  this.ship.setAttributeNS(null, "fill-opacity", 1-by/20);
  if (--by>=0) this.apprTimer = window.setTimeout("enemies["+this.id+"].appearNice("+by+")", 100);
  else {
    this.alive = 1; this.appr = 0;
    this.ship.setAttributeNS(null, "stroke", (Settings.strokes) ? "#000" : "none");
    this.move(def[this.type]['movement']);
    if (this.wave) this.wave.setAttributeNS(null, "visibility", "visible");
  }
}

// basic ship movement handler
Ship.prototype.move = function (times) {
  if (!this.alive || !gameRunning) return;
  if (--times == 0) return this.fire();  // shoot and then continue
  if ((this.direction ==-1) && (this.x <= def[this.type]['x2'])) { this.direction = 1; return this.fire(); }
  if ((this.direction == 1) && (this.x >= def[this.type]['x1'])) { this.direction = -1; return this.fire(); }
  this.x += this.direction*def[this.type]['speed']; // common move continue
  this.ship.setAttributeNS(null, "x", this.x);
  this.setWaveX();  
  this.moveTimer = window.setTimeout("enemies["+this.id+"].move("+times+")", 100);
}

// decision maker for several cases whether and in which direction should ship go on
Ship.prototype.moveGoOn = function () {
  if (!this.alive || !gameRunning) return;
  if (this.x <= def[this.type]['x2']) this.direction = 1;
  else if (this.x >= def[this.type]['x1']) this.direction = -1;
       else this.direction *= (Math.round(Math.random()*2)==1) ? -1 : 1;  // with 33% probability change direction
  if (this.wave) this.wave.setAttributeNS(null, "visibility", "visible");
  this.move(def[this.type]['movement']);
}

// method for initialization of ship firing
Ship.prototype.fire = function () {
  if (!this.alive || !gameRunning) return;
  if (!def[this.type]['enemy']) return this.moveGoOn(); // for innocent ships
  if (this.wave) this.wave.setAttributeNS(null, "visibility", "hidden");
  message('Ship '+this.id+' is firing!');
  this.shot = svgDocument.createElementNS(Basics.svgns, "circle");     // create new shot
  this.shot.setAttributeNS(null, "cx", this.x+def[this.type]['fireX']);
  this.fireCY = this.y+def[this.type]['fireY'];
  this.shot.setAttributeNS(null, "cy", this.fireCY);
  this.fireR = .5;
  this.shot.setAttributeNS(null, "r", this.fireR);
  this.shot.setAttributeNS(null, "fill", "#353535");
  if (Settings.strokes) {
    this.shot.setAttributeNS(null, "stroke", "#3e3e3e");
    this.shot.setAttributeNS(null, "stroke-width", 6);
  }
  enemyShots.appendChild(this.shot);
  this.shotSmoke = svgDocument.createElementNS(Basics.svgns, "circle");     // create new shot
  this.shotSmoke.setAttributeNS(null, "cx", this.x+def[this.type]['fireX']);
  this.shotSmoke.setAttributeNS(null, "cy", this.y+def[this.type]['fireY']);
  this.shotSmoke.setAttributeNS(null, "r",  3);
  this.shotSmoke.setAttributeNS(null, "fill", "yellow");
  this.shotSmoke.setAttributeNS(null, "stroke", "red");
  enemyShots.appendChild(this.shotSmoke);
  (this.id%2) ? playSound('enemyFire1') : playSound('enemyFire2');
  this.fireTimer = window.setTimeout("enemies["+this.id+"].fireAnim(80)", 40);
}

// animation and eval of ship's shot
Ship.prototype.fireAnim = function (howMany) {
  if (!gameRunning) return;
  var fireCY = Math.floor(howMany/10);
  if (fireCY) this.shot.setAttributeNS(null, "cy", (this.fireCY-=fireCY));
  var fireR = Math.floor(96/howMany);
  if (fireR) this.shot.setAttributeNS(null, "r", (this.fireR+=fireR));
  if (howMany==60) enemyShots.removeChild(this.shotSmoke);
  howMany -= 2;
  if (howMany>0) {
    this.fireTimer = window.setTimeout("enemies["+this.id+"].fireAnim("+howMany+")", 40);
  } else {
    playSound('uboatCrash');
    mainPanel("#f22");
    message("HIT!");
    enemyShots.removeChild(this.shot);
    this.shot = null;
    if (destroyed(1)) return IntroOutro.endAnimDest(0 , 1, 1);
    this.moveGoOn();
  }
}

// method detection collision between ship and torpedo
Ship.prototype.isCollision = function (tx, ty) {
  var x2 = def[this.type]['BBwidth']+this.x;
  var y2 = def[this.type]['BBheight']+this.y;
  if ( ( (this.x <= tx) && ( x2 >= tx) ) && ( (this.y <= ty) && ( y2 >= ty) ) ) {
    this.explosion(tx, ty, 5);
    message("Hit! tx "+tx+" between ("+this.x+" - "+x2+") and ty "+ty+" between ("+this.y+" - "+y2+")");
    return 1;
  }
}

// method both initiating and animating explosion of the ship after hit
Ship.prototype.explosion = function (tx, ty, act) {
  if (act) {  // start or continue anim.
    if (!this.blast) { // 1st time
      this.alive = 0;
      this.thumbOff(0);
      //window.parent.document.getElementById('ddd').click();
      if (this.wave) {
        this.wave.setAttributeNS(null, "cx", this.x+(def[this.type]['BBwidth']/2));
        this.wave.setAttributeNS(null, "rx", 9+(def[this.type]['BBwidth']/2));
        this.wave.setAttributeNS(null, "ry", 12);
        this.wave.setAttributeNS(null, "visibility", "visible");
      }
      playSound('enemyCrash');
      destroyedCount++;
      enemyStatus();
      this.ship.setAttributeNS(Basics.xlinkns, "href", def[this.type]['sink']);
      this.blast = svgDocument.createElementNS(Basics.svgns, "use");
      this.blast.setAttributeNS(Basics.xlinkns, "href", "#blast0");
      this.blast.setAttributeNS(null, "x", tx);
      this.blast.setAttributeNS(null, "y", ty);
      activeElements.appendChild(this.blast);
      mainPanel("#e55");
      addScore(def[this.type]['points']);
    } else {
      tx += -1*this.direction*2;
      ty -= 3;
      this.blast.setAttributeNS(null, "x", tx);
      this.blast.setAttributeNS(null, "y", ty);
      this.blast.setAttributeNS(null , "opacity", act/4);
      //if (this.wave) this.wave.setAttributeNS(null , "fill-opacity", act/4);
    }
    this.explTimer = window.setTimeout("enemies["+this.id+"].explosion("+tx+","+ty+","+(--act)+")", 125);
  } else { // end
    activeElements.removeChild(this.ship);
    activeElements.removeChild(this.blast);
    if (this.wave) activeElements.removeChild(this.wave);
    this.blast = this.ship = this.wave = null;
  }
}


// ************************************************************************************************
// Settings Object methods
// ************************************************************************************************

// helper function for highlighting top option menu items
Settings.decode = function(ex) {
  return (ex) ? "white" : "gray" ;
}

// workaround for FFX 1.5 not supporting direct events on tspan elements
Settings.decOpt = function(evt) {
  var x = evt.target.firstChild;
  switch (x.data) {
    case "Debugs":
    Settings.setMessages(evt); break;
    case "ShipAppear":
    Settings.setShipAppear(evt); break;
    case "Clouds":
    Settings.setClouds(evt); break;
    case "Gradients":
    Settings.setGradients(evt); break;
    case "Compass":
    Settings.setCompass(evt); break;
    case "Strokes":
    Settings.setStrokes(evt); break;
    case "Periscope":    
    Settings.setView(evt); break;
    case "FullScreen":
    Settings.setFullScreen(evt); break;
    case "ShipWave":
    Settings.setShipWaves(evt); break;
    case "Quality":
    Settings.setQuality(evt); break;
    case "Panels":
    Settings.setPanels(evt); break;
  }
}

// method setting on or off debugging messages
Settings.setMessages = function(e) {
  e.target.setAttributeNS(null, "fill", this.decode(this.messages = (this.messages) ? 0 : 1));
  var x = svgDocument.getElementById("message");
  x.setAttributeNS(null, "visibility", (this.messages) ? "visible" : "hidden");
  if (this.messages) message("Debugging messages are ON (slower)!");
}

// method setting on or off real periscope view or rectangular
Settings.setView = function(e) {
  var x = svgDocument.getElementById("perisView");
  if (this.niceView) {
    e.target.setAttributeNS(null, "fill", this.decode(this.niceView = 0));
    x.setAttributeNS(null, "clip-path", "none");
    mainPanel1.setAttributeNS(null, "visibility", "hidden");
    mainPanel0.setAttributeNS(null, "visibility", "visible");
    svgDocument.getElementById("periOv").setAttributeNS(null, "rx", "10");
    return message("View was set to rectangular one! (faster)");
  }
  e.target.setAttributeNS(null, "fill", this.decode(this.niceView = 1));
  x.setAttributeNS(null, "clip-path", "url(#periscope)");
  mainPanel1.setAttributeNS(null, "visibility", "visible");
  mainPanel0.setAttributeNS(null, "visibility", "hidden");
  svgDocument.getElementById("periOv").setAttributeNS(null, "rx", "100");
  message("View was set to radial/triedr-based nice one! (slower)");
}

// method setting on or off nice and fast ship appear methods
Settings.setShipAppear = function(e) {
  e.target.setAttributeNS(null, "fill", this.decode(this.shipAppearNice = (this.shipAppearNice) ? 0 : 1)); 
  var z = (this.shipAppearNice) ? "nice-fade (slower)" : "simple-stroke (faster)"; 
  message("Ship appearing method switched to " + z + this.note);
}

// method setting on or off strokes on majority of environment objects
Settings.setStrokes = function(e) {
  e.target.setAttributeNS(null, "fill", this.decode(this.strokes = (this.strokes) ? 0 : 1));
  svgDocument.getElementById("sun").setAttributeNS(null, "stroke", (this.strokes) ? "orange" : "none");
  var z = (this.strokes) ? "ON (slower)" : "OFF (faster)"; message("Silouhethes of ships and shots switched to: " + z + this.note);
}

// method setting on or off dashboard panels boxes
Settings.setPanels = function(e) {
  e.target.setAttributeNS(null, "fill", this.decode(this.panels = (this.panels) ? 0 : 1));
  svgDocument.getElementById("dashboardPanels").setAttributeNS(null, "visibility", this.panels ? "visible" : "hidden");
  var z = (this.panels) ? "ON (slower)" : "OFF (faster)"; message("Dashboard panels switched to: " + z);
}

// method setting on or off waves behind ships
Settings.setShipWaves = function(e) {
  e.target.setAttributeNS(null, "fill", this.decode(this.shipWave = (this.shipWave) ? 0 : 1));
  var z = (this.shipWave) ? "ON (slower)" : "OFF (faster)"; message("Waves behind ships switched to: " + z + this.note);
}

// method setting on or off dashboard's compass and deep'o'meter
Settings.setCompass = function(e) {
  e.target.setAttributeNS(null, "fill", this.decode(this.deepAndCompass = (this.deepAndCompass) ? 0 : 1)); 
  svgDocument.getElementById("compassGroup").setAttributeNS(null, "visibility", this.deepAndCompass ? "visible" : "hidden");
  svgDocument.getElementById("deepGroup").setAttributeNS(null, "visibility", this.deepAndCompass ? "visible" : "hidden");
  var z =(this.deepAndCompass) ? "ON (slower)" : "OFF (faster)"; message("Compass and deep'o'meter switched to: " + z);
}

// method setting on or off all the gradients used in this game
Settings.setGradients = function(e) {
  var x = svgDocument.getElementById("seaRect");
  e.target.setAttributeNS(null, "fill", this.decode(this.gradients = (this.gradients) ? 0 : 1)); 
  x.setAttributeNS(null, "fill", (this.gradients) ? ((this.night) ? "url(#nightSea)" : "url(#daySea)") : ((this.night) ? "#005" : "#00b"));
  x = svgDocument.getElementById("skyRect");
  x.setAttributeNS(null, "fill", (this.gradients) ? ((this.night) ? "url(#nightSky)" : "url(#daySky)") : ((this.night) ? "#111" : "#e68519"));
  x = svgDocument.getElementById("deepGrad");
  x.setAttributeNS(null, "fill", (this.gradients) ? "url(#deep)" : "#0f0");
  x = svgDocument.getElementById("compassGrad");
  x.setAttributeNS(null, "fill", (this.gradients) ? "url(#gradComp)" : "#444");
  var z = (this.gradients) ? "ON (much slower!)" : "OFF (faster)";
  message("Gradiens of sky, sea, compass, panels and deep'o'meter switched to: " + z);
}

// method setting on or off clouds and waves and trees
Settings.setClouds = function(e) {
  var cloud = svgDocument.getElementById("clouds");
  e.target.setAttributeNS(null, "fill", this.decode(this.clouds = (this.clouds) ? 0 : 1)); 
  if (this.clouds) {
    cloud.setAttributeNS(null, "visibility", "visible");
    svgDocument.getElementById("dayEnv").setAttributeNS(null, "visibility", (this.night) ? "hidden" : "visible");
    svgDocument.getElementById("nightEnv").setAttributeNS(null, "visibility", (!this.night) ? "hidden" : "visible");
  } else {
    cloud.setAttributeNS(null, "visibility", "hidden");
    svgDocument.getElementById("dayEnv").setAttributeNS(null, "visibility", "hidden");
    svgDocument.getElementById("nightEnv").setAttributeNS(null, "visibility", "hidden");
  }
  var z = (this.clouds) ? "visible (slower)" : "hidden (faster)"; message("Clouds, waves and palms visibility switched to: " + z);
}

// method setting on or off day or night environment based on level during gameplay
Settings.setNight = function () {
  this.night = (level%2) ? 0 : 1;
  var x = svgDocument.getElementById("seaRect");
  x.setAttributeNS(null, "fill", (this.gradients) ? ((this.night) ? "url(#nightSea)" : "url(#daySea)") : ((this.night) ? "#005" : "#00b"));
  x = svgDocument.getElementById("skyRect");
  x.setAttributeNS(null, "fill", (this.gradients) ? ((this.night) ? "url(#nightSky)" : "url(#daySky)") : ((this.night) ? "#111" : "#e68519"));
  svgDocument.getElementById("sun").setAttributeNS(null, "visibility", (this.night) ? "hidden" : "visible");
  svgDocument.getElementById("dayEnv").setAttributeNS(null, "visibility", (this.night || !this.clouds) ? "hidden" : "visible");
  svgDocument.getElementById("nightEnv").setAttributeNS(null, "visibility", (!this.night || !this.clouds) ? "hidden" : "visible");
}

// when possible, switching on and off viewox to the maximal viewbox
Settings.setFullScreen = function(e) {
  var svgMain = svgDocument.getElementById("svgMain");
  e.target.setAttributeNS(null, "fill", this.decode(this.fullScreen = (this.fullScreen) ? 0 : 1));
  if (this.fullScreen) {
    svgMain.setAttributeNS(null, "width", "100%");
    svgMain.setAttributeNS(null, "height", "100%");
    return message("Screen size swithed to FullScreen! (much slower!)");
  }
  e.target.setAttributeNS(null, "fill", this.decode(0));
  svgMain.setAttributeNS(null, "width", "600");
  svgMain.setAttributeNS(null, "height", "380");
  message("Screen size swithed to original size! (faster)");
}

// method degrading/upgrading quality of rendering, depends on SVG viewer capabilities
Settings.setQuality = function(e) {
  var svgMain = svgDocument.getElementById("svgMain");
  e.target.setAttributeNS(null, "fill", this.decode(this.quality = (this.quality) ? 0 : 1));
  if (!this.quality) {
    svgMain.setAttributeNS(null, "shape-rendering", "optimizeSpeed");
    svgMain.setAttributeNS(null, "text-rendering", "optimizeSpeed");
    svgMain.setAttributeNS(null, "image-rendering", "optimizeSpeed");
    return message("Quality of antialiasing, text and images degraded to optimize speed");
  }
  svgMain.setAttributeNS(null, "shape-rendering", "optimizeQuality");
  svgMain.setAttributeNS(null, "text-rendering", "geometricPrecision");
  svgMain.setAttributeNS(null, "image-rendering", "optimizeQuality");
  message("Quality of antialiasing, text and images upgraded!");
}

// method setting on or off almost all options of the game
Settings.setAllOptions = function (evt) {
  var x = svgDocument.getElementById("options");
  if (this.all) {
    this.clouds = this.gradients = this.shipAppearNice = this.messages = this.strokes = 1;
    this.deepAndCompass = this.panels = this.shipWave = this.niceView = this.quality = this.fullScreen = 1; 
    this.all = 0;
  } else {
    this.clouds = this.gradients = this.shipAppearNice = this.messages = this.strokes = 0;
    this.deepAndCompass = this.panels = this.shipWave = this.niceView = this.quality = this.fullScreen = 0; 
    this.all = 1;
  }
  this.setClouds(evt);    this.setCompass(evt);
  this.setGradients(evt); this.setQuality(evt);
  this.setMessages(evt);  this.setView(evt);
  this.setStrokes(evt);   this.setShipAppear(evt);
  this.setPanels(evt);    this.setFullScreen(evt);
  this.setShipWaves(evt);
  var to = (this.all) ? "white" : "gray";
  for( var node = x.firstChild ; node != null ; node = node.nextSibling )
    if (node.nodeType == 1) node.setAttributeNS(null, "fill", to);
  message("All visual options switched ON");
}

// method setting off several options to boost performance for Gecko browsers
Settings.setFirefox = function (evt) {
  var x = svgDocument.getElementById("options");
  // those switch off
  this.shipAppearNice = this.messages = this.strokes = this.panels = this.fullScreen = this.clouds = this.deepAndCompass = 1;
  // and those on
  this.gradients = this.shipWave = this.niceView = this.quality = 0;
  this.setClouds(evt);    this.setCompass(evt);
  this.setGradients(evt); this.setQuality(evt);
  this.setMessages(evt);  this.setView(evt);
  this.setStrokes(evt);   this.setShipAppear(evt);
  this.setPanels(evt);    this.setFullScreen(evt);
  this.setShipWaves(evt);
  for( var node = x.firstChild ; node != null ; node = node.nextSibling ) {
    if (node.nodeType == 1) {
      var n = node.firstChild.data;
      if (n == "Periscope" || n == "ShipWave" || n == "Quality" || n == "Gradients") 
        node.setAttributeNS(null, "fill", "white");
      else 
        node.setAttributeNS(null, "fill", "gray");
    }
  }
  message("Visual options switched to optimize Firefox/Gecko performance");
}

// method setting on or off sound effects
Settings.setSounds = function (evt) {
  if (!evt) {
    try { 
      if (!top.soundWrap) {
        this.sounds = this.sndAvail = 0;
        return message("Sound effects were disabled and are not available!");
      } else {
        this.sounds = this.sndAvail = 1;
        return message("Sound effects enabled!");
      }
    } catch (e) {
      this.sounds = this.sndAvail = 0;
      return message("Sound effects were disabled and are not available!");
    }
  }
  if (this.sndAvail && this.sounds) {
    this.sounds = 0;
    if (evt) evt.target.setAttributeNS(null, "fill", "black"); 
    message("Sound effects disabled!");
  } else if (this.sndAvail) {
    this.sounds = 1;
    if (evt) evt.target.setAttributeNS(null, "fill", "green"); 
    message("Sound effects enabled!");
  }
}

// ************************************************************************************************
// IntroOutro Object methods
// ************************************************************************************************

// intro object constructor
IntroOutro.init = function() {
  try { navigator.mimeTypes["image/svg"]; } catch (e) { this.msie = 1; }
  this.introMask = svgDocument.getElementById("introMask");
  this.startScreen = svgDocument.getElementById("startScreen");
  this.inputNameBox = svgDocument.getElementById("inputNameBox");
  this.endScreen = svgDocument.getElementById("endScreen");
  this.scoreShow = svgDocument.getElementById("scoreShow");
  //playSound('introSong');
}

// initialization of game to start the play
IntroOutro.start = function() {
  document.documentElement.removeEventListener("keydown", IntroOutro.writeDown, false);
  document.documentElement.addEventListener("keydown", keyDown, false);
  document.documentElement.addEventListener("keyup", keyUp, false);
  this.introMask.setAttributeNS(null, "fill", "none");
  this.introMask.setAttributeNS(null, "visibility", "hidden");
  subDamage.setAttributeNS(null, "width", 0);
  Torpedo.init();
  enemies = new Array();
  destroyedCount = hits = score = damage = this.introRunning = 0;
  elapsed = withShift = 0;
  window.setTimeout("timeElapsed()", 2000);
  destroyed(0);
  var w = world.getCTM();
  worldE = w.e; worldF = w.f;
  level = 1;
  eLevel.data = "Level: "+level;
  //window.setTimeout("generateEnemy()", 1000);
  afterLevel(1);
}

// animation of intro comming
IntroOutro.startAnim = function(howMany, tot, first) {
  if (first && this.introRunning) return;
  if (first) { 
    this.introRunning = 1; 
    this.introMask.setAttributeNS(null, "fill", "black");
    level = gameRunning = 1;
    Settings.setNight();
  }
  if ((tot==-1) && (howMany<=.2)) {
    keyHandler = window.setInterval("moveWorld()", 30);
    playSound('background');
    return this.start();
  }

  howMany += tot*.1;
  this.introMask.setAttributeNS(null, "fill-opacity", howMany);
  if((tot==1) && (howMany>=.9)) {
    tot = -1; 
    this.startScreen.setAttributeNS(null, "visibility", "hidden");
    this.introMask.setAttributeNS(null, "stroke", "none");
  }
  window.setTimeout("IntroOutro.startAnim("+howMany+","+tot+",0)", 40);
}

// initialization of game to stop the play
IntroOutro.end = function() {
  gameRunning = this.introRunning = 0;
  document.documentElement.removeEventListener("keydown", keyDown, false);
  document.documentElement.removeEventListener("keyup", keyUp, false);
  document.documentElement.addEventListener("keydown", IntroOutro.writeDown, false);
  this.introMask.setAttributeNS(null, "fill", "none");
  if (score) this.inputNameBox.setAttributeNS(null, "visibility", "visible");
  else this.getHighScore("");
  while (activeElements.hasChildNodes()) activeElements.removeChild(activeElements.firstChild);
  while (enemyShots.hasChildNodes()) enemyShots.removeChild(enemyShots.firstChild);
  while (eThumbs.hasChildNodes()) eThumbs.removeChild(eThumbs.firstChild);
  if (Torpedo.elemens && Torpedo.elemens.hasChildNodes())
    while (Torpedo.elemens.hasChildNodes()) Torpedo.elemens.removeChild(Torpedo.elemens.firstChild);
}

// animation of intro comming after outro
IntroOutro.endAnim = function(howMany, tot, first) {
  if (first && this.introRunning) return;
  if (first) { 
    playSound('outroSong');
    this.introRunning = 1;
    this.inputNameBox.setAttributeNS(null, "visibility", "hidden");
    this.introMask.setAttributeNS(null, "fill", "black");
    document.documentElement.removeEventListener("keydown", IntroOutro.writeDown, false);
  }
  if ((tot==-1) && (howMany<=.2)) {
    this.introRunning = 0;
    return this.introMask.setAttributeNS(null, "fill", "none");
  }
  howMany += tot*.1;
  this.introMask.setAttributeNS(null, "fill-opacity", howMany);
  if((tot==1) && (howMany>=.9)) {
    tot = -1; 
    this.endScreen.setAttributeNS(null, "visibility", "hidden");
    this.startScreen.setAttributeNS(null, "visibility", "visible");
  }
  window.setTimeout("IntroOutro.endAnim("+howMany+","+tot+",0)", 40);
}

// shoving up table with high scores
IntroOutro.highScoreDest = function(howMany, tot, first) {
  if (first && this.introRunning) return;
  if (first) {
    this.introRunning = 1; score = 0; 
    this.introMask.setAttributeNS(null, "fill", "black");
  }
  if ((tot==-1) && (howMany<=.2)) {
    return this.end();
  }
  howMany += tot*.1;
  this.introMask.setAttributeNS(null, "fill-opacity", howMany);
  if((tot==1) && (howMany>=.9)) {
    tot = -1; 
    this.startScreen.setAttributeNS(null, "visibility", "hidden");
    this.endScreen.setAttributeNS(null, "visibility", "visible");
  }
  window.setTimeout("IntroOutro.highScoreDest("+howMany+","+tot+",0)", 40);
}

// animation of outro comming after gameplay
IntroOutro.endAnimDest = function(howMany, tot, first) {
  if (first && this.introRunning) return;
  window.clearInterval(keyHandler);
  if (first) {
    this.introRunning = 1;
    this.introMask.setAttributeNS(null, "fill", "black");
    this.introMask.setAttributeNS(null, "visibility", "visible");
    playSoundX('background');
  }
  if ((tot==-1) && (howMany<=.2)) return this.end();

  howMany += tot*.1;
  this.introMask.setAttributeNS(null, "fill-opacity", howMany);
  if((tot==1) && (howMany>=.9)) {
    tot = -1; 
    this.scoreShow.firstChild.data = "Your score is: "+score;
    this.endScreen.setAttributeNS(null, "visibility", "visible");
    this.introMask.setAttributeNS(null, "stroke", "#000");
  }
  window.setTimeout("IntroOutro.endAnimDest("+howMany+","+tot+",0)", 40);
}

// keyboard hanler used to sign in to the Hall of Fame
IntroOutro.writeDown = function(evt) { // emulation of input element
  if(evt.preventDefault) evt.preventDefault();
  var naming = svgDocument.getElementById('inputNameX').firstChild;
  if (naming.data=="EnterYourNameHere" || naming.data=="Just start typing now...") naming.data = "";
  var x = evt.keyCode;
  if (x==27) return IntroOutro.endAnim(0, 1, 1);
  // skip Shift, left, right, home, end, insert
  if (x==16 || x==37 || x==39 || x==36 || x==35 || x==155) return 0;
  if (x==13) { // enter pressed
    var playerName = naming.data;
    IntroOutro.getHighScore(playerName);
    naming.data = "EnterYourNameHere";
    return document.documentElement.removeEventListener("keydown", IntroOutro.writeDown, false);
  }
  if (x==8 || x==46 || x==127) {
    var prom = naming.data;
    prom = prom.substring(0, (prom.length-1))
    naming.data = prom;
  } else {
    if (naming.data.length > 14) return 0;
    naming.data += String.fromCharCode(x);
  }
}

// ajax method used for communication with server to obtain highscore list
IntroOutro.send_xmlhttprequest = function(serve, methode, url, content, headers) { 
  var xmlhttp = (window.XMLHttpRequest ? new XMLHttpRequest : (window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : null));
  if (!xmlhttp) return 0; // MSIE ActiveX/AJAX doesn't work in pure SVG and ASV, so use directly ASV getUrl
  xmlhttp.open(methode, url);
  xmlhttp.onreadystatechange = function() { serve(xmlhttp); };
  if (headers) for(var key in headers) xmlhttp.setRequestHeader(key, headers[key]);
  xmlhttp.send(content);
  return 1;
}

// method invoking getting of high-scoe list
IntroOutro.getHighScore = function(playerName) {
  var tmpAdr = Basics.serverScoreScript + ((playerName && score) ? "?name="+this.urlEncode(playerName)+"&score="+score : "");
  var r = (!this.msie) ? this.send_xmlhttprequest(IntroOutro.showHighScore, "GET", tmpAdr) : getURL(tmpAdr, IntroOutro.showHighScore);
}

// helper function used to sort high scores
IntroOutro.sortByInt = function(item1, item2) { return item2 - item1; }

// mouseover highlighting method for some intro boxes
IntroOutro.over = function(evt, x) {
  if (x) {
    evt.target.setAttributeNS(null, "fill-opacity", .3);
    evt.target.setAttributeNS(null, "stroke", "maroon");
  } else {
    evt.target.setAttributeNS(null, "fill-opacity", .1);
    evt.target.setAttributeNS(null, "stroke", "black");
  }
}

// helper function letting peoble better understand way in which they should sign in
IntroOutro.letsWrite = function() {
  var n = svgDocument.getElementById('inputNameX').firstChild;
  if (!n.data || (n.data == "EnterYourNameHere"))
  n.data = "Just start typing now...";
}

// method called from ajax, real parsing of acquired data and putting them show
IntroOutro.showHighScore = function(xmlhttp) {
  var rows = new Array();
  var hallOfFame = new Array();
  if ((IntroOutro.msie && !xmlhttp.success) || (!IntroOutro.msie && xmlhttp.readyState != 4)) var incomingData = "000#-|-#No data available";
  else var incomingData = (IntroOutro.msie) ? xmlhttp.content : xmlhttp.responseText;
  svgDocument.getElementById("inputNameBox").setAttributeNS(null, "visibility", "hidden");
  rows = incomingData.split("\n");
  if (!rows.length) return;
  if (incomingData.indexOf("#-|-#")==-1) return;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i]) hallOfFame[i] = rows[i].split("#-|-#");
  }
  var fame = svgDocument.getElementById('hallOfFame');
  while (fame.hasChildNodes()) fame.removeChild(fame.firstChild);
  // resort arrays
  var tmpArray = new Array();
  for (var i = hallOfFame.length-1; i>=0; i--) tmpArray[i] = hallOfFame[i][0];
  tmpArray.sort(IntroOutro.sortByInt);
  var topTen = (tmpArray.length>15) ? 15 : tmpArray.length;
  var total = 0;
  for (var y = 0; y < topTen; y++) {
    for (var i = 0; i < hallOfFame.length; i++) {
      if ((hallOfFame[i][0] == tmpArray[y]) && (total<topTen)) {
        // create text span
        var fameSpan = svgDocument.createElementNS(Basics.svgns, "tspan");
        fameSpan.setAttributeNS(null, "x", 48); fameSpan.setAttributeNS(null, "dx", 0);
        fameSpan.setAttributeNS(null, "dy", 14); fameSpan.appendChild(document.createTextNode(hallOfFame[i][0]));
        fame.appendChild(fameSpan);
        fameSpan = svgDocument.createElementNS(Basics.svgns, "tspan");
        fameSpan.setAttributeNS(null, "x", 48); fameSpan.setAttributeNS(null, "dx", 40);
        fameSpan.setAttributeNS(null, "dy", 0); fameSpan.appendChild(document.createTextNode('................... '+ hallOfFame[i][1]));
        fame.appendChild(fameSpan);
        hallOfFame[i][0] = -1; // some kind of reset
        total++;
      }
    }
  }
  message('Acquiring and showing up high-score list completed...');
}

// helper function preventing some not-acceptable characters to be entered into highscore list
IntroOutro.urlEncode = function(plaintext) {
	var safechars = "0123456789" +					// Numeric
  	"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
		"abcdefghijklmnopqrstuvwxyz" +
		"-_.!~*'()";					// RFC2396 Mark characters 
	var hex = "0123456789ABCDEF";
	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	  if (ch == " ") encoded += "+";				// x-www-urlencoded, rather than %20
		else if (safechars.indexOf(ch) != -1) encoded += ch;
    else {
		  var charCode = ch.charCodeAt(0);
			if (charCode > 255) {
			  alert( "Unicode Character '" + ch + "' cannot be encoded using standard URL encoding.\n" +
				       "(URL encoding only supports 8-bit characters.)\n" + "A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += hex.charAt((charCode >> 4) & 0xF);
				encoded += hex.charAt(charCode & 0xF);
			}
		}
	}
	return encoded;
}


// ************************************************************************************************
// Torpedo Object methods
// ************************************************************************************************

// object constructor
Torpedo.init = function() {
  this.arr = new Array();   this.arrCY = new Array();
  this.arrRY = new Array(); this.arrR = new Array();
  this.x = this.y = this.r = 0;
  this.elemens = svgDocument.getElementById("torpedoElements");
  this.loadInd = svgDocument.getElementById("torpLoad");
}

// creation of new torpedo missile
Torpedo.fire = function() {
  if (worldF>1) {
    playSound('notAvail');
    message('Not possible to fire torpedo above water!');
    return mainPanel("#bbb");
  }
  var xPref = (worldE>0) ? -1 : 1;
  var cx = (200+(xPref*Math.abs(worldE)));
  var yPref = 257+Math.abs(worldF);
  // create new torpedo
  for (var i = 1; i < 5; i++) {
    this.arr[i] = svgDocument.createElementNS(Basics.svgns, "circle");
    this.arr[i].setAttributeNS(null, "cx", cx);
    this.arrCY[i] = yPref+(i*5);
    this.arr[i].setAttributeNS(null, "cy", this.arrCY[i]);
    var x = i*3;
    this.arr[i].setAttributeNS(null, "fill", "#"+x+x+x);
    if (i!=4) {
      this.arrR[i] = 8+(i*2);
    } else {
      this.arrR[i] = 6+(i*2);
      if (Settings.strokes) this.arr[i].setAttributeNS(null, "stroke", "black");
    }
    this.arr[i].setAttributeNS(null, "r", this.arrR[i]);
    this.elemens.appendChild(this.arr[i]);
  }
  i = 5; // wave
  this.arr[i] = svgDocument.createElementNS(Basics.svgns, "ellipse");
  this.arr[i].setAttributeNS(null, "cx", cx);
  this.arr[i].setAttributeNS(null, "cy", Torpedo.arrCY[4]+14);
  this.arr[i].setAttributeNS(null, "rx",  4);
  this.arrRY[i] = 11+(i*2);
  this.arr[i].setAttributeNS(null, "ry", Torpedo.arrRY[i]);
  this.arr[i].setAttributeNS(null, "fill",  "#fff");
  this.elemens.appendChild(this.arr[i]);
  playSound('torpedoFire');
  message('Torpedo fired at cx='+cx+', cy='+yPref);
  this.x = cx;
  this.loadInd.firstChild.data = "Torpedo loading";
  this.loadInd.setAttributeNS(null, "fill", "red");
  this.fly = 170;
  window.setTimeout("Torpedo.fireAnim()", 1000);
}

// animation of torpedo missile
Torpedo.fireAnim = function() {
  if (this.fly>1) {
    var x0 = Math.round(this.fly/3); var x;
    for (var i = 1; i < 5; i++) {
      this.arrR[i] -= ((i+10)/this.fly);
      this.arrCY[i] = Math.round(this.arrCY[i]-((i+53)/this.fly)-2);
      this.arr[i].setAttributeNS(null, "r", this.arrR[i]);
      x = x0 + i*15;
      this.arr[i].setAttributeNS(null, "fill", "rgb("+x+","+x+","+x+")");
      this.arr[i].setAttributeNS(null, "cy", this.arrCY[i]);
    }
    i = 5; // wave
    this.arrRY[i] -= ((i+8)/this.fly);
    this.arr[i].setAttributeNS(null, "ry", this.arrRY[i]);
    x = Math.round(this.fly/3) + i*20;
    this.arr[i].setAttributeNS(null, "fill", "rgb("+x+","+x+","+x+")");
    this.arr[i].setAttributeNS(null, "cy", this.arrCY[4]+14);
    this.fly -= 5;
    window.setTimeout("Torpedo.fireAnim()", 30);
  } else {
    this.loadInd.firstChild.data = "Torpedo ready...";
    this.loadInd.setAttributeNS(null, "fill", "green");
    while (this.elemens.hasChildNodes()){
      this.elemens.removeChild(this.elemens.firstChild);
    }
    // check if some enemy is hit
    for (var i = enemies.length-1; i >= 0; i--) {
      if (!enemies[i].alive) continue;  // skip already dead ones
      if (enemies[i].isCollision(this.x, this.arrCY[1])) return this.x = 0; // target found
    }
    mainPanel("#8b8");
    message('Torpedo missed at x='+this.x+', y='+this.arrCY[1]);
    this.x = 0;
  }
}
