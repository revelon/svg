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
    if (levels[$routeParams.levelId].state == game.showLimit) {
        playAudio("60445__jobro__tada3");
        $scope.status = 0;
        $scope.txt = "Well done!!";
    } else {
        playAudio("135831__davidbain__end-game-fail");
        $scope.status = 15;
        $scope.txt = "Keep trying...";
    }

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
        var data = [];
        for (var i = 0; i < 50; i++) {
            data[i] = new Tile(i);
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
                $scope.reason = "";
                $store.set('levelStatus', levels);
            }
            $location.path("/levelDone/" + $routeParams.levelId);
        } else if ($scope.chosenOne > num) {
            for (var i = 1; i <= num; i++) {
                $scope.data[i].uncovered = true;
            }
            $scope.reason = "My number is bigger than " + num;
            playAudio("83237__mlestn1__pop");
        } else {
            for (var i = num; i <= 49; i++) {
                $scope.data[i].uncovered = true;
            }
            $scope.reason = "My number is smaller than " + num;
            playAudio("83237__mlestn1__pop");
        }
        if ($scope.tries == 0) {
            $location.path("/levelDone/" + $routeParams.levelId);
            $scope.reason = "";
        }
    }

    $scope.restart = function () {
        $scope.chosenOne = Math.round(Math.random()*48)+1;
        $scope.tries = 5;
        $scope.data = generateGameArea();
    }

    var levels = $store.get('levelStatus');
    if (levels[$routeParams.levelId].state == game.showLimit) {
        $location.path("/levelDone/" + $routeParams.levelId);
    }

    $scope.restart(1);
    $scope.level = $routeParams.levelId;
}
