/* ************************************************************************* */
/* *********************  GLOBAL VARIABLES START  ************************** */
/* ************************************************************************* */

    // namespaces prefixes
    var svgns = "http://www.w3.org/2000/svg";
    var xlinkns = "http://www.w3.org/1999/xlink";

    // flag if game is running
    var gameRunning = false;

    // flag if new game is allowed
    var newGameAllowed = true;

    // flag if game's quality option
    var quality = 0;

    // flag if game's music is allowed
    var music = true;

    // flag if game's masking is allowed
    var masks = true;

    // player's Name
    var playerName = 'NOBODY';

    // level indicator
    var level = 1;
    var levels = new Array (5000, 1700, 1600, 1500, 1300, 1100, 900, 700, 500);

    // active elements root
    var activeElements = null;

    // variable storing all bandits around - mainly for debug purposes
    var banditsCounter = 0;

    // variable storing all objects with bandits
    var bandits = new Array();

    // variable storing all objects with dying bandits
    var banditsKilled = new Array();

    // variable storing all one game history
    var historyx = new Array();

    // innocent objects
    var innocents = new Array();

    // innocent objects countdown
    var innoCountDown = null;

    // how many bullets in magazine are
    var bullets = 6;

    // game's score
    var score = 0;

    // players health
    var health = 100;

    // retranslations for special characters
    var abcConv = new Array();
        abcConv['space'] =  new Array();
        abcConv['space']['show'] = '';  // '_'
        abcConv['space']['do'] = ' ';
        abcConv['dot'] =  new Array();
        abcConv['dot']['show'] = '.';
        abcConv['dot']['do'] = '.';
        abcConv['delete'] =  new Array();
        abcConv['delete']['show'] = '';
        abcConv['delete']['do'] = '';
        abcConv['enter'] =  new Array();
        abcConv['enter']['show'] = '';
        abcConv['enter']['do'] = '';

/* ************************************************************************* */
/* **********************  GLOBAL VARIABLES END  *************************** */
/* ************************************************************************* */



/* ************************************************************************* */
/* *********************  FUNCTION SECTION START  ************************** */
/* ************************************************************************* */

    // zero ini
    function ini(evt){
        healthMask = document.getElementById("q_HEALTH");
        activeElements = document.getElementById("activeElements");
        document.documentElement.addEventListener("keydown", pressKey, false);
        // generate letters
        abeceda();
    }

    // first initialization
    function init(evt){
        // clear all still active characters and objects
        while (activeElements.hasChildNodes()){
            activeElements.removeChild(activeElements.firstChild);
        }

        // reset all
        banditsCounter = 0;
        level = 1;
        bandits = new Array();
        banditsKilled = new Array();
        historyx = new Array();
        score = 0;
        document.getElementById('score').firstChild.data = 'Score: ' + score;
        health = 100;
        healthMask.setAttributeNS(null, "width", 100);
        gameRunning = true;

        // reset innocent objects
        clearInnocents();

        // do reload for the first time
        loadMagazine();

        // appy all graphics settings
        setQuality(null, 1);

        // hide starting screen and start action
        document.getElementById("hideStartScreen").beginElement();
        setTimeout ('addBandit()', levels[level]+1500); // a bit longer for the begin

        // call innocemts for the first time
        innoCountDown = setTimeout ('invokeInnocent()', 12000);

    }


    // random invoke of innocent object
    function invokeInnocent(){

        // do nothing if not game
        if (!gameRunning){
            return false;
        }

        var someLiving = false; var i = 0;
        // test whether there are some living creatues
        while (i<innocents.length){
            if (innocents[i]['living']){
                someLiving = true;
                break;
            }
            i++;
        }

        // find someone
        var current = -1;
        while (someLiving && current == -1){
            var genType = Math.round( Math.random() * 4); // times by number of innocents
            if (innocents[genType]['living']){
                current = genType;
                break;
            }
        }

        // testing
        // current = 0;

        // do and show all needed
        if (current != -1){
            innocents[current]['bonus'] = true;
            document.getElementById(innocents[current]['name']+'ShowDialog').beginElement();

            // prepare countDown
            innoCountDown = setTimeout('disableInnoBonus('+current+', false)', 1100);
        }

    }


    // hide / disable some active innocent objects
    function disableInnoBonus(whichOne, byGun){
        // was shooted by gun
        if (byGun){
            // super, you'll got a bonus ;-)
            if (innocents[whichOne]['bonus']){
                document.getElementById(innocents[whichOne]['name']+'HideDialog').beginElement();
                document.getElementById(innocents[whichOne]['name']+'Killed').beginElement();
                innocents[whichOne]['living'] = 0;
                score += 50;    // add score to player
                document.getElementById('score').firstChild.data = 'Score: ' + score;
                document.getElementById('hit3').beginElement();
            // oh man, you killed me
            } else {
                document.getElementById(innocents[whichOne]['name']+'Killed').beginElement();
                innocents[whichOne]['living'] = 0;
                score -= 50;    // get score off
                document.getElementById('score').firstChild.data = 'Score: ' + score;
                document.getElementById('hit2').beginElement();
            }
            if (innocents[whichOne]['name'] == "babka") AudioMan.play("babkaugh");
            else AudioMan.play("catbird");AudioMan.play("catbird");
        // was not shoot at all, just reset him
        } else {
            document.getElementById(innocents[whichOne]['name']+'HideDialog').beginElement();
            innocents[whichOne]['bonus'] = false;
        }

        // request for new countDown
        if (innoCountDown)
            clearTimeout(innoCountDown);
        innoCountDown = setTimeout ('invokeInnocent()', 12000);

    }


    // reset (init) of all innocent objects (five)
    function clearInnocents(){
        innocents = new Array();
        innoCountDown = null;

        innocents[0] = new Array();
            innocents[0]['name'] = 'babka';
            innocents[0]['living'] = 1;
            innocents[0]['bonus'] = false;
        innocents[1] = new Array();
            innocents[1]['name'] = 'kot';
            innocents[1]['living'] = 1;
            innocents[1]['bonus'] = false;
        innocents[2] = new Array();
            innocents[2]['name'] = 'sup1';
            innocents[2]['living'] = 1;
            innocents[2]['bonus'] = false;
        innocents[3] = new Array();
            innocents[3]['name'] = 'sup2';
            innocents[3]['living'] = 1;
            innocents[3]['bonus'] = false;
        innocents[4] = new Array();
            innocents[4]['name'] = 'snake';
            innocents[4]['living'] = 1;
            innocents[4]['bonus'] = false;
    }


    // on key down emulating
    function pressKey(evt){
        if (!gameRunning)
            return;
        if (evt && (evt.keyCode == 32)) // space
            DoMouseDown(false, 1);
        }

    // fire !!
    function DoMouseDown(evt, emulate){
        if (!gameRunning)
            return;

        // disable RMB, emulate SPACE
        var btn = (evt) ? evt.button : emulate;
        if (evt) evt.preventDefault();

        // shoot if bullets are loaded
        if ((btn==0) && (bullets>0)){
            document.getElementById('ammo'+bullets).setAttributeNS(null, "opacity", 0.4);
            if (quality)
                document.getElementById("rotateMagazine").beginElement();
            // fire's sound
            AudioMan.play('gun_fire');
            bullets--;

            // inverted iteration to kill object with higher z-index
            for (var i=(bandits.length-1); i>=0; i--){
                if ( collisionBB(bandits[i].banditNode, evt) ){
                    // set appropriate attributes / replace anims with dying anims

                    // copy the object - move bandit from living to dying
                    banditsKilled.push( bandits[i] );
                    bandits[i].killed(false);

                    // remove bandit from living ones
                    bandits.splice(i,1);
                    break;
                } else {
                }
            }

            // test, if not shootes some innocent one
            for (var i=0; i<innocents.length; i++){
                if(innocents[i]['living'] && collisionBB(document.getElementById(innocents[i]['name']+'Act'), evt)){
                    disableInnoBonus(i, true);
                    break;
                }
            }
        } else {
            // reload magazine when right mouse click
            if ((btn==1) && (bullets<1)){
                loadMagazine();
            } else {
                // nothing
                document.getElementById('mustReload').beginElement();
                AudioMan.play("gunIsEmpty");
            }
        }
    }

    // end fire
    function DoMouseUp(evt){
        if (!gameRunning)
            return;
    }


    // do loading of magazine
    function loadMagazine(){
        bullets = 6;
        for (var i = 1; i <= 6; i++)
            document.getElementById('ammo'+i).setAttributeNS(null, "opacity", 1);
        if (quality) document.getElementById("reloadMagazine").beginElement();
        AudioMan.play('gun_reload');
    }

    // simple function to get collision of BBoxes of 2 objects
    // be sure to not use transform() repositioning which this
    // primitive function cannot handle
    function collisionBB(obj, evt){
        var ibb = obj.getBBox();
        var ictm = obj.getCTM();
        var bb1 = {x:(ibb.x+ictm.e), y:(ibb.y+ictm.f), width:(ibb.width), height:(ibb.height)};

        var xYes = false;
        // test x axis
        if ((bb1.x <= evt.clientX) && ((bb1.x+bb1.width) >= evt.clientX)) xYes = true;

        var yYes = false;
        // test y axis
        if ((bb1.y <= evt.clientY) && ((bb1.y+bb1.height) >= evt.clientY)) yYes = true;

        if (xYes && yYes){
            return true;
        } else {
            return false;
        }
    }

    // add next bandit
    function addBandit (){
        if (!gameRunning)
            return;

        // increase level after by ten killed bandits
        if (banditsCounter && !(banditsCounter%10))
            level++;

        // testing purposes
        //if (banditsCounter>15)
        //    gameOver();

        // loop and find the bandit who still doesn't exists
        var rightBandit = false;
        var genType = 0;
        while (rightBandit==false){
            genType = Math.round( Math.random() * 14); // times by number of templates
            if (!genType)
                genType = 1; // anything, but avoid 0
            // do new one active
            rightBandit = true;

            // build array of four of latest bandits
            if (historyx.length<4){
                var comparing = historyx;
            } else {
                var comparing = new Array();
                for (var i = 0; i < 4; i++){
                    comparing[i] = historyx[(historyx.length - i - 1)];
                }
            }

            // now search through it
            for (var i = 0; i < comparing.length; i++){
                if (comparing[i] == genType){
                    rightBandit = false;
                    break;
                }
            }

        }

        // for testing purposes
        // genType = 15;

        // keep history
        historyx[historyx.length] = genType;

        bandits.push ( new bandit(banditsCounter, 'b'+genType) );
        banditsCounter++;

        // add next one, again and again
        setTimeout ('addBandit()', levels[level]);

    }

    // object of bandit - prototypes follow
    function bandit (id, type){

        this.id = "ban"+id;
        this.type = type;
        this.alive = true;
        this.countDown = null;
        this.firing = null; // firstly no firing, but once created, 
                            // could be called more times
        // compute x-axis coeficient
        var xKoef = 0;
        if (isNaN(tmpDefs[this.type]['x1']) || isNaN(tmpDefs[this.type]['x2']))
            xKoef = 700;    // maximal X
        else
            xKoef = tmpDefs[this.type]['x2'] - tmpDefs[this.type]['x1'];    // ranged X

        // compute y-axis coeficient
        var yKoef = 0;
        if (isNaN(tmpDefs[this.type]['y1']) || isNaN(tmpDefs[this.type]['y2']))
            yKoef = 400;    // maximal Y
        else
            yKoef = tmpDefs[this.type]['y2'] - tmpDefs[this.type]['y1'];    // ranged Y

        var x = 0 + tmpDefs[this.type]['x1'] + Math.round(Math.random()*xKoef);
        var y = 0 + tmpDefs[this.type]['y1'] + Math.round(Math.random()*yKoef);

        // call internal method and return animation node
        this.currAnim = this.applyTemplate(x, y);
        this.currAnimPicture = this.currAnim.cloneNode(true);

        // create active target
        this.banditNode = document.createElementNS(svgns, "rect");
        this.banditNode.setAttributeNS(null, "x", x+tmpDefs[this.type]['BBkoefX']);
        this.banditNode.setAttributeNS(null, "y", y+tmpDefs[this.type]['BBkoefY']);
        this.banditNode.setAttributeNS(null, "id", this.id);
        this.banditNode.setAttributeNS(null, "width", tmpDefs[this.type]['BBwidth']);
        this.banditNode.setAttributeNS(null, "height", tmpDefs[this.type]['BBheight']);
        this.banditNode.setAttributeNS(null, "fill", "none");
        this.banditNode.setAttributeNS(null, "stroke", "none");
        this.banditNode.setAttributeNS(null, "pointer-events", "all");

        // mask workaround
        this.mask = document.createElementNS(svgns, "g");
        if (masks && tmpDefs[this.type]['mask'] != '') {
            this.mask.setAttributeNS(null, "mask", "url(#"+tmpDefs[this.type]['mask']+")");
        }
        activeElements.appendChild(this.mask);

        // append copy of animation to the visible picture and send it to the doc
        this.banditPicture.appendChild(this.currAnimPicture);
        this.mask.appendChild(this.banditPicture);
        this.currAnimPicture.beginElement();

        // append animation to the evaluated shape and send it to the doc
        this.banditNode.appendChild(this.currAnim);
        this.mask.appendChild(this.banditNode);
        this.currAnim.beginElement();
    }

    // get and create new bandit from appropriate template
    // with initial animation depending on type
    bandit.prototype.applyTemplate = function (x, y){
        this.banditPicture = document.getElementById(tmpDefs[this.type]['template']).cloneNode(true);
        this.banditPicture.setAttributeNS(null, "id", null);
        this.banditPicture.setAttributeNS(null, "x", x);
        this.banditPicture.setAttributeNS(null, "y", y);

        // create animation and return it (from tmpDefs PARAMS)
        // prepare temporary modifier according to the animation type
        var axis = (tmpDefs[this.type]['appear']['attr'] == "x") ? x : y;
        var ani = document.createElementNS(svgns, tmpDefs[this.type]['appear']['elem']);
        ani.setAttributeNS(null, "attributeName", tmpDefs[this.type]['appear']['attr']);
        ani.setAttributeNS(null, "dur", ''+tmpDefs[this.type]['appear']['dur']+'ms');
        ani.setAttributeNS(null, "by", tmpDefs[this.type]['appear']['by']);
        ani.setAttributeNS(null, "fill", "freeze");
        ani.setAttributeNS(null, "repeatCount", 1);

        this.countDown = setTimeout("doFire('"+this.id+"')", tmpDefs[this.type]['appear']['dur']+tmpDefs[this.type]['fire']['timeOffset']);

        // play SFX, if available
        if (tmpDefs[this.type]['appear']['audio']) {
            AudioMan.play(tmpDefs[this.type]['appear']['audio']);
        }
        return ani;
    }

    // sub class to bandit - do killing procedure
    bandit.prototype.killed = function (){

        // hide active area
        this.banditNode.setAttributeNS(null, "display", 'none');
        //alert(printNode(this.banditPicture));
        // unmask and change opacity
        this.banditPicture.removeAttributeNS(null, "mask");
        this.banditPicture.setAttributeNS(null, "opacity", 0.2);

        this.currAnim.endElement();
        this.currAnimPicture.endElement();

        // add score
        score += tmpDefs[this.type]['points'];
        document.getElementById('score').firstChild.data = 'Score: ' + score;

        // solve if negative scorepoints - innocent people
        if (tmpDefs[this.type]['points']<0)
            document.getElementById('hit2').beginElement();

        // create animation and apply it (from tmpDefs PARAMS)
        // prepare temporary modifier according to the animation type
        var ani = document.createElementNS(svgns, tmpDefs[this.type]['die']['elem']);
        ani.setAttributeNS(null, "attributeName", tmpDefs[this.type]['die']['attr']);
        ani.setAttributeNS(null, "dur", ''+tmpDefs[this.type]['die']['dur']+'ms');
        ani.setAttributeNS(null, "by", tmpDefs[this.type]['die']['by']);
        ani.setAttributeNS(null, "fill", "freeze");
        ani.setAttributeNS(null, "repeatCount", 1);
        ani.setAttributeNS(null, "begin", document.getElementById("svgE").getCurrentTime());
        ani.setAttributeNS(null, "end", "indefinite");

        //alert(printNode(ani));
        // play SFX, if available
        if (tmpDefs[this.type]['die']['audio']) {
            AudioMan.play(tmpDefs[this.type]['die']['audio']);
        }

        // apply dying procedure
        this.currAnim = ani;
        this.banditPicture.appendChild(this.currAnim);

        // reset countdown
        if (this.countDown)
            clearTimeout(this.countDown);

        // remove firing
        if (this.firing)
            activeElements.removeChild(this.firing);

        // call garbage collector in specified (dying) time
        setTimeout('clearKilledOne()', tmpDefs[this.type]['die']['dur']);
    }

    // firing handler
    // should be called from more places, not only when ending appearing animation
    function doFire(id){
        if (!gameRunning)
            return;

        // look for the object
        for (var i=0; i<bandits.length; i++){
            if ( bandits[i].id==id ){

                // only bandit shots!, so decide here what to do !!!
                if (tmpDefs[bandits[i].type]['points']>0){
                // negative one

                    // remove current firing, if any
                    if (bandits[i].firing)
                        activeElements.removeChild(bandits[i].firing);
    
                    var bb = bandits[i].banditNode.getBBox();
                    bandits[i].firing = document.getElementById(tmpDefs[bandits[i].type]['fire']['template']).cloneNode(true);
                    bandits[i].firing.setAttributeNS(null, "x", parseInt(bb.x) + tmpDefs[bandits[i].type]['fire']['x']);
                    bandits[i].firing.setAttributeNS(null, "y", parseInt(bb.y) + tmpDefs[bandits[i].type]['fire']['y']);
    
                    activeElements.appendChild(bandits[i].firing);
    
                    // show blood
                    document.getElementById('hit').beginElement();
                    AudioMan.play('ugh1');
                    // decrement health
                    health -= 10;
                    healthMask.setAttributeNS(null, "width", healthMask.getAttribute("width")-10);
    
                    if (tmpDefs[bandits[i].type]['fire']['audio'])
                        AudioMan.play(tmpDefs[bandits[i].type]['fire']['audio']);
    
                    // and call the firing again
                    bandits[i].countDown = setTimeout("doFire('"+id+"')", tmpDefs[bandits[i].type]['appear']['dur']+tmpDefs[bandits[i].type]['fire']['timeOffset']);

                } else {
                // positive one

                    // create negative animation
                    // prepare temporary modifier according to the animation type
                    // var axis = (tmpDefs[bandits[i].type]['appear']['attr'] == "x") ? x : y;
                    var ani = document.createElementNS(svgns, tmpDefs[bandits[i].type]['appear']['elem']);
                    ani.setAttributeNS(null, "attributeName", tmpDefs[bandits[i].type]['appear']['attr']);
                    ani.setAttributeNS(null, "dur", ''+tmpDefs[bandits[i].type]['appear']['dur']+'ms');
                    ani.setAttributeNS(null, "by", (-1*tmpDefs[bandits[i].type]['appear']['by']) );
                    ani.setAttributeNS(null, "fill", "freeze");
                    ani.setAttributeNS(null, "repeatCount", 1);
                    ani.setAttributeNS(null, "begin", document.getElementById("svgE").getCurrentTime());
                    ani.setAttributeNS(null, "end", "indefinite");

                    // modify animation
                    bandits[i].currAnim = ani;
                    bandits[i].currAnimPicture = bandits[i].currAnim.cloneNode(true);
                    // append animation to the evaluated shape and send it to the doc
                    bandits[i].banditNode.appendChild(bandits[i].currAnim);
                    // activeElements.appendChild(bandits[i].banditNode);
                    // append copy of animation to the visible picture and send it to the doc
                    bandits[i].banditPicture.appendChild(bandits[i].currAnimPicture);
                    // activeElements.appendChild(bandits[i].banditPicture);

                    bandits[i].countDown = setTimeout("clearPositiveOne('"+bandits[i].id+"')", tmpDefs[bandits[i].type]['appear']['dur']+tmpDefs[bandits[i].type]['fire']['timeOffset']);

                }

                break; // the loop
            }
        }
        
        // end game, if necessary
        if (health<=0){
            gameOver();
        }

    }


    // ending of positives figures (correct)
    function clearPositiveOne(id){
        // look for the object
        for (var i=0; i<bandits.length; i++){
            if ( bandits[i].id==id ){

                // remove active rect area and its subnodes
                //activeElements.removeChild(bandits[i].banditNode);
                // remove active rect area and its subnodes
                //activeElements.removeChild(bandits[i].banditPicture);
                activeElements.removeChild(bandits[i].mask);

                // remove bandit from living - active - ones
                bandits.splice(i,1);

                break; // the loop
            }
        }
    }


    // erase && destroy first item in killed list
    function clearKilledOne(){
        var removing = banditsKilled.shift();
        //alert(printNode(activeElements));
        if (removing){
            // remove active rect area and its subnodes
            //activeElements.removeChild(removing.banditNode);
            // remove active rect area and its subnodes
            //activeElements.removeChild(removing.banditPicture);
            activeElements.removeChild(removing.mask);

            // remove the object from array
            //alert(printNode(activeElements));
        }
    }


    // ending Game
    function gameOver(){
        gameRunning = false;

        // disable innocent, if any
        if (innoCountDown)
            clearTimeout(innoCountDown);

        // remove all events of living ones
        var xy = 0;
        while (xy < bandits.length){
            // remove time triggers
            if (bandits[0].countDown)
                clearTimeout(bandits[0].countDown);
            xy++;
        }

        // remove all events of killed ones
        var xy = 0;
        while (xy < banditsKilled.length){
            // remove time triggers
            if (banditsKilled[0].countDown)
                clearTimeout(banditsKilled[0].countDown);
            xy++;
        }

        // clear all still active characters and objects
        while (activeElements.hasChildNodes()){
            activeElements.removeChild(activeElements.firstChild);
        }

        // reset arrays
        bandits = new Array();
        banditsKilled = new Array();

        // restrict new game start for a while
        newGameAllowed = false;
        setTimeout('newGameAllowed = true', 3000);

        document.getElementById("finalScore").firstChild.data = score;

        document.getElementById("showDeathScreen").beginElement();
        AudioMan.reset();
        AudioMan.play('end');
        // call for next action
        setTimeout("afterDeath()", 5000);
    }

    // degrading or upgrading graphics options
    function setQuality(event, fromInit){
        if (!document) 
            document = event.getTarget().getOwnerDocument();

        // set global flag
        if (!fromInit)
            quality = (quality) ? 0 : 1;

        if (quality){
            document.getElementById("q_BABKA").beginElement();
            document.getElementById("q_FILLTOMADLO").setAttributeNS(null, "fill", "url(#madlo_ver)");
            document.getElementById("q_MADLOHOR").setAttributeNS(null, "fill", "url(#madlo_hor)");
            document.getElementById("q_SET_BACK").setAttributeNS(null, "fill", "#bb0000");
            document.getElementById("q_SET_TEXT").firstChild.data = "HQ";

            document.getElementById("q_WINGS_FLY").setAttributeNS(null, "display", "block");
            document.getElementById("q_SUP_ITSELF").setAttributeNS(null, "mask", "url(#supWings)");
            document.getElementById("q_TAIL_FLY").setAttributeNS(null, "display", "block");
            document.getElementById("q_KOT_ITSELF").setAttributeNS(null, "mask", "url(#catTail)");
        } else {
            document.getElementById("q_BABKA").endElement();
            document.getElementById("q_FILLTOMADLO").setAttributeNS(null, "fill", "#9c4931");
            document.getElementById("q_MADLOHOR").setAttributeNS(null, "fill", "#9c4931");
            document.getElementById("q_SET_BACK").setAttributeNS(null, "fill", "green");
            document.getElementById("q_SET_TEXT").firstChild.data = "LQ";

            document.getElementById("q_WINGS_FLY").setAttributeNS(null, "display", "none");
            document.getElementById("q_SUP_ITSELF").setAttributeNS(null, "mask", "none");
            document.getElementById("q_TAIL_FLY").setAttributeNS(null, "display", "none");
            document.getElementById("q_KOT_ITSELF").setAttributeNS(null, "mask", "none");
        }

    }

    // enabling and disabling masks for webkit compatibility
    function setMasks(event){
        masks = (masks) ? false : true;
        document.getElementById("q_MASKS").setAttributeNS(null, "fill", masks ? "deepskyblue" : "gray");
    }

    // enabling and disabling music
    function setMusic(event){
        music = (music) ? false : true;

        if (music){
            AudioMan.play('music');

            document.getElementById("q_MUSIC_BACK").setAttributeNS(null, "fill", "navy");
            document.getElementById("q_MUSIC_SKRT").setAttributeNS(null, "display", "none");
        } else {
            AudioMan.reset();

            document.getElementById("q_MUSIC_BACK").setAttributeNS(null, "fill", "#bb00bb");
            document.getElementById("q_MUSIC_SKRT").setAttributeNS(null, "display", "block");
        }

    }


    // what to do, when killed
    function afterDeath(){
        if (newGameAllowed){
            document.getElementById("hideDeathScreen").beginElement();
            if (score>1){
                document.getElementById("showSignatureScreen").beginElement();
            } else {
                showScoreList(false);
            }
        }
    }


    // function writing dow ABCD
    function abeceda(evt){
        // initiative array
        var abc = new Array ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'space', 'dot', 'delete', 'enter');

        // get element to write in
        var abeceda = document.getElementById("abeceda");

        var group = document.getElementById("textCovers");

        var lett = document.createElementNS(svgns, "text");
        lett.setAttributeNS(null, "x", 0);
        lett.setAttributeNS(null, "y", 0);
        lett.setAttributeNS(null, "fill", 'red');
        lett.setAttributeNS(null, "stroke", "none");
        lett.setAttributeNS(null, "font-family", "monospace");
        lett.setAttributeNS(null, "font-weight", "bold");
        lett.setAttributeNS(null, "font-size", 25);
        lett.setAttributeNS(null, "font-stretch", 'ultra-expanded');

        var letter = 0;
        var y = 0; var x = 0;
        
        // iterate through and write down letters
        while (letter < abc.length){
            // new line
            if ( !(letter % 6) ){
                y += 50;
                x = 0;
            }

            // visible bullet
            var bull = document.createElementNS(svgns, "use");
            bull.setAttributeNS(xlinkns, "href", "#bulhole2");
            bull.setAttributeNS(null, "x", x-3);
            bull.setAttributeNS(null, "y", y-6);
            abeceda.appendChild(bull);

            var lettSpan = document.createElementNS(svgns, "tspan");
            //lettSpan.setAttributeNS(null, "id", "lety-" + abc[letter]);
            lettSpan.setAttributeNS(null, "x", x+16);
            lettSpan.setAttributeNS(null, "y", y+27);
            //lettSpan.addEventListener("click", getLetter, false);
            if (abc[letter].length==1) {
                lettSpan.appendChild(document.createTextNode(abc[letter]));
            } else {
                lettSpan.appendChild(document.createTextNode(abcConv[abc[letter]]['show']));
            }
            lett.appendChild(lettSpan);

            // hovering circle
            var env = document.createElementNS(svgns, "circle");
            env.setAttributeNS(null, "id", "lett-" + abc[letter]);
            env.setAttributeNS(null, "cx", x+24);
            env.setAttributeNS(null, "cy", y+19.5);
            env.setAttributeNS(null, "r", 16);
            env.setAttributeNS(null, "fill", "none");
            env.setAttributeNS(null, "stroke", "black");
            env.setAttributeNS(null, "fill-opacity", 0.4);
            env.setAttributeNS(null, "pointer-events", "all");
            env.addEventListener("mouseover", letterOver, false);
            env.addEventListener("mouseout", letterOut, false);
            env.addEventListener("click", getLetter, false);
            group.appendChild(env);


            // every cycle increments
            x += 60;
            letter++;
        }
        abeceda.appendChild(lett);
    }


    // writing letter to the name
    function getLetter(evt){
        var current = evt.currentTarget;
        var letter = current.id.substring(5);

        // do nothing if not worthy of
        if (score<1)
            return false;

        // limit the length a bit
        if (playerName.length<10){
            // solve what to do
            if(letter.length==1){
                playerName += letter;
                AudioMan.play("gun_fire");
            } else {
                if (abcConv[letter]['do']){
                    playerName += abcConv[letter]['do'];
                    AudioMan.play("gun_fire");
                } else {
                    if (letter=='delete' && playerName){
                        playerName = playerName.substring(0, playerName.length-1);
                        AudioMan.play("gun_fire");
                    }
                    if (letter=='enter' && playerName)
                        showScoreList(true);
                }
            }

        } else {
            if (letter=='delete'){
                playerName = playerName.substring(0, playerName.length-1);
                AudioMan.play("gun_fire");
            }
            if (letter=='enter' && playerName)
                showScoreList(true);
        }

        // show the name
        document.getElementById("playerName").firstChild.data = playerName;
    }

    // highlight letter
    function letterOver(evt){
        evt.currentTarget.setAttributeNS(null, 'fill', 'gold');
        evt.currentTarget.setAttributeNS(null, 'stroke', 'gold');
    }

    // de-highlight letter
    function letterOut(evt){
        evt.currentTarget.setAttributeNS(null, 'fill', 'none');
        evt.currentTarget.setAttributeNS(null, 'stroke', 'black');
    }

    // ajax method used for communication with server to obtain highscore list
    sendXmlHttpRequest = function(serve, methode, url, content, headers) {
      var xmlhttp = new XMLHttpRequest;
      xmlhttp.open(methode, url);
      xmlhttp.onreadystatechange = function() { serve(xmlhttp); };
      if (headers) for(var key in headers) xmlhttp.setRequestHeader(key, headers[key]);
      xmlhttp.send(content);
      return 1;
    }
    
    // method invoking getting of high-score list
    getHighScore = function(playerName) {
      var tmpAdr = "cowboys_score.php" + ((playerName) ? ("?name="+playerName+"&score="+score) : "");
      this.sendXmlHttpRequest(callback, "GET", tmpAdr);
    }


    // get new list from server and show it
    function showScoreList(withNewUploaded){

        // branch to save also new name
        if (withNewUploaded){

            if (playerName && score) {
                if (playerName.length>10) {
                    playerName = playerName.substring(0,10);
                }
                // do save of new one and get list again
                //getURL(urlLink, callback);
                getHighScore(URLEncode(playerName));
            }
        } else {
            // simply get list
            getHighScore();
        }

        // do some action of getting new score list + show it
        document.getElementById("hideDeathScreen").beginElement();
        document.getElementById("hideSignatureScreen").beginElement();
        document.getElementById("showHighScoreScreen").beginElement();
    }

    // hide score list and get from beginning
    function hideScoreList(){
        document.getElementById("hideHighScoreScreen").beginElement();
        document.getElementById("showStartScreen").beginElement();
        //document.getElementById("hutFly").beginElement();
        if (music) {
            AudioMan.reset();
            AudioMan.play('music');
        }
    }


    // internal callback function to sort arrays
    function sortByInt(item1, item2) {
        if(1*item1 < 1*item2)
            return 1;
        if(1*item1 < 1*item2)
            return 0;
        if(1*item1 > 1*item2)
            return -1;
    }


    // internal function parsing arrays of high scores
    function callback(urlRequestStatus) {
        var rows = new Array();

        // storing variable of games
        var HallOfFame = new Array();

        if (urlRequestStatus.readyState != 4) var incomingData = "";
        else var incomingData = urlRequestStatus.responseText;

        if(incomingData) {
            rows = incomingData.split("\n");

            // do not allow offline php content showing
            if (incomingData.indexOf('$filename')!=-1) {
                return false;
            }

            for (var i = 0; i < rows.length; i++) {
                if (rows[i])
                    HallOfFame[i] = rows[i].split("#-|-#");
            }

            // get the table of fame
            var fame = document.getElementById('HallOfFame');

            // clear all subnodes in pool
            while (fame.hasChildNodes()) {
                fame.removeChild(fame.firstChild);
            }

            // resort arrays to do what we want
            // create sorting index
            var tmpArray = new Array();
            for (var i = 0; i < HallOfFame.length; i++)
                tmpArray[i] = HallOfFame[i][0];

            // sort index
            tmpArray.sort(sortByInt);

            // create new sorted array
            var ourResults = new Array();
            var topTwenty = (tmpArray.length>30) ? 30 : tmpArray.length;
            var total = 0;
            for (var y = 0; y < topTwenty; y++) {
                for (var i = 0; i < HallOfFame.length; i++) {
                    if ((HallOfFame[i][0] == tmpArray[y]) && (total<topTwenty)) {
                        // create text span
                        var fameSpan = document.createElementNS(svgns, "tspan");
                        fameSpan.setAttributeNS(null, "x", "102");
                        fameSpan.setAttributeNS(null, "dx", "0");
                        fameSpan.setAttributeNS(null, "dy", "14");
                        fameSpan.appendChild(document.createTextNode(HallOfFame[i][0] +' .......... '+ HallOfFame[i][1]) );
                        fame.appendChild(fameSpan);
                        // reset
                        HallOfFame[i][0] = "unset";
                        total++;
                    }
                }
            }

        }
    }

    // encode string for URL 
	// The Javascript escape and unescape functions do not correspond 
	// with what browsers actually do...
    function URLEncode(plaintext) {

    	var SAFECHARS = "0123456789" +					// Numeric
    					"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
    					"abcdefghijklmnopqrstuvwxyz" +
    					"-_.!~*'()";					// RFC2396 Mark characters 
    	var HEX = "0123456789ABCDEF";

    	var encoded = "";
    	for (var i = 0; i < plaintext.length; i++ ) {
    		var ch = plaintext.charAt(i);
    	    if (ch == " ") {
    		    encoded += "+";				// x-www-urlencoded, rather than %20
    		} else if (SAFECHARS.indexOf(ch) != -1) {
    		    encoded += ch;
    		} else {
    		    var charCode = ch.charCodeAt(0);
    			if (charCode > 255) {
    			    alert( "Unicode Character '" + ch + "' cannot be encoded using standard URL encoding.\n" +
    				        "(URL encoding only supports 8-bit characters.)\n" +
    						"A space (+) will be substituted." );
    				encoded += "+";
    			} else {
    				encoded += "%";
    				encoded += HEX.charAt((charCode >> 4) & 0xF);
    				encoded += HEX.charAt(charCode & 0xF);
    			}
    		}
    	}
    	return encoded;
    }

/* ************************************************************************* */
/* **********************  FUNCTION SECTION END  *************************** */
/* ************************************************************************* */
