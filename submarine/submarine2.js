// SVG Submarine Assault version 2.0x
// move = main view / move step, levelShips = number of ships per level, addEnSpeed = how quickly should enemy be generated
var Basics = { move:7, levelShips:4, addEnSpeed:8500, maxDamage:30, svgns:"http://www.w3.org/2000/svg", xlinkns:"http://www.w3.org/1999/xlink" };
var Settings = { all:1, sounds:0, sndAvail:1, clouds:1, quality:1, gradients:1, fullScreen:0, shipAppearNice:1, messages:1, strokes:1, deepAndCompass:1, panels:1, shipWave:1, niceView:1, night:1, note:". Effective to new ships only, not existing ones!" };
var IntroOutro = { introMask:null, startScreen:null, endScreen:null };
var Torpedo = { arr:null, arrCY:null, arrR:null, arrRY:null, x:0, y:0, r:0, elemens:null, loadInd:null, fly:0 };
var enemies, destroyedCount, score, hits, worldE, worldF, gameRunning, eNums, enemyShots, eDamage, shipAlertRight, shipAlertLeft, level, withShift, eThumbs, levelReached;
var svgDocument, world, activeElements, keyHandler, mainPanel1, mainPanel0, eCompass, eDeepMeter, eMessage, eScore, eElapsed, elapsed, eLevel, subDamage;
var dx = 0, dy = 0, baseLR = 0, baseFB = 0;
var supportsVibrate = "vibrate" in navigator;
var setTilt = false;

// array of definitions of enemies/ships
var def = new Array();                      // more colors   #9DCEF2
// ship 1
def[1] = new Array();   def[1]['template'] = '#ship1';  def[1]['enemy'] = 1;  
def[1]['points'] = 2;   def[1]['movement'] = 70;        def[1]['sink'] = '#ship1sink';
def[1]['speed'] = 1.4;  def[1]['fill'] = "#4B705A";
def[1]['x1'] = 640;     def[1]['y1'] = 80; // allowed range of initial apperiance
def[1]['x2'] = 25;      def[1]['y2'] = 145; // corrections to the above values
def[1]['BBwidth'] = 62; def[1]['BBheight'] = 15; // bouncing box size used to detect collisions
def[1]['fireX'] = 51;   def[1]['fireY'] = -7; // coordinates of cannon/fire position
// ship 2
def[2] = new Array();   def[2]['template'] = '#ship2';  def[2]['enemy'] = 1;
def[2]['points'] = 3;   def[2]['movement'] = 90;        def[2]['sink'] = '#ship2sink';
def[2]['speed'] = 1.2;  def[2]['fill'] = "#5C647F";
def[2]['x1'] = 630;     def[2]['y1'] = 75;
def[2]['x2'] = 25;      def[2]['y2'] = 145;
def[2]['BBwidth'] = 77; def[2]['BBheight'] = 16;
def[2]['fireX'] = 23;   def[2]['fireY'] = -8;
// ship 3
def[3] = new Array();   def[3]['template'] = '#ship3';  def[3]['enemy'] = 1;
def[3]['points'] = 4;   def[3]['movement'] = 50;        def[3]['sink'] = '#ship3sink';
def[3]['speed'] = 1;    def[3]['fill'] = "#4F8661";
def[3]['x1'] = 600;     def[3]['y1'] = 70;
def[3]['x2'] = 50;      def[3]['y2'] = 135;
def[3]['BBwidth'] = 93; def[3]['BBheight'] = 21;
def[3]['fireX'] = 25;   def[3]['fireY'] = -11;
// ship 4
def[4] = new Array();   def[4]['template'] = '#ship4';  def[4]['enemy'] = 1;
def[4]['points'] = 3;   def[4]['movement'] = 80;        def[4]['sink'] = '#ship4sink';
def[4]['speed'] = 1.3;  def[4]['fill'] = "#898E9D";
def[4]['x1'] = 620;     def[4]['y1'] = 80;
def[4]['x2'] =  20;     def[4]['y2'] = 145;
def[4]['BBwidth'] = 105;def[4]['BBheight'] = 15;
def[4]['fireX'] = 76;   def[4]['fireY'] = -10;
// ship 5
def[5] = new Array();   def[5]['template'] = '#ship5';  def[5]['enemy'] = 1;
def[5]['points'] = 2;   def[5]['movement'] = 50;        def[5]['sink'] = '#ship5sink';
def[5]['speed'] = 1;    def[5]['fill'] = "#00487D";
def[5]['x1'] = 580;     def[5]['y1'] = 85;
def[5]['x2'] =  30;     def[5]['y2'] = 145;
def[5]['BBwidth'] = 115;def[5]['BBheight'] = 14;
def[5]['fireX'] = 65;   def[5]['fireY'] = -8;
// ship 6
def[6] = new Array();   def[6]['template'] = '#ship6';  def[6]['enemy'] = 1;
def[6]['points'] = 4;   def[6]['movement'] = 66;        def[6]['sink'] = '#ship6sink';
def[6]['speed'] = 1.1;  def[6]['fill'] = "#550B80";
def[6]['x1'] = 550;     def[6]['y1'] = 28;
def[6]['x2'] =  20;     def[6]['y2'] = 145;
def[6]['BBwidth'] = 142;def[6]['BBheight'] = 11;
def[6]['fireX'] = 80;   def[6]['fireY'] = -2;
// ship 7
def[7] = new Array();   def[7]['template'] = '#ship7';  def[7]['enemy'] = 1;
def[7]['points'] = 3;   def[7]['movement'] = 70;        def[7]['sink'] = '#ship7sink';
def[7]['speed'] = 1.2;  def[7]['fill'] = "#385A11";
def[7]['x1'] = 620;     def[7]['y1'] = 80;
def[7]['x2'] =  20;     def[7]['y2'] = 145;
def[7]['BBwidth'] = 77; def[7]['BBheight'] = 15;
def[7]['fireX'] = 57;   def[7]['fireY'] = -3;
// ship 8
def[8] = new Array();   def[8]['template'] = '#ship8';  def[8]['enemy'] = 1;
def[8]['points'] = 2;   def[8]['movement'] = 40;        def[8]['sink'] = '#ship8sink';
def[8]['speed'] = 1.1;  def[8]['fill'] = "#7F3E04";
def[8]['x1'] = 620;     def[8]['y1'] = 80;
def[8]['x2'] =  20;     def[8]['y2'] = 145;
def[8]['BBwidth'] = 90; def[8]['BBheight'] = 18;
def[8]['fireX'] = 80;   def[8]['fireY'] = -4;
// ship 9
def[9] = new Array();   def[9]['template'] = '#ship9';  def[9]['enemy'] = 0;
def[9]['points'] = -15; def[9]['movement'] = 150;       def[9]['sink'] = '#ship9sink';
def[9]['speed'] = 1;    def[9]['fill'] = "#99714E";
def[9]['x1'] = 630;     def[9]['y1'] = 70;
def[9]['x2'] =  20;     def[9]['y2'] = 150;
def[9]['BBwidth'] = 70; def[9]['BBheight'] = 10;
def[9]['fireX'] = 0;    def[9]['fireY'] = 0;
// ship 10
def[10] = new Array();  def[10]['template'] = '#ship10';def[10]['enemy'] = 1;
def[10]['points'] = 2;  def[10]['movement'] = 100;      def[10]['sink'] = '#ship10sink';
def[10]['speed'] = 1.1; def[10]['fill'] = "#3F4222";
def[10]['x1'] = 630;    def[10]['y1'] = 70;
def[10]['x2'] =  20;    def[10]['y2'] = 145;
def[10]['BBwidth'] = 80;def[10]['BBheight'] = 15;
def[10]['fireX'] = 11;  def[10]['fireY'] = -2;

// global initialization after onload
function init(evt) {
  svgDocument = evt.target.ownerDocument;                 activeElements = svgDocument.getElementById("activeElements");
  enemyShots = svgDocument.getElementById("enemyShots");  world = svgDocument.getElementById("world");
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
  if (supportsVibrate) navigator.vibrate(200);
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
function playSound(s,l) {
  audio.play(s,l);
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
      toMenu();
  }
}

// accelerometer events
function keyDown2(evt) {
  var lr = Math.round(evt.beta);
  var fb = Math.round(evt.gamma);

  if (setTilt) {
    baseLR = lr;
    baseFB = fb;
    setTilt = false;
  }

  if (lr > (baseLR+5)) {
    dx = 1; // left
    withShift = (lr < (baseLR+12)) ? 1 : 0;
  } else if (lr < (baseLR-5)) {
    dx = -1; // right
    withShift = (lr > (baseLR-12)) ? 1 : 0;
  } else dx = 0; // reset lr

  if (fb > (baseFB+5)) {
    dy = -1; // up
    withShift = (!withShift && fb < (baseFB+12)) ? 1 : 0;
  } else if (fb < (baseFB-5)) {
    dy = 1; // down
    withShift = (!withShift && fb > (baseFB-12)) ? 1 : 0;
  } else dy = 0; // reset fb
  message("base: " + baseLR + " " + baseFB + ", tilt: " + lr + " " + fb + " ;LR = " + dx + " , FB = " + dy + " , withShift = " + withShift);
}

function toMenu() {
  gameRunning = score = 0;
  IntroOutro.endAnimDest(0 , 1, 1);
}

// click fire event
function fire2(evt) {
  if (Torpedo.x) {
    playSound('notAvail');
    message('Not loaded new torpedo yet!');
    mainPanel("#779");
  } else Torpedo.fire();
}


// keyboard evaluation during gameplay - reverse
function keyUp(evt) {
  var c = (evt.keyCode) ? evt.keyCode : evt.charCode;
  switch(c) {
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
  var x2 = worldE+(dx*(Basics.move-(4*withShift))); var y2 = worldF+(dy*(2-(1*withShift)));
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
  window.setTimeout("generateEnemy()", Basics.addEnSpeed-maxCoef*700);
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
  this.thumb.setAttributeNS(null, "y", (this.id>11) ? 283 : 270);
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
  this.wave.setAttributeNS(null, "cy", this.y+def[this.type]['BBheight']-3);
  this.wave.setAttributeNS(null, "rx", 20);
  this.wave.setAttributeNS(null, "ry", 1.5);
  this.wave.setAttributeNS(null, "visibility", "hidden");
  activeElements.appendChild(this.wave);
}

// method for friendly ships, releasing them after a while
Ship.prototype.rescued = function (by) {
  if (!this.alive || !gameRunning) return;
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

// method setting on or off debugging messages
Settings.setMessages = function() {
  this.messages = (this.messages) ? 0 : 1;
  var x = svgDocument.getElementById("message");
  x.setAttributeNS(null, "visibility", (this.messages) ? "visible" : "hidden");
  if (this.messages) message("Debugging messages are ON");
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

// method setting on or off sound effects
Settings.setSounds = function (evt) {
  if (!evt) {
    try { 
      if (!audio.enabled) {
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
    audio.enabled = 0;
    audio.reset();
    if (evt) evt.target.setAttributeNS(null, "fill", "black"); 
    message("Sound effects disabled!");
  } else if (this.sndAvail) {
    this.sounds = 1;
    audio.enabled = 1;
    if (evt) evt.target.setAttributeNS(null, "fill", "green"); 
    message("Sound effects enabled!");
  }
}

// ************************************************************************************************
// IntroOutro Object methods
// ************************************************************************************************

// intro object constructor
IntroOutro.init = function() {
  this.introMask = svgDocument.getElementById("introMask");
  this.startScreen = svgDocument.getElementById("startScreen");
  this.endScreen = svgDocument.getElementById("endScreen");
  playSound('introSong');
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", keyDown2, false);
  }
}

// initialization of game to start the play
IntroOutro.start = function() {
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
  world.setAttribute("transform", "matrix(1 0 0 1 0 0)");
  worldE = 0; worldF = 0;
  level = 1;
  eLevel.data = "Level: "+level;
  afterLevel(1);
  if (window.DeviceOrientationEvent) {
    document.documentElement.addEventListener("click", fire2, false);
    setTilt = true;
  }
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
    playSound('background', true);
    return this.start();
  }

  howMany += tot*.1;
  this.introMask.setAttributeNS(null, "fill-opacity", howMany);
  if((tot==1) && (howMany>=.9)) {
    tot = -1; 
    this.startScreen.setAttributeNS(null, "visibility", "hidden");
    this.introMask.setAttributeNS(null, "stroke", "none");
  }
  window.setTimeout("IntroOutro.startAnim("+howMany+","+tot+",0)", 20);
}

// initialization of game to stop the play
IntroOutro.end = function() {
  gameRunning = this.introRunning = 0;
  document.documentElement.removeEventListener("keydown", keyDown, false);
  document.documentElement.removeEventListener("keyup", keyUp, false);
  if (window.DeviceOrientationEvent) {
    document.documentElement.removeEventListener("click", fire2, false);
  }
  this.introMask.setAttributeNS(null, "fill", "none");
  while (activeElements.hasChildNodes()) activeElements.removeChild(activeElements.firstChild);
  while (enemyShots.hasChildNodes()) enemyShots.removeChild(enemyShots.firstChild);
  while (eThumbs.hasChildNodes()) eThumbs.removeChild(eThumbs.firstChild);
  if (Torpedo.elemens && Torpedo.elemens.hasChildNodes())
    while (Torpedo.elemens.hasChildNodes()) Torpedo.elemens.removeChild(Torpedo.elemens.firstChild);
  if (score) this.getHighScore(prompt("Your score is " + score + ", write your name, captain", ""));
  else this.getHighScore("");
}

// animation of intro comming after outro
IntroOutro.endAnim = function(howMany, tot, first) {
  if (first && this.introRunning) return;
  if (first) { 
    playSound('introSong');
    this.introRunning = 1;
    this.introMask.setAttributeNS(null, "fill", "black");
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
    audio.reset();
  }
  if ((tot==-1) && (howMany<=.2)) return this.end();

  howMany += tot*.1;
  this.introMask.setAttributeNS(null, "fill-opacity", howMany);
  if((tot==1) && (howMany>=.9)) {
    tot = -1; 
    this.endScreen.setAttributeNS(null, "visibility", "visible");
    this.introMask.setAttributeNS(null, "stroke", "#000");
  }
  window.setTimeout("IntroOutro.endAnimDest("+howMany+","+tot+",0)", 40);
}

// method invoking getting of high-scoe list
IntroOutro.getHighScore = function(playerName) {
  var hof = {"hof":[{"name":"Marek","score":"300"},{"name":"Janca","score":"200"},{"name":"Mnouk","score":"100"}]}
  if (localStorage) {
    if (localStorage.hallOfFame) {
      hof = JSON.parse(localStorage.hallOfFame);
    }
    if (playerName) {
      if (playerName.length > 14) playerName = playerName.substring(0, 15);
      hof.hof.push({"name":playerName,"score":score});
    }
    localStorage.hallOfFame = JSON.stringify(hof);
  }
  this.showHighScore(hof.hof);
}

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

// method showing high score table
IntroOutro.showHighScore = function(scores) {
  var fame = svgDocument.getElementById('hallOfFame');
  while (fame.hasChildNodes()) fame.removeChild(fame.firstChild);
  // resort score
  scores.sort(function (a, b) {
    if (1*a.score > 1*b.score)
      return -1;
    if (1*a.score < 1*b.score)
      return 1;
    // a must be equal to b
    return 0;
  });

  var topTen = (scores.length>13) ? 13 : scores.length;
  var total = 0;
  while (total < topTen) {
    var sc = scores.shift();
    // create text span
    var fameSpan = svgDocument.createElementNS(Basics.svgns, "tspan");
    fameSpan.setAttributeNS(null, "x", 48); fameSpan.setAttributeNS(null, "dx", 0);
    fameSpan.setAttributeNS(null, "dy", 16); fameSpan.appendChild(document.createTextNode(sc.score));
    fame.appendChild(fameSpan);
    fameSpan = svgDocument.createElementNS(Basics.svgns, "tspan");
    fameSpan.setAttributeNS(null, "x", 48); fameSpan.setAttributeNS(null, "dx", 40);
    fameSpan.setAttributeNS(null, "dy", 0); fameSpan.appendChild(document.createTextNode('................... '+ sc.name));
    fame.appendChild(fameSpan);
    total++;
  }
  message('Acquiring and showing up high-score list completed...');
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


/* ****************************************************************************
   **************************** Audio manager *******************************
   *****************************************************************************
*/
function AudioMan () { // constructor
  this.enabled = 1; // flag, on/off whether sound is enabled
  try {
    var test = new Audio();
    this.type = (test.canPlayType && test.canPlayType("audio/wav")) ? ".wav" : ".mp3";
  } catch (e) {
    this.enabled = 0; // for browsers not supporting it yet
    this.type = "";
  }
  this.dirPrefix = "sounds/";
  this.audios = new Array();
  this.sounds = new Array();

  this.sounds["background"] = "background";
  this.sounds["introSong"] = "ocean";
  this.sounds["uboatCrash"] = "uboatcrash";
  this.sounds["enemyCrash"] = "enemycrash1";
  this.sounds["torpedoFire"] = "torpedo";
  this.sounds["enemyFire1"] = "enemyfire1";
  this.sounds["enemyFire2"] = "enemyfire2";
  this.sounds["enemyAlert"] = "enemyalert";
  this.sounds["notAvail"] = "notavail";
  this.sounds["gotBonus"] = "bonus";

  // do some preload
  for (var i in this.sounds) {
    var a = new Audio(this.dirPrefix + this.sounds[i] + this.type);
    a.setAttribute("preload", "auto");
  }
}

// method for playing audio sound by given id
AudioMan.prototype.play = function (what, loop) {
  if (!this.enabled || !this.type) return;
  var x = new Audio(this.dirPrefix + this.sounds[what] + this.type);
  if (loop) x.setAttribute("loop", "loop");
  this.audios.push(x);
  x.play();
}

// reset method
AudioMan.prototype.reset = function () {
  for (var i in this.audios) {
    try {
      this.audios[i].pause();
    } catch (e) {
      try {
        this.audios[i].stop();  // try Opera
      } catch (e) {
        // do nothing
      }
    }
  }
  this.audios = new Array();
}

var audio = new AudioMan();
