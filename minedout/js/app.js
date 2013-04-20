'use strict';

/* App Module */

angular.module('minedout', ['scoreServices', 'viewFilters']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/intro', {templateUrl: 'partials/intro.html',  controller: IntroCtrl}).
      when('/outro', {templateUrl: 'partials/outro.html',  controller: OutroCtrl}).
      when('/help', {templateUrl: 'partials/help.html',  controller: HelpCtrl}).
      when('/level/:levelId', {templateUrl: 'partials/level.html', controller: LevelCtrl}).
      when('/levelDone/:levelId', {templateUrl: 'partials/leveldone.html',  controller: LevelDoneCtrl}).
      otherwise({redirectTo: '/intro'});
}]);

var Def = {
    FREE: 0,
    MINE : 2,
    VISIBLEMINE : 5,
    FENCE : 4,
    VISITED : 1,
    WORM: 3,
    XSIZE : 30,
    YSIZE : 19
};

function Tile(content) {
    this.mine = content;
};

function Level(level) {
    function getBlankArea() {
        var data = [];
        for (var y = 0; y < Def.YSIZE; y++) {
            var row = [new Tile(Def.FENCE)];
            for (var x = 1; x < Def.XSIZE; x++) {
                if (y === 0 || y === (Def.YSIZE-2)) {
                    if (x >= (Def.XSIZE/2) && x <= (Def.XSIZE/2+1)) {
                        row[x] = new Tile(Def.FREE);
                    } else {
                        row[x] = new Tile(Def.FENCE);
                    }
                } else {
                    row[x] = new Tile(Def.FREE);
                }
            }
            row.push(new Tile(Def.FENCE));
            data[y] = row;
        }
        return data;
    };

    function generateWorms (data) {
        var span = 14;
        var y = Math.round(Def.YSIZE/2)-1;
        var x = Math.round(Def.XSIZE/2) - span/2;
        data[y][x-1].mine = Def.FREE;
        data[y][x].mine = Def.WORM;
        data[y][x+1].mine = Def.FREE;
        x = x + span;
        data[y][x-1].mine = Def.FREE;
        data[y][x].mine = Def.WORM;
        data[y][x+1].mine = Def.FREE;
        return data;
    };

    function generateMines (data, level) {
        var minesCount = 2; //10 + (10 * level);
        var rowMax = 4;
        var rows = [];
        var maxIters = 10000000;

        while (minesCount && (minesCount && maxIters)) {
            var x = 1 + (Math.round(Math.random()*(Def.XSIZE-2)));
            var y = 2 + (Math.round(Math.random()*(Def.YSIZE-6)));
            //console.log("aaa x="+x+" y="+y);
            if ((data[y][x].mine === Def.FREE) && (!rows[y] || (rows[y] < rowMax))) {
                data[y][x] = new Tile(Def.MINE);
                rows[y] = (rows[y]) ? (rows[y]+1) : 1;
                minesCount--;
            }
            maxIters--;
        }
        //console.log("Mines count: " + minesCount);
        if (level > 1) {
            data = generateWorms(data);
        }

        return data;
    };

    this.getAdjacentMinesCount = function(x, y) {
        var count = 0;
        if (this.data[y-1] && this.data[y-1][x].mine > 1) count++;
        if (this.data[y+1] && this.data[y+1][x].mine > 1) count++;
        if (this.data[y][x-1] && this.data[y][x-1].mine > 1) count++;
        if (this.data[y][x+1] && this.data[y][x+1].mine > 1) count++;
        return count;
    };

    this.generateLevel = function(level) {
        this.data = generateMines(getBlankArea(), level);
    };

    this.prepareReplay = function() {
        for (var y = 0; y < Def.YSIZE; y++) {
            for (var x = 0; x < (Def.XSIZE+1); x++) {
                if (this.data[y][x].mine == Def.VISIBLEMINE) {
                    this.data[y][x].mine = Def.FREE;
                } else if (!this.data[y][x].org && this.data[y][x].mine === Def.VISITED) {
                    this.data[y][x].mine = Def.FREE;
                } if (this.data[y][x].org) {
                    this.data[y][x].mine = this.data[y][x].org;
                }
            }
        }
    };

    this.generateLevel(level);
};

function Spreader(){
    var rowSpan = 5;
    var yy = 2 + (Math.round(Math.random()*(Def.YSIZE-10)));
    this.x = -1;
    this.y = -1;
    this.currentMineY = null;

    this.init = function() {
        this.x = 1;
        this.y = (yy+Math.ceil(rowSpan/2));
    };

    this.generate = function(data) {
        var delta = Math.round(Math.random()*rowSpan);
        if (this.x === Def.XSIZE) {
            this.x = -100;
            return false;
        } else if (data[(yy+delta)][this.x].mine === Def.FREE || data[(yy+delta)][this.x].mine === Def.VISITED) {
            this.currentMineY = yy+delta;
            return {"x":this.x++, "y":(yy+delta)};
        } else {
            this.currentMineY = null;
            return true;
        }
    };
};

function Bug() {
    this.x = Def.XSIZE;
    this.y = Def.YSIZE-1;
    var beginning = Def.XSIZE-1;
    var stack = [];

    this.addToStack = function(coords) {
        stack.push(coords);
    };
    this.move = function() {
        if (beginning >= (Def.XSIZE/2)) {
            this.x--;
            beginning--;
        } else if (stack.length) {
            var coords = stack.shift();
            this.x = coords.x;
            this.y = coords.y;
        }
    };
};

function Player() {
    this.x = Def.XSIZE/2;
    this.y = Def.YSIZE-1;
    this.alive = true;
    this.movementHistory = [];
    this.adjacentMines = 0;
    var orgStatus;

    this.killed = function(reason) {
        this.alive = false;
        this.adjacent = reason;
    };
    this.replayMode = function(on) {
        if (on) {
            orgStatus = this.status;
            this.alive = true;
        } else {
            this.status = orgStatus;
            orgStatus = null;
        }
    };
    this.moveUp = function() {
        if (!this.alive) return false;
        if (this.y) this.y--;
        return true;
    };
    this.moveLeft = function() {
        if (!this.alive) return false;
        if (this.x) this.x--;
        return true;
    };
    this.moveRight = function() {
        if (!this.alive) return false;
        if (this.x < (Def.XSIZE)) this.x++;
        return true;
    };
    this.moveDown = function() {
        if (!this.alive) return false;
        if (this.y < (Def.YSIZE-1)) this.y++;
        return true;
    };

};
