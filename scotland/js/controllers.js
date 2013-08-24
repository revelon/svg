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
};

function LevelDoneCtrl($scope, $routeParams, $store, $location) {
    $scope.title = 'LevelDone';
    $scope.level = $routeParams.levelId;
    var levels = $store.get('levelStatus');
    $scope.state = levels[$routeParams.levelId].state;
    playTada($routeParams.how);

    if (levels[$routeParams.levelId].state == game.showLimit) {
        $scope.txt = ($routeParams.how == "greatSuccess") ? "Excellent guess!" : "Well done!!";
    } else if (levels[$routeParams.levelId].state === 0) {
        $scope.txt = "Two more to show";
    } else {
        $scope.txt = "One more to show";
    }
    
    function playTada(how) {
        if (how == "justShow") {
            return;
        } else if (how == "success") {
            playAudio("win");
        } else if (how == "greatSuccess") {
            playAudio("win");
        } else if (how == "fail") {
            playAudio("fail");
        }
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
        var levels = $store.get('levelStatus');
        var veryFirst = ((levels[$routeParams.levelId].state == 0) && ($scope.tries == 5)) ? true : false;

        $scope.tries--;
        if ($scope.chosenOne == num) {
            if (levels[$routeParams.levelId].state < game.showLimit) {
                levels[$routeParams.levelId].state++;
                if (veryFirst) {
                    levels[$routeParams.levelId].state++;
                }
                $scope.reason = "";
                $store.set('levelStatus', levels);
            }
            $location.path("/levelDone/" + $routeParams.levelId + (veryFirst ? "/greatSuccess" : "/success"));
        } else if ($scope.chosenOne > num) {
            for (var i = 1; i <= num; i++) {
                $scope.data[i].uncovered = true;
            }
            $scope.reason = "Number is bigger than " + num;
            playAudio("pop");
        } else {
            for (var i = num; i <= 49; i++) {
                $scope.data[i].uncovered = true;
            }
            $scope.reason = "Number is smaller than " + num;
            playAudio("pop");
        }
        if ($scope.tries == 0) {
            $location.path("/levelDone/" + $routeParams.levelId + "/fail");
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
        $location.path("/levelDone/" + $routeParams.levelId + "/justShow");
    }

    $scope.restart(1);
    $scope.level = $routeParams.levelId;
    $scope.lvlState = levels[$routeParams.levelId].state;
}
