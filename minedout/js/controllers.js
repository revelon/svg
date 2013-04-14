'use strict';

/* Controllers */

function IntroCtrl($scope) {
    $scope.title = 'Intro';
};

function OutroCtrl($scope) {
    $scope.title = 'Outro';
};

function HelpCtrl($scope) {
    $scope.title = 'Help';
};

function LevelDoneCtrl($scope, $routeParams) {
    $scope.title = 'LevelDone';
    $scope.level = $routeParams.levelId;
};

function LevelCtrl($scope, $routeParams, $timeout, $location, Level) {
    $scope.title = 'Level' + $routeParams.levelId;
    $scope.level = $routeParams.levelId;
    $scope.levelData = Level;
    $scope.x, $scope.y;
    $scope.adjacentMines;
    $scope.playerAlive = true;
    $scope.movementHistory = [];
    $scope.remainingTime;
    $scope.replayMode = false;

    $scope.keypress = function(keyEvent) {
        console.log('keypress', keyEvent);
        if (keyEvent.keyCode == 38 || keyEvent.keyCode == 119) $scope.moveUp();
        else if (keyEvent.keyCode == 40 || keyEvent.keyCode == 115) $scope.moveDown();
        else if (keyEvent.keyCode == 37 || keyEvent.keyCode == 97) $scope.moveLeft();
        else if (keyEvent.keyCode == 39 || keyEvent.keyCode == 100) $scope.moveRight();
    };

    function replay() {
        // reset visited
        $scope.replayMode = true;
        // ...
    }
    function setTileVisited() {
        //console.log($scope.levelData);
        $scope.levelData.data[$scope.y][$scope.x].mine = Def.VISITED;
    };

    $scope.getBackground = function() {
        return "area num" + $scope.adjacentMines;
    };
    $scope.moveUp = function() {
        if (!$scope.playerAlive) return;
        if ($scope.y) $scope.y--;
        evaluateMovement();
    };
    $scope.moveLeft = function() {
        if (!$scope.playerAlive) return;
        if ($scope.x) $scope.x--;
        evaluateMovement();
    };
    $scope.moveRight = function() {
        if (!$scope.playerAlive) return;
        if ($scope.x < (Def.XSIZE)) $scope.x++;
        evaluateMovement();
    };
    $scope.moveDown = function() {
        if (!$scope.playerAlive) return;
        if ($scope.y < (Def.YSIZE-1)) $scope.y++;
        evaluateMovement();
    };
    function evaluateMovement() {
        $scope.movementHistory.push({x:$scope.x, y:$scope.y});
        $scope.adjacentMines = $scope.levelData.getAdjacentMinesCount($scope.x, $scope.y);
        console.log("Evaluated...");
        if ($scope.levelData.data[$scope.y][$scope.x].mine === Def.MINE ||
            $scope.levelData.data[$scope.y][$scope.x].mine === Def.FENCE) {
            $scope.playerAlive = false;
            $scope.adjacentMines = "BOOOOOOOOM";
        } else if ($scope.y == 0) {
            $scope.adjacentMines = "VICTORYYYY";
            $location.path("/levelDone/"+$scope.level);
        } else {
            setTileVisited();
        }
    };
    $scope.restart = function() {
        $scope.levelData.generateLevel();
        $scope.x = Def.XSIZE/2, $scope.y = Def.YSIZE-1;
        $scope.playerAlive = true;
        setTime();
        runningTime();
        evaluateMovement();
    };

    var stop;
    function runningTime() {
        stop = $timeout(function() {
            if ($scope.remainingTime && $scope.playerAlive) {
                $scope.remainingTime--;
                runningTime();
            } else if (!$scope.remainingTime || !$scope.playerAlive) {
                $scope.playerAlive = false;
                $timeout.cancel(stop);
            }
        }, 1000);
    };

    function setTime() {
        $scope.remainingTime = 50 * $scope.level;
    };

    $scope.restart();
}
