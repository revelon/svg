/* ***************************************************************************
   ****************** SVG Cavern Fighter by Marek Raida *****************
   ****************************************************************************
*/

// couple of globals
var Game, Fighter, Cave, ViewPort, Util, Objects, GameStartTime, AudioMan; // global singletons

/* ***************************************************************************
   *************************** Generic Util object ***************************
   ****************************************************************************
*/
function Util () { // constructor
  this.svgns = "http://www.w3.org/2000/svg"; // common namespace
  this.xlinkns = "http://www.w3.org/1999/xlink"; // another common namespace
  this.msg = document.getElementById("message").firstChild; // messages DOM holder
  this.messages = new Array();
  this.debug = 0;  // flag whether debug messaging in allowed or not
}

// compute real BBox, with applied transformation changes to get real screen pixels
Util.prototype.getComputedBBox = function (obj) {
  var ibb = obj.getBBox();
  var ictm = obj.getCTM();
  return {x:(ibb.x+ictm.e), y:(ibb.y+ictm.f), width:(ibb.width), height:(ibb.height)};
}

// identify collision generic method working with precomputed visible screen BBoxes of pair of elements
Util.prototype.isCollision = function (bb1, bb2) {
            // test x axis
  if ( (((bb1.x>=bb2.x) && (bb1.x<=(bb2.x+bb2.width))) || 
       (((bb1.x+bb1.width)>=bb2.x) && ((bb1.x+bb1.width)<=(bb2.x+bb2.width))) || 
       ((bb2.x>=bb1.x) && (bb2.x<=(bb1.x+bb1.width))) || 
       (((bb2.x+bb2.width)>=bb1.x) && ((bb2.x+bb2.width)<=(bb1.x+bb1.width))) 
       ) && // test y axis
       (((bb1.y>=bb2.y) && (bb1.y<=(bb2.y+bb2.height))) || 
       (((bb1.y+bb1.height)>=bb2.y) && ((bb1.y+bb1.height)<=(bb2.y+bb2.height))) || 
       ((bb2.y>=bb1.y) && (bb2.y<=(bb1.y+bb1.height))) || 
       (((bb2.y+bb2.height)>=bb1.y) && ((bb2.y+bb2.height)<=(bb1.y+bb1.height))) 
       ) 
     ) return true;
  return false;
}

// identify collision generic method working with precomputed visible screen BBoxes of pair of elements
Util.prototype.message = function (key, msg) {
  if (!this.debug) return;
  this.messages[key] = msg;
  var out = "";
  for (var i in this.messages) out += i +":" + this.messages[i] + " | ";
  this.msg.data = out;
}




/* ****************************************************************************
   ******************************* Game object ********************************
   ****************************************************************************
*/
function Game () { // constructor
  this.level = 0; // current level
  this.state = "menu"; // state of game running or in other state
  this.debug = 0;  // flag whether debug messaging in allowed or not
  this.scoreInfo = document.getElementById("scoreInfo").firstChild;
  this.shieldInfo = document.getElementById("shieldInfo").firstChild;
  this.levelInfo =  document.getElementById("levelInfo").firstChild;
  this.shieldBar = document.getElementById("shieldBar");
  this.shieldMax = 150; // 1.5* default
  this.fuelInfo = document.getElementById("fuelInfo").firstChild;
  this.fuelBar = document.getElementById("fuelBar");
  this.ammoBar = document.getElementById("ammoBar");
  this.fuelWarning = null;
  this.fuelWarningThreshold = 100;
  this.shieldWarning = null;
  this.shieldWarningThreshold = 50;
  this.ammoWarning = null;
  this.fuelMax = 300; // 1.5* default
  this.ammoInfo = document.getElementById("ammoInfo").firstChild;
  this.modalScreen = document.getElementById("modalScreen");
  this.modalScreenText = document.getElementById("modalScreenText").firstChild;
  this.modalScreenSubText = document.getElementById("modalScreenSubText").firstChild;
  this.modalScreenLink = document.getElementById("modalScreenLink");
  this.modalScreenLinkText = document.getElementById("modalScreenLinkText").firstChild;
  this.showMarkerOnObjects = 1;
  this.decorations = 1;
}

// modifyModalSscreen
Game.prototype.setModalScreen = function (action) {
  this.state = action;
  Util.message("GameState", this.state);
  Fighter.resetForceShield();
  if (action == "menu") {
    Cave.reset();
    Fighter.setVisualState("normal");
    this.modalScreenText.data = "SVG CAVERN FIGHTER";
    this.modalScreenSubText.data = "*** by Marek Raida ***";
    this.modalScreenLinkText.data = "START GAME";
    this.modalScreenLink.setAttributeNS(Util.xlinkns, "href", "javascript:Game.levelStart(true)");
    this.modalScreen.setAttributeNS(null, "display", "inherit");
    CreditsManager.getHighScore();
    AudioMan.play("gong");
  } else if (action == "level") {
    this.modalScreenText.data = "LEVEL "+ this.level +" COMPLETED";
    Fighter.score += Fighter.shield + Fighter.fuel; 
    this.modalScreenSubText.data = "Shield " + Fighter.shield + " + Fuel " + Fighter.fuel + " = Score " + Fighter.score;
    this.modalScreenLinkText.data = "CONTINUE";
    this.modalScreenLink.setAttributeNS(Util.xlinkns, "href", "javascript:Game.levelStart()");
    this.modalScreen.setAttributeNS(null, "display", "inherit");
  } else if (action == "end") {
    this.modalScreenText.data = "GAME OVER" + ((Fighter.fuel<=0) ? ", OUT OF FUEL" : ((Fighter.shield<=0) ? ", OUT OF SHIELD" : ""));
    this.modalScreenSubText.data = "Your score is " + Fighter.score + " points, level " + this.level;
    this.modalScreenLinkText.data = "MENU";
    this.modalScreenLink.setAttributeNS(Util.xlinkns, "href", "javascript:Game.setModalScreen('menu')");
    this.modalScreen.setAttributeNS(null, "display", "inherit");
  } else if (action == "running") {
    this.modalScreen.setAttributeNS(null, "display", "none");
  }
}

// begin everything/level
Game.prototype.levelStart = function (gameStart) {
  if (this.state == "running") return;
  if (gameStart) {
    this.level = 0; // reset fighter also!!
    this.setAnimations(0);
  }
  Util.message("level", this.level++);
  Cave.reset();
  ViewPort.reset();
  AudioMan.reset();
  Cave.generateCave();
  Fighter.setListeners(true);
  Fighter.reset(gameStart);
  AudioMan.play("startx");
  this.setModalScreen("running");
  window.setTimeout('AudioMan.play("music")', 2000);
}

// end level
Game.prototype.levelStop = function () {
  Fighter.setListeners(false);
  Fighter.resetForceShield();
  this.setModalScreen("level");  
  this.showStats();
  AudioMan.reset();
  AudioMan.play("level");
  this.state = "level"; // workaround
  this.showStats();
}

// end game
Game.prototype.finish = function (byEscape) {
  Fighter.setListeners(false);
  Fighter.resetForceShield();
  this.showStats();
  Fighter.setVisualState("crash");
  this.setModalScreen("end");
  this.setAnimations(1);
  AudioMan.reset();
  AudioMan.play("crash4");
  this.showStats();
  if (!byEscape && (Fighter.score > 200)) window.setTimeout(CreditsManager.writeDown, 500);   // give player chance to enter hall of fame, with little delay only
}

// method for rendering game statistics
Game.prototype.showStats = function () {
  if (Fighter.shieldOrg) { // force shield exception
    this.shieldBar.setAttributeNS(null, "width", 200); // draw percent bar for extra shield
  } else {
    if (Fighter.shield > this.shieldMax) Fighter.shield = this.shieldMax;
    this.shieldBar.setAttributeNS(null, "width", Math.ceil((Fighter.shield/this.shieldMax)*200)); // draw percent bar for shield
  }
  if (Fighter.fuel > this.fuelMax) Fighter.fuel = this.fuelMax;
  this.fuelBar.setAttributeNS(null, "width", Math.ceil((Fighter.fuel/this.fuelMax)*200)); // draw percent bar for fuel
  this.shieldInfo.data = "SHIELD: " + Fighter.shield;
  this.fuelInfo.data = "FUEL: " + Fighter.fuel--;
  this.scoreInfo.data = "SCORE: " + Fighter.score++;
  this.ammoInfo.data = "AMMO: " + Fighter.ammo;
  this.levelInfo.data = "LEVEL: " + this.level;
  if ((Fighter.fuel < this.fuelWarningThreshold) && !this.fuelWarning) { // make nice visual representation of fuel running out
    this.fuelWarning = this.getWarningAnimation();
    this.fuelBar.appendChild(this.fuelWarning);
    AudioMan.play("alarm");
  } else if ((Fighter.fuel > this.fuelWarningThreshold) && this.fuelWarning) {
    this.fuelBar.removeChild(this.fuelWarning);
    this.fuelWarning = null;
  }
  if ((Fighter.shield < this.shieldWarningThreshold) && !this.shieldWarning) { // make nice visual representation of low shiel
    this.shieldWarning = this.getWarningAnimation();
    this.shieldBar.appendChild(this.shieldWarning);
    AudioMan.play("alarm2");
  } else if ((Fighter.shield > this.shieldWarningThreshold) && this.shieldWarning) {
    this.shieldBar.removeChild(this.shieldWarning);
    this.shieldWarning = null;
  }
  if (!Fighter.ammo && !this.ammoWarning) { // make nice visual representation of no ammo
    this.ammoWarning = this.getWarningAnimation();
    this.ammoBar.appendChild(this.ammoWarning);
    AudioMan.play("alarm2");
  } else if (Fighter.ammo && this.ammoWarning) {
    this.ammoBar.removeChild(this.ammoWarning);
    this.ammoWarning = null;
  }
}

// method for preparing waring animation
Game.prototype.getWarningAnimation = function () {
  var ani = document.createElementNS(Util.svgns, "animate");
  ani.setAttributeNS(null, "attributeName", "stroke-width");
  ani.setAttributeNS(null, "calcMode", "discrete");
  ani.setAttributeNS(null, "dur", "0.5s");
  ani.setAttributeNS(null, "repeatCount", "indefinite");
  ani.setAttributeNS(null, "values", "2; 8");
  ani.setAttributeNS(null, "begin", "0s");
  return ani;
}

// switch marker support
Game.prototype.markerSwitcher = function (elem) {
  if (!this.showMarkerOnObjects) {
    this.showMarkerOnObjects = 1;
    elem.setAttributeNS(null, "fill", "lightgreen");
  } else {
    this.showMarkerOnObjects = 0;
    elem.setAttributeNS(null, "fill", "red");
  }
}

// switch on/off debugging options
Game.prototype.debugSwitcher = function (elem) {
  if (!this.debug) {
    this.debug = 1;
    Util.debug = 1;
    elem.setAttributeNS(null, "fill", "lightgreen");
  } else {
    this.debug = 0;
    Util.debug = 0;
    elem.setAttributeNS(null, "fill", "red");
  }
}

// switch on/off decorations options
Game.prototype.decorationsSwitcher = function (elem) {
  if (!this.decorations) {
    this.decorations = 1;
    elem.setAttributeNS(null, "fill", "lightgreen");
    this.setAnimations(1);
  } else {
    this.decorations = 0;
    elem.setAttributeNS(null, "fill", "red");
    this.setAnimations(0);
  }
}

// switch on/off title animations options
Game.prototype.setAnimations = function (how) {
  //(!how) ? document.documentElement.pauseAnimations() : document.documentElement.unpauseAnimations();
  var anims = document.getElementsByTagName("animate");
  if (!anims[0].beginElement) return; // for browsers without SMIL support
  for (var i = 0; i < anims.length; i++){
    if (how) anims[i].beginElement();
    else anims[i].endElement();
  }
  var anims = document.getElementsByTagName("animateTransform");
  for (var i = 0; i < anims.length; i++){
    if (how) anims[i].beginElement();
    else anims[i].endElement();
  }
}




/* ****************************************************************************
   ************************** Cave/environment object *************************
   ****************************************************************************
*/
function Cave () { // constructor
  this.envBoxWidth = 22; // width of one rectangle creating cave shape
  this.cave = document.getElementById("cave");  // cave itself in dom
  this.caveWalls = document.getElementById("caveWalls");  // cave floor and ceiling
  this.environment = document.getElementById("environment");  // element of cave where are all collision detection boxes stored
  this.bcgDecors = document.getElementById("bcgDecors");  // cave background decorations
  this.caveColors = null; // pair od cave color information
  this.caveTop = 30;  // upper level used for generation
  this.caveBottom = 490; // lower level used for generation
  this.tunnelMinSize = 110; // minimal allowed tunnel size
  this.tunnelVarSize = 30; // variable tunnel size
  this.pieces = 0; // how many pieces of steps in horizontal axis is representing cave
  this.realPiecesMax = 0; // pieces*2
  this.objects = document.getElementById("objects");  // game objects in DOM
  this.crashes = document.getElementById("crashes");  // game crashes in DOM
  this.objectsRefs = new Array();  // array of object references
  this.initialThreshold = 10; // how long should be cave user friendly straight from both beginning and end
}

// reset method
Cave.prototype.reset = function () {
  this.tunnelMinSize = 110;
  this.objectsRefs = new Array();
  while (this.environment.hasChildNodes()) this.environment.removeChild(this.environment.firstChild);
  while (this.crashes.hasChildNodes()) this.crashes.removeChild(this.crashes.firstChild);
  while (this.objects.hasChildNodes()) this.objects.removeChild(this.objects.firstChild);
  while (this.caveWalls.hasChildNodes()) this.caveWalls.removeChild(this.caveWalls.firstChild);
  while (this.bcgDecors.hasChildNodes()) this.bcgDecors.removeChild(this.bcgDecors.firstChild);
  var fin = document.getElementById("finishLine")
  fin.setAttributeNS(null, "display", "none");
  this.caveColors = null;
}

// modify randomly cave color
Cave.prototype.setCaveColor = function (pair) {
  if (!pair && !this.caveColors) {
    var colors = new Array({c1:"beige",c2:"brown"}, {c1:"lightgreen",c2:"darkgreen"}, {c1:"lightblue",c2:"navy"}, {c1:"pink",c2:"magenta"}, {c1:"yellow",c2:"red"})
    pair = colors[Math.round(Math.random() * (colors.length-1))];
    this.caveColors = pair;
  } else if (!pair && this.caveColors) {
    pair = this.caveColors;
  }
  document.getElementById("ceilOffset1").setAttributeNS(null, "stop-color", pair.c1);
  document.getElementById("ceilOffset2").setAttributeNS(null, "stop-color", pair.c2);
  document.getElementById("floorOffset2").setAttributeNS(null, "stop-color", pair.c1);
  document.getElementById("floorOffset1").setAttributeNS(null, "stop-color", pair.c2);
}

// cave generation
Cave.prototype.generateCave = function () {
  var y = 200; // current generation y position, initial point
  var polyCorrecture = 3; // pixels, how much should polygons oversize bouncing boxes
  var polyTop = "0,0 "; // point values of visual cave ceiling representation
  var polyBottom = "0,"+this.caveBottom+" "; // point values of visual cave ceiling representation
  var direction = 1; // direction indicates whether generate up (1) or down (-1), but never straight
  var dirCountDown = 0; // how long hold direction count (0-5)
  var justGenerated = 0;
  this.pieces = Game.level*40;
  this.tunnelMinSize -= (Game.level*2);
  this.realPiecesMax = (this.pieces*2);
  
  Fighter.setShipToCoordinates(100, (y + this.tunnelMinSize/2)); // set initial fighters position to be in tunnel

  for (var x = 0; x < this.pieces; x++) {
    var varHeight = (Math.round(Math.random()*this.tunnelVarSize)); // random height of tunnel
    if (dirCountDown < 1) {
      direction = (Math.random()>.5) ? -1 : 1;
      dirCountDown = 1 + Math.round(Math.random()*4);
      justGenerated = 1;
    } else justGenerated = 0;

    if ((x > this.initialThreshold) && (x < (this.pieces - this.initialThreshold))) { // assure friendly cave beginning/ending
      y = y + (direction * varHeight);
    }
      
    if (y > this.caveBottom-(this.tunnelMinSize+this.tunnelVarSize)) {
      y = this.caveBottom-(this.tunnelMinSize+this.tunnelVarSize);
      dirCountDown = 0;
    }
    if (y < this.caveTop) {
      y = this.caveTop;
      dirCountDown = 0;
    }

    this.setCaveColor(null);

    // generate objects to the cave
    if ( x && ((x % 36) == 0) && (x < (this.pieces - this.initialThreshold)) ) { // generate fuel every 36 pieces
    	 this.generateObject(x, y, varHeight, 0);
    } else if ((x>this.initialThreshold) && (x < (this.pieces - this.initialThreshold)) && (!justGenerated) && 
      (!this.objectsRefs[(this.objectsRefs.length-2)]) && (Math.random()>.6) ) {
      this.generateObject(x, y, varHeight, null);
    } else if ((Game.level > 1) && (x == (this.pieces - this.initialThreshold + 1))) {
      this.generateObject(x, y, varHeight, (ObjectTypes.length-1)); // boss, hard one temporarily, !!!!
    } else {
      this.generateDecoration(x, y, varHeight);
      this.objectsRefs.push(null,null); // empty placeholders
    }

    polyTop += (x*this.envBoxWidth+(this.envBoxWidth/2)) + "," + (y+polyCorrecture) + " ";
    polyBottom += (x*this.envBoxWidth+(this.envBoxWidth/2)) + "," + (y+varHeight+this.tunnelMinSize-polyCorrecture) + " ";


    // ceiling, object used for collision detection
    var rec = document.createElementNS(Util.svgns, "rect");
    rec.setAttributeNS(null, "x", x*this.envBoxWidth);
    rec.setAttributeNS(null, "y", 0);
    rec.setAttributeNS(null, "width", this.envBoxWidth);
    rec.setAttributeNS(null, "height", y);
    rec.setAttributeNS(null, "visibility", Game.debug ? "visible" : "hidden");
    rec.setAttributeNS(null, "fill", Game.debug ? "blue" : "none");
    this.environment.appendChild(rec);
    
    // floor, object used for collision detection
    var rec = document.createElementNS(Util.svgns, "rect");
    rec.setAttributeNS(null, "x", x*this.envBoxWidth);
    rec.setAttributeNS(null, "y", y+varHeight+this.tunnelMinSize);
    rec.setAttributeNS(null, "width", this.envBoxWidth);
    rec.setAttributeNS(null, "height",  this.caveBottom-y-varHeight-this.tunnelMinSize);
    rec.setAttributeNS(null, "visibility", Game.debug ? "visible" : "hidden");
    rec.setAttributeNS(null, "fill", Game.debug ? "blue" : "none");
    this.environment.appendChild(rec);
    
    dirCountDown--; // decrement direction countdown generation repetition times
  }
  Util.message("objectsCount", Cave.objects.childNodes.length);

  polyTop += this.pieces*this.envBoxWidth + ",0";
  polyBottom += this.pieces*this.envBoxWidth + "," + this.caveBottom;
  
  // ceiling, visual representation
  var ceilingHolder = document.createElementNS(Util.svgns, "polyline");
  ceilingHolder.setAttributeNS(null, "fill", (Game.debug ? "brown" : "url(#ceiling)"));
  if (Game.debug) ceilingHolder.setAttributeNS(null, "opacity", .5);
  ceilingHolder.setAttributeNS(null, "points", polyTop);
  this.caveWalls.appendChild(ceilingHolder);
  
  // floor, visual representation
  var floorHolder = document.createElementNS(Util.svgns, "polyline");
  floorHolder.setAttributeNS(null, "fill", (Game.debug ? "brown" : "url(#floor)"));
  if (Game.debug) floorHolder.setAttributeNS(null, "opacity", .5);
  floorHolder.setAttributeNS(null, "points", polyBottom);
  this.caveWalls.appendChild(floorHolder);

  // do finish flags movement
  var fin = document.getElementById("finishLine")
  fin.setAttributeNS(null, "transform", "translate(" + (this.pieces*this.envBoxWidth) + ", " + y + ")");
  fin.setAttributeNS(null, "display", "inherit");
}


// cave background decoration
Cave.prototype.generateDecoration = function (x, y, varHeight) {
  if (!Game.decorations) return;
  var decorColors = new Array("yellow", "gray", "cyan", "blue", "gold", "green", "pink");
  var size = 1 + Math.round(Math.random());
  var rec = document.createElementNS(Util.svgns, "rect");
  rec.setAttributeNS(null, "x", x*this.envBoxWidth + Math.round(Math.random()*this.envBoxWidth));
  rec.setAttributeNS(null, "y", (y+(Math.random()*(this.tunnelMinSize+varHeight))));
  rec.setAttributeNS(null, "width", size);
  rec.setAttributeNS(null, "height", size);
  rec.setAttributeNS(null, "fill", decorColors[Math.round(Math.random()*(decorColors.length-1))]);
  this.bcgDecors.appendChild(rec);

  var caveDecor = (Math.random()*10);
  var size = Math.round(Math.random()*20);
  if (size < 4) size = 4;
  var rec = document.createElementNS(Util.svgns, "circle");
  rec.setAttributeNS(null, "cx", x*this.envBoxWidth + Math.round(Math.random()*this.envBoxWidth));
  rec.setAttributeNS(null, "r", size);
  var decFill = Math.round(Math.random()*10);
  rec.setAttributeNS(null, "fill", (decFill < 9 ) ? "black" : ((decFill == 9) ? "#080808" : "#111") ); // random decoration colors
  
  if (caveDecor < 2) {                        // temporary hack, should not be this.crashes, but works anyway...
    var ty = Math.round(Math.random()*y);
    if ((ty-size) <= this.caveTop) {
      ty = this.caveTop + size + 2;
      rec.setAttributeNS(null, "r", Math.ceil(size/2));
    } else if ((ty+size) >= y) {
      ty = y - size - 2;
      rec.setAttributeNS(null, "r", Math.ceil(size/2));
    }
    rec.setAttributeNS(null, "cy", ty);
    this.crashes.appendChild(rec);
  } else if (caveDecor > 8) {
    var bottom = this.tunnelMinSize + varHeight + y;
    var ty = bottom + Math.round(Math.random()*(this.caveBottom - bottom));
    if ((ty+size) >= this.caveBottom) {
      ty = this.caveBottom - size - 2;
      rec.setAttributeNS(null, "r", Math.ceil(size/2));
    } else if ((ty-size) <= bottom) {
      ty = bottom + size + 2;
      rec.setAttributeNS(null, "r", Math.ceil(size/2));
    }
    rec.setAttributeNS(null, "cy", ty);
    this.crashes.appendChild(rec);
  } else {
    // do nothing
  }
}

// cave movable/static object generation
Cave.prototype.generateObject = function (x, y, varHeight, oid) {
  var objType = (oid == null) ? Math.round(Math.random()*(ObjectTypes.length-2)) : oid;   //   -1  implicit, -2 = one boss, -3 = two bosses etc.
  var movable = (Math.random()>ObjectTypes[objType].moveThreshold); // variable chance of movable object
  var reversedCoef = (ObjectTypes[objType].reversed) ? -1 : 1;
  
  var initX = x*this.envBoxWidth;
  var initY = (ObjectTypes[objType].reversed) ? y : y-ObjectTypes[objType].height+this.tunnelMinSize+varHeight;
  initY -= reversedCoef * 2; // default correcture

  var rec = document.getElementById(ObjectTypes[objType].element).firstChild.cloneNode(true);
  rec.setAttributeNS(null, "objType", objType);
  rec.setAttributeNS(null, "transform", "translate("+initX+","+initY+")");
  if (ObjectTypes[objType].shieldPoints) {  // boss points special treatment
    rec.setAttributeNS(null, "shieldPoints", ObjectTypes[objType].shieldPoints+((Game.level-1)*10));
  }
  if (movable) { 
    var ani = document.createElementNS(Util.svgns, "animateTransform");
    ani.setAttributeNS(null, "attributeName", "transform");
    ani.setAttributeNS(null, "type", "translate");
    ani.setAttributeNS(null, "dur", "" + ObjectTypes[objType].speed + "s");
    ani.setAttributeNS(null, "repeatCount", "indefinite");
    if (ObjectTypes[objType].destroyable) {
      ani.setAttributeNS(null, "values", ""+initX+","+initY+";"+initX+","+(initY+(ObjectTypes[objType].height*reversedCoef)-((this.tunnelMinSize+varHeight)*reversedCoef))+";"+initX+","+initY);
    } else { // this is patch for WebKit case and Bolt, to move initial position from path...
      initY = initY+(ObjectTypes[objType].height*reversedCoef)-((this.tunnelMinSize+varHeight)*reversedCoef);
      rec.setAttributeNS(null, "transform", "translate("+initX+","+initY+")");
      ani.setAttributeNS(null, "values", ""+initX+","+initY+";"+initX+","+(initY-(ObjectTypes[objType].height*reversedCoef)+((this.tunnelMinSize+varHeight)*reversedCoef))+";"+initX+","+initY);
    }
    ani.setAttributeNS(null, "begin", "" + (((new Date()) - GameStartTime) + (42 * x * 2)) + "ms");
    rec.appendChild(ani);
  }

  if (Game.showMarkerOnObjects) { // user friendly advisory option
    var marker = document.getElementById((ObjectTypes[objType].points>0)?"bonusMarker":"antiBonusMarker").cloneNode(true);
    if (ObjectTypes[objType].reversed) marker.setAttributeNS(null, "cy", 14);
    rec.appendChild(marker);
  }

  this.objects.appendChild(rec);
  this.objectsRefs.push(rec, null);
}

// remove object by given index
Cave.prototype.removeObjectByIndex = function (index) {
  Util.message("removingObject", index);
  Cave.objects.removeChild(this.objectsRefs[index]);
  this.objectsRefs[index] = null;
  Util.message("objectsCount", Cave.objects.childNodes.length);
}

// cave crash visuals
Cave.prototype.generateCrash = function (x, y, message, type, sound) {
  x += ViewPort.distance;
  var el = document.getElementById(type).firstChild.cloneNode(true);
  el.setAttributeNS(null, "transform", "translate("+x+","+y+")");
  el.firstChild.firstChild.data = "" + message;
  var ani = document.createElementNS(Util.svgns, "animateTransform");
  ani.setAttributeNS(null, "attributeName", "transform");
  ani.setAttributeNS(null, "type", "translate");
  ani.setAttributeNS(null, "dur", "1s");
  ani.setAttributeNS(null, "repeatCount", 1);
  ani.setAttributeNS(null, "values", ""+x+","+y+";"+(x-50)+","+(y-50));
  ani.setAttributeNS(null, "begin", "" + (new Date() - GameStartTime) + "ms");
  el.appendChild(ani);
  this.crashes.appendChild(el);
  AudioMan.play(sound);
  window.setTimeout(function() {if (el) Cave.crashes.removeChild(el)}, 900);
}





/* ****************************************************************************
   ************* Viewport object, for computing current visual window *********
   ****************************************************************************
*/
function ViewPort () { // constructor
  this.windowWidth = 0;
  this.windowHeight = 0;
  this.scrollStep = 2;  // by how much pixels scroll
  this.distance = 0;  // distance, already scrolled out
  this.leftOffset = 0;  // whole visible area viewport left offset of cave pieces*2
  this.rightOffset = 0;  // whole visible area viewport right offset of cave pieces*2
  this.piecesInView = 0;
  this.leftOffsetToShip = 0;  // fighter/ship related possible colission cave pieces*2 from left
  this.rightOffsetToShip = 0;  // fighter/ship related possible colission cave pieces*2 from right
  this.timeShiftHolder = null;
}

// reset everything
ViewPort.prototype.reset = function () {
  this.distance = 0;
  this.leftOffset = 0;
  this.scrollStep = 2;
  this.rightOffset = 0;
  this.piecesInView = 0;
  this.leftOffsetToShip = 0;
  this.rightOffsetToShip = 0;
  if (this.timeShiftHolder) window.clearTimeout(this.timeShiftHolder);
  this.timeShiftHolder = null;
}

// acquiring actual window size
ViewPort.prototype.getWindowSize = function () {
  if (typeof window.innerWidth != 'undefined') {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
     this.windowWidth = document.documentElement.clientWidth;
     this.windowHeight = document.documentElement.clientHeight;
  } else {
     this.windowWidth = document.getElementsByTagName('body')[0].clientWidth;
     this.windowHeight = document.getElementsByTagName('body')[0].clientHeight;
  }
  this.piecesInView = Math.ceil(this.windowWidth/Cave.envBoxWidth)*2;
}

// computing offset with which environment elements detect collisions to avoid unnecessary work/load/computing
ViewPort.prototype.computeOffset = function () {
  this.leftOffset = Math.floor(this.distance/Cave.envBoxWidth)*2; // how many pieces already scrolled out
  this.rightOffset = this.piecesInView + this.leftOffset; // how many compare
  if (this.rightOffset > Cave.realPiecesMax) this.rightOffset = Cave.realPiecesMax; // maximum

  this.leftOffsetToShip = Math.floor((this.distance+Fighter.BB.x)/Cave.envBoxWidth)*2;
  this.rightOffsetToShip = 2 + this.leftOffsetToShip + Math.ceil(Fighter.BB.width/Cave.envBoxWidth)*2;
  if (this.leftOffsetToShip >= (Cave.pieces - Cave.initialThreshold)) this.leftOffsetToShip = this.leftOffsetToShip - 2; // bosses corrections
  Util.message("ViewPort", "distance="+this.distance+ /*", leftOffset="+this.leftOffset+", rightOffset="+this.rightOffset+*/
                            ", leftOffsetToShip="+this.leftOffsetToShip+", rightOffsetToShip="+this.rightOffsetToShip);
}

// cave scrolling to the left
ViewPort.prototype.scroll = function () {
  this.distance += this.scrollStep;
  Cave.cave.setAttributeNS(null, "transform", "translate("+(-1*this.distance)+" 0)");
}

// starting positive or negative timeshift bonus
ViewPort.prototype.setTimeShift = function (negative) {
  if (negative) {
    this.scrollStep = 1;
    Cave.setCaveColor({c1:"#eee",c2:"#333"});
  } else {
    this.scrollStep = 3;
    Cave.setCaveColor({c1:"#333",c2:"#eee"});
  }
  if (this.timeShiftHolder) window.clearTimeout(this.timeShiftHolder);
  this.timeShiftHolder = window.setTimeout(function() {ViewPort.resetTimeShift();}, 6000);
}

// reset temporary timeshifting
ViewPort.prototype.resetTimeShift = function () {
  this.scrollStep = 2;
  Cave.setCaveColor(null);
  this.timeShiftHolder = null;
}






/* ****************************************************************************
   ************************** Fighter/ship object *****************************
   ****************************************************************************
*/
function Fighter () { // constructor
  this.dx = 0; // direction indicator for x axis
  this.dy = 0; // direction indicator for y axis
  this.movementIndex = 5; // common movement index/speed in pixels  
  this.score = 0; //
  this.shield = 100;
  this.shieldOrg = 0;
  this.forceShieldHolder = null; // timer holder for force shield
  this.fuel = 200;
  this.fighter = document.getElementById("fighter");
  this.fires = document.getElementById("fires");
  this.forceShield = document.getElementById("forceShieldDom");
  this.timer = null; // general timer for movement
  this.timerColl = null; // general timer for collisions
  var tmpBB = this.fighter.getBBox();
  this.BB = {x: tmpBB.x, y: tmpBB.y, width: tmpBB.width, height: tmpBB.height}; // store it for better performance
  this.states = {normal:"normal", crash:"crash", forward:"forward", backward:"backward"};
  this.state = "normal";
  this.missile = null; // missile element
  this.missileType = 1; // 1= missile, 2 = bomb
  this.missileTimer = null;
  this.ammo = 5; // ammunition counter
};

// keyboard evaluation during gameplay
Fighter.prototype.keyDown = function (evt) {
  //var c = (evt.keyCode) ? evt.keyCode : evt.charCode;
  switch(evt.keyCode) {
    case 37: // left
    case 63234:
      this.dx = -1; break;
    case 39: // right
    case 63235:
      this.dx = 1; break;
    case 40: // down
    case 63233:
      this.dy = 1; break;
    case 38: // up
    case 63232:
      this.dy = -1; break;
    case 32: // fire space or (Z)
    case 89: // CS keyboard variant
    case 90: // EN keyboard variant
      evt.preventDefault();
      if (Game.state == "running") this.fireMissile(0); 
      else if (Game.state == "menu") Game.levelStart(true);
      else if (Game.state == "level") Game.levelStart();
      break;
    case 88: // bomb (X)
    case 66: // bomb (B)
      if (Game.state == "running") this.fireMissile(1); break;
    case 27: // esc
      evt.preventDefault();
      if (Game.state == "running") Game.finish(true); 
      else Game.setModalScreen("menu");
      break;
    case 13: // enter
      evt.preventDefault();
      if (Game.state == "level") Game.levelStart();
      else if (Game.state == "menu") Game.levelStart(true);
      else if (Game.state == "end") {
        Fighter.resetForceShield();
        Game.setModalScreen("menu");
      }
      break;
  }
}

// keyboard evaluation during gameplay - reverse
Fighter.prototype.keyUp = function (evt) {
  switch(evt.keyCode) {
    case 37: // left
    case 63234:
    case 39: // right
    case 63235:
      this.dx = 0; break;
    case 40: // down
    case 63233:
    case 38: // up
    case 63232:
      this.dy = 0; break;
  }
}

// method throwing on/off fighter;s event listeners
Fighter.prototype.setListeners = function (toOn) {
  if (toOn) {
    // document.documentElement.addEventListener("keydown", function (evt) {Fighter.keyDown(evt);}, false);
    // document.documentElement.addEventListener("keyup", function (evt) {Fighter.keyUp(evt);}, false);
    this.timer = window.setInterval("Fighter.moveShip()", 35);
    this.timerColl = window.setInterval("Fighter.detectCollisions()", 116);
  } else {
    // document.documentElement.removeEventListener("keydown", function (evt) {Fighter.keyDown(evt);}, false);
    // document.documentElement.removeEventListener("keyup", function (evt) {Fighter.keyUp(evt);}, false);
    window.clearTimeout(this.timer);
    window.clearTimeout(this.timerColl);
    this.removeMissile();
    this.timer = this.timerColl = null;
  }
}

// method reseting timers wholly/partially between levels
Fighter.prototype.reset = function (totalReset) {
  this.fuel = 200;
  this.resetForceShield();
  this.shield = 100;
  this.shieldOrg = 0;
  this.ammo += 5; // ammo just increase
  this.missile = null;
  if (totalReset) {
    this.score = 0;
    this.state = "normal";
    this.ammo = 5;
  }
  this.removeMissile();
  this.setVisualState("normal");
  if (this.forceShieldHolder) window.clearTimeout(this.forceShieldHolder);
}

// starting force shield action
Fighter.prototype.setForceShield = function () {
  this.shieldOrg = this.shield;
  this.shield = 10000;
  this.forceShield.setAttributeNS(Util.xlinkns, "href", "#forceShieldVisual");
  if (this.forceShieldHolder) window.clearTimeout(this.forceShieldHolder);
  this.forceShieldHolder = window.setTimeout(function() {Fighter.resetForceShield();}, 4000);
}

// stopping force shieldaction
Fighter.prototype.resetForceShield = function () {
  this.shield = (this.shieldOrg) ? this.shieldOrg : 100;
  this.shieldOrg = 0;
  this.forceShieldHolder = null;
  this.forceShield.setAttributeNS(Util.xlinkns, "href", "#noForceShieldVisual");
}

// move fighter to given coordinates
Fighter.prototype.setShipToCoordinates = function (x, y) {
  this.BB.x = x;
  this.BB.y = y;
  this.fighter.setAttributeNS(null, "transform", "translate("+x+" "+y+")");
  this.fighter.setAttributeNS(null, "visibility", "visible");
}

// navigation of fighter through environment
Fighter.prototype.moveShip = function () {
  ViewPort.scroll();

  Util.message("directions", "dx="+this.dx+", dy="+this.dy + ", state=" + this.state);
  if (this.dx) {
    this.BB.x += (this.dx*this.movementIndex);
    if (this.BB.x > ViewPort.windowWidth-this.BB.width) this.BB.x = ViewPort.windowWidth-this.BB.width; // max correction
    if (this.BB.x < 0) this.BB.x = 0; // min correction
    this.fighter.setAttributeNS(null, "transform", "translate("+this.BB.x+" "+this.BB.y+")");
    this.setVisualState((this.dx==1) ? "forward" : "backward");
  } else {
    this.setVisualState("normal");
  }
  if (this.dy) { // dy
    this.BB.y += (this.dy*this.movementIndex);
    if (this.BB.y > Cave.caveBottom-this.BB.height) this.BB.y = Cave.caveBottom-this.BB.height; // max correction
    if (this.BB.y < 0) this.BB.y = 0; // min correction
    this.fighter.setAttributeNS(null, "transform", "translate("+this.BB.x+" "+this.BB.y+")");
  }
  Util.message("fighter", "x="+this.BB.x+", y="+this.BB.y);
  //if ((ViewPort.distance % 3) == 0) this.detectCollisions(); // detect collisons every third time of movement/scroll                                         // temporary move to separate time cycle
  if ((this.shield < 1) || (this.fuel < 1)) Game.finish(false);
  if (ViewPort.rightOffsetToShip >= Cave.realPiecesMax) Game.levelStop();
}

// method to set current visual fighter's implementation
Fighter.prototype.setVisualState = function (state) {
  if (this.state == state) return; // it is necessary to do nothing
  this.state = state;
  if (state == "forward") AudioMan.play("thrust");
  this.fighter.lastChild.setAttributeNS(Util.xlinkns, "href", "#" + state);
}

// detection of collisions between fighter and the cave environment
Fighter.prototype.detectCollisions = function () {
  ViewPort.computeOffset();
  Game.showStats();

  // offsets are there to minimize the number of comparations
  for (var i=ViewPort.leftOffsetToShip; i < ViewPort.rightOffsetToShip; i++) {
    if (Cave.objectsRefs[i] && Util.isCollision(this.BB, Util.getComputedBBox(Cave.objectsRefs[i]))) {
      var collisionType = ObjectTypes[Cave.objectsRefs[i].getAttributeNS(null, "objType")];
      if (collisionType.points<0) this.setVisualState("crash");
      Util.message("collision", "with object " + collisionType.element + " affects " + collisionType.type);
      Cave.generateCrash(this.BB.x, this.BB.y, collisionType.type + ((collisionType.points>0)?" +":" ") + collisionType.points, (collisionType.points>0)?"crashPositive":"crashNegative", collisionType.contactSound);
      Cave.removeObjectByIndex(i);
      Fighter[collisionType.type] += collisionType.points;
      if (collisionType.affectsTime) ViewPort.setTimeShift(1);  // start negative time scroll shift
      else if (collisionType.affectsForceShield) this.setForceShield();
      return true;
    }

    if ((i > 0) && Cave.environment.childNodes[i] && Util.isCollision(this.BB, Util.getComputedBBox(Cave.environment.childNodes[i]))) {
      this.setVisualState("crash");
      Cave.generateCrash(this.BB.x, this.BB.y, "shield -10" , "crashNegative", "crash3");
      Util.message("collision", "with cave");
      this.shield -= 10; // hard value
      return true;
    }
    
  }

  //this.setVisualState("normal");
  Util.message("collision", "none");
  return false;
}

// fire missile
Fighter.prototype.fireMissile = function (asBomb) {
  if (this.bomb || this.missile || !this.ammo) {
    AudioMan.play("nothing");
    return; // do nothing
  }
  if (asBomb) {
    var x = (this.BB.x + Math.floor(this.BB.width/2));
    var y = (this.BB.y + this.BB.height);
    this.missileType = 2;
    AudioMan.play("bomb");
  } else {
    var x = (this.BB.x + this.BB.width);
    var y = (this.BB.y + Math.floor(this.BB.height/2));
    this.missileType = 1;
    AudioMan.play("missile");
  }
  this.missile = document.createElementNS(Util.svgns, "rect");
  this.missile.setAttributeNS(null, "x", x);
  this.missile.setAttributeNS(null, "y", y);
  this.missile.setAttributeNS(null, "width", 4);
  this.missile.setAttributeNS(null, "height", 4);
  this.missile.setAttributeNS(null, "fill", "#dd3");
  this.fires.appendChild(this.missile);
  this.ammo--;
  this.missileTimer = window.setInterval( function() { Fighter.missileAnimate(); } , 26);
}

// missile animate
Fighter.prototype.missileAnimate = function () {
  if (this.missile) {
    var missBB = Util.getComputedBBox(this.missile);
    if (this.detectFireCollision(missBB)) return this.removeMissile(); // collision processed
    if (this.missileType == 2) { // bomb case
      this.missile.setAttributeNS(null, "y", (missBB.y+6));
      this.missile.setAttributeNS(null, "x", (missBB.x+1));
    } else {  // missile case
      this.missile.setAttributeNS(null, "x", (missBB.x+7));
    }
  } else {
    this.removeMissile();
  }
}

// remove missile from dom and delete references
Fighter.prototype.removeMissile = function () {
  if (this.missileTimer) {
    window.clearTimeout(this.missileTimer);
    this.missileTimer = null;
  }
  if (this.missile) {
    this.fires.removeChild(this.missile);
    this.missile = null;
  }
}

// detection of collision between fire and environment
Fighter.prototype.detectFireCollision = function (missBB) {
  var leftOffsetToMissile = Math.floor((ViewPort.distance+missBB.x)/Cave.envBoxWidth)*2;
  var addValue = 2;
  if (leftOffsetToMissile >= (Cave.pieces * 2)) {
    Fighter.removeMissile();
    return true;
  }
  if (leftOffsetToMissile >= (Cave.pieces - Cave.initialThreshold)) {  // bosses corrections
    leftOffsetToMissile = leftOffsetToMissile - 2;
    addValue = 4;
  }
  for (var i=leftOffsetToMissile; i < (leftOffsetToMissile+addValue); i++) {
    if (Cave.objectsRefs[i]) {
      if (Fighter.missile && Cave.objectsRefs[i] && Util.isCollision(missBB, Util.getComputedBBox(Cave.objectsRefs[i]))) {
        var objType = Cave.objectsRefs[i].getAttributeNS(null, "objType");
        Util.message("missileColl", objType);
        Fighter.removeMissile();
        if (ObjectTypes[objType] && ObjectTypes[objType].destroyable) {
          var normalProcess = true;
          if (ObjectTypes[objType].shieldPoints) {
            var lifePoints = 1 * Cave.objectsRefs[i].getAttributeNS(null, "shieldPoints");
            if ( (lifePoints - 10) > 0) {
              normalProcess = false;
              Cave.objectsRefs[i].setAttributeNS(null, "shieldPoints", (lifePoints - 10));
              Fighter.score += 10; // hiting boss for default value 10
              Cave.generateCrash(missBB.x, missBB.y, "points 10", "crashPositive", ObjectTypes[objType].shotSound);
            }
          }
          if (normalProcess) {
            if (ObjectTypes[objType].points < 0) { // enemy, always points up
              var hitPoints = 2 * Math.abs(ObjectTypes[objType].points);
              var tType = "score";
              var cType = "crashNegative";
              Fighter.score += hitPoints; // positive always
            } else { // positive object hit, add half points of the type
              var hitPoints = Math.ceil(0.5 * Math.abs(ObjectTypes[objType].points));
              var tType = ObjectTypes[objType].type;
              var cType = "crashPositive";
            }
            Fighter[tType] += hitPoints;
            Cave.removeObjectByIndex(i);
            Cave.generateCrash(missBB.x, missBB.y, "" + tType + " + " + hitPoints, cType, ObjectTypes[objType].shotSound);
            if (ObjectTypes[objType].affectsTime) ViewPort.setTimeShift(0);   // start positive time scroll shift
            else if (ObjectTypes[objType].affectsForceShield) this.setForceShield();
          }
        } else if (!ObjectTypes[objType].destroyable){
          AudioMan.play("nothing");
        }
        return true;
      }
    } else if (Cave.environment.childNodes[i] && Util.isCollision(missBB, Util.getComputedBBox(Cave.environment.childNodes[i]))) {
      Util.message("missileColl", "cave");
      AudioMan.play("nothing");
      Fighter.removeMissile();
      return true;
    } else {
      Util.message("missileColl", "nothing");
    }
  }
  return false;
}





/* ****************************************************************************
   **************************** Credits manager ******************************
   *****************************************************************************
*/
function CreditsManager () {}

// method for writing down player name
CreditsManager.prototype.writeDown = function() {
  var playerName = window.prompt("You have scored well, died because of " + (Fighter.fuel ? "fuel" : "shield") +", input your name, player...");
  if (playerName) CreditsManager.getHighScore(CreditsManager.urlEncode(playerName));
  Game.setModalScreen("menu");
}

// ajax method used for communication with server to obtain highscore list
CreditsManager.prototype.sendXmlHttpRequest = function(serve, methode, url, content, headers) {
  var xmlhttp = new XMLHttpRequest;
  xmlhttp.open(methode, url);
  xmlhttp.onreadystatechange = function() { serve(xmlhttp); };
  if (headers) for(var key in headers) xmlhttp.setRequestHeader(key, headers[key]);
  xmlhttp.send(content);
  return 1;
}

// method invoking getting of high-score list
CreditsManager.prototype.getHighScore = function(playerName) {
  var tmpAdr = "cavernscore.php" + ((playerName) ? ("?name="+playerName+"&score="+Fighter.score) : "");
  this.sendXmlHttpRequest(CreditsManager.showHighScore, "GET", tmpAdr);
}

// helper function used to sort high scores
CreditsManager.prototype.sortByInt = function(item1, item2) {
  return item2 - item1; 
}

// method called from ajax, real parsing of acquired data and putting them show
CreditsManager.prototype.showHighScore = function(xmlhttp) {
  var rows = new Array();
  var hallOfFame = new Array();
  if (xmlhttp.readyState != 4) var incomingData = "000#-|-#No data";
  else var incomingData = xmlhttp.responseText;
  rows = incomingData.split("\n");
  if (!rows.length) return;
  if (incomingData.indexOf("#-|-#")==-1) return;
  for (var i = 0; i < rows.length; i++) {
    if (rows[i]) hallOfFame[i] = rows[i].split("#-|-#");
  }
  var fame = document.getElementById('hallOfFame');
  while (fame.hasChildNodes()) fame.removeChild(fame.firstChild);
  // resort arrays
  var tmpArray = new Array();
  for (var i = hallOfFame.length-1; i>=0; i--) tmpArray[i] = hallOfFame[i][0];
  tmpArray.sort(CreditsManager.sortByInt);
  var topTen = (tmpArray.length>15) ? 15 : tmpArray.length;
  var total = 0;
  for (var y = 0; y < topTen; y++) {
    for (var i = 0; i < hallOfFame.length; i++) {
      if ((hallOfFame[i][0] == tmpArray[y]) && (total<topTen)) {
        // create text span
        var fameSpan = document.createElementNS(Util.svgns, "tspan");
        fameSpan.setAttributeNS(null, "x", "73%"); fameSpan.setAttributeNS(null, "dx", 0);
        fameSpan.setAttributeNS(null, "dy", 14); fameSpan.appendChild(document.createTextNode(hallOfFame[i][0]));
        fame.appendChild(fameSpan);
        fameSpan = document.createElementNS(Util.svgns, "tspan");
        fameSpan.setAttributeNS(null, "x", "73%"); fameSpan.setAttributeNS(null, "dx", 40);
        fameSpan.setAttributeNS(null, "dy", 0); fameSpan.appendChild(document.createTextNode('................... '+ hallOfFame[i][1]));
        fame.appendChild(fameSpan);
        hallOfFame[i][0] = -1; // some kind of reset
        total++;
      }
    }
  }
}

// helper function preventing some not-acceptable characters to be entered into highscore list
CreditsManager.prototype.urlEncode = function(plaintext) {
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





/* ****************************************************************************
   **************************** Audio manager *******************************
   *****************************************************************************
*/
function AudioMan () { // constructor
  this.enabled = 1; // flag, on/off whether sound is enabled
  try {
    if (new Audio("") == 'undefined') this.enabled = 0;
  } catch (e) {
    this.enabled = 0; // for browsers not supporting it yet
  }
  this.dirPrefix = "sounds/";
  this.audios = new Array();
  this.sounds = new Array();
  this.sounds["missile"] = "28917__junggle__btn107.wav";
  this.sounds["enemy"] = "51464__smcameron__bombexplosion.wav";
  this.sounds["bonus"] = "33244__ljudman__dingding.wav";
  this.sounds["crash"] = "73005__Benboncan__Blast.wav";
  this.sounds["alarm2"] = "39514__Syna_Max__alarm_of_d00m.wav";
  this.sounds["alarm"] = "usr_shield_med.wav";
  this.sounds["forceshield"] = "gravitation_segmental-min.wav";
  this.sounds["bomb"] = "5382__Jovica__Attack_Zound_02.wav";
  this.sounds["points"] = "bon_shield_min.wav";
  this.sounds["positiveShot"] = "3380__patchen__Rhino_05.wav";
  this.sounds["nothing"] = "4270__NoiseCollector__Chug.wav";
  this.sounds["crash2"] = "30935__aust_paul__possiblelazer.wav";
  this.sounds["positiveSound"] = "5211__fonogeno__drop02.wav";
  this.sounds["level"] = "4269__NoiseCollector__Ghammer.wav";
  this.sounds["crash3"] = "9628__NoiseCollector__PowerSnareVerb.wav";
  this.sounds["crash4"] = "49513__Jon285__405Win.wav";
  this.sounds["startx"] = "min_more_moves.wav";
  this.sounds["thrust"] = "5446__Jovica__Attack_Zound_69m.wav";
  this.sounds["gong"] = "hero_available_2min.wav";
  this.sounds["timeshift"] = "8611__hanstimm__tune606467712448.wav";
  this.sounds["music"] = "anxmin.ogg";
}
  
// method for playing audio sound by given id
AudioMan.prototype.play = function (what) {
  if (!this.enabled) return;
  var x = new Audio(this.dirPrefix + this.sounds[what]);
  this.audios.push(x);
  x.play();
}

// reset method
AudioMan.prototype.reset = function () {
  try {
    for (var i in this.audios) {
      this.audios[i].pause();
    }
  } catch (e) {
    // do nothing, probably Opera...
  }
  this.audios = new Array();
}

// prefetch all used sounds
AudioMan.prototype.prefetch = function () {
  for (var snd in this.sounds) {
    var x = new Audio(this.dirPrefix + this.sounds[snd]);
    this.audios.push(x);
    x.volume = 0;
    x.play();
  }
}

// switch sound support
AudioMan.prototype.switcher = function (elem) {
  if (!this.enabled) {
    this.enabled = 1;
    elem.setAttributeNS(null, "fill", "lightgreen");
  } else {
    this.enabled = 0;
    elem.setAttributeNS(null, "fill", "red");
  }
}






/* ****************************************************************************
   **************************** Configuration *********************************
   *****************************************************************************
   moveThreshold > 1 => always static, moveThreshold < 0 => always in motion
*/
ObjectTypes = new Array (
    {element:"fuel", type:"fuel", points: 80, destroyable:1, moveThreshold: .1, contactSound: "positiveSound", shotSound: "positiveShot", height: 20, speed: 4, reversed: 1},   // some fuel must be the first !! because of generating it regularly
    {element:"bomb", type:"shield", points: -20, destroyable:1, moveThreshold: .1, contactSound: "crash3", shotSound: "crash2", height: 20, speed: 3},
    {element:"shield", type:"shield", points: 20, destroyable:1, moveThreshold: .5, contactSound: "points", shotSound: "positiveShot", height: 20, speed: 4.5},
    {element:"bonus", type:"score", points: 50, destroyable:1, moveThreshold: .5, contactSound: "points", shotSound: "positiveShot", height: 20, speed: 5},
    {element:"bolt1", type:"shield", points: -30, destroyable:0, moveThreshold: -1, contactSound: "crash4", shotSound: "nothing", height: 20, speed: 4},
    {element:"bolt2", type:"shield", points: -30, destroyable:0, moveThreshold: -1, contactSound: "crash4", shotSound: "nothing", height: 20, speed: 3.4, reversed: 1},
    {element:"death", type:"shield", points: -40, destroyable:1, moveThreshold: -1, contactSound: "enemy", shotSound: "crash2", height: 20, speed: 3.5},
    {element:"ammo", type:"ammo", points: 6, destroyable:1, moveThreshold: .5, contactSound: "bonus", shotSound: "positiveShot", height: 20, speed: 5},
    {element:"coil", type:"shield", points: -30, destroyable:1, moveThreshold: 5, contactSound: "enemy", shotSound: "crash", height: 30, speed: 0},
    {element:"cistern", type:"fuel", points: 60, destroyable:1, moveThreshold: 5, contactSound: "positiveSound", shotSound: "positiveShot", height: 20, speed: 0},
    {element:"ufo", type:"shield", points: -30, destroyable:1, moveThreshold: -1, contactSound: "crash3", shotSound: "crash2", height: 20, speed: 2.5},
    {element:"hourglass", type:"score", points: 20, destroyable:1, moveThreshold: 5, contactSound: "timeshift", shotSound: "timeshift", reversed: 1, affectsTime: 1, height: 25, speed: 0},
    {element:"eye", type:"shield", points: -20, destroyable:1, moveThreshold: .6, contactSound: "crash3", shotSound: "crash2", reversed: 1, height: 20, speed: 3},
    {element:"icicle", type:"shield", points: -20, destroyable:1, moveThreshold: 5, contactSound: "crash", shotSound: "crash4", reversed: 1, height: 20, speed: 0},
    {element:"forceShield", type:"score", points: 1, destroyable:1, moveThreshold: -1, contactSound: "forceshield", shotSound: "forceshield", reversed: 1, height: 20, affectsForceShield: 1, speed: 3},

    // bosses should be the last ones, temporarily, and with known number
    {element:"boss", type:"shield", points: -80, destroyable:1, moveThreshold: -1, contactSound: "crash3", shotSound: "crash", shieldPoints: 20, height: 60, speed: 2.4}
                        );



/* ****************************************************************************
   **************************** Initialization *********************************
   ****************************************************************************
*/
// initialization
function init() {
  Util = new Util();
  Game = new Game();
  ViewPort = new ViewPort();
  Fighter = new Fighter();
  Cave = new Cave();
  ViewPort.getWindowSize();
  AudioMan = new AudioMan();
  CreditsManager = new CreditsManager();
  document.documentElement.addEventListener("keydown", function (evt) {Fighter.keyDown(evt);}, false);
  document.documentElement.addEventListener("keyup", function (evt) {Fighter.keyUp(evt);}, false);
  GameStartTime = new Date();
  window.resizeTo(920, 770);
  AudioMan.prefetch();
  Game.setModalScreen("menu");
}
init();

