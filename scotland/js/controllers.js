'use strict';

/* Controllers */

function IntroCtrl($scope, $store) {
    $scope.reset = function (force) {
        if (force || !$store.get('levelStatus')) {
          $store.set('levelStatus', game.getEmpty(game.picsCount));
        }
        $store.bind($scope, 'levelStatus', game.getEmpty(game.picsCount));
    };
    $scope.reset(false);
};

function HelpCtrl($scope) {
    $scope.title = 'Help';
};

function LevelDoneCtrl($scope, $routeParams, $store, $location) {
    $scope.title = 'LevelDone';
    $scope.level = $routeParams.levelId;
    var levels = $store.get('levelStatus');
    $scope.status = (levels[$routeParams.levelId].state == game.showLimit) ? 0 : 9;
    $scope.txt = (levels[$routeParams.levelId].state == game.showLimit) ? "Well done!!" : "Keep trying...";

    $scope.getAction = function () {
        var levels = $store.get('levelStatus');
        if (levels[$routeParams.levelId].state == game.showLimit) {
            $location.path("/intro/");
        } else {
            $location.path("/level/" + $routeParams.levelId);
        }
    }

};

function LevelCtrl($scope, $routeParams, $location, $store) {

    function generateGameArea() {
        var data = [new Tile(0, -10, -10)];
        var num = 1;
        for (var y = 0; y < 7; y++) {
            for (var x = 0; x < 7; x++) {
                data[num] = new Tile(num++, x, y);
            }
        }
        return data;
    };
    
    $scope.tryMe = function (num) {
        if ($scope.data[num].uncovered) {
            return;
        }
        $scope.tries--;
        if ($scope.chosenOne == num) {
            var levels = $store.get('levelStatus');
            if (levels[$routeParams.levelId].state < game.showLimit) {
                levels[$routeParams.levelId].state++;
                $store.set('levelStatus', levels);
            }
            $location.path("/levelDone/" + $routeParams.levelId);
        } else if ($scope.chosenOne > num) {
            for (var i = 1; i < num; i++) {
                $scope.data[i].uncovered = true;
            }
        } else {
            for (var i = num; i <= 49; i++) {
                $scope.data[i].uncovered = true;
            }
        }
        if ($scope.tries == 0) {
            $location.path("/levelDone/" + $routeParams.levelId);
        }
    }

    $scope.restart = function () {
        $scope.chosenOne = Math.round(Math.random()*48)+1;
        $scope.tries = 5;
        $scope.data = generateGameArea();
    }

    $scope.restart(1);
}
