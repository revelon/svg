/* ****************************************************************************
   **************************** Audio manager *******************************
   *****************************************************************************
*/
function AudioMan () { // constructor
  this.enabled = 1; // flag, on/off whether sound is enabled
  this.embeds = new Array(); // references for faster acces to the page embedded sounds
  try {
    var test = new Audio("");
    this.type = (test.canPlayType && test.canPlayType("audio/ogg")) ? ".ogg" : ".wav";
  } catch (e) {
    this.enabled = 0; // for browsers not supporting it yet
    this.type = "";
  }
  this.dirPrefix = "sounds/";
  this.audios = new Array();
  this.sounds = new Array();
  this.sounds["end"] = "end";
  this.sounds["music"] = "picking3";
  this.sounds["innough"] = "wow";
  this.sounds["ugh4"] = "ugh4";
  this.sounds["ugh3"] = "ugh3";
  this.sounds["ugh2"] = "ugh2";
  this.sounds["ugh1"] = "ugh1";
  this.sounds["gun_reload"] = "reload";
  this.sounds["ugh5"] = "innough";
  this.sounds["haha"] = "haha";
  this.sounds["gunIsEmpty"] = "empty";
  this.sounds["creak"] = "creak";
  this.sounds["gun_fire_enemy"] = "coltb";
  this.sounds["gun_fire"] = "colt";
  this.sounds["catbird"] = "catbird";
  this.sounds["babkaugh"] = "babka01";

  if (this.type == ".ogg") { // prepare them for faster access
    for (var i in this.sounds) this.embeds[i] = document.getElementById(i);
  }
}
  
// method for playing audio sound by given id
AudioMan.prototype.play = function (what) {
  if (!this.enabled || !this.type) return;
  if (this.type == ".ogg") {
    if (!this.embeds[what]) alert(what);
    return this.embeds[what].play();
  }
  // Opera case
  var x = new Audio(this.dirPrefix + this.sounds[what] + this.type);
  this.audios.push(x);
  x.play();
}

// reset method
AudioMan.prototype.reset = function () {
  for (var i in this.embeds) this.embeds[i].pause();

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

var AudioMan = new AudioMan();
