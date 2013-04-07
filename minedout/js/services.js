'use strict';

/* Services */

angular.module('levelServices', ['ngResource']).
    factory('Level', function($resource, $routeParams){
        var minesCount = 30 * $routeParams.levelId;
        var xSize = 30, ySize = 19;
        this.data = [];
        for (var y = 0; y < ySize; y++) {
            var row = [new Tile(Def.FENCE)];
            for (var x = 1; x < xSize; x++) {
                if (y === 0 || y === (ySize-2)) {
                    if (x >= (xSize/2) && x <= (xSize/2+1)) {
                        row[x] = new Tile(Def.FREE);
                    } else {
                        row[x] = new Tile(Def.FENCE);
                    }
                } else if (y !== 1 && y !== (ySize-3)) {
                    if (minesCount && (Math.random() < 0.2)) {
                        row[x] = new Tile(Def.MINE);
                        minesCount--;
                    } else {
                        row[x] = new Tile(Def.FREE);
                    }
                } else {
                    row[x] = new Tile(Def.FREE);
                }
            }
            row.push(new Tile(Def.FENCE));
            this.data[y] = row;
        }

        this.getAdjacentMinesCount = function(x, y) {
            var count = 0;
            if (this.data[y-1][x].mine > 0) count++;
            if (this.data[y+1][x].mine > 0) count++;
            if (this.data[y][x-1].mine > 0) count++;
            if (this.data[y][x+1].mine > 0) count++;
            return count;
        }

        return this;
    });


angular.module('phonecatServices', ['ngResource']).
    factory('Phone', function($resource){
  return $resource('phones/:phoneId.json', {}, {
    query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
  });
});
