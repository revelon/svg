'use strict';

/* App Module */

angular.module('minedout', ['viewFilters']).
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
    FENCE : 4,
    VISITED : 1,
    XSIZE : 30,
    YSIZE : 19
}

function Tile(content) {
    this.mine = content;
}

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
    }

    function generateMines (data, level) {
        var minesCount = 40 * level;
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
        console.log(minesCount);
        console.log(rows);
        return data;

    }

    this.getAdjacentMinesCount = function(x, y) {
        var count = 0;
        if (this.data[y-1] && this.data[y-1][x].mine > 1) count++;
        if (this.data[y+1] && this.data[y+1][x].mine > 1) count++;
        if (this.data[y][x-1] && this.data[y][x-1].mine > 1) count++;
        if (this.data[y][x+1] && this.data[y][x+1].mine > 1) count++;
        return count;
    }

    this.generateLevel = function(level) {
        this.data = generateMines(getBlankArea(), level);
    }

    this.generateLevel(level);
};
